package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"

	"lan-mai/backend/internal/domain"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrBuyTransactionNotFound = errors.New("buy transaction not found")
var ErrDailyPriceNotFound = errors.New("daily price not found")
var ErrBuyTransactionNotPending = errors.New("buy transaction is not pending")
var ErrInvalidBuyTransactionWeight = errors.New("invalid buy transaction weight")

type BuyTransactionRepository interface {
	List(ctx context.Context, filters domain.ListBuyTransactionFilters) ([]domain.BuyTransaction, error)
	Create(ctx context.Context, adminUserID string, input domain.CreateBuyTransactionInput) (*domain.BuyTransaction, error)
	Complete(ctx context.Context, transactionID string, input domain.CompleteBuyTransactionInput) (*domain.BuyTransaction, error)
}

type PostgresBuyTransactionRepository struct {
	db *pgxpool.Pool
}

func NewPostgresBuyTransactionRepository(db *pgxpool.Pool) *PostgresBuyTransactionRepository {
	return &PostgresBuyTransactionRepository{db: db}
}

func (r *PostgresBuyTransactionRepository) List(ctx context.Context, filters domain.ListBuyTransactionFilters) ([]domain.BuyTransaction, error) {
	baseQuery := `
		SELECT
			bt.transaction_id,
			bt.customer_id,
			bt.wood_id,
			bt.before_weight::float8,
			bt.after_weight::float8,
			bt.net_weight::float8,
			bt.price_per_kg::float8,
			bt.total_price::float8,
			bt.status,
			bt.created_by,
			bt.created_at,
			bt.updated_at,
			c.customer_id,
			c.name,
			c.type_car,
			c.model_car,
			c.color_car,
			c.license_plate,
			c.phone,
			w.wood_id,
			w.name
		FROM buy_transactions bt
		JOIN customers c ON c.customer_id = bt.customer_id
		JOIN wood_types w ON w.wood_id = bt.wood_id
		WHERE 1=1
	`

	var conditions []string
	var args []any
	index := 1

	if filters.Date != "" {
		conditions = append(conditions, fmt.Sprintf("DATE(bt.created_at) = $%d", index))
		args = append(args, filters.Date)
		index++
	}
	if filters.CustomerID != "" {
		conditions = append(conditions, fmt.Sprintf("bt.customer_id = $%d", index))
		args = append(args, filters.CustomerID)
		index++
	}
	if filters.WoodID != "" {
		conditions = append(conditions, fmt.Sprintf("bt.wood_id = $%d", index))
		args = append(args, filters.WoodID)
		index++
	}

	query := baseQuery
	if len(conditions) > 0 {
		query += " AND " + strings.Join(conditions, " AND ")
	}
	query += " ORDER BY bt.created_at DESC"

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var transactions []domain.BuyTransaction
	for rows.Next() {
		transaction, err := scanBuyTransaction(rows)
		if err != nil {
			return nil, err
		}
		transactions = append(transactions, transaction)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return transactions, nil
}

func (r *PostgresBuyTransactionRepository) Create(ctx context.Context, adminUserID string, input domain.CreateBuyTransactionInput) (*domain.BuyTransaction, error) {
	tx, err := r.db.BeginTx(ctx, pgx.TxOptions{})
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	var pricePerKg float64
	err = tx.QueryRow(ctx, `
		SELECT price_per_kg::float8
		FROM daily_prices
		WHERE wood_id = $1
			AND effective_date = CURRENT_DATE
	`, input.WoodID).Scan(&pricePerKg)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrDailyPriceNotFound
		}

		return nil, err
	}

	var transactionID string
	err = tx.QueryRow(ctx, `
		INSERT INTO buy_transactions (
			customer_id,
			wood_id,
			before_weight,
			price_per_kg,
			status,
			created_by
		)
		VALUES ($1, $2, $3, $4, 'pending', $5)
		RETURNING transaction_id
	`, input.CustomerID, input.WoodID, input.BeforeWeight, pricePerKg, adminUserID).Scan(&transactionID)
	if err != nil {
		return nil, err
	}

	transaction, err := r.findByIDTx(ctx, tx, transactionID)
	if err != nil {
		return nil, err
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}

	return transaction, nil
}

