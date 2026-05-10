package handler

import (
	"errors"
	"net/http"

	"lan-mai/backend/internal/domain"
	"lan-mai/backend/internal/service"
	"lan-mai/backend/pkg/response"

	"github.com/gin-gonic/gin"
)

type SellTransactionHandler struct {
	service *service.SellTransactionService
}

func NewSellTransactionHandler(service *service.SellTransactionService) *SellTransactionHandler {
	return &SellTransactionHandler{service: service}
}

func (h *SellTransactionHandler) List(c *gin.Context) {
	filters := domain.ListSellTransactionFilters{
		Date:          c.Query("date"),
		WoodID:        c.Query("wood_id"),
		DestinationID: c.Query("destination_id"),
	}

	transactions, err := h.service.List(c.Request.Context(), filters)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "failed to load sell transactions")
		return
	}

	response.JSON(c, http.StatusOK, gin.H{"transactions": transactions})
}

func (h *SellTransactionHandler) Create(c *gin.Context, adminUserID string) {
	var input domain.CreateSellTransactionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	transaction, err := h.service.Create(c.Request.Context(), adminUserID, input)
	if err != nil {
		status := http.StatusInternalServerError
		if errors.Is(err, service.ErrInvalidSellWeightFlow) {
			status = http.StatusUnprocessableEntity
		}
		response.Error(c, status, err.Error())
		return
	}

	response.JSON(c, http.StatusCreated, gin.H{"transaction": transaction})
}

func (h *SellTransactionHandler) ListDestinations(c *gin.Context) {
	destinations, err := h.service.ListDestinations(c.Request.Context())
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "failed to load destinations")
		return
	}

	response.JSON(c, http.StatusOK, gin.H{"destinations": destinations})
}
