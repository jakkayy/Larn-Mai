package domain

import "time"

type Destination struct {
	DestinationID string `json:"destination_id"`
	Name          string `json:"name"`
	Code          string `json:"code"`
}

type SellTransaction struct {
	TransactionID  string       `json:"transaction_id"`
	WoodID         string       `json:"wood_id"`
	DestinationID  string       `json:"destination_id"`
	Wood           *WoodType    `json:"wood,omitempty"`
	Destination    *Destination `json:"destination,omitempty"`
	BeforeWeight   float64      `json:"before_weight"`
	AfterWeight    float64      `json:"after_weight"`
	NetWeight      float64      `json:"net_weight"`
	TotalSalePrice float64      `json:"total_sale_price"`
	Notes          *string      `json:"notes,omitempty"`
	CreatedBy      string       `json:"created_by"`
	CreatedAt      time.Time    `json:"created_at"`
	UpdatedAt      time.Time    `json:"updated_at"`
}

type CreateSellTransactionInput struct {
	WoodID         string  `json:"wood_id" binding:"required,uuid"`
	DestinationID  string  `json:"destination_id" binding:"required,uuid"`
	BeforeWeight   float64 `json:"before_weight" binding:"required,gt=0"`
	AfterWeight    float64 `json:"after_weight" binding:"required,gt=0"`
	TotalSalePrice float64 `json:"total_sale_price" binding:"required,gte=0"`
	Notes          string  `json:"notes"`
}

type ListSellTransactionFilters struct {
	Date          string
	WoodID        string
	DestinationID string
}
