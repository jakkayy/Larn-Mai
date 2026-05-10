package domain

type CreateCustomerInput struct {
	Name         string `json:"name" binding:"required,max=255"`
	TypeCar      string `json:"type_car" binding:"required,max=100"`
	ModelCar     string `json:"model_car" binding:"required,max=100"`
	ColorCar     string `json:"color_car" binding:"required,max=100"`
	LicensePlate string `json:"license_plate" binding:"required,max=50"`
	Phone        string `json:"phone" binding:"required,max=30"`
}

type UpdateCustomerInput struct {
	Name         string `json:"name" binding:"required,max=255"`
	TypeCar      string `json:"type_car" binding:"required,max=100"`
	ModelCar     string `json:"model_car" binding:"required,max=100"`
	ColorCar     string `json:"color_car" binding:"required,max=100"`
	LicensePlate string `json:"license_plate" binding:"required,max=50"`
	Phone        string `json:"phone" binding:"required,max=30"`
}

type ListCustomerFilters struct {
	Query string
}
