package auth

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type TokenManager struct {
	secret []byte
	issuer string
}

type Claims struct {
	Role string `json:"role"`
	SID  string `json:"sid"`
	jwt.RegisteredClaims
}

func NewTokenManager(secret string, issuer string) *TokenManager {
	return &TokenManager{
		secret: []byte(secret),
		issuer: issuer,
	}
}

func (m *TokenManager) Generate(userID string, role string, sessionID string, ttl time.Duration) (string, error) {
	now := time.Now()
	claims := Claims{
		Role: role,
		SID:  sessionID,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   userID,
			Issuer:    m.issuer,
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(ttl)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(m.secret)
}

func (m *TokenManager) Parse(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (any, error) {
		if token.Method != jwt.SigningMethodHS256 {
			return nil, errors.New("unexpected signing method")
		}

		return m.secret, nil
	})
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, errors.New("invalid token")
	}

	return claims, nil
}
