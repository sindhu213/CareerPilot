import jwt from "jsonwebtoken";
import { AuthUser } from "../models/AuthUser.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // Support token from Authorization header (Bearer) or cookie
    let token = null;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const user = await AuthUser.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error("authMiddleware error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export default authMiddleware;