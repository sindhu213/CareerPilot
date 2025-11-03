import express from "express";
import { login, logout, register } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// REGISTER
router.post("/register", register);

// LOGIN
router.post("/login", login);

// LOGOUT (protect so only authenticated users can clear their cookie)
router.post("/logout", authMiddleware, logout);

// FETCH USER PROFILE
router.get("/me", authMiddleware, async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
});

export default router;