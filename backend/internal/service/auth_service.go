package service

import (
	"context"
	"errors"
	"time"

	"lan-mai/backend/internal/auth"
	"lan-mai/backend/internal/domain"
	"lan-mai/backend/internal/repository"
)

var (
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrRegisterConflict   = errors.New("username or customer data already exists")
)

type AuthService struct {
	users      repository.UserRepository
	tokens     *auth.TokenManager
	sessions   *auth.SessionStore
	sessionTTL time.Duration
}

func NewAuthService(users repository.UserRepository, tokens *auth.TokenManager, sessions *auth.SessionStore, sessionTTL time.Duration) *AuthService {
	return &AuthService{
		users:      users,
		tokens:     tokens,
		sessions:   sessions,
		sessionTTL: sessionTTL,
	}
}

type AuthResult struct {
	User  *domain.User `json:"user"`
	Token string       `json:"-"`
}

func (s *AuthService) Register(ctx context.Context, input domain.RegisterInput) (*AuthResult, error) {
	passwordHash, err := auth.HashPassword(input.Password)
	if err != nil {
		return nil, err
	}

	user, err := s.users.CreateUserWithCustomer(ctx, input, passwordHash)
	if err != nil {
		return nil, mapRepositoryError(err)
	}

	token, err := s.issueSessionToken(ctx, user)
	if err != nil {
		return nil, err
	}

	return &AuthResult{User: user, Token: token}, nil
}

func (s *AuthService) Login(ctx context.Context, input domain.LoginInput) (*AuthResult, error) {
	user, err := s.users.FindByUsername(ctx, input.Username)
	if err != nil {
		if errors.Is(err, repository.ErrUserNotFound) {
			return nil, ErrInvalidCredentials
		}

		return nil, err
	}

	if err := auth.ComparePassword(user.PasswordHash, input.Password); err != nil {
		return nil, ErrInvalidCredentials
	}

	token, err := s.issueSessionToken(ctx, user)
	if err != nil {
		return nil, err
	}

	return &AuthResult{User: user, Token: token}, nil
}

func (s *AuthService) Logout(ctx context.Context, userID string, sessionID string) error {
	return s.sessions.Delete(ctx, userID, sessionID)
}

func (s *AuthService) CurrentUser(ctx context.Context, userID string) (*domain.User, error) {
	return s.users.FindByID(ctx, userID)
}

func (s *AuthService) issueSessionToken(ctx context.Context, user *domain.User) (string, error) {
	sessionID, err := s.sessions.Create(ctx, user.UserID, s.sessionTTL)
	if err != nil {
		return "", err
	}

	return s.tokens.Generate(user.UserID, string(user.Role), sessionID, s.sessionTTL)
}

func mapRepositoryError(err error) error {
	if errors.Is(err, repository.ErrUserConflict) {
		return ErrRegisterConflict
	}

	return err
}
