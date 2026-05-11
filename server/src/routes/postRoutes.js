import express from "express";
import { createPost, deletePost, getMyPosts, getFeedPosts, getPostById } from "../controllers/postController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// POST /api/posts - Create a new post
router.post("/", createPost);

// GET /api/posts/me - Get current user's posts
router.get("/me", getMyPosts);

// GET /api/posts/feed - Get network feed posts
router.get("/feed", getFeedPosts);

// DELETE /api/posts/:id - Delete current user's post
router.delete("/:id", deletePost);

// GET /api/posts/:id - Get a single post by ID
router.get("/:id", getPostById);

export default router;
