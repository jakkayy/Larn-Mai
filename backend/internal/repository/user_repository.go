package repository

import (
	"context"
	"errors"

	"lan-mai/backend/internal/domain"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrUserNotFound = errors.New("user not found")
var ErrUserConflict = errors.New("user conflict")

type UserRepository interface {
	CreateUserWithCustomer(ctx context.Context, input domain.RegisterInput, passwordHash string) (*domain.User, error)
	FindByUsername(ctx context.Context, username string) (*domain.User, error)
	FindByID(ctx context.Context, userID string) (*domain.User, error)
}

type PostgresUserRepository struct {
	db *pgxpool.Pool
}

func NewPostgresUserRepository(db *pgxpool.Pool) *PostgresUserRepository {
	return &PostgresUserRepository{db: db}
}

func (r *PostgresUserRepository) CreateUserWithCustomer(ctx context.Context, input domain.RegisterInput, passwordHash string) (*domain.User, error) {
	tx, err := r.db.BeginTx(ctx, pgx.TxOptions{})
	if err != nil {
		return nil, mapDatabaseError(err)
	}
	defer tx.Rollback(ctx)

	var customer domain.Customer
	err = tx.QueryRow(ctx, `
		INSERT INTO customers (name, type_car, model_car, color_car, license_plate, phone)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING customer_id, name, type_car, model_car, color_car, license_plate, phone
	`, input.Name, input.TypeCar, input.ModelCar, input.ColorCar, input.LicensePlate, input.Phone).Scan(
		&customer.CustomerID,
		&customer.Name,
		&customer.TypeCar,
		&customer.ModelCar,
		&customer.ColorCar,
		&customer.LicensePlate,
		&customer.Phone,
	)
	if err != nil {
		return nil, mapDatabaseError(err)
	}

	user := &domain.User{
		Customer: &customer,
	}
	err = tx.QueryRow(ctx, `
		INSERT INTO users (username, password_hash, role, customer_id)
		VALUES ($1, $2, 'user', $3)
		RETURNING user_id, username, role, customer_id
	`, input.Username, passwordHash, customer.CustomerID).Scan(
		&user.UserID,
		&user.Username,
		&user.Role,
		&user.CustomerID,
	)
	if err != nil {
		return nil, err
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}

	return user, nil
}

func (r *PostgresUserRepository) FindByUsername(ctx context.Context, username string) (*domain.User, error) {
	return r.findOne(ctx, `
		SELECT
			u.user_id,
			u.username,
			u.password_hash,
			u.role,
			u.customer_id,
			c.customer_id,
			c.name,
			c.type_car,
			c.model_car,
			c.color_car,
			c.license_plate,
			c.phone
		FROM users u
		LEFT JOIN customers c ON c.customer_id = u.customer_id
		WHERE u.username = $1
	`, username)
}

func (r *PostgresUserRepository) FindByID(ctx context.Context, userID string) (*domain.User, error) {
	return r.findOne(ctx, `
		SELECT
			u.user_id,
			u.username,
			u.password_hash,
			u.role,
			u.customer_id,
			c.customer_id,
			c.name,
			c.type_car,
			c.model_car,
			c.color_car,
			c.license_plate,
			c.phone
		FROM users u
		LEFT JOIN customers c ON c.customer_id = u.customer_id
		WHERE u.user_id = $1
	`, userID)
}

func (r *PostgresUserRepository) findOne(ctx context.Context, query string, arg string) (*domain.User, error) {
	var user domain.User
	var customerID *string
	var customer domain.Customer
	var customerRecordID *string
	var customerName *string
	var typeCar *string
	var modelCar *string
	var colorCar *string
	var licensePlate *string
	var phone *string

	err := r.db.QueryRow(ctx, query, arg).Scan(
		&user.UserID,
		&user.Username,
		&user.PasswordHash,
		&user.Role,
		&customerID,
		&customerRecordID,
		&customerName,
		&typeCar,
		&modelCar,
		&colorCar,
		&licensePlate,
		&phone,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrUserNotFound
		}

		return nil, err
	}

	user.CustomerID = customerID

	if customerRecordID != nil {
		customer.CustomerID = *customerRecordID
		customer.Name = derefString(customerName)
		customer.TypeCar = derefString(typeCar)
		customer.ModelCar = derefString(modelCar)
		customer.ColorCar = derefString(colorCar)
		customer.LicensePlate = derefString(licensePlate)
		customer.Phone = derefString(phone)
		user.Customer = &customer
	}

	return &user, nil
}

func derefString(value *string) string {
	if value == nil {
		return ""
	}

	return *value
}

func mapDatabaseError(err error) error {
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) && pgErr.Code == "23505" {
		return ErrUserConflict
	}

	return err
}
