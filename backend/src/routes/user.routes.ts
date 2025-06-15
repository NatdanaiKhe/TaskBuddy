import express from "express";
const router = express.Router();
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user.controller";

const userController = new UserController();

router.get("/:id", authenticate, userController.getUserById);
router.post("/", userController.createUser);

export default router;
