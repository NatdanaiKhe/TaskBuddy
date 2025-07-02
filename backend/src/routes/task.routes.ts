import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { upload } from "../services/upload.service";
const router = Router();
const taskController = new TaskController();

router.post(
  "/create",
  authenticate,
  authorizeRoles("provider"),
  upload.single("image"),
  taskController.createTask
);

router.get("/", taskController.getAllTask);
router.get("/:id", taskController.getTaskById);
router.get("/provider/:id", taskController.getTaskByProviderId);

router.put(
  "/update/:id",
  upload.single("image"),
  authenticate,
  authorizeRoles("provider"),
  taskController.updateTask
);
router.delete("/delete/:id", authenticate, authorizeRoles("provider"), taskController.deleteTask);

export default router;
