import type { UseFormReturn } from "react-hook-form";

export interface Task {
  id: string;
  providerId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  location: string;
  imageUrls?: string[];
  is_active: boolean;
  image: string;
  createdAt: Date;
  updatedAt: Date;
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
  description: string;
  image?: File;
}

export interface TaskFormProps {
  form: UseFormReturn<TaskCardProps>;
  onSubmit: (data: TaskFormValues) => void;
  initialData?: TaskCardProps | null;
  isEditing?: boolean;
}
