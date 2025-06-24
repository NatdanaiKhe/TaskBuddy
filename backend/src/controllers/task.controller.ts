import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { TaskModel } from "../models/task.model";
import { CreateTaskDto } from "../types/taskType";

export class TaskController {
  createTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const providerId = req.user?.id;
      const taskData: CreateTaskDto = req.body;

      taskData.providerId = providerId!!;
      const taskId = uuidv4();
      taskData.id = taskId;
      const task = await TaskModel.createTask(taskData);
      if (!task) {
        res
          .status(400)
          .json({ success: false, message: "Failed to create task" });
      }
      res
        .status(201)
        .json({ success: true, message: "Task created successfully", task });
    } catch (error) {
      next(error);
    }
  };

  getTaskById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const taskId = req.params.id;
      const task = await TaskModel.getTaskById(taskId);
      if (!task) {
        res.status(400).json({ success: false, message: "Task not found" });
      }
      res
        .status(200)
        .json({ success: true, message: "Task fetched successfully", task });
    } catch (error) {
      next(error);
    }
  };

  getAllTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { page, limit } = req.body;
      const tasks = await TaskModel.getAllTask(limit, page);
      if (!tasks) {
        res.status(400).json({ success: false, message: "No tasks found" });
      }
      res
        .status(200)
        .json({ success: true, message: "Tasks fetched successfully", tasks });
    } catch (error) {
      next(error);
    }
  };

  getTaskByProviderId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const role = req.user?.role;
      const user_id = req.user?.id;
      const providerId = req.params.id;
      let task = null;
      if (role === "provider" && user_id) {
        task = await TaskModel.getTaskByProviderId(user_id);
      } else {
        task = await TaskModel.getTaskByProviderId(providerId);
      }

      if (!task) {
        res.status(400).json({ success: false, message: "Task not found" });
      }
      res
        .status(200)
        .json({ success: true, message: "Task fetched successfully", task });
    } catch (error) {
      next(error);
    }
  };

  updateTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const taskId = req.params.id;
      const userId = req.user?.id;
      const taskData = req.body;

      if (!userId) {
        res.status(400).json({ success: false, message: "User not found" });
        return;
      }

      const task = await TaskModel.updateTask(taskId, taskData, userId);

      if (!task) {
        res
          .status(400)
          .json({ success: false, message: "Failed to update task" });
        return;
      }
      res
        .status(200)
        .json({ success: true, message: "Task updated successfully"});
    } catch (error) {
      next(error);
    }
  };

  deleteTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const taskId = req.params.id;
      const userId = req.user?.id;

      if (!userId) {
        res.status(400).json({ success: false, message: "User not found" });
        return;
      }

      const task = await TaskModel.deleteTask(taskId, userId);
      if (!task) {
        res
          .status(400)
          .json({ success: false, message: "Failed to delete task" });
        return;
      }
      res
        .status(200)
        .json({ success: true, message: "Task deleted successfully", task });
    } catch (error) {
      next(error);
    }
  };
}
