package auth

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

type SessionStore struct {
	client *redis.Client
}

func NewSessionStore(client *redis.Client) *SessionStore {
	return &SessionStore{client: client}
}

func (s *SessionStore) Create(ctx context.Context, userID string, ttl time.Duration) (string, error) {
	sessionID, err := newSessionID()
	if err != nil {
		return "", err
	}
	key := s.key(userID, sessionID)

	if err := s.client.Set(ctx, key, "active", ttl).Err(); err != nil {
		return "", err
	}

	return sessionID, nil
}

func (s *SessionStore) Exists(ctx context.Context, userID string, sessionID string) (bool, error) {
	count, err := s.client.Exists(ctx, s.key(userID, sessionID)).Result()
	if err != nil {
		return false, err
	}

	return count == 1, nil
}

func (s *SessionStore) Delete(ctx context.Context, userID string, sessionID string) error {
	return s.client.Del(ctx, s.key(userID, sessionID)).Err()
}

func (s *SessionStore) key(userID string, sessionID string) string {
	return fmt.Sprintf("session:%s:%s", userID, sessionID)
}

func newSessionID() (string, error) {
	buf := make([]byte, 16)
	if _, err := rand.Read(buf); err != nil {
		return "", err
	}

	return hex.EncodeToString(buf), nil
}
