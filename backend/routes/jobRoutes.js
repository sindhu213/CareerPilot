import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Default locations to search when no filter is provided
// const DEFAULT_LOCATIONS = ["Bangalore", "Mumbai", "Delhi", "Pune", "Remote"];
const DEFAULT_LOCATIONS = ['Bangalore']
const RESULTS_PER_PAGE = 10; // Target number of results per page
const PAGES_PER_LOCATION = 2; // Fetch 2 pages per location for more results

router.get("/search", async (req, res) => {
  try {
    let { query = "", location = "", jobType = "", page = "1" } = req.query;

    const searchQuery = query.toString().trim() || "software developer";
    const currentPage = parseInt(page.toString());

    // Determine which locations to search
    let locationsToSearch = [];
    if (location && location !== "all") {
      locationsToSearch = [location.toString().trim()];
    } else {
      // No filter provided - search all default locations
      locationsToSearch = DEFAULT_LOCATIONS;
    }

    // Fetch multiple pages from each location
    const allJobsPromises = locationsToSearch.flatMap((loc) => {
      return Array.from({ length: PAGES_PER_LOCATION }, (_, i) => {
        const apiPage = ((currentPage - 1) * PAGES_PER_LOCATION) + i + 1;
        return async () => {
          const params = {
            query: loc === "Remote" ? `${searchQuery} remote` : `${searchQuery} in ${loc}`,
            page: apiPage.toString(),
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

          try {
            const response = await axios.get("https://jsearch.p.rapidapi.com/search", {
              params,
              headers: {
                "x-rapidapi-key": process.env.RAPID_API_KEY,
                "x-rapidapi-host": "jsearch.p.rapidapi.com",
              },
              timeout: 20000,
            });

            return {
              location: loc,
              page: apiPage,
              jobs: response.data.data || [],
            };
          } catch (error) {
            console.error(`Error fetching jobs for ${loc} (page ${apiPage}):`, error.message);
            return {
              location: loc,
              page: apiPage,
              jobs: [],
            };
          }
        };
      });
    });

    // Execute all API calls
    const results = await Promise.all(allJobsPromises.map(fn => fn()));

    // Combine all jobs with location metadata
    const allJobs = results.flatMap(result =>
      result.jobs.map(job => ({
        ...job,
        search_location: result.location,
      }))
    );

    // Remove duplicates based on job_id
    const uniqueJobs = Array.from(
      new Map(allJobs.map(job => [job.job_id, job])).values()
    );

    // Sort by apply link availability and posted date
    uniqueJobs.sort((a, b) => {
      if (a.job_apply_link && !b.job_apply_link) return -1;
      if (!a.job_apply_link && b.job_apply_link) return 1;
      return 0;
    });

    // Paginate the results
    const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
    const endIndex = startIndex + RESULTS_PER_PAGE;
    const paginatedJobs = uniqueJobs.slice(startIndex, endIndex);

    console.log(`Fetched ${uniqueJobs.length} unique jobs from ${locationsToSearch.length} locations, showing ${paginatedJobs.length} on page ${currentPage}`);

    res.json({
      data: paginatedJobs,
      locations_searched: locationsToSearch,
      pagination: {
        currentPage: currentPage,
        hasNext: endIndex < uniqueJobs.length,
        hasPrev: currentPage > 1,
        totalResults: uniqueJobs.length,
        resultsPerPage: RESULTS_PER_PAGE,
      },
      stats: {
        total_jobs: uniqueJobs.length,
        showing: paginatedJobs.length,
        by_location: locationsToSearch.map(loc => ({
          location: loc,
          count: results.filter(r => r.location === loc).reduce((sum, r) => sum + r.jobs.length, 0),
        })),
      },
    });
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

export default router;