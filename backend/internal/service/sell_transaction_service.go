package service

import (
	"context"
	"errors"

	"lan-mai/backend/internal/domain"
	"lan-mai/backend/internal/repository"
)

var ErrInvalidSellWeightFlow = errors.New("after_weight must be greater than before_weight")

type SellTransactionService struct {
	repo repository.SellTransactionRepository
}

func NewSellTransactionService(repo repository.SellTransactionRepository) *SellTransactionService {
	return &SellTransactionService{repo: repo}
}

func (s *SellTransactionService) List(ctx context.Context, filters domain.ListSellTransactionFilters) ([]domain.SellTransaction, error) {
	return s.repo.List(ctx, filters)
}

func (s *SellTransactionService) Create(ctx context.Context, adminUserID string, input domain.CreateSellTransactionInput) (*domain.SellTransaction, error) {
	transaction, err := s.repo.Create(ctx, adminUserID, input)
	if err != nil {
		if errors.Is(err, repository.ErrInvalidSellTransactionWeight) {
			return nil, ErrInvalidSellWeightFlow
		}
		return nil, err
	}

	return transaction, nil
}

func (s *SellTransactionService) ListDestinations(ctx context.Context) ([]domain.Destination, error) {
	return s.repo.ListDestinations(ctx)
}
