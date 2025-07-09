// types.ts
export interface Task {
  id: string;
  providerId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  location: string;
  image_url?: string;
  is_active : boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTaskDto {
  id: string;
  providerId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  location: string;
  image_url: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  category?: string;
  price?: number;
  location?: string;
  image_url?: string;
  updated_at: Date;
  is_active: boolean;
}

export interface TaskResponse {
  id: string;
  provider_id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
}

export interface Review {
  id: string;
  bookingId: string;
  rating: number;
  comment: string;
  created_at: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}
