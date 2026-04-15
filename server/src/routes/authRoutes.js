import express from "express";
import { registerStudent, loginUser } from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/register - Register a new student
router.post("/register", registerStudent);

// POST /api/auth/login - Login user (student, alumni, admin)
router.post("/login", loginUser);

export default router;
