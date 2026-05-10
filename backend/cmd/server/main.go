package main

import (
	"context"
	"log"

	"lan-mai/backend/internal/auth"
	"lan-mai/backend/internal/config"
	"lan-mai/backend/internal/domain"
	"lan-mai/backend/internal/handler"
	"lan-mai/backend/internal/middleware"
	"lan-mai/backend/internal/repository"
	"lan-mai/backend/internal/service"
	"lan-mai/backend/internal/storage"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()
	ctx := context.Background()

	db, err := storage.NewPostgres(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("connect postgres: %v", err)
	}
	defer db.Close()

	redisClient := storage.NewRedis(cfg.RedisAddr, cfg.RedisDB)
	defer redisClient.Close()

	userRepository := repository.NewPostgresUserRepository(db)
	buyTransactionRepository := repository.NewPostgresBuyTransactionRepository(db)
	catalogRepository := repository.NewPostgresCatalogRepository(db)
	tokenManager := auth.NewTokenManager(cfg.JWTSecret, cfg.JWTIssuer)
	sessionStore := auth.NewSessionStore(redisClient)
	authService := service.NewAuthService(userRepository, tokenManager, sessionStore, cfg.SessionTTL)
	buyTransactionService := service.NewBuyTransactionService(buyTransactionRepository)
	catalogService := service.NewCatalogService(catalogRepository)

	authHandler := handler.NewAuthHandler(authService, cfg.CookieName, cfg.CookieDomain, cfg.CookieSecure, cfg.SessionTTL)
	buyTransactionHandler := handler.NewBuyTransactionHandler(buyTransactionService)
	catalogHandler := handler.NewCatalogHandler(catalogService)
	userHandler := handler.NewUserHandler(authService)
	healthHandler := handler.NewHealthHandler(db, redisClient)
	authMiddleware := middleware.NewAuthMiddleware(cfg.CookieName, tokenManager, sessionStore, userRepository)

	router := gin.Default()
	router.GET("/health", healthHandler.Health)

	api := router.Group("/api")
	{
		authRoutes := api.Group("/auth")
		{
			authRoutes.POST("/register", authHandler.Register)
			authRoutes.POST("/login", authHandler.Login)
			authRoutes.POST("/logout", authMiddleware.RequireAuth(), func(c *gin.Context) {
				user, ok := middleware.GetCurrentUser(c)
				if !ok {
					c.AbortWithStatus(401)
					return
				}
				sessionID, ok := middleware.GetCurrentSessionID(c)
				if !ok {
					c.AbortWithStatus(401)
					return
				}

				authHandler.Logout(c, user.UserID, sessionID)
			})
		}

		userRoutes := api.Group("/users")
		userRoutes.Use(authMiddleware.RequireAuth())
		{
			userRoutes.GET("/me", func(c *gin.Context) {
				user, ok := middleware.GetCurrentUser(c)
				if !ok {
					c.AbortWithStatus(401)
					return
				}

				userHandler.Me(c, user.UserID)
			})
			userRoutes.PUT("/me", func(c *gin.Context) {
				user, ok := middleware.GetCurrentUser(c)
				if !ok {
					c.AbortWithStatus(401)
					return
				}

				userHandler.UpdateMe(c, user.UserID)
			})
		}

		adminRoutes := api.Group("/admin")
		adminRoutes.Use(authMiddleware.RequireAuth(), authMiddleware.RequireRole(domain.RoleAdmin))
		{
			adminRoutes.GET("/me", func(c *gin.Context) {
				user, ok := middleware.GetCurrentUser(c)
				if !ok {
					c.AbortWithStatus(401)
					return
				}

				userHandler.Me(c, user.UserID)
			})
		}

		buyTransactionRoutes := api.Group("/buy-transactions")
		buyTransactionRoutes.Use(authMiddleware.RequireAuth(), authMiddleware.RequireRole(domain.RoleAdmin))
		{
			buyTransactionRoutes.GET("", buyTransactionHandler.List)
			buyTransactionRoutes.POST("", func(c *gin.Context) {
				user, ok := middleware.GetCurrentUser(c)
				if !ok {
					c.AbortWithStatus(401)
					return
				}

				buyTransactionHandler.Create(c, user.UserID)
			})
			buyTransactionRoutes.PATCH("/:id", buyTransactionHandler.Complete)
		}

		woodTypeRoutes := api.Group("/wood-types")
		woodTypeRoutes.Use(authMiddleware.RequireAuth(), authMiddleware.RequireRole(domain.RoleAdmin))
		{
			woodTypeRoutes.GET("", catalogHandler.ListWoodTypes)
			woodTypeRoutes.POST("", catalogHandler.CreateWoodType)
		}

		dailyPriceRoutes := api.Group("/daily-prices")
		dailyPriceRoutes.Use(authMiddleware.RequireAuth(), authMiddleware.RequireRole(domain.RoleAdmin))
		{
			dailyPriceRoutes.GET("", catalogHandler.ListDailyPrices)
			dailyPriceRoutes.POST("", func(c *gin.Context) {
				user, ok := middleware.GetCurrentUser(c)
				if !ok {
					c.AbortWithStatus(401)
					return
				}

				catalogHandler.CreateDailyPrice(c, user.UserID)
			})
		}
	}

	log.Printf("backend listening on %s", cfg.Address())
	if err := router.Run(cfg.Address()); err != nil {
		log.Fatalf("run server: %v", err)
	}
}
