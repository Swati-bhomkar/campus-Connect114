import express from "express";
import { getAllUsers, searchUsers, getUserById } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/users - Get all users for admin
router.get("/", getAllUsers);

// GET /api/users/search - Search users with filters
router.get("/search", searchUsers);

// GET /api/users/:id - Get user by ID
router.get("/:id", getUserById);

export default router;