func (r *PostgresBuyTransactionRepository) Complete(ctx context.Context, transactionID string, input domain.CompleteBuyTransactionInput) (*domain.BuyTransaction, error) {
	tx, err := r.db.BeginTx(ctx, pgx.TxOptions{})
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	var beforeWeight float64
	var status domain.BuyTransactionStatus
	err = tx.QueryRow(ctx, `
		SELECT before_weight::float8, status
		FROM buy_transactions
		WHERE transaction_id = $1
	`, transactionID).Scan(&beforeWeight, &status)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrBuyTransactionNotFound
		}

		return nil, err
	}

	if status != domain.BuyTransactionStatusPending {
		return nil, ErrBuyTransactionNotPending
	}

	if input.AfterWeight >= beforeWeight {
		return nil, ErrInvalidBuyTransactionWeight
	}

	commandTag, err := tx.Exec(ctx, `
		UPDATE buy_transactions
		SET
			after_weight = $2,
			status = 'completed',
			updated_at = NOW()
		WHERE transaction_id = $1
	`, transactionID, input.AfterWeight)
	if err != nil {
		return nil, err
	}
	if commandTag.RowsAffected() == 0 {
		return nil, ErrBuyTransactionNotFound
	}

	transaction, err := r.findByIDTx(ctx, tx, transactionID)
	if err != nil {
		return nil, err
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}

	return transaction, nil
}

func (r *PostgresBuyTransactionRepository) findByIDTx(ctx context.Context, tx pgx.Tx, transactionID string) (*domain.BuyTransaction, error) {
	row := tx.QueryRow(ctx, `
		SELECT
			bt.transaction_id,
			bt.customer_id,
			bt.wood_id,
			bt.before_weight::float8,
			bt.after_weight::float8,
			bt.net_weight::float8,
			bt.price_per_kg::float8,
			bt.total_price::float8,
			bt.status,
			bt.created_by,
			bt.created_at,
			bt.updated_at,
			c.customer_id,
			c.name,
			c.type_car,
			c.model_car,
			c.color_car,
			c.license_plate,
			c.phone,
			w.wood_id,
			w.name
		FROM buy_transactions bt
		JOIN customers c ON c.customer_id = bt.customer_id
		JOIN wood_types w ON w.wood_id = bt.wood_id
		WHERE bt.transaction_id = $1
	`, transactionID)

	transaction, err := scanBuyTransaction(row)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrBuyTransactionNotFound
		}

		return nil, err
	}

	return &transaction, nil
}

type scanner interface {
	Scan(dest ...any) error
}

func scanBuyTransaction(row scanner) (domain.BuyTransaction, error) {
	var transaction domain.BuyTransaction
	var afterWeight sql.NullFloat64
	var netWeight sql.NullFloat64
	var totalPrice sql.NullFloat64
	var customer domain.Customer
	var wood domain.WoodType

	err := row.Scan(
		&transaction.TransactionID,
		&transaction.CustomerID,
		&transaction.WoodID,
		&transaction.BeforeWeight,
		&afterWeight,
		&netWeight,
		&transaction.PricePerKg,
		&totalPrice,
		&transaction.Status,
		&transaction.CreatedBy,
		&transaction.CreatedAt,
		&transaction.UpdatedAt,
		&customer.CustomerID,
		&customer.Name,
		&customer.TypeCar,
		&customer.ModelCar,
		&customer.ColorCar,
		&customer.LicensePlate,
		&customer.Phone,
		&wood.WoodID,
		&wood.Name,
	)
	if err != nil {
		return domain.BuyTransaction{}, err
	}

	if afterWeight.Valid {
		value := afterWeight.Float64
		transaction.AfterWeight = &value
	}
	if netWeight.Valid {
		value := netWeight.Float64
		transaction.NetWeight = &value
	}
	if totalPrice.Valid {
		value := totalPrice.Float64
		transaction.TotalPrice = &value
	}

	transaction.Customer = &customer
	transaction.Wood = &wood

	return transaction, nil
}
