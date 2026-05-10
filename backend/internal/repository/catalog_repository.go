package repository

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"lan-mai/backend/internal/domain"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrWoodTypeNotFound = errors.New("wood type not found")
var ErrDailyPriceConflict = errors.New("daily price conflict")

type CatalogRepository interface {
	ListWoodTypes(ctx context.Context) ([]domain.WoodType, error)
	CreateWoodType(ctx context.Context, input domain.CreateWoodTypeInput) (*domain.WoodType, error)
	ListDailyPrices(ctx context.Context, filters domain.DailyPriceFilters) ([]domain.DailyPrice, error)
	CreateDailyPrice(ctx context.Context, adminUserID string, input domain.CreateDailyPriceInput) (*domain.DailyPrice, error)
}

type PostgresCatalogRepository struct {
	db *pgxpool.Pool
}

func NewPostgresCatalogRepository(db *pgxpool.Pool) *PostgresCatalogRepository {
	return &PostgresCatalogRepository{db: db}
}

func (r *PostgresCatalogRepository) ListWoodTypes(ctx context.Context) ([]domain.WoodType, error) {
	rows, err := r.db.Query(ctx, `
		SELECT wood_id, name
		FROM wood_types
		ORDER BY name ASC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var woodTypes []domain.WoodType
	for rows.Next() {
		var wood domain.WoodType
		if err := rows.Scan(&wood.WoodID, &wood.Name); err != nil {
			return nil, err
		}
		woodTypes = append(woodTypes, wood)
	}

	return woodTypes, rows.Err()
}

func (r *PostgresCatalogRepository) CreateWoodType(ctx context.Context, input domain.CreateWoodTypeInput) (*domain.WoodType, error) {
	var wood domain.WoodType
	err := r.db.QueryRow(ctx, `
		INSERT INTO wood_types (name)
		VALUES ($1)
		RETURNING wood_id, name
	`, input.Name).Scan(&wood.WoodID, &wood.Name)
	if err != nil {
		return nil, mapDatabaseError(err)
	}

	return &wood, nil
}

func (r *PostgresCatalogRepository) ListDailyPrices(ctx context.Context, filters domain.DailyPriceFilters) ([]domain.DailyPrice, error) {
	baseQuery := `
		SELECT
			dp.price_id,
			dp.wood_id,
			dp.price_per_kg::float8,
			dp.effective_date::text,
			dp.created_by,
			dp.created_at,
			w.wood_id,
			w.name
		FROM daily_prices dp
		JOIN wood_types w ON w.wood_id = dp.wood_id
		WHERE 1=1
	`

	var conditions []string
	var args []any
	index := 1

	if filters.Date != "" {
		conditions = append(conditions, fmt.Sprintf("dp.effective_date = $%d", index))
		args = append(args, filters.Date)
		index++
	}
	if filters.WoodID != "" {
		conditions = append(conditions, fmt.Sprintf("dp.wood_id = $%d", index))
		args = append(args, filters.WoodID)
		index++
	}

	query := baseQuery
	if len(conditions) > 0 {
		query += " AND " + strings.Join(conditions, " AND ")
	}
	query += " ORDER BY dp.effective_date DESC, w.name ASC"

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var prices []domain.DailyPrice
	for rows.Next() {
		price, err := scanDailyPrice(rows)
		if err != nil {
			return nil, err
		}
		prices = append(prices, price)
	}

	return prices, rows.Err()
}

func (r *PostgresCatalogRepository) CreateDailyPrice(ctx context.Context, adminUserID string, input domain.CreateDailyPriceInput) (*domain.DailyPrice, error) {
	var price domain.DailyPrice
	var wood domain.WoodType
	err := r.db.QueryRow(ctx, `
		INSERT INTO daily_prices (wood_id, price_per_kg, effective_date, created_by)
		VALUES ($1, $2, $3, $4)
		RETURNING price_id, wood_id, price_per_kg::float8, effective_date::text, created_by, created_at
	`, input.WoodID, input.PricePerKg, input.EffectiveDate, adminUserID).Scan(
		&price.PriceID,
		&price.WoodID,
		&price.PricePerKg,
		&price.EffectiveDate,
		&price.CreatedBy,
		&price.CreatedAt,
	)
	if err != nil {
		return nil, mapDatabaseError(err)
	}

	err = r.db.QueryRow(ctx, `
		SELECT wood_id, name
		FROM wood_types
		WHERE wood_id = $1
	`, price.WoodID).Scan(&wood.WoodID, &wood.Name)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrWoodTypeNotFound
		}
		return nil, err
	}

	price.Wood = &wood
	return &price, nil
}

func scanDailyPrice(row scanner) (domain.DailyPrice, error) {
	var price domain.DailyPrice
	var wood domain.WoodType

	err := row.Scan(
		&price.PriceID,
		&price.WoodID,
		&price.PricePerKg,
		&price.EffectiveDate,
		&price.CreatedBy,
		&price.CreatedAt,
		&wood.WoodID,
		&wood.Name,
	)
	if err != nil {
		return domain.DailyPrice{}, err
	}

	price.Wood = &wood
	return price, nil
}
