// types.ts
declare global {
  namespace Express {
    interface Request {
      user?: UserResponse;
    }
  }
}

export type UserRole = "customer" | "provider" | "admin";
export type BookingStatus = "pending" | "accepted" | "declined";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
  isActive: boolean;
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
  confirmPassword?: string;
}

export interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isActive?: boolean;
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

export interface Service {
  id: string;
  providerId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  location: string;
  imageUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateServiceDto {
  providerId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  location: string;
  imageUrls?: string[];
}

export interface UpdateServiceDto {
  title?: string;
  description?: string;
  category?: string;
  price?: number;
  location?: string;
  imageUrls?: string[];
}

export interface Booking {
  id: string;
  customerId: string;
  serviceId: string;
  status: BookingStatus;
  date: Date;
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
