import express from "express";
import Application from "../models/Application.js";
import { User } from "../models/User.js";

const router = express.Router();

// GET all dashboard stats
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    // Count applications
    const totalApplications = await Application.countDocuments({ authUserId: userId });

    // Count interviews
    const totalInterviews = await Application.countDocuments({
      authUserId: userId,
      status: "interview",
    });

    // Fetch skill counts from user
    const user = await User.findOne({ authUserId: userId });

    const totalSkills =
      (user?.technicalSkills?.length || 0) +
      (user?.softSkills?.length || 0) +
      (user?.toolsAndTechnologies?.length || 0);

    res.json({
      applications: totalApplications,
      interviews: totalInterviews,
      skills: totalSkills,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;