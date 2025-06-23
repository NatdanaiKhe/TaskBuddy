import { UserController } from "./../controllers/user.controller";
import express from "express";
const router = express.Router();
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
const userController = new UserController();
const authController = new AuthController();

router.post("/login", authController.login);
router.get("/me", authenticate, userController.getUserById);
router.post("/register", authController.register);
router.post("/refresh-token", authenticate, authController.refresh);
router.post("/verify-email/:token", authController.verifyEmail);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/logout", authenticate, authController.logout);

export default router;
