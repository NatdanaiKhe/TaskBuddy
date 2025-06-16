import { Database } from "../config/db";
import { CreateTaskDto, UpdateTaskDto, Task, TaskResponse } from "../types/taskType";

export class TaskModel {
  static async createTask(task: CreateTaskDto): Promise<TaskResponse | null> {
    const { id, providerId, title, description, price,location,category } = task;

    const query = `
      INSERT INTO tasks (id, providerId, title, description, price, category, location)
      VALUES (?, ?, ?, ?, ?,?,?,?)
    `;

    const values = [id, providerId, title, description, price, category,location];

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

  static async getAllTask(limit: number = 10, page: number = 1): Promise<TaskResponse[]> {
    const query =
      "SELECT * FROM tasks ORDER BY createdAt DESC LIMIT ? OFFSET ?";
    const offset = (page - 1) * limit;
    const values = [limit, offset];
    const result = await Database.query(query, values);

    if (result.lenght == 0) {
      return [];
    }

    return result as TaskResponse[];
  }

  static async getTaskByProviderId(providerId: string): Promise<TaskResponse | null> {
    const query = "SELECT * FROM tasks WHERE providerId = ?";
    const values = [providerId];
    const result = await Database.query(query, values);

    if (result.length === 0) {
      return null;
    }
    return result[0];
  }

  static async updateTask(taskId: string, taskData: Task, userId: string): Promise<UpdateTaskDto | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (taskData.title !== undefined) {
      fields.push("firstName = ?");
      values.push(taskData.title);
    }

    if (taskData.description !== undefined) {
      fields.push("lastName = ?");
      values.push(taskData.description);
    }

    if (taskData.isActive !== undefined) {
      fields.push("isActive = ?");
      values.push(taskData.isActive ? 1 : 0);
    }
    if (fields.length === 0) {
      return null;
    }

    const query = `
    UPDATE users
    SET ${fields.join(", ")}
    WHERE id = ? AND providerId = ?
  `;
    values.push(taskId, userId);

    const result = await Database.query(query, values);

    if (result.affectedRows === 0) {
      return null;
    }

    return {
      ...taskData,
      updatedAt: new Date(),
    };
  }

  static async deleteTask(taskId: string, userId: string): Promise<boolean> {
    const query = "DELETE FROM tasks WHERE id = ? AND providerId = ?";
    const result = await Database.query(query, [taskId, userId]);

    return result.affectedRows > 0;
  }
}
