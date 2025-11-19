import dotenv from 'dotenv'
dotenv.config();
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    console.log('Available models:');
    data.models.forEach(model => {
      console.log(`- ${model.name} (supports generateContent: ${model.supportedGenerationMethods.includes('generateContent')})`);
    });
  } catch (error) {
    console.error('Error listing models:', error);
  }
}

listModels();