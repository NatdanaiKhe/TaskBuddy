import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import bcryptjs from "bcryptjs";
import { UserModel } from "../models/user.model";
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
      const hashedPassword = await bcryptjs.hash(userData.password, 10);
      const userId =   uuidv4();
      userData.id = userId;
      userData.password = hashedPassword;
      userData.role = userData.role || "customer";

      const newUser = await UserModel.createUser(userData);
      console.log("New User Created:", newUser);
      
      if (!newUser) {
        res
          .status(500)
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
      if (!id) {
        res.status(400).json({ success: false, message: "ID is required" });
      }
      const user = await UserModel.getUserById(id);

      res.status(200).json({
        success: true,
        data: user || null,
        message: user ? "User found" : "User not found",
      });
    } catch (error) {
      next(error);
    }
  };
}
