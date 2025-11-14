
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    console.log("msg ------------", message);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(message);
    const reply = result.response.text();

    res.json({ reply });

  } catch (error) {
    console.error("Gemini API Error:", error.message);
    res.status(500).json({ message: "Gemini API request failed" });
  }
});

export default router;
