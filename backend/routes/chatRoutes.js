
// import express from "express";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv";
// dotenv.config();

// const router = express.Router();

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// router.post("/", async (req, res) => {
//   try {
//     const { message } = req.body;

//     console.log("msg ------------", message);

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

//     const result = await model.generateContent(message);
//     const reply = result.response.text();

//     res.json({ reply });

//   } catch (error) {
//     console.error("Gemini API Error:", error.message);
//     res.status(500).json({ message: "Gemini API request failed" });
//   }
// });

// router.get("/models", async (req, res) => {
//   try {
//     const result = await genAI.listModels();
//     res.json(result);
//   } catch (err) {
//     console.error("List Models Error:", err);
//     res.status(500).json({ error: "Unable to list models." });
//   }
// });

// export default router;

import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, 
});

// POST route: generate content
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    console.log("msg ------------", message);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          type: "system",
          text: `You are a career guidance assistant. Your role is to help users make informed decisions to build a successful career.
                - Give relevant advice based on the user's question.
                - Be concise, actionable, and encouraging.
                - Avoid irrelevant or generic answers.`
        },
        { type: "user", text: message }
      ],
      temperature: 0.5,
      maxOutputTokens: 80,
    });

    const reply = response.text; 
    res.json({ reply });

  } catch (error) {
    console.error("Gemini API Error:", error.message);
    res.status(500).json({ message: "Gemini API request failed" });
  }
});

// GET route: list models
router.get("/models", async (req, res) => {
  try {
    const result = await ai.models.list();
    res.json(result);
  } catch (err) {
    console.error("List Models Error:", err);
    res.status(500).json({ error: "Unable to list models." });
  }
});

export default router;