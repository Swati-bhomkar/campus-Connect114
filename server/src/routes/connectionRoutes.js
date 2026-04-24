import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import Connection from "../models/Connection.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

const router = express.Router();

// POST /api/connections
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { toUserId, purpose } = req.body;
    const fromUserId = req.user._id;

    // Validate required fields
    if (!toUserId || !purpose) {
      return res.status(400).json({
        success: false,
        message: "toUserId and purpose are required",
      });
    }

    // Check if users exist
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({
        success: false,
        message: "Target user not found",
      });
    }

    // Prevent self-connection
    if (fromUserId.toString() === toUserId) {
      return res.status(400).json({
        success: false,
        message: "Cannot connect to yourself",
      });
    }

    // Check if active connection already exists (pending or accepted)
    const existingConnection = await Connection.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ],
      status: { $in: ["pending", "accepted"] }
    });

    if (existingConnection) {
      return res.status(400).json({
        success: false,
        message: "Connection already exists",
      });
    }

    // Create connection
    const connection = new Connection({
      fromUserId,
      toUserId,
      purpose,
    });

    await connection.save();

    // Create notification for recipient
    const fromUser = await User.findById(fromUserId);
    const notification = new Notification({
      userId: toUserId,
      type: "connection_request",
      title: "New Connection Request",
      message: `${fromUser.name} wants to connect with you`,
      linkTo: `/profile/${fromUserId}`,
    });

    await notification.save();

    res.status(201).json({
      success: true,
      message: "Connection request sent",
      connection,
    });

  } catch (error) {
    console.error("Create connection error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;