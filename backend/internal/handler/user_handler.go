package handler

import (
	"net/http"

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
