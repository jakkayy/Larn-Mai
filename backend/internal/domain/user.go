package domain

type Role string

const (
	RoleAdmin Role = "admin"
	RoleUser  Role = "user"
)

type Customer struct {
	CustomerID   string `json:"customer_id"`
	Name         string `json:"name"`
	TypeCar      string `json:"type_car"`
	ModelCar     string `json:"model_car"`
	ColorCar     string `json:"color_car"`
	LicensePlate string `json:"license_plate"`
	Phone        string `json:"phone"`
}

type User struct {
	UserID       string    `json:"user_id"`
	Username     string    `json:"username"`
	Role         Role      `json:"role"`
	CustomerID   *string   `json:"customer_id,omitempty"`
	Customer     *Customer `json:"customer,omitempty"`
	PasswordHash string    `json:"-"`
}

type RegisterInput struct {
	Username     string `json:"username" binding:"required,min=3,max=100"`
	Password     string `json:"password" binding:"required,min=8,max=72"`
	Name         string `json:"name" binding:"required,max=255"`
	TypeCar      string `json:"type_car" binding:"required,max=100"`
	ModelCar     string `json:"model_car" binding:"required,max=100"`
	ColorCar     string `json:"color_car" binding:"required,max=100"`
	LicensePlate string `json:"license_plate" binding:"required,max=50"`
	Phone        string `json:"phone" binding:"required,max=30"`
}

type LoginInput struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type UpdateProfileInput struct {
	Name         string `json:"name" binding:"required,max=255"`
	TypeCar      string `json:"type_car" binding:"required,max=100"`
	ModelCar     string `json:"model_car" binding:"required,max=100"`
	ColorCar     string `json:"color_car" binding:"required,max=100"`
	LicensePlate string `json:"license_plate" binding:"required,max=50"`
	Phone        string `json:"phone" binding:"required,max=30"`
}
