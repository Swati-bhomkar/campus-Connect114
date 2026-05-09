import express from "express";
import { body } from "express-validator";
import {
  createReferralRequest,
  getSentRequests,
  getReceivedRequests,
  updateRequestStatus,
} from "../controllers/referralController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// POST /api/referrals - Create a new referral request
router.post(
  "/",
  [
    body("referralPostId").isMongoId().withMessage("Invalid post ID"),
    body("resumeUrl").isURL().withMessage("Invalid resume URL"),
    body("motivation").optional().isLength({ max: 250 }).withMessage("Motivation too long"),
    body("linkedinUrl").optional().isURL().withMessage("Invalid LinkedIn URL"),
  ],
  createReferralRequest
);

// GET /api/referrals/sent - Get requests sent by current user
router.get("/sent", getSentRequests);

// GET /api/referrals/received - Get requests received by current alumni
router.get("/received", getReceivedRequests);

// PATCH /api/referrals/:id/status - Update request status
router.patch("/:id/status", updateRequestStatus);

export default router;