import { Database } from "../config/db";
import {
  CreateTaskDto,
  UpdateTaskDto,
  Task,
  TaskResponse,
} from "../types/taskType";

export class TaskModel {
  static async createTask(task: CreateTaskDto): Promise<TaskResponse | null> {
    const {
      id,
      providerId,
      title,
      description,
      price,
      location,
      category,
      image_url,
    } = task;

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
      image_url,
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
    const query =
      "SELECT tasks.id,provider_id,title,description,category,price,location,image_url,users.firstName,users.lastName,users.createdAt FROM tasks LEFT JOIN users ON tasks.provider_id = users.id WHERE tasks.id = ?";
    const result = await Database.query(query, [taskId]);

    if (result.length === 0) {
      return null;
    }

    return result[0] as TaskResponse;
  }

  static async getAllTask(
    limit: number = 12,
    page: number = 1,
    q?: string,
    category?: string,
    location?: string
  ): Promise<{
    tasks: TaskResponse[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }> {
    const offset = (page - 1) * limit;

    // Build dynamic WHERE conditions
    const whereClauses: string[] = [];
    const values: any[] = [];

    if (q) {
      whereClauses.push("title LIKE ?");
      values.push(`%${q}%`);
    }

    if (category) {
      whereClauses.push("category = ?");
      values.push(category);
    }

    if (location) {
      whereClauses.push("location = ?");
      values.push(location);
    }

    const whereSQL = whereClauses.length
      ? `WHERE ${whereClauses.join(" AND ")}`
      : "";

    // Main query
    const dataQuery = `
      SELECT * FROM tasks
      ${whereSQL}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    const dataValues = [...values, limit, offset];
    const result = await Database.query(dataQuery, dataValues);

    // Count query
    const countQuery = `
      SELECT COUNT(*) as count FROM tasks
      ${whereSQL}
    `;
    const countResult = await Database.query(countQuery, values);
    const totalItems = countResult[0].count;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      tasks: result as TaskResponse[],
      totalItems,
      totalPages,
      currentPage: page,
    };
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
      values.push(taskData.location);
    }

    if (taskData.image_url != undefined) {
      fields.push("image_url = ?");
      values.push(taskData.image_url);
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

    return result;
  }

  static async deleteTask(taskId: string, userId: string): Promise<boolean> {
    const query = "DELETE FROM tasks WHERE id = ? AND provider_id = ?";
    const result = await Database.query(query, [taskId, userId]);

    return result.affectedRows > 0;
  }
}
