package repository

import (
	"context"
	"errors"

	"lan-mai/backend/internal/domain"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrCustomerNotFound = errors.New("customer not found")

type CustomerRepository interface {
	List(ctx context.Context, filters domain.ListCustomerFilters) ([]domain.Customer, error)
	Create(ctx context.Context, input domain.CreateCustomerInput) (*domain.Customer, error)
	FindByID(ctx context.Context, customerID string) (*domain.Customer, error)
	Update(ctx context.Context, customerID string, input domain.UpdateCustomerInput) (*domain.Customer, error)
}

type PostgresCustomerRepository struct {
	db *pgxpool.Pool
}

func NewPostgresCustomerRepository(db *pgxpool.Pool) *PostgresCustomerRepository {
	return &PostgresCustomerRepository{db: db}
}

func (r *PostgresCustomerRepository) List(ctx context.Context, filters domain.ListCustomerFilters) ([]domain.Customer, error) {
	var (
		rows pgx.Rows
		err  error
	)

	if filters.Query != "" {
		pattern := "%" + filters.Query + "%"
		rows, err = r.db.Query(ctx, `
			SELECT customer_id, name, type_car, model_car, color_car, license_plate, phone
			FROM customers
			WHERE
				name ILIKE $1
				OR license_plate ILIKE $1
				OR phone ILIKE $1
			ORDER BY name ASC
		`, pattern)
	} else {
		rows, err = r.db.Query(ctx, `
			SELECT customer_id, name, type_car, model_car, color_car, license_plate, phone
			FROM customers
			ORDER BY name ASC
		`)
	}
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var customers []domain.Customer
	for rows.Next() {
		customer, err := scanCustomer(rows)
		if err != nil {
			return nil, err
		}
		customers = append(customers, customer)
	}

	return customers, rows.Err()
}

func (r *PostgresCustomerRepository) Create(ctx context.Context, input domain.CreateCustomerInput) (*domain.Customer, error) {
	row := r.db.QueryRow(ctx, `
		INSERT INTO customers (name, type_car, model_car, color_car, license_plate, phone)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING customer_id, name, type_car, model_car, color_car, license_plate, phone
	`, input.Name, input.TypeCar, input.ModelCar, input.ColorCar, input.LicensePlate, input.Phone)

	customer, err := scanCustomer(row)
	if err != nil {
		return nil, mapDatabaseError(err)
	}

	return &customer, nil
}

func (r *PostgresCustomerRepository) FindByID(ctx context.Context, customerID string) (*domain.Customer, error) {
	row := r.db.QueryRow(ctx, `
		SELECT customer_id, name, type_car, model_car, color_car, license_plate, phone
		FROM customers
		WHERE customer_id = $1
	`, customerID)

	customer, err := scanCustomer(row)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrCustomerNotFound
		}
		return nil, err
	}

	return &customer, nil
}

func (r *PostgresCustomerRepository) Update(ctx context.Context, customerID string, input domain.UpdateCustomerInput) (*domain.Customer, error) {
	commandTag, err := r.db.Exec(ctx, `
		UPDATE customers
		SET
			name = $2,
			type_car = $3,
			model_car = $4,
			color_car = $5,
			license_plate = $6,
			phone = $7,
			updated_at = NOW()
		WHERE customer_id = $1
	`, customerID, input.Name, input.TypeCar, input.ModelCar, input.ColorCar, input.LicensePlate, input.Phone)
	if err != nil {
		return nil, mapDatabaseError(err)
	}
	if commandTag.RowsAffected() == 0 {
		return nil, ErrCustomerNotFound
	}

	return r.FindByID(ctx, customerID)
}

func scanCustomer(row scanner) (domain.Customer, error) {
	var customer domain.Customer

	err := row.Scan(
		&customer.CustomerID,
		&customer.Name,
		&customer.TypeCar,
		&customer.ModelCar,
		&customer.ColorCar,
		&customer.LicensePlate,
		&customer.Phone,
	)
	if err != nil {
		return domain.Customer{}, err
	}

	return customer, nil
}
