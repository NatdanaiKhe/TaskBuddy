
import express from "express";
const router = express.Router();
import { AuthController } from "../controllers/auth.controller";

const authController = new AuthController();

router.post("/login", authController.login);
router.post("/register", authController.register);


export default router;