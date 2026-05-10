package handler

import (
	"errors"
	"net/http"

	"lan-mai/backend/internal/domain"
	"lan-mai/backend/internal/service"
	"lan-mai/backend/pkg/response"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	service *service.AuthService
}

func NewUserHandler(service *service.AuthService) *UserHandler {
	return &UserHandler{service: service}
}

func (h *UserHandler) Me(c *gin.Context, userID string) {
	user, err := h.service.CurrentUser(c.Request.Context(), userID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "failed to load current user")
		return
	}

	response.JSON(c, http.StatusOK, gin.H{"user": user})
}

func (h *UserHandler) UpdateMe(c *gin.Context, userID string) {
	var input domain.UpdateProfileInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	user, err := h.service.UpdateProfile(c.Request.Context(), userID, input)
	if err != nil {
		status := http.StatusInternalServerError
		if errors.Is(err, service.ErrProfileConflict) {
			status = http.StatusConflict
		}
		response.Error(c, status, err.Error())
		return
	}

	response.JSON(c, http.StatusOK, gin.H{"user": user})
}
