package handler

import (
	"errors"
	"net/http"
	"time"

	"lan-mai/backend/internal/domain"
	"lan-mai/backend/internal/service"
	"lan-mai/backend/pkg/response"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	service      *service.AuthService
	cookieName   string
	cookieDomain string
	cookieSecure bool
	sessionTTL   time.Duration
}

func NewAuthHandler(service *service.AuthService, cookieName string, cookieDomain string, cookieSecure bool, sessionTTL time.Duration) *AuthHandler {
	return &AuthHandler{
		service:      service,
		cookieName:   cookieName,
		cookieDomain: cookieDomain,
		cookieSecure: cookieSecure,
		sessionTTL:   sessionTTL,
	}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var input domain.RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	result, err := h.service.Register(c.Request.Context(), input)
	if err != nil {
		status := http.StatusInternalServerError
		if errors.Is(err, service.ErrRegisterConflict) {
			status = http.StatusConflict
		}
		response.Error(c, status, err.Error())
		return
	}

	h.setSessionCookie(c, result.Token)
	response.JSON(c, http.StatusCreated, gin.H{"user": result.User})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var input domain.LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	result, err := h.service.Login(c.Request.Context(), input)
	if err != nil {
		status := http.StatusInternalServerError
		if errors.Is(err, service.ErrInvalidCredentials) {
			status = http.StatusUnauthorized
		}
		response.Error(c, status, err.Error())
		return
	}

	h.setSessionCookie(c, result.Token)
	response.JSON(c, http.StatusOK, gin.H{"user": result.User})
}

func (h *AuthHandler) Logout(c *gin.Context, userID string, sessionID string) {
	if err := h.service.Logout(c.Request.Context(), userID, sessionID); err != nil {
		response.Error(c, http.StatusInternalServerError, "failed to logout")
		return
	}

	h.clearSessionCookie(c)
	response.JSON(c, http.StatusOK, gin.H{"message": "logged out"})
}

func (h *AuthHandler) setSessionCookie(c *gin.Context, token string) {
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(
		h.cookieName,
		token,
		int(h.sessionTTL.Seconds()),
		"/",
		h.cookieDomain,
		h.cookieSecure,
		true,
	)
}

func (h *AuthHandler) clearSessionCookie(c *gin.Context) {
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(
		h.cookieName,
		"",
		-1,
		"/",
		h.cookieDomain,
		h.cookieSecure,
		true,
	)
}
