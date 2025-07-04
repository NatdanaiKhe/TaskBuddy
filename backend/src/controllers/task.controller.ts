import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { TaskModel } from "../models/task.model";
import { CreateTaskDto, UpdateTaskDto } from "../types/taskType";

export class TaskController {
  createTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const providerId = req.user?.id;
      const taskData: CreateTaskDto = req.body;
      console.log("create task: ", taskData);

      const image = req.file as Express.Multer.File;

      if (image) {
        taskData.image_url = `/image/${image.filename}`;
      }

      taskData.providerId = providerId!!;
      const taskId = uuidv4();
      taskData.id = taskId;

      console.log("task data", taskData);

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
      const page =
        typeof req.query.page === "string" ? parseInt(req.query.page, 10) : 1;
      const limit =
        typeof req.query.limit === "string"
          ? parseInt(req.query.limit, 10)
          : 12;
      const q = typeof req.query.q === "string" ? req.query.q : undefined;
      const category =
        typeof req.query.category === "string" ? req.query.category : undefined;
      const location =
        typeof req.query.location === "string" ? req.query.location : undefined;
      
        const tasks = await TaskModel.getAllTask(
          limit,
          page,
          q,
          category,
          location
        );
      if (!tasks) {
        res.status(200).json({ success: false, message: "No tasks found" });
      }
      res
        .status(200)
        .json({
          success: true,
          message: "Tasks fetched successfully",
          data: tasks,
        });
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
        res
          .status(200)
          .json({ success: false, message: "Task not found", task: [] });
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
      const taskData: UpdateTaskDto = req.body;
      const image = req.file;

      if (image) {
        taskData.image_url = `/image/${image.filename}`;
      }

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
        .json({ success: true, message: "Task updated successfully" });
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
