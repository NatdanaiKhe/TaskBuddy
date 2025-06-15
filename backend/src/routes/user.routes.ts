import express from "express";
const router = express.Router();
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user.controller";

const userController = new UserController();

router.get("/:id", authenticate, userController.getUserById);
router.get("/", authenticate, authorizeRoles("admin"), userController.getAllUsers);

router.post("/", userController.createUser);
router.put('/', authenticate, userController.updateUser);
router.put("/:id", authenticate,authorizeRoles('admin'), userController.updateUser);

router.delete("/", authenticate, userController.deActivateUser);
router.delete("/:id", authenticate, authorizeRoles('admin'),userController.deleteUser);

export default router;
