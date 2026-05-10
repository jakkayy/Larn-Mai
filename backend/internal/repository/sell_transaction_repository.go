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

var ErrSellTransactionNotFound = errors.New("sell transaction not found")
var ErrInvalidSellTransactionWeight = errors.New("invalid sell transaction weight")

type SellTransactionRepository interface {
	List(ctx context.Context, filters domain.ListSellTransactionFilters) ([]domain.SellTransaction, error)
	Create(ctx context.Context, adminUserID string, input domain.CreateSellTransactionInput) (*domain.SellTransaction, error)
	ListDestinations(ctx context.Context) ([]domain.Destination, error)
}

type PostgresSellTransactionRepository struct {
	db *pgxpool.Pool
}

func NewPostgresSellTransactionRepository(db *pgxpool.Pool) *PostgresSellTransactionRepository {
	return &PostgresSellTransactionRepository{db: db}
}

func (r *PostgresSellTransactionRepository) List(ctx context.Context, filters domain.ListSellTransactionFilters) ([]domain.SellTransaction, error) {
	baseQuery := `
		SELECT
			st.transaction_id,
			st.wood_id,
			st.destination_id,
			st.before_weight::float8,
			st.after_weight::float8,
			st.net_weight::float8,
			st.total_sale_price::float8,
			st.notes,
			st.created_by,
			st.created_at,
			st.updated_at,
			w.wood_id,
			w.name,
			d.destination_id,
			d.name,
			d.code
		FROM sell_transactions st
		JOIN wood_types w ON w.wood_id = st.wood_id
		JOIN destinations d ON d.destination_id = st.destination_id
		WHERE 1=1
	`

	var conditions []string
	var args []any
	index := 1

	if filters.Date != "" {
		conditions = append(conditions, fmt.Sprintf("DATE(st.created_at) = $%d", index))
		args = append(args, filters.Date)
		index++
	}
	if filters.WoodID != "" {
		conditions = append(conditions, fmt.Sprintf("st.wood_id = $%d", index))
		args = append(args, filters.WoodID)
		index++
	}
	if filters.DestinationID != "" {
		conditions = append(conditions, fmt.Sprintf("st.destination_id = $%d", index))
		args = append(args, filters.DestinationID)
		index++
	}

	query := baseQuery
	if len(conditions) > 0 {
		query += " AND " + strings.Join(conditions, " AND ")
	}
	query += " ORDER BY st.created_at DESC"

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var transactions []domain.SellTransaction
	for rows.Next() {
		transaction, err := scanSellTransaction(rows)
		if err != nil {
			return nil, err
		}
		transactions = append(transactions, transaction)
	}

	return transactions, rows.Err()
}

func (r *PostgresSellTransactionRepository) Create(ctx context.Context, adminUserID string, input domain.CreateSellTransactionInput) (*domain.SellTransaction, error) {
	if input.AfterWeight <= input.BeforeWeight {
		return nil, ErrInvalidSellTransactionWeight
	}

	var notes *string
	if strings.TrimSpace(input.Notes) != "" {
		notes = &input.Notes
	}

	var transactionID string
	err := r.db.QueryRow(ctx, `
		INSERT INTO sell_transactions (
			wood_id,
			destination_id,
			before_weight,
			after_weight,
			total_sale_price,
			notes,
			created_by
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING transaction_id
	`, input.WoodID, input.DestinationID, input.BeforeWeight, input.AfterWeight, input.TotalSalePrice, notes, adminUserID).Scan(&transactionID)
	if err != nil {
		return nil, mapDatabaseError(err)
	}

	return r.findByID(ctx, transactionID)
}

func (r *PostgresSellTransactionRepository) ListDestinations(ctx context.Context) ([]domain.Destination, error) {
	rows, err := r.db.Query(ctx, `
		SELECT destination_id, name, code
		FROM destinations
		ORDER BY name ASC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var destinations []domain.Destination
	for rows.Next() {
		var destination domain.Destination
		if err := rows.Scan(&destination.DestinationID, &destination.Name, &destination.Code); err != nil {
			return nil, err
		}
		destinations = append(destinations, destination)
	}

	return destinations, rows.Err()
}

func (r *PostgresSellTransactionRepository) findByID(ctx context.Context, transactionID string) (*domain.SellTransaction, error) {
	row := r.db.QueryRow(ctx, `
		SELECT
			st.transaction_id,
			st.wood_id,
			st.destination_id,
			st.before_weight::float8,
			st.after_weight::float8,
			st.net_weight::float8,
			st.total_sale_price::float8,
			st.notes,
			st.created_by,
			st.created_at,
			st.updated_at,
			w.wood_id,
			w.name,
			d.destination_id,
			d.name,
			d.code
		FROM sell_transactions st
		JOIN wood_types w ON w.wood_id = st.wood_id
		JOIN destinations d ON d.destination_id = st.destination_id
		WHERE st.transaction_id = $1
	`, transactionID)

	transaction, err := scanSellTransaction(row)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrSellTransactionNotFound
		}
		return nil, err
	}

	return &transaction, nil
}

func scanSellTransaction(row scanner) (domain.SellTransaction, error) {
	var transaction domain.SellTransaction
	var notes *string
	var wood domain.WoodType
	var destination domain.Destination

	err := row.Scan(
		&transaction.TransactionID,
		&transaction.WoodID,
		&transaction.DestinationID,
		&transaction.BeforeWeight,
		&transaction.AfterWeight,
		&transaction.NetWeight,
		&transaction.TotalSalePrice,
		&notes,
		&transaction.CreatedBy,
		&transaction.CreatedAt,
		&transaction.UpdatedAt,
		&wood.WoodID,
		&wood.Name,
		&destination.DestinationID,
		&destination.Name,
		&destination.Code,
	)
	if err != nil {
		return domain.SellTransaction{}, err
	}

	transaction.Notes = notes
	transaction.Wood = &wood
	transaction.Destination = &destination

	return transaction, nil
}
