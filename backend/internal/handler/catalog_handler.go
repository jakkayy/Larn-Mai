package handler

import (
	"errors"
	"net/http"

	"lan-mai/backend/internal/domain"
	"lan-mai/backend/internal/service"
	"lan-mai/backend/pkg/response"

	"github.com/gin-gonic/gin"
)

type CatalogHandler struct {
	service *service.CatalogService
}

func NewCatalogHandler(service *service.CatalogService) *CatalogHandler {
	return &CatalogHandler{service: service}
}

func (h *CatalogHandler) ListWoodTypes(c *gin.Context) {
	woodTypes, err := h.service.ListWoodTypes(c.Request.Context())
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "failed to load wood types")
		return
	}

	response.JSON(c, http.StatusOK, gin.H{"wood_types": woodTypes})
}

func (h *CatalogHandler) CreateWoodType(c *gin.Context) {
	var input domain.CreateWoodTypeInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	wood, err := h.service.CreateWoodType(c.Request.Context(), input)
	if err != nil {
		status := http.StatusInternalServerError
		if errors.Is(err, service.ErrWoodTypeConflict) {
			status = http.StatusConflict
		}
		response.Error(c, status, err.Error())
		return
	}

	response.JSON(c, http.StatusCreated, gin.H{"wood_type": wood})
}

func (h *CatalogHandler) ListDailyPrices(c *gin.Context) {
	filters := domain.DailyPriceFilters{
		Date:   c.Query("date"),
		WoodID: c.Query("wood_id"),
	}

	prices, err := h.service.ListDailyPrices(c.Request.Context(), filters)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "failed to load daily prices")
		return
	}

	response.JSON(c, http.StatusOK, gin.H{"daily_prices": prices})
}

func (h *CatalogHandler) CreateDailyPrice(c *gin.Context, adminUserID string) {
	var input domain.CreateDailyPriceInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	price, err := h.service.CreateDailyPrice(c.Request.Context(), adminUserID, input)
	if err != nil {
		status := http.StatusInternalServerError
		if errors.Is(err, service.ErrDailyPriceAlreadyExists) {
			status = http.StatusConflict
		}
		response.Error(c, status, err.Error())
		return
	}

	response.JSON(c, http.StatusCreated, gin.H{"daily_price": price})
}
