import express from "express";
import { registerStudent, loginUser, verifyStudentCredentials, verifyAlumniCredentials, registerAlumni } from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/verify-student - Verify student credentials against CSV
router.post("/verify-student", verifyStudentCredentials);

// POST /api/auth/verify-alumni - Verify alumni credentials against CSV
router.post("/verify-alumni", verifyAlumniCredentials);

// POST /api/auth/register - Register a new student
router.post("/register", registerStudent);

// POST /api/auth/register-alumni - Register a new alumni
router.post("/register-alumni", registerAlumni);

// POST /api/auth/login - Login user (student, alumni, admin)
router.post("/login", loginUser);

export default router;
