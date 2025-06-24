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
import { EmailVerifyModel } from "../models/email.model";
import logger from "../utils/logger";
import {
  sendResetPasswordEmail,
  sendVerificationEmail,
} from "../services/email.service";
import { PasswordResetModel } from "../models/password.model";

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
      const emailVerifyToken = uuidv4();
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
        // create email verify token
        const createEmailToken = EmailVerifyModel.create(
          userData.id,
          emailVerifyToken
        );

        if (!createEmailToken) {
          res
            .status(400)
            .json({ success: false, message: "Create User failed" });
        }

        // send email
        await sendVerificationEmail(userData.email, emailVerifyToken);

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

  verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = req?.params?.token;

      const result = await EmailVerifyModel.update(token);
      if (result) {
        res
          .status(200)
          .json({ success: true, message: "Verify email success" });
      } else {
        res
          .status(400)
          .json({ success: false, message: "Verify email failed" });
      }
    } catch (error) {
      if (error instanceof Error) {
        logger.error("Verify email error : ", error.message);
      }
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password, remember = false } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
        return;
      }

      const user = await UserModel.getUserByEmail(email);
      if (!user) {
        res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
        return;
      }
      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
        return;
      }

      const accessToken = generateAccessToken(user.id, user.role);
      const refreshToken = generateRefreshToken(user.id, user.role);

      await TokenModel.saveRefreshToken(user.id, refreshToken);

      // set refresh token in cookie for 7 days if remember, else session cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: remember ? 7 * 24 * 60 * 60 * 1000 : undefined,
      });

      res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
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

  forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email } = req?.body;
      const user = await UserModel.getUserByEmail(email);
      let token = "";

      if (!user) {
        res.status(400).json({ success: false, message: "User not found" });
        return;
      }

      const checkToken = await PasswordResetModel.getByEmail(email);

      if (!checkToken) {
        token = uuidv4();
        // expire in 1 hour
        const expireDate = new Date();
        expireDate.setHours(expireDate.getHours() + 1);

        const createResetToken = await PasswordResetModel.create(
          user?.id,
          token,
          expireDate
        );

        if (!createResetToken) {
          res.status(400).json({
            success: false,
            message: "Failed to create reset password link",
          });
          return;
        }
      } else {
        token = checkToken.token;
      }

      console.log("token : ", token);

      await sendResetPasswordEmail(user.email, token);

      res.status(201).json({
        success: true,
        message: "Sent reset password email successful",
      });
    } catch (error) {
      console.log(error);
    }
  };

  resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { token, password } = req.body;
      const hashedPassword = await bcryptjs.hash(password, 10);
      const updatePassword = await PasswordResetModel.update(
        token,
        hashedPassword
      );
      console.log("controller : ", updatePassword);

      if (!updatePassword) {
        res
          .status(400)
          .json({ success: false, message: "Reset password failed" });
        return;
      }

      res
        .status(200)
        .json({ success: true, message: "Reset password successful" });
    } catch (error) {
      console.log(error);
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
