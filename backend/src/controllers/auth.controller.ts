import { Request, Response, NextFunction } from "express";
import bcryptjs from "bcryptjs";
import {v4 as uuidv4 } from "uuid";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../services/auth.service";
import { UserModel } from "../models/user.model";
import logger from "../utils/logger";

export class AuthController {
  register = async (
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
      const userId =  uuidv4();
      const hashedPassword = await bcryptjs.hash(userData.password, 10);

      userData.id = userId;
      userData.password = hashedPassword;
      userData.role = userData.role || "customer";

      logger.info("User Data:", userData);
      const newUser = await UserModel.createUser(userData);
     

      if (!newUser) {
        res
          .status(200)
          .json({ success: false, message: "Email already exists" });
        return;
      } else {
        const accessToken = generateAccessToken(newUser.id, newUser.role);
        const refreshToken = generateRefreshToken(newUser.id, newUser.role);

        res.status(201).json({
          success: true,
          data: newUser,
          message: "User created successfully",
          accessToken,
          refreshToken,
        });
      }
    } catch (error) {
      if(error instanceof Error) {
        res.status(500).json({ success: false, message: error.message });
      }
      next(error);
    }
  }
  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res
          .status(400)
          .json({ success: false, message: "Email and password are required" });
        return;
      }

      const user = await UserModel.getUserByEmail(email);

      if (!user) {
        res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
        return;
      }

      const isMatch = await bcryptjs.compare(password, user.password);

      if (!isMatch) {
        res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
        return;
      }

      const accessToken = generateAccessToken(user.id, user.role);
      const refreshToken = generateRefreshToken(user.id, user.role);

      res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
