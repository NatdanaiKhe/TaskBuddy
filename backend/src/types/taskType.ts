// types.ts

export type BookingStatus = "pending" | "accepted" | "declined";


export interface Task {
  id: string;
  providerId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  location: string;
  imageUrls?: string[];
  isActive : boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDto {
  id: string;
  providerId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  location: string;
  imageUrls?: string[];
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  category?: string;
  price?: number;
  location?: string;
  imageUrls?: string[];
  updatedAt: Date;
  isActive: boolean;
}

export interface TaskResponse {
  id: string;
  providerId: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
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
