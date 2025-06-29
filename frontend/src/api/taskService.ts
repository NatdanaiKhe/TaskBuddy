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
    const res = await axios.post(
      `/tasks/create`,
      formData,
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
    );
    return res.data;
  },
  updateTask: async (id:string,data: TaskFormValues) => {
    const formData = new FormData();

    for (const key in data) {
      const value = data[key as keyof TaskFormValues];
      if (value !== undefined && value !== null) {
        formData.append(key, value instanceof File ? value : String(value));
      }
    }
    const res = await axios.put(
      `/tasks/update/${id}`,
      formData,
      { withCredentials: true }
    );
    return res.data;
  },
  getTaskByProviderId: async (id: string) => {
    const res = await axios.get(`/tasks/provider/${id}`, {
      withCredentials: true,
    });
    return res.data;
  },
};

export default taskService;
