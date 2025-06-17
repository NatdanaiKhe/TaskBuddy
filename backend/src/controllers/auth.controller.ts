import { Request, Response, NextFunction } from "express";
import bcryptjs from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../services/auth.service";
import { UserModel } from "../models/user.model";
import { TokenModel } from "../models/token.model";
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
      const userId = uuidv4();
      const hashedPassword = await bcryptjs.hash(userData.password, 10);

      userData.id = userId;
      userData.password = hashedPassword;
      userData.role = userData.role || "customer";

      const newUser = await UserModel.createUser(userData);

      if (!newUser) {
        res
          .status(200)
          .json({ success: false, message: "Email already exists" });
        return;
      } else {
        // log user created
        logger.info("User Data:", userData);
        res.status(201).json({
          success: true,
          data: newUser,
          message: "User created successfully",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ success: false, message: error.message });
      }
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      
      const { email, password, remember = false } = req.body;
      // validate request
      if (!email || !password) {
        res
          .status(400)
          .json({ success: false, message: "Email and password are required" });
        return;
      }

      // check email and password
      const user = await UserModel.getUserByEmail(email);
      logger.info("user:",user);
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

      // generate token
      const accessToken = generateAccessToken(user.id, user.role);
      const refreshToken = generateRefreshToken(user.id, user.role);
      // save refreshToken to database
      await TokenModel.saveRefreshToken(user.id, refreshToken);

      // set cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken,
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

  refresh = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const token = req.cookies.refreshToken;
    if (!token) {
      res.sendStatus(401);
      return;
    }

    try {
      // verify refresh token and check in database
      const { id, role } = verifyRefreshToken(token);
      const tokenInDb = await TokenModel.findRefreshToken(token);
      if (!tokenInDb) {
        res.sendStatus(403);
        return;
      }

      // generate a new tokens
      const newAccessToken = generateAccessToken(id, role);
      const newRefreshToken = generateRefreshToken(id, role);

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ success: true, accessToken: newAccessToken });
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
    }
  };

  logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const token = req.cookies.refreshToken;
    if (token) {
      await TokenModel.deleteRefreshToken(token);
    }
    res.clearCookie("refreshToken");
    res.sendStatus(204);
  };
}
