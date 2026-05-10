package domain

import "time"

type BuyTransactionStatus string

const (
	BuyTransactionStatusPending   BuyTransactionStatus = "pending"
	BuyTransactionStatusCompleted BuyTransactionStatus = "completed"
	BuyTransactionStatusCancelled BuyTransactionStatus = "cancelled"
)

type WoodType struct {
	WoodID string `json:"wood_id"`
	Name   string `json:"name"`
}

type BuyTransaction struct {
	TransactionID string               `json:"transaction_id"`
	CustomerID    string               `json:"customer_id"`
	WoodID        string               `json:"wood_id"`
	Customer      *Customer            `json:"customer,omitempty"`
	Wood          *WoodType            `json:"wood,omitempty"`
	BeforeWeight  float64              `json:"before_weight"`
	AfterWeight   *float64             `json:"after_weight,omitempty"`
	NetWeight     *float64             `json:"net_weight,omitempty"`
	PricePerKg    float64              `json:"price_per_kg"`
	TotalPrice    *float64             `json:"total_price,omitempty"`
	Status        BuyTransactionStatus `json:"status"`
	CreatedBy     string               `json:"created_by"`
	CreatedAt     time.Time            `json:"created_at"`
	UpdatedAt     time.Time            `json:"updated_at"`
}

type CreateBuyTransactionInput struct {
	CustomerID   string  `json:"customer_id" binding:"required,uuid"`
	WoodID       string  `json:"wood_id" binding:"required,uuid"`
	BeforeWeight float64 `json:"before_weight" binding:"required,gt=0"`
}

type CompleteBuyTransactionInput struct {
	AfterWeight float64 `json:"after_weight" binding:"required,gt=0"`
}

type ListBuyTransactionFilters struct {
	Date       string
	CustomerID string
	WoodID     string
}
