import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    let { query = "", location = "", jobType = "", page = "1" } = req.query;

    let searchQuery = query.toString().trim();

    // Build the search query with location
    if (location && location !== "all") {
      const locationStr = location.toString().trim();
      // Combine job title with location in the query
      searchQuery = searchQuery 
        ? `${searchQuery} in ${locationStr}` 
        : locationStr;
    } else if (!searchQuery) {
      // Default search if nothing provided
      searchQuery = "software developer";
    }

    const params = {
      query: searchQuery,
      page: page.toString(),
      num_pages: "1",
      date_posted: "all",
    };

    // Add job type filter if provided
    if (jobType && jobType !== "all") {
      const type = jobType.toString().toUpperCase();
      if (type === "REMOTE") {
        params.remote_jobs_only = "true";
      } else {
        params.employment_types = type;
      }
    } else {
      params.employment_types = "FULLTIME,PARTTIME,CONTRACTOR,INTERN";
    }

    console.log("Job search params →", params);

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