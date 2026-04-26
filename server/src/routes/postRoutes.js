import express from "express";
import { createPost, getMyPosts } from "../controllers/postController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// POST /api/posts - Create a new post
router.post("/", createPost);

// GET /api/posts/me - Get current user's posts
router.get("/me", getMyPosts);

export default router;