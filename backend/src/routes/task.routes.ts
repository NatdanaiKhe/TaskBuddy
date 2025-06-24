import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
const router = Router();
const taskController = new TaskController();

router.post(
  "/create",
  authenticate,
  authorizeRoles("provider"),
  taskController.createTask
);

router.get("/:id", taskController.getTaskById);
router.get("/", taskController.getAllTask);
router.get("/provider/:id", taskController.getTaskByProviderId);

router.put("/update/:id", authenticate, authorizeRoles("provider"), taskController.updateTask);
router.delete("/delete/:id", authenticate, authorizeRoles("provider"), taskController.deleteTask);

export default router;
