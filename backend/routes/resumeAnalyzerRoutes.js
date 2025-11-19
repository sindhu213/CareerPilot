import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { sendFileToExtractor } from "../services/pyClient.js";
import extractEntities from '../services/spacyClient.js';
import generateResumeAnalysis from '../services/geminiClient.js';
import Skill from '../models/Skill.js';

const router = express.Router();

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '_');
    cb(null, `${Date.now()}_${base}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || `${5 * 1024 * 1024}`) },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed'));
    }
    cb(null, true);
  }
});

router.post('/analyze', upload.single('file'), async (req, res, next) => {

  if (!req.file) {
    return res.status(400).json({
      ok: false,
      error: "No file uploaded. Please upload a resume (PDF/DOC/DOCX/TXT)."
    });
  }

  const jobDescription = req.body.jobDescription || req.body.job_description || '';
  const userId = req.body.userId || null;
  const uploadedFilePath = req.file.path;

  try {
    // 1. Extract text from uploaded PDF
    const extractorResp = await sendFileToExtractor(uploadedFilePath);
    const text = extractorResp?.text || '';

    if (!text || text.trim().length < 50) {
      return res.status(400).json({
        ok: false,
        error: "Could not extract readable text from the resume. Try a clearer PDF."
      });
    }

    // 2. Extract entities using spaCy
    let entities = {};
    try {
      entities = await extractEntities(text);
    } catch (err) {
      console.warn('spaCy failed (continuing without entities):', err.message);
    }

    // 3. Analyze with Gemini
    const geminiPayload = {
      text,
      entities,
      jobDescription,
      file_url: uploadedFilePath
    };

    const geminiResp = await generateResumeAnalysis(geminiPayload);

    // 4. Use Gemini skills → fallback to spaCy if empty
    const extractedSkills =
      (Array.isArray(geminiResp.extracted_skills) && geminiResp.extracted_skills.length > 0)
        ? geminiResp.extracted_skills
        : (Array.isArray(entities.skills) ? entities.skills : []);

    // 5. Save skills to DB (optional)
    if (extractedSkills.length > 0 && userId) {
      const bulkOps = extractedSkills.map(skill => ({
        updateOne: {
          filter: { userId, skill: skill.trim() },
          update: { $setOnInsert: { source: 'nlp', createdAt: new Date() } },
          upsert: true
        }
      }));

      await Skill.bulkWrite(bulkOps).catch(err =>
        console.warn("Failed to save skills:", err.message)
      );;
    }

    // 6. Send success response
    return res.json({
      ok: true,
      analysis: {
        score: geminiResp.score || 70,
        strengths: geminiResp.strengths || [],
        suggestions: geminiResp.suggestions || [],
        missing_skills: geminiResp.missing_skills || [],
        recommended_skills: geminiResp.recommended_skills || [],
        extracted_skills: extractedSkills,
        summary: geminiResp.summary || "Analysis complete.",
        raw_entities: entities
      }
    });

  } catch (err) {
    console.error("Resume analysis failed:", err);
    return res.status(500).json({
      ok: false,
      error: "Analysis failed. Please try again later."
    });
  } finally {
    // Always delete the uploaded file
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      fs.unlink(uploadedFilePath, () => { });
    }
  }
});

export default router;