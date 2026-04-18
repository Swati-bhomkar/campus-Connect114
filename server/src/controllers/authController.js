import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { verifyAlumni } from "../config/alumniDatabase.js";

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
 * Verify student credentials against CSV database
 * POST /api/auth/verify-student
 */
export const verifyStudentCredentials = async (req, res) => {
  try {
    const { firstName, lastName, registrationNumber } = req.body;

    // Validation: Check required fields
    if (!firstName || !lastName || !registrationNumber) {
      return res.status(400).json({
        success: false,
        message: "First name, last name, and registration number are required",
      });
    }

    // Verify student against CSV database
    const studentExists = verifyStudent(firstName, lastName, registrationNumber);
    if (!studentExists) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to register",
        reason: "Name and registration number do not match college records",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student credentials verified successfully",
    });
  } catch (error) {
    console.error("Student verification error:", error);
    res.status(500).json({
      success: false,
      message: "Verification failed",
      error: error.message,
    });
  }
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
      avatar: "",
      joinedAt: new Date().toISOString(),
    };

    // Create user
    const newUser = new User(userData);
    await newUser.save();

    // Generate JWT token for the newly registered user
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return success response (exclude password)
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
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

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return success response (exclude password)
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
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

/**
 * Verify alumni credentials against CSV database
 * POST /api/auth/verify-alumni
 */
export const verifyAlumniCredentials = async (req, res) => {
  try {
    const { firstName, lastName, registrationNumber } = req.body;

    // Validation: Check required fields
    if (!firstName || !lastName || !registrationNumber) {
      return res.status(400).json({
        success: false,
        message: "First name, last name, and registration number are required",
      });
    }

    // Verify alumni against CSV database
    const alumniExists = verifyAlumni(firstName, lastName, registrationNumber);
    if (!alumniExists) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized in the college database",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Alumni credentials verified successfully",
    });
  } catch (error) {
    console.error("Alumni verification error:", error);
    res.status(500).json({
      success: false,
      message: "Verification failed",
      error: error.message,
    });
  }
};

/**
 * Register a new alumni
 * POST /api/auth/register-alumni
 */
export const registerAlumni = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      registrationNumber,
      password,
      confirmPassword,
      collegeEmail,
      passOutYear,
      accountStatus,
      companyName,
      workEmail,
      collegeName,
      courseName,
      freelanceSkills,
      freelanceDomain,
      summary,
      domain,
      skills,
    } = req.body;

    // Validation: Check required fields
    if (!firstName || !lastName || !registrationNumber || !password || !passOutYear) {
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

    // Validation: Verify alumni against CSV database
    const alumniExists = verifyAlumni(firstName, lastName, registrationNumber);
    if (!alumniExists) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized in the college database",
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

    // Validation: If working, validate workEmail
    if (accountStatus === "working") {
      if (!workEmail) {
        return res.status(400).json({
          success: false,
          message: "Work email is required for working professionals",
        });
      }
      const blockedDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "protonmail.com", "icloud.com", "aol.com", "mail.com", "yandex.com"];
      const workEmailDomain = workEmail.split("@")[1]?.toLowerCase();
      if (blockedDomains.includes(workEmailDomain)) {
        return res.status(400).json({
          success: false,
          message: "Work email cannot be a personal email domain",
        });
      }
    }

    // Validation: If higher_studies, validate collegeName and courseName
    if (accountStatus === "higher_studies") {
      if (!collegeName || !courseName) {
        return res.status(400).json({
          success: false,
          message: "College name and course name are required",
        });
      }
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Determine verification status based on accountStatus
    let isVerifiedProfessional = false;
    let isHigherStudiesVerified = false;

    if (accountStatus === "working") {
      isVerifiedProfessional = true;
    } else if (accountStatus === "higher_studies") {
      isHigherStudiesVerified = true;
    }

    // Prepare user data for alumni
    const userData = {
      name: `${firstName} ${lastName}`,
      collegEmail: collegeEmail?.toLowerCase() || null,
      password: hashedPassword,
      registrationNumber,
      role: "alumni",
      domain: domain || "Not Specified",
      skills: skills || [],
      passOutYear: parseInt(passOutYear),
      reputationScore: 0,
      referralCount: 0,
      availableForReferrals: accountStatus === "working",
      avatar: "",
      joinedAt: new Date().toISOString(),
      accountStatus: accountStatus === "working" ? "active" : "limited",
      workEmail: workEmail || null,
      isVerifiedProfessional,
      isHigherStudiesVerified,
      // Store additional status-specific info
      company: companyName || null,
      currentStatus: accountStatus === "working" ? "working" : "studying",
    };

    // Create user
    const newUser = new User(userData);
    await newUser.save();

    // Generate JWT token for the newly registered alumni
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return success response (exclude password)
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "Alumni registration successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Alumni registration error:", error);
    res.status(500).json({
      success: false,
      message: "Alumni registration failed",
      error: error.message,
    });
  }
};
