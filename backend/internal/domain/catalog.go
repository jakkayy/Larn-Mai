package domain

import "time"

type CreateWoodTypeInput struct {
	Name string `json:"name" binding:"required,max=100"`
}

type DailyPrice struct {
	PriceID       string    `json:"price_id"`
	WoodID        string    `json:"wood_id"`
	Wood          *WoodType `json:"wood,omitempty"`
	PricePerKg    float64   `json:"price_per_kg"`
	EffectiveDate string    `json:"effective_date"`
	CreatedBy     string    `json:"created_by"`
	CreatedAt     time.Time `json:"created_at"`
}

type CreateDailyPriceInput struct {
	WoodID        string  `json:"wood_id" binding:"required,uuid"`
	PricePerKg    float64 `json:"price_per_kg" binding:"required,gte=0"`
	EffectiveDate string  `json:"effective_date" binding:"required,datetime=2006-01-02"`
}

type DailyPriceFilters struct {
	Date   string
	WoodID string
}
