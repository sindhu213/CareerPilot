
import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    let { query = "", location = "", jobType = "", page = "1" } = req.query;

    const globalKeywords = [
      "software engineer", "developer", "data analyst", "product manager",
      "marketing", "sales", "remote", "full time", "engineer", "designer",
      "india", "united kingdom", "germany", "canada", "australia", "europe"
    ];

    let searchQuery = query.toString().trim();

    if (!searchQuery) {
      const randomKeyword = globalKeywords[Math.floor(Math.random() * globalKeywords.length)];
      searchQuery = randomKeyword;
    }

    const params = {
      query: searchQuery,
      page: page.toString(),
      num_pages: "1",
      date_posted: "all",          
      employment_types: "FULLTIME,PARTTIME,CONTRACTOR,INTERN", 
    };

    if (location?.toString().trim()) {
      params.location = location.toString().trim();
    }

    if (jobType?.toString().trim()) {
      const type = jobType.toString().toLowerCase();
      if (type.includes("remote")) {
        params.remote_jobs_only = "true";
      }
    }

    console.log("Forcing global jobs →", params);

    const response = await axios.get("https://jsearch.p.rapidapi.com/search", {
      params,
      headers: {
        "x-rapidapi-key": process.env.RAPID_API_KEY,
        "x-rapidapi-host": "jsearch.p.rapidapi.com",
      },
      timeout: 20000,
    });

    const jobs = response.data.data || [];
    const hasMore = jobs.length === 10;

    res.json({
      data: jobs,
      pagination: {
        currentPage: parseInt(page.toString()),
        hasNext: hasMore,
        hasPrev: parseInt(page.toString()) > 1,
      },
    });
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

export default router;