package handler

import (
	"context"
	"net/http"
	"time"

	"lan-mai/backend/pkg/response"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

type HealthHandler struct {
	db    *pgxpool.Pool
	redis *redis.Client
}

func NewHealthHandler(db *pgxpool.Pool, redis *redis.Client) *HealthHandler {
	return &HealthHandler{
		db:    db,
		redis: redis,
	}
}

func (h *HealthHandler) Health(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	if err := h.db.Ping(ctx); err != nil {
		response.Error(c, http.StatusServiceUnavailable, "database unavailable")
		return
	}

	if err := h.redis.Ping(ctx).Err(); err != nil {
		response.Error(c, http.StatusServiceUnavailable, "redis unavailable")
		return
	}

	response.JSON(c, http.StatusOK, gin.H{"status": "ok"})
}
