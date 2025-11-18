import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import authMiddleware from "../middleware/authMiddleware.js";
dotenv.config();

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// POST: generate career-focused response
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // System prompt restricts domain
    const systemPrompt = `
        You are a professional AI Career Assistant.
        Only answer questions related to:
        - career advice  
        - resume improvement  
        - skills and learning  
        - interview guidance  
        - job market trends  
        If question is unrelated → politely decline.
    `;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          type: "system",
          text: systemPrompt,
        },
        {
          type: "user",
          text: message,
        },
      ],
      temperature: 0.4,
      maxOutputTokens: 150,
    });

    const reply = result.text;
    res.json({ reply });
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    res.status(500).json({ error: "Failed to fetch AI response" });
  }
});

// GET: list gemini models
router.get("/models", authMiddleware, async (req, res) => {
  try {
    const list = await ai.models.list();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Unable to list models" });
  }
});

export default router;