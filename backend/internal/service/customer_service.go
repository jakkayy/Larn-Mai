package service

import (
	"context"
	"errors"

	"lan-mai/backend/internal/domain"
	"lan-mai/backend/internal/repository"
)

var ErrCustomerConflict = errors.New("customer data conflicts with an existing record")
var ErrCustomerNotFound = errors.New("customer not found")

type CustomerService struct {
	repo repository.CustomerRepository
}

func NewCustomerService(repo repository.CustomerRepository) *CustomerService {
	return &CustomerService{repo: repo}
}

func (s *CustomerService) List(ctx context.Context, filters domain.ListCustomerFilters) ([]domain.Customer, error) {
	return s.repo.List(ctx, filters)
}

func (s *CustomerService) Create(ctx context.Context, input domain.CreateCustomerInput) (*domain.Customer, error) {
	customer, err := s.repo.Create(ctx, input)
	if err != nil {
		if errors.Is(err, repository.ErrUserConflict) {
			return nil, ErrCustomerConflict
		}
		return nil, err
	}

	return customer, nil
}

func (s *CustomerService) FindByID(ctx context.Context, customerID string) (*domain.Customer, error) {
	customer, err := s.repo.FindByID(ctx, customerID)
	if err != nil {
		if errors.Is(err, repository.ErrCustomerNotFound) {
			return nil, ErrCustomerNotFound
		}
		return nil, err
	}

	return customer, nil
}

func (s *CustomerService) Update(ctx context.Context, customerID string, input domain.UpdateCustomerInput) (*domain.Customer, error) {
	customer, err := s.repo.Update(ctx, customerID, input)
	if err != nil {
		switch {
		case errors.Is(err, repository.ErrUserConflict):
			return nil, ErrCustomerConflict
		case errors.Is(err, repository.ErrCustomerNotFound):
			return nil, ErrCustomerNotFound
		default:
			return nil, err
		}
	}

	return customer, nil
}
