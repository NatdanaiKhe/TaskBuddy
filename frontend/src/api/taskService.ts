import type { TaskFormValues } from "@/types/taskTypes";
import axios from "./axios";

const taskService = {
  createTask: async (data: TaskFormValues) => {
    const formData = new FormData();

    for (const key in data) {
      const value = data[key as keyof TaskFormValues];
      if (value !== undefined && value !== null) {
        formData.append(key, value instanceof File ? value : String(value));
      }
    }
    const res = await axios.post(`/tasks/create`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },
  getTaskById: async (id: string) => {
    const res = await axios.get(`/tasks/${id}`);
    return res.data;
  },
  
  getAllTask: async ({
    page = 1,
    limit = 12,
    q,
    category,
    location,
  }: {
    page?: number;
    limit?: number;
    q?: string | null;
    category?: string | null;
    location?: string | null;
  }) => {
    const params = new URLSearchParams();
  
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());
    if (q) params.append("q", q);
    if (category) params.append("category", category);
    if (location) params.append("location", location);
  
    const res = await axios.get(`/tasks?${params.toString()}`);
    return res.data;
  },
  updateTask: async (id: string, data: TaskFormValues) => {
    const formData = new FormData();

    for (const key in data) {
      const value = data[key as keyof TaskFormValues];
      if (value !== undefined && value !== null) {
        formData.append(key, value instanceof File ? value : String(value));
      }
    }
    const res = await axios.put(`/tasks/update/${id}`, formData, {
      withCredentials: true,
    });
    return res.data;
  },
  getTaskByProviderId: async (id: string) => {
    const res = await axios.get(`/tasks/provider/${id}`, {
      withCredentials: true,
    });
    return res.data;
  },
  deleteTask: async (id: string) => {
    const res = await axios.delete(`/tasks/delete/${id}`, {
      withCredentials: true,
    });

    return res.data;
  },
};

export default taskService;
