// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js"; 
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

connectDB();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
