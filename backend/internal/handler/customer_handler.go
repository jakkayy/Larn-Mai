package handler

import (
	"errors"
	"net/http"

	"lan-mai/backend/internal/domain"
	"lan-mai/backend/internal/service"
	"lan-mai/backend/pkg/response"

	"github.com/gin-gonic/gin"
)

type CustomerHandler struct {
	service *service.CustomerService
}

func NewCustomerHandler(service *service.CustomerService) *CustomerHandler {
	return &CustomerHandler{service: service}
}

func (h *CustomerHandler) List(c *gin.Context) {
	filters := domain.ListCustomerFilters{
		Query: c.Query("q"),
	}

	customers, err := h.service.List(c.Request.Context(), filters)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "failed to load customers")
		return
	}

	response.JSON(c, http.StatusOK, gin.H{"customers": customers})
}

func (h *CustomerHandler) Create(c *gin.Context) {
	var input domain.CreateCustomerInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	customer, err := h.service.Create(c.Request.Context(), input)
	if err != nil {
		status := http.StatusInternalServerError
		if errors.Is(err, service.ErrCustomerConflict) {
			status = http.StatusConflict
		}
		response.Error(c, status, err.Error())
		return
	}

	response.JSON(c, http.StatusCreated, gin.H{"customer": customer})
}

func (h *CustomerHandler) Get(c *gin.Context) {
	customer, err := h.service.FindByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		status := http.StatusInternalServerError
		if errors.Is(err, service.ErrCustomerNotFound) {
			status = http.StatusNotFound
		}
		response.Error(c, status, err.Error())
		return
	}

	response.JSON(c, http.StatusOK, gin.H{"customer": customer})
}

func (h *CustomerHandler) Update(c *gin.Context) {
	var input domain.UpdateCustomerInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	customer, err := h.service.Update(c.Request.Context(), c.Param("id"), input)
	if err != nil {
		status := http.StatusInternalServerError
		switch {
		case errors.Is(err, service.ErrCustomerConflict):
			status = http.StatusConflict
		case errors.Is(err, service.ErrCustomerNotFound):
			status = http.StatusNotFound
		}
		response.Error(c, status, err.Error())
		return
	}

	response.JSON(c, http.StatusOK, gin.H{"customer": customer})
}
