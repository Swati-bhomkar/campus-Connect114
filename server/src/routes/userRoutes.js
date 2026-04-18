import express from "express";
import { getAllUsers, getCurrentUser, updateCurrentUser } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/users - Get all users for admin
router.get("/users", getAllUsers);

// GET /api/me - Get current user profile
router.get("/me", getCurrentUser);

// PUT /api/me - Update current user profile
router.put("/me", updateCurrentUser);

export default router;