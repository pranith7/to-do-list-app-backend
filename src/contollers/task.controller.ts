import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Taskmodel } from "../models/task.model.js";

const createTask = AsyncHandler(async (req: any, res: any) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;

        if (!title) {
            throw new ApiError(400, "Title is required");
        }

        const task = await Taskmodel.create({
            title,
            description,
            status,
            priority,
            dueDate,
            userId: req.user._id
        });

        return res.status(201).json(new ApiResponse(201, task, "Task created successfully"));
    } catch (error: any) {
        throw new ApiError(error.statusCode || 500, error.message || "Error creating task");
    }
});

const getUserTasks = AsyncHandler(async (req: any, res: any) => {
    try {
        const tasks = await Taskmodel.find({ userId: req.user._id });
        return res.status(200).json(new ApiResponse(200, tasks, "Tasks retrieved successfully"));
    } catch (error: any) {
        throw new ApiError(error.statusCode || 500, error.message || "Error retrieving tasks");
    }
});

const updateTask = AsyncHandler(async (req: any, res: any) => {
    try {
        const { taskId } = req.params;
        const updates = req.body;

        const task = await Taskmodel.findOneAndUpdate(
            { _id: taskId, userId: req.user._id },
            updates,
            { new: true }
        );

        if (!task) {
            throw new ApiError(404, "Task not found or you don't have permission to update it");
        }

        return res.status(200).json(new ApiResponse(200, task, "Task updated successfully"));
    } catch (error: any) {
        throw new ApiError(error.statusCode || 500, error.message || "Error updating task");
    }
});

const deleteTask = AsyncHandler(async (req: any, res: any) => {
    try {
        const { taskId } = req.params;

        console.log("taskId", taskId);
        console.log("userId", req.user._id);
        const task = await Taskmodel.findOneAndDelete({ _id: taskId, userId: req.user._id });

        if (!task) {
            throw new ApiError(404, "Task not found or you don't have permission to delete it");
        }

        return res.status(200).json(new ApiResponse(200, {}, "Task deleted successfully"));
    } catch (error: any) {
        throw new ApiError(error.statusCode || 500, error.message || "Error deleting task");
    }
});

export {
    createTask,
    getUserTasks,
    updateTask,
    deleteTask
};