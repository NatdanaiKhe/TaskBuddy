import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import bcryptjs from "bcryptjs";
import { UserModel } from "../models/user.model";
import logger from "../utils/logger";
export class UserController {
  createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userData = req.body;
      if (!userData || !userData.email || !userData.password) {
        res.status(400).json({ success: false, message: "Invalid user data" });
        return;
      }

      // hash and add uuid
      const userId = uuidv4();
      const hashedPassword = await bcryptjs.hash(userData.password, 10);

      userData.id = userId;
      userData.password = hashedPassword;
      userData.role = userData.role || "customer";

      const newUser = await UserModel.createUser(userData);

      if (!newUser) {
        res
          .status(200)
          .json({ success: false, message: "Email already exist" });
        return;
      } else {
        res.status(201).json({
          success: true,
          data: newUser,
          message: "User created successfully",
        });
      }
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      // if not admin, use userId from request to get user
      if (userRole !== "admin" && !id) {
        if (!userId) {
          res.status(400).json({ success: false, message: "ID is required" });
          return;
        }
        const user = await UserModel.getUserById(userId);
        res.status(200).json({
          success: true,
          data: user || null,
          message: user ? "User found" : "User not found",
        });
        return;
      }
      // if admin, get user by id
      if (userRole === "admin") {
        if (!id) {
          res.status(400).json({ success: false, message: "ID is required" });
          return;
        }
        const user = await UserModel.getUserById(id);
        res.status(200).json({
          success: true,
          data: user || null,
          message: user ? "User found" : "User not found",
        });
      }

      if (!id && userRole !== "admin") {
        res.status(400).json({ success: false, message: "ID is required" });
        return;
      }
    } catch (error) {
      next(error);
    }
  };

  getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { limit, page } = req.query;
      const limitValue = limit ? parseInt(limit as string) : 10;
      const pageValue = page ? parseInt(page as string) : 1;
      // Validate limit and page values
      if (isNaN(limitValue) || isNaN(pageValue)) {
        res
          .status(400)
          .json({ success: false, message: "Invalid query parameters" });
        return;
      }

      // Fetch users with pagination
      const users = await UserModel.getAllUsers(limitValue, pageValue);
      if (!users || users.length === 0) {
        res.status(404).json({
          success: false,
          message: "No users found",
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: users,
        message: "Users retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      // if not admin, use userId from request to update
      if (userRole !== "admin" && !id) {
        if (!userId) {
          res.status(400).json({ success: false, message: "ID is required" });
          return;
        }
        const updatedUser = await UserModel.updateUser(userId, req.body);
        if (updatedUser) {
          res.status(200).json({
            success: true,
            data: updatedUser,
            message: "User updated successfully",
          });
        } else {
          res.status(404).json({
            success: false,
            message: "User not found",
          });
        }
        return;
      }

      // if admin, update user by id
      if (userRole === "admin") {
        if (!id) {
          res.status(400).json({ success: false, message: "ID is required" });
          return;
        }
        const updatedUser = await UserModel.updateUser(id, req.body);
        if (updatedUser) {
          res.status(200).json({
            success: true,
            data: updatedUser,
            message: "User updated successfully",
          });
        } else {
          res.status(404).json({
            success: false,
            message: "User not found",
          });
        }
      }
    } catch (error) {
      next(error);
    }
  };

  deActivateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(400).json({ success: false, message: "ID is required" });
        return;
      }
      const deactivatedUser = await UserModel.updateUser(userId, {
        isActive: false,
      });
      if (deactivatedUser) {
        res.status(200).json({
          success: true,
          message: "User deactivated successfully",
        });
      } else {
        res.status(404).json({
          success: false,
          message: "User not found",
        });

        return;
      }
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      // if not admin, use userId from request to delete
      if (userRole !== "admin" && !id) {
        if (!userId) {
          res.status(400).json({ success: false, message: "ID is required" });
          return;
        }
        const deletedUser = await UserModel.deleteUser(userId);
        if (deletedUser) {
          res.status(200).json({
            success: true,
            message: "User deleted successfully",
          });
        } else {
          res.status(404).json({
            success: false,
            message: "User not found",
          });
        }
        return;
      }

      // if admin, delete user by id
      if (userRole === "admin") {
        if (!id) {
          res.status(400).json({ success: false, message: "ID is required" });
          return;
        }
        const deletedUser = await UserModel.deleteUser(id);
        if (deletedUser) {
          res.status(200).json({
            success: true,
            message: "User deleted successfully",
          });
        } else {
          res.status(404).json({
            success: false,
            message: "User not found",
          });
        }
      }
    } catch (error) {
      next(error);
    }
  };
}
