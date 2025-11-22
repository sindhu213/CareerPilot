import applicationsRoutes from "./routes/applicationsRoutes.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import resumeAnalyzerRoutes from "./routes/resumeAnalyzerRoutes.js";
import careerChatRoutes from "./routes/careerChatRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

dotenv.config();

const app = express();
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const PORT = process.env.PORT || 5001;

connectDB();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/applications", applicationsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/resume", resumeAnalyzerRoutes);
app.use("/api/careerChat", careerChatRoutes);
app.use("/api/jobs",jobRoutes);

app.get("/", (req, res) => {
  res.send("Server is running correctly!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});