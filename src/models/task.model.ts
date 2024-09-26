import mongoose, { Schema } from "mongoose";

const TaskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
        type: String,
        enum: ["To Do", "In Progress", "Completed"],
        default: "To Do"
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium"
    },
    dueDate: Date,
    userId: { type: Schema.Types.ObjectId, ref: 'Usermodel' }
});

export const Taskmodel = mongoose.model('Task', TaskSchema);