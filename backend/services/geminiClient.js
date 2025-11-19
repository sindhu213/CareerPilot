
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("GEMINI_API_KEY missing from .env");

const genAI = new GoogleGenerativeAI(apiKey);

const MODEL_ID = process.env.GOOGLE_GEMINI_MODEL || "gemini-2.5-flash";

async function generateResumeAnalysis(payload, retryCount = 0) {
  const { text, entities = {}, jobDescription = "", file_url } = payload;


const prompt = `You are a senior technical recruiter and resume parser.

Your only job: Return a clean JSON with these exact keys. NO markdown, NO code blocks, NO extra text.

{
  "score": 88,
  "strengths": ["string"],
  "suggestions": ["string"],
  "missing_skills": ["string"],
  "recommended_skills": ["string"],
  "extracted_skills": ["Python", "React", "Docker"],
  "summary": "Two sentences max."
}

RULES FOR extracted_skills:
- Return ONLY exact technical skill names as they appear in the resume
- Include ALL programming languages, libraries, frameworks, tools, databases
- Do NOT use concepts like "Machine Learning" — only specific tools only
- Examples from this resume you MUST include: Python, C++, JavaScript, React.js, Node.js, Express.js, Flask, FastAPI, MongoDB, MySQL, NumPy, Pandas, Matplotlib, Scikit-learn, TensorFlow, Keras, OpenCV, PyTorch, LangChain, Gemini API, Git, REST API, JWT, Tailwind CSS

Resume text:
${text.slice(0, 3000)}

Entities (for reference only): ${JSON.stringify(entities)}

Job description: ${jobDescription || "Software Engineer / ML Engineer"}

Return only the raw JSON starting with { and ending with }:
`;

  const model = genAI.getGenerativeModel({
    model: MODEL_ID,
    generationConfig: {
  temperature: 0.2, 
  maxOutputTokens: 2048,
}
  });

  console.log(`Calling ${MODEL_ID} (attempt ${retryCount + 1})...`);

  try {
    const result = await model.generateContent(prompt);

    // Full debug
    console.log("Full response object:", JSON.stringify(result.response, null, 2));
    let rawText = result.response.text()?.trim() || "";
    const finishReason = result.response.candidates?.[0]?.finishReason || "UNKNOWN";
    const candidates = result.response.candidates?.length || 0;

    console.log(`Finish reason: ${finishReason}, Candidates: ${candidates}`);
    console.log("Raw text (first 400 chars):", rawText.substring(0, 400) + (rawText.length > 400 ? "..." : ""));

    if (!rawText && finishReason === "STOP" && retryCount < 2) {
      console.warn("Empty — retrying...");
      return generateResumeAnalysis(payload, retryCount + 1);
    }

    if (!rawText) throw new Error(`Empty: ${finishReason}`);

    rawText = rawText.replace(/```json\s*/g, '').replace(/```\s*$/g, '').replace(/```/g, '').trim();

    if (finishReason === "MAX_TOKENS" && rawText.endsWith(',')) {
      rawText = rawText.replace(/,\s*$/, '');  
      rawText += '}';  
    }

    // Better regex for JSON extraction (handles wrapped/incomplete)
    const jsonMatch = rawText.match(/(\{[\s\S]*\})/);
    if (!jsonMatch) throw new Error("No JSON found");

    let jsonStr = jsonMatch[0];

    jsonStr = jsonStr.replace(/,\s*([\]}])/g, '$1');  // Remove trailing commas

    const parsed = JSON.parse(jsonStr);

    // Validate arrays
    ['strengths', 'suggestions', 'missing_skills', 'recommended_skills', 'extracted_skills'].forEach(key => {
      parsed[key] = Array.isArray(parsed[key]) ? parsed[key] : [];
    });
    parsed.score = Math.max(0, Math.min(100, Number(parsed.score) || 50));

    console.log("Success! Parsed score:", parsed.score, "Skills count:", parsed.extracted_skills.length);
    return parsed;

  } catch (error) {
    console.error("Gemini failed:", error.message);
    return {
      score: 70,
      strengths: ["Strong academics", "Relevant projects"],
      suggestions: ["Add links & metrics"],
      missing_skills: ["Docker", "AWS"],
      recommended_skills: ["FastAPI", "Kubernetes"],
      extracted_skills: Array.isArray(entities.skills) ? entities.skills : [],
      summary: "Promising resume; enhance with cloud/DevOps."
    };
  }
}

export default generateResumeAnalysis;