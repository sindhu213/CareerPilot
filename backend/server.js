
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const PORT = process.env.PORT || 5001;

connectDB();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: CLIENT_URL, // 👈 frontend origin
    credentials: true, // 👈 allow sending cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("Server is running correctly!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});