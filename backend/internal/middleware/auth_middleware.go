package middleware

import (
	"errors"
	"net/http"

	"lan-mai/backend/internal/auth"
	"lan-mai/backend/internal/domain"
	"lan-mai/backend/internal/repository"
	"lan-mai/backend/pkg/response"

	"github.com/gin-gonic/gin"
)

const currentUserContextKey = "current_user"
const currentSessionIDContextKey = "current_session_id"

type AuthMiddleware struct {
	cookieName string
	tokens     *auth.TokenManager
	sessions   *auth.SessionStore
	users      repository.UserRepository
}

func NewAuthMiddleware(cookieName string, tokens *auth.TokenManager, sessions *auth.SessionStore, users repository.UserRepository) *AuthMiddleware {
	return &AuthMiddleware{
		cookieName: cookieName,
		tokens:     tokens,
		sessions:   sessions,
		users:      users,
	}
}

func (m *AuthMiddleware) RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString, err := c.Cookie(m.cookieName)
		if err != nil {
			response.Error(c, http.StatusUnauthorized, "authentication required")
			c.Abort()
			return
		}

		claims, err := m.tokens.Parse(tokenString)
		if err != nil {
			response.Error(c, http.StatusUnauthorized, "invalid session")
			c.Abort()
			return
		}

		exists, err := m.sessions.Exists(c.Request.Context(), claims.Subject, claims.SID)
		if err != nil {
			response.Error(c, http.StatusInternalServerError, "failed to verify session")
			c.Abort()
			return
		}
		if !exists {
			response.Error(c, http.StatusUnauthorized, "session expired")
			c.Abort()
			return
		}

		user, err := m.users.FindByID(c.Request.Context(), claims.Subject)
		if err != nil {
			if errors.Is(err, repository.ErrUserNotFound) {
				response.Error(c, http.StatusUnauthorized, "user not found")
			} else {
				response.Error(c, http.StatusInternalServerError, "failed to load user")
			}
			c.Abort()
			return
		}

		c.Set(currentUserContextKey, user)
		c.Set(currentSessionIDContextKey, claims.SID)
		c.Next()
	}
}

func (m *AuthMiddleware) RequireRole(role domain.Role) gin.HandlerFunc {
	return func(c *gin.Context) {
		user, ok := GetCurrentUser(c)
		if !ok {
			response.Error(c, http.StatusUnauthorized, "authentication required")
			c.Abort()
			return
		}

		if user.Role != role {
			response.Error(c, http.StatusForbidden, "insufficient permissions")
			c.Abort()
			return
		}

		c.Next()
	}
}

func GetCurrentUser(c *gin.Context) (*domain.User, bool) {
	value, ok := c.Get(currentUserContextKey)
	if !ok {
		return nil, false
	}

	user, ok := value.(*domain.User)
	return user, ok
}

func GetCurrentSessionID(c *gin.Context) (string, bool) {
	value, ok := c.Get(currentSessionIDContextKey)
	if !ok {
		return "", false
	}

	sessionID, ok := value.(string)
	return sessionID, ok
}
