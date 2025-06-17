export type UserRole = "customer" | "provider" | "admin";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  isVerify: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: UserRole;
  isActive?: boolean;
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  updatedAt: Date;
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
