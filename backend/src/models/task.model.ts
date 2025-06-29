import { Database } from "../config/db";
import {
  CreateTaskDto,
  UpdateTaskDto,
  Task,
  TaskResponse,
} from "../types/taskType";

export class TaskModel {
  static async createTask(task: CreateTaskDto): Promise<TaskResponse | null> {
    const { id, providerId, title, description, price, location, category,image_url } =
      task;

    const query = `
      INSERT INTO tasks (id, provider_id, title, description, price, category, location,image_url)
      VALUES (?, ?, ?, ?, ?,?,?,?)
    `;

    const values = [
      id,
      providerId,
      title,
      description,
      price,
      category,
      location,
      image_url
    ];

    const result = await Database.query(query, values);

    if (result.affectedRows === 0) {
      return null;
    }

    return {
      id,
      providerId,
      title,
      description,
      category,
      price,
      location,
    };
  }

  static async getTaskById(taskId: string): Promise<TaskResponse | null> {
    const query = "SELECT * FROM tasks WHERE id = ?";
    const result = await Database.query(query, [taskId]);

    if (result.length === 0) {
      return null;
    }

    return result[0] as TaskResponse;
  }

  static async getAllTask(
    limit: number = 10,
    page: number = 1
  ): Promise<TaskResponse[]> {
    const query =
      "SELECT * FROM tasks ORDER BY created_at DESC LIMIT ? OFFSET ?";
    const offset = (page - 1) * limit;
    const values = [limit, offset];
    const result = await Database.query(query, values);

    if (result.lenght == 0) {
      return [];
    }

    return result as TaskResponse[];
  }

  static async getTaskByProviderId(
    providerId: string
  ): Promise<TaskResponse | null> {
    const query = "SELECT * FROM tasks WHERE provider_id = ?";
    const values = [providerId];
    const result = await Database.query(query, values);

    if (result.length === 0) {
      return null;
    }
    return result;
  }

  static async updateTask(
    taskId: string,
    taskData: UpdateTaskDto,
    userId: string
  ): Promise<UpdateTaskDto | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (taskData.title !== undefined) {
      fields.push("title = ?");
      values.push(taskData.title);
    }

    if (taskData.description !== undefined) {
      fields.push("description = ?");
      values.push(taskData.description);
    }

    if (taskData.category !== undefined) {
      fields.push("category = ?");
      values.push(taskData.category);
    }

    if (taskData.location !== undefined) {
      fields.push("location = ?");
      values.push(taskData.location ? 1 : 0);
    }

    if(taskData.image_url !== undefined || taskData.image_url !== ""){
      fields.push("image_url = ?");
      values.push(taskData.image_url ? 1 : 0);
    }

    if (taskData.price !== undefined) {
      fields.push("price = ?");
      values.push(taskData.price);
    }

    if (taskData.is_active !== undefined) {
      fields.push("is_active = ?");
      values.push(taskData.is_active ? 1 : 0);
    }


    if (fields.length === 0) {
      return null;
    }

    const query = `
    UPDATE tasks
    SET ${fields.join(", ")}
    WHERE id = ? AND provider_id = ?`;
    values.push(taskId, userId);

    const result = await Database.query(query, values);

    if (result.affectedRows === 0) {
      return null;
    }

    return result
    
  }

  static async deleteTask(taskId: string, userId: string): Promise<boolean> {
    const query = "DELETE FROM tasks WHERE id = ? AND provider_id = ?";
    const result = await Database.query(query, [taskId, userId]);

    return result.affectedRows > 0;
  }
}
