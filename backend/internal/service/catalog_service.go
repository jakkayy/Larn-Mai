package service

import (
	"context"
	"errors"

	"lan-mai/backend/internal/domain"
	"lan-mai/backend/internal/repository"
)

var ErrWoodTypeConflict = errors.New("wood type already exists")
var ErrDailyPriceAlreadyExists = errors.New("daily price for this wood type and date already exists")

type CatalogService struct {
	repo repository.CatalogRepository
}

func NewCatalogService(repo repository.CatalogRepository) *CatalogService {
	return &CatalogService{repo: repo}
}

func (s *CatalogService) ListWoodTypes(ctx context.Context) ([]domain.WoodType, error) {
	return s.repo.ListWoodTypes(ctx)
}

func (s *CatalogService) CreateWoodType(ctx context.Context, input domain.CreateWoodTypeInput) (*domain.WoodType, error) {
	wood, err := s.repo.CreateWoodType(ctx, input)
	if err != nil {
		if errors.Is(err, repository.ErrUserConflict) {
			return nil, ErrWoodTypeConflict
		}
		return nil, err
	}

	return wood, nil
}

func (s *CatalogService) ListDailyPrices(ctx context.Context, filters domain.DailyPriceFilters) ([]domain.DailyPrice, error) {
	return s.repo.ListDailyPrices(ctx, filters)
}

func (s *CatalogService) CreateDailyPrice(ctx context.Context, adminUserID string, input domain.CreateDailyPriceInput) (*domain.DailyPrice, error) {
	price, err := s.repo.CreateDailyPrice(ctx, adminUserID, input)
	if err != nil {
		if errors.Is(err, repository.ErrUserConflict) {
			return nil, ErrDailyPriceAlreadyExists
		}
		return nil, err
	}

	return price, nil
}
