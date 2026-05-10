package service

import (
	"context"
	"errors"

	"lan-mai/backend/internal/domain"
	"lan-mai/backend/internal/repository"
)

var ErrDailyPriceUnavailable = errors.New("daily price for this wood type is not set for today")
var ErrBuyTransactionNotFound = errors.New("buy transaction not found")
var ErrBuyTransactionAlreadyCompleted = errors.New("buy transaction is already completed")
var ErrInvalidWeightFlow = errors.New("after_weight must be less than before_weight")

type BuyTransactionService struct {
	repo repository.BuyTransactionRepository
}

func NewBuyTransactionService(repo repository.BuyTransactionRepository) *BuyTransactionService {
	return &BuyTransactionService{repo: repo}
}

func (s *BuyTransactionService) List(ctx context.Context, filters domain.ListBuyTransactionFilters) ([]domain.BuyTransaction, error) {
	return s.repo.List(ctx, filters)
}

func (s *BuyTransactionService) Create(ctx context.Context, adminUserID string, input domain.CreateBuyTransactionInput) (*domain.BuyTransaction, error) {
	transaction, err := s.repo.Create(ctx, adminUserID, input)
	if err != nil {
		return nil, mapBuyTransactionError(err)
	}

	return transaction, nil
}

func (s *BuyTransactionService) Complete(ctx context.Context, transactionID string, input domain.CompleteBuyTransactionInput) (*domain.BuyTransaction, error) {
	transaction, err := s.repo.Complete(ctx, transactionID, input)
	if err != nil {
		return nil, mapBuyTransactionError(err)
	}

	return transaction, nil
}

func mapBuyTransactionError(err error) error {
	switch {
	case errors.Is(err, repository.ErrDailyPriceNotFound):
		return ErrDailyPriceUnavailable
	case errors.Is(err, repository.ErrBuyTransactionNotFound):
		return ErrBuyTransactionNotFound
	case errors.Is(err, repository.ErrBuyTransactionNotPending):
		return ErrBuyTransactionAlreadyCompleted
	case errors.Is(err, repository.ErrInvalidBuyTransactionWeight):
		return ErrInvalidWeightFlow
	default:
		return err
	}
}
