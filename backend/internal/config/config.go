package config

import (
	"fmt"
	"os"
	"strconv"
	"time"
)

type Config struct {
	AppEnv       string
	BackendHost  string
	BackendPort  string
	DatabaseURL  string
	RedisAddr    string
	RedisDB      int
	JWTSecret    string
	JWTIssuer    string
	SessionTTL   time.Duration
	CookieName   string
	CookieDomain string
	CookieSecure bool
}

func Load() Config {
	postgresHost := getEnv("POSTGRES_HOST", "127.0.0.1")
	postgresPort := getEnv("POSTGRES_PORT", "5432")
	postgresDB := getEnv("POSTGRES_DB", "lan_mai")
	postgresUser := getEnv("POSTGRES_USER", "postgres")
	postgresPassword := getEnv("POSTGRES_PASSWORD", "postgres")

	redisHost := getEnv("REDIS_HOST", "127.0.0.1")
	redisPort := getEnv("REDIS_PORT", "6379")

	return Config{
		AppEnv:       getEnv("APP_ENV", "development"),
		BackendHost:  getEnv("BACKEND_HOST", "0.0.0.0"),
		BackendPort:  getEnv("BACKEND_PORT", "8080"),
		DatabaseURL:  getEnv("DATABASE_URL", fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", postgresUser, postgresPassword, postgresHost, postgresPort, postgresDB)),
		RedisAddr:    getEnv("REDIS_ADDR", fmt.Sprintf("%s:%s", redisHost, redisPort)),
		RedisDB:      getEnvAsInt("REDIS_DB", 0),
		JWTSecret:    getEnv("JWT_SECRET", "lan-mai-dev-secret"),
		JWTIssuer:    getEnv("JWT_ISSUER", "lan-mai"),
		SessionTTL:   time.Duration(getEnvAsInt("SESSION_TTL_HOURS", 24)) * time.Hour,
		CookieName:   getEnv("COOKIE_NAME", "lan_mai_session"),
		CookieDomain: getEnv("COOKIE_DOMAIN", ""),
		CookieSecure: getEnvAsBool("COOKIE_SECURE", false),
	}
}

func (c Config) Address() string {
	return fmt.Sprintf("%s:%s", c.BackendHost, c.BackendPort)
}

func getEnv(key string, fallback string) string {
	if value, ok := os.LookupEnv(key); ok && value != "" {
		return value
	}

	return fallback
}

func getEnvAsInt(key string, fallback int) int {
	raw := getEnv(key, "")
	if raw == "" {
		return fallback
	}

	value, err := strconv.Atoi(raw)
	if err != nil {
		return fallback
	}

	return value
}

func getEnvAsBool(key string, fallback bool) bool {
	raw := getEnv(key, "")
	if raw == "" {
		return fallback
	}

	value, err := strconv.ParseBool(raw)
	if err != nil {
		return fallback
	}

	return value
}
