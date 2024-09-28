"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getUserTasks = exports.createTask = void 0;
const AsyncHandler_js_1 = require("../utils/AsyncHandler.js");
const ApiError_js_1 = require("../utils/ApiError.js");
const ApiResponse_js_1 = require("../utils/ApiResponse.js");
const task_model_js_1 = require("../models/task.model.js");
const createTask = (0, AsyncHandler_js_1.AsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, status, priority, dueDate } = req.body;
        if (!title) {
            throw new ApiError_js_1.ApiError(400, "Title is required");
        }
        const task = yield task_model_js_1.Taskmodel.create({
            title,
            description,
            status,
            priority,
            dueDate,
            userId: req.user._id
        });
        return res.status(201).json(new ApiResponse_js_1.ApiResponse(201, task, "Task created successfully"));
    }
    catch (error) {
        throw new ApiError_js_1.ApiError(error.statusCode || 500, error.message || "Error creating task");
    }
}));
exports.createTask = createTask;
const getUserTasks = (0, AsyncHandler_js_1.AsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield task_model_js_1.Taskmodel.find({ userId: req.user._id });
        return res.status(200).json(new ApiResponse_js_1.ApiResponse(200, tasks, "Tasks retrieved successfully"));
    }
    catch (error) {
        throw new ApiError_js_1.ApiError(error.statusCode || 500, error.message || "Error retrieving tasks");
    }
}));
exports.getUserTasks = getUserTasks;
const updateTask = (0, AsyncHandler_js_1.AsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        const updates = req.body;
        const task = yield task_model_js_1.Taskmodel.findOneAndUpdate({ _id: taskId, userId: req.user._id }, updates, { new: true });
        if (!task) {
            throw new ApiError_js_1.ApiError(404, "Task not found or you don't have permission to update it");
        }
        return res.status(200).json(new ApiResponse_js_1.ApiResponse(200, task, "Task updated successfully"));
    }
    catch (error) {
        throw new ApiError_js_1.ApiError(error.statusCode || 500, error.message || "Error updating task");
    }
}));
exports.updateTask = updateTask;
const deleteTask = (0, AsyncHandler_js_1.AsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        console.log("taskId", taskId);
        console.log("userId", req.user._id);
        const task = yield task_model_js_1.Taskmodel.findOneAndDelete({ _id: taskId, userId: req.user._id });
        if (!task) {
            throw new ApiError_js_1.ApiError(404, "Task not found or you don't have permission to delete it");
        }
        return res.status(200).json(new ApiResponse_js_1.ApiResponse(200, {}, "Task deleted successfully"));
    }
    catch (error) {
        throw new ApiError_js_1.ApiError(error.statusCode || 500, error.message || "Error deleting task");
    }
}));
exports.deleteTask = deleteTask;
