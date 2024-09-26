import { Router } from "express";
import { createTask, getUserTasks, updateTask, deleteTask } from "../contollers/task.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.route("/").post(verifyJWT, createTask);
router.route("/").get(verifyJWT, getUserTasks);
router.route("/:taskId").put(verifyJWT, updateTask);
router.route("/:taskId").delete(verifyJWT,deleteTask);


export default router;