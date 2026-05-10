package handler

import (
	"errors"
	"net/http"

	"lan-mai/backend/internal/domain"
	"lan-mai/backend/internal/service"
	"lan-mai/backend/pkg/response"

	"github.com/gin-gonic/gin"
)

type BuyTransactionHandler struct {
	service *service.BuyTransactionService
}

func NewBuyTransactionHandler(service *service.BuyTransactionService) *BuyTransactionHandler {
	return &BuyTransactionHandler{service: service}
}

func (h *BuyTransactionHandler) List(c *gin.Context) {
	filters := domain.ListBuyTransactionFilters{
		Date:       c.Query("date"),
		CustomerID: c.Query("customer_id"),
		WoodID:     c.Query("wood_id"),
	}

	transactions, err := h.service.List(c.Request.Context(), filters)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "failed to load buy transactions")
		return
	}

	response.JSON(c, http.StatusOK, gin.H{"transactions": transactions})
}

func (h *BuyTransactionHandler) Create(c *gin.Context, adminUserID string) {
	var input domain.CreateBuyTransactionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	transaction, err := h.service.Create(c.Request.Context(), adminUserID, input)
	if err != nil {
		status := http.StatusInternalServerError
		if errors.Is(err, service.ErrDailyPriceUnavailable) {
			status = http.StatusUnprocessableEntity
		}
		response.Error(c, status, err.Error())
		return
	}

	response.JSON(c, http.StatusCreated, gin.H{"transaction": transaction})
}

func (h *BuyTransactionHandler) Complete(c *gin.Context) {
	var input domain.CompleteBuyTransactionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	transaction, err := h.service.Complete(c.Request.Context(), c.Param("id"), input)
	if err != nil {
		status := http.StatusInternalServerError
		switch {
		case errors.Is(err, service.ErrBuyTransactionNotFound):
			status = http.StatusNotFound
		case errors.Is(err, service.ErrBuyTransactionAlreadyCompleted), errors.Is(err, service.ErrInvalidWeightFlow):
			status = http.StatusUnprocessableEntity
		}
		response.Error(c, status, err.Error())
		return
	}

	response.JSON(c, http.StatusOK, gin.H{"transaction": transaction})
}
