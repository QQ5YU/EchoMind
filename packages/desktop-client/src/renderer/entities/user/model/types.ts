export interface User {
  id: string
  email: string
  name?: string
  createdAt: string
}

export interface AuthResponse {
  access_token: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest extends LoginRequest {
  name?: string
  confirmPassword?: string
}
