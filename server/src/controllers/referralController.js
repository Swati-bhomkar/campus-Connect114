import ReferralRequest from "../models/ReferralRequest.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { validationResult } from "express-validator";

const serializeUser = (user) => {
  if (!user) return null;

  return {
    id: user._id?.toString?.() || user.id,
    _id: user._id,
    name: user.name,
    avatar: user.avatar || "",
    role: user.role,
    email: user.email,
    company: user.company,
    registrationNumber: user.registrationNumber,
  };
};

const serializePost = (post) => {
  if (!post) return null;

  return {
    id: post._id?.toString?.() || post.id,
    _id: post._id,
    title: post.title,
    company: post.company,
  };
};

const serializeReferralRequest = (request) => {
  const plain = request.toObject ? request.toObject() : request;
  const requester = typeof plain.requesterId === "object" ? serializeUser(plain.requesterId) : null;
  const alumni = typeof plain.alumniId === "object" ? serializeUser(plain.alumniId) : null;
  const referralPost = typeof plain.referralPostId === "object" ? serializePost(plain.referralPostId) : null;

  return {
    ...plain,
    id: plain._id?.toString?.() || plain.id,
    requesterId: requester?.id || plain.requesterId?.toString?.() || plain.requesterId,
    alumniId: alumni?.id || plain.alumniId?.toString?.() || plain.alumniId,
    referralPostId: referralPost?.id || plain.referralPostId?.toString?.() || plain.referralPostId,
    requester,
    alumni,
    referralPost,
  };
};

/**
 * Create a new referral request
 */
export const createReferralRequest = async (req, res) => {
  try {
    console.log("[referrals:create] controller entered");
    console.log("[referrals:create] payload received:", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.warn("[referrals:create] validation errors:", errors.array());
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { referralPostId, motivation, linkedinUrl, resumeUrl } = req.body;
    const requesterId = req.user._id;
    const requesterRole = req.user.role;

    // Validate referral post exists and is referral type
    const post = await Post.findById(referralPostId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Referral post not found",
      });
    }

    if (post.type !== "referral_opportunity") {
      return res.status(400).json({
        success: false,
        message: "Post is not a referral opportunity",
      });
    }

    // Validate alumni exists
    const alumni = await User.findById(post.authorId);
    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    // Prevent self-requests
    if (requesterId.toString() === alumni._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Cannot request referral from yourself",
      });
    }

    // Check for duplicate request (handled by unique index, but check explicitly)
    const existingRequest = await ReferralRequest.findOne({
      requesterId,
      referralPostId,
    });

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message: "You have already sent a referral request for this post",
      });
    }

    // Validate resume (basic check - assume URL is provided)
    if (!resumeUrl || !resumeUrl.endsWith('.pdf')) {
      return res.status(400).json({
        success: false,
        message: "Resume must be a PDF file",
      });
    }

    // Create request
    const referralRequest = new ReferralRequest({
      requesterId,
      requesterRole,
      alumniId: alumni._id,
      referralPostId,
      companySnapshot: post.company,
      roleSnapshot: post.title, // Using title as role snapshot
      motivation: motivation || "",
      linkedinUrl: linkedinUrl || "",
      resumeUrl,
    });

    try {
      await referralRequest.save();
      console.log("[referrals:create] save success:", referralRequest._id.toString());
    } catch (saveError) {
      console.error("[referrals:create] save failure:", saveError);
      throw saveError;
    }

    Notification.create({
      userId: alumni._id,
      type: "referral_update",
      title: "New Referral Request",
      message: `${req.user.name} sent you a referral request for ${post.title} at ${post.company}`,
      linkTo: "/alumni/requests",
    }).catch((notificationError) => {
      console.error("[referrals:create] notification failure:", notificationError);
    });

    res.status(201).json({
      success: true,
      message: "Referral request submitted successfully",
      data: serializeReferralRequest(referralRequest),
    });
  } catch (error) {
    console.error("Create referral request error:", error);
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already sent a referral request for this post",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Get referral requests sent by current user
 */
export const getSentRequests = async (req, res) => {
  try {
    const requests = await ReferralRequest.find({ requesterId: req.user._id })
      .populate("requesterId", "name email avatar role registrationNumber")
      .populate("alumniId", "name email avatar role company")
      .populate("referralPostId", "title company")
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: requests.map(serializeReferralRequest),
    });
  } catch (error) {
    console.error("Get sent requests error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Get referral requests received by current alumni
 */
export const getReceivedRequests = async (req, res) => {
  try {
    const requests = await ReferralRequest.find({ alumniId: req.user._id })
      .populate("requesterId", "name email avatar role registrationNumber")
      .populate("alumniId", "name email avatar role company")
      .populate("referralPostId", "title company")
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: requests.map(serializeReferralRequest),
    });
  } catch (error) {
    console.error("Get received requests error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Update referral request status (accept/reject)
 */
export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const request = await ReferralRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Referral request not found",
      });
    }

    // Only alumni can update status
    if (request.alumniId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this request",
      });
    }

    request.status = status;
    request.statusUpdatedAt = new Date();
    await request.save();

    const populatedRequest = await ReferralRequest.findById(request._id)
      .populate("requesterId", "name email avatar role registrationNumber")
      .populate("alumniId", "name email avatar role company")
      .populate("referralPostId", "title company")
      .lean();

    res.json({
      success: true,
      message: `Request ${status}`,
      data: serializeReferralRequest(populatedRequest),
    });
  } catch (error) {
    console.error("Update request status error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
