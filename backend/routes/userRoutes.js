import express from "express";
import { User } from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET user profile (by GitHub username for simplicity)
router.get("/:github", async (req, res) => {
  try {
    const user = await User.findOne({ github: req.params.github });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST (create or update user) — protected so only authenticated users can create/update their profile
router.post("/", authMiddleware, async (req, res) => {
  try {
    const data = req.body || {};

    if (req.user) {
      if (!data.email) data.email = req.user.email;
      if (!data.name) data.name = req.user.name;
    }

    if (!data.github) return res.status(400).json({ message: "`github` username is required" });

    const existing = await User.findOne({ github: data.github });
    if (existing) {
      const updated = await User.findOneAndUpdate({ github: data.github }, data, {
        new: true,
      });
      return res.json(updated);
    } else {
      const newUser = new User(data);
      await newUser.save();
      return res.status(201).json(newUser);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;