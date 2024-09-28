import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieparser());

// Root Route
app.get('/', (_req, res) => {
    res.send("Server is running fine");
});

// Routes
import authRouter from "./routes/auth.route";
import taskRouter from "./routes/task.route";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tasks", taskRouter);



export { app };