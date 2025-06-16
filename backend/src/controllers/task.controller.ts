import { Request, Response, NextFunction } from "express";
import { TaskModel } from "../models/task.model";

export class TaskController {
  createTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const taskData = req.body;
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
      const tasks = await TaskModel.getAllTask();
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
      const providerId = req.params.id;
      const task = await TaskModel.getTaskByProviderId(providerId);
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
        .json({ success: true, message: "Task updated successfully", task });
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
