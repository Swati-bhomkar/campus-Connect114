import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcryptjs from "bcryptjs";
import User from "../models/User.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load and parse student CSV file
const loadStudentDatabase = () => {
  const csvPath = path.join(__dirname, "../data/student1.csv");
  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const lines = csvContent.trim().split("\n");

  const students = [];
  for (let i = 1; i < lines.length; i++) {
    const [regNo, firstName, lastName] = lines[i].split(",").map((field) => field.trim());
    if (regNo && firstName && lastName) {
      students.push({
        regNo,
        firstName: firstName.toUpperCase(),
        lastName: lastName.toUpperCase(),
      });
    }
  }
  return students;
};

// Normalize name for comparison (trim & uppercase)
const normalizeName = (name) => name.trim().toUpperCase();

// Verify student against CSV database
const verifyStudent = (firstName, lastName, regNumber) => {
  const students = loadStudentDatabase();
  return students.find(
    (s) =>
      s.regNo === regNumber &&
      normalizeName(s.firstName) === normalizeName(firstName) &&
      normalizeName(s.lastName) === normalizeName(lastName)
  );
};

// Generate avatar URL using dicebear API
const generateAvatarUrl = (name) => {
  const encodedName = encodeURIComponent(name);
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodedName}&scale=80`;
};

/**
 * Register a new student
 * POST /api/auth/register
 */
export const registerStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      registrationNumber,
      password,
      confirmPassword,
      email,
      passOutYear,
      domain,
      skills,
    } = req.body;

    // Validation: Check required fields
    if (!firstName || !lastName || !registrationNumber || !password || !email || !passOutYear) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Validation: Passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Validation: Password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Validation: Verify student against CSV database
    const studentExists = verifyStudent(firstName, lastName, registrationNumber);
    if (!studentExists) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to register.",
        reason: "Name and registration number do not match college records",
      });
    }

    // Validation: Check if email already exists
    const existingUser = await User.findOne({ collegEmail: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Validation: Check if registration number already used
    const existingReg = await User.findOne({ registrationNumber });
    if (existingReg) {
      return res.status(409).json({
        success: false,
        message: "Registration number already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Generate avatar URL
    const avatarUrl = generateAvatarUrl(`${firstName} ${lastName}`);

    // Prepare user data with defaults
    const userData = {
      name: `${firstName} ${lastName}`,
      collegEmail: email.toLowerCase(),
      password: hashedPassword,
      registrationNumber,
      role: "student",
      domain: domain || "Not Specified",
      skills: skills || [],
      currentStatus: "studying",
      passOutYear: parseInt(passOutYear),
      company: null,
      companyVerified: "unverified",
      reputationScore: 0,
      referralCount: 0,
      availableForReferrals: false,
      avatar: avatarUrl,
      joinedAt: new Date().toISOString(),
    };

    // Create user
    const newUser = new User(userData);
    await newUser.save();

    // Return success response (exclude password)
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: userResponse,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

/**
 * Login user - Find by email or registrationNumber and verify password
 * POST /api/auth/login
 */
export const loginUser = async (req, res) => {
  try {
    const { email, registrationNumber, password } = req.body;

    // Validation: At least one identifier required
    if (!password || (!email && !registrationNumber)) {
      return res.status(400).json({
        success: false,
        message: "Email or Registration Number and password are required",
      });
    }

    // Find user by email or registrationNumber
    let user;
    if (email) {
      user = await User.findOne({ collegEmail: email.toLowerCase() });
    } else if (registrationNumber) {
      user = await User.findOne({ registrationNumber });
    }

    // User not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Compare password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Return success response (exclude password)
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};
