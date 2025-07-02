import type { UseFormReturn } from "react-hook-form";

export interface Task {
  id: string;
  providerId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  location: string;
  is_active: boolean;
  image_url: string;
  created_at: Date;
  updated_at: Date;
}

export interface TaskDetailType {
  id: string;
  providerId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  location: string;
  is_active: boolean;
  image_url: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

export interface TaskCardProps {
  id: string;
  title: string;
  category: string;
  price: number;
  location: string;
  description?: string;
  is_active: boolean;
  image_url?: string;
}

export interface TaskFormValues {
  title: string;
  price: number;
  category: string;
  location: string;
  description?: string;
  image?: File;
}

export interface TaskFormProps {
  form: UseFormReturn<TaskFormValues>;
  onSubmit: (data: TaskFormValues) => void;
  initialData?: TaskCardProps | null;
  isEditing?: boolean;
}
