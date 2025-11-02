import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthUser } from "../models/AuthUser.js";

export const register =async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await AuthUser.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await AuthUser.create({
      name,
      email,
      password: hashedPassword,
    });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax"
    });

    res.status(201).json({
      message: "User registered",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await AuthUser.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    res.json({
      message: "Login success",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const logout =  (req, res) => {
 res.cookie("token", "", {
  httpOnly: true,
  expires: new Date(0)
});
res.json({ message: "Logged out" });
}