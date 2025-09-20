import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

// Node.js environment
/* global process */

// JWT Secret - in production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "cudorms_secret_key_2024";

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Verify JWT token middleware
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

// Check if user is admin
export const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// Check if user owns resource or is admin
export const requireOwnershipOrAdmin = (req, res, next) => {
  const resourceUserId = req.params.userId || req.body.userId;
  const currentUserId = req.user._id.toString();

  if (currentUserId !== resourceUserId && req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};
