import express from "express";
import { User } from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ authUserId: req.userId });
    if (!user) return res.status(404).json({ message: "Profile not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const data = req.body || {};

    // fill name/email automatically from auth user
    if (req.user) {
      data.email = req.user.email;
      data.name = req.user.name;
    }

    // always tie this profile to the authenticated user
    let user = await User.findOne({ authUserId: req.userId });

    if (user) {
      Object.assign(user, data);
      await user.save();
    } else {
      user = await User.create({
        authUserId: req.userId,
        ...data,
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:github", async (req, res) => {
  try {
    const user = await User.findOne({ github: req.params.github });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;