import express from "express";
import { registerStudent, loginUser, verifyStudentCredentials } from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/verify-student - Verify student credentials against CSV
router.post("/verify-student", verifyStudentCredentials);

// POST /api/auth/register - Register a new student
router.post("/register", registerStudent);

// POST /api/auth/login - Login user (student, alumni, admin)
router.post("/login", loginUser);

export default router;
