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
      connectionId: connection._id,
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

// GET /api/connections
router.get("/", authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const connections = await Connection.find({
      $or: [
        { fromUserId: currentUserId },
        { toUserId: currentUserId }
      ],
      status: "accepted",
    })
      .populate("fromUserId", "name role avatar company domain passOutYear reputationScore")
      .populate("toUserId", "name role avatar company domain passOutYear reputationScore")
      .sort({ updatedAt: -1 })
      .lean();

    const response = connections.map(connection => {
      const fromUser = connection.fromUserId;
      const toUser = connection.toUserId;
      const currentUserIdString = currentUserId.toString();
      const connectedUser = fromUser._id.toString() === currentUserIdString ? toUser : fromUser;

      return {
        connectionId: connection._id.toString(),
        connectedUser: {
          id: connectedUser._id.toString(),
          name: connectedUser.name,
          role: connectedUser.role,
          avatar: connectedUser.avatar,
          company: connectedUser.company,
          domain: connectedUser.domain,
          passOutYear: connectedUser.passOutYear,
          reputationScore: connectedUser.reputationScore,
        },
        status: connection.status,
        purpose: connection.purpose,
        connectedAt: connection.updatedAt || connection.createdAt,
      };
    });

    res.json({
      success: true,
      connections: response,
    });
  } catch (error) {
    console.error("Get connections error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// GET /api/connections/count
router.get("/count", authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const count = await Connection.countDocuments({
      $or: [
        { fromUserId: currentUserId },
        { toUserId: currentUserId }
      ],
      status: "accepted",
    });

    res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Get connections count error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// GET /api/connections/status/:userId
router.get("/status/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId: targetUserId } = req.params;
    const currentUserId = req.user._id;

    // Validate target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Target user not found",
      });
    }

    // Check for connection in both directions
    const connection = await Connection.findOne({
      $or: [
        { fromUserId: currentUserId, toUserId: targetUserId },
        { fromUserId: targetUserId, toUserId: currentUserId }
      ]
    });

    let status = "none";
    if (connection) {
      // Treat rejected as none (no connection exists)
      status = connection.status === "rejected" ? "none" : connection.status;
    }

    res.json({
      success: true,
      status,
    });

  } catch (error) {
    console.error("Get connection status error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// DELETE /api/connections/:userId
router.delete("/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId: targetUserId } = req.params;
    const currentUserId = req.user._id;

    // Find and delete ONLY pending connection between users
    const connection = await Connection.findOneAndDelete({
      $or: [
        { fromUserId: currentUserId, toUserId: targetUserId },
        { fromUserId: targetUserId, toUserId: currentUserId }
      ],
      status: "pending" // Only allow cancelling pending requests
    });

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: "No pending connection found to cancel",
      });
    }

    res.json({
      success: true,
      message: "Connection request cancelled",
    });

  } catch (error) {
    console.error("Cancel connection error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// PUT /api/connections/:id/accept
router.put("/:id/accept", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id;

    // Find connection
    const connection = await Connection.findById(id);
    if (!connection) {
      return res.status(404).json({
        success: false,
        message: "Connection not found",
      });
    }

    // Check if current user is the recipient
    if (connection.toUserId.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only accept connections sent to you",
      });
    }

    // Check if status is pending
    if (connection.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Connection is not pending",
      });
    }

    // Update connection status
    connection.status = "accepted";
    await connection.save();

    // Create notification for sender
    const recipientUser = await User.findById(currentUserId);
    const acceptedNotification = new Notification({
      userId: connection.fromUserId,
      type: "connection_accepted",
      title: "Connection Accepted",
      message: `${recipientUser.name} accepted your connection request`,
      linkTo: `/profile/${currentUserId}`,
    });

    await acceptedNotification.save();

    res.json({
      success: true,
      message: "Connection accepted",
      connection,
    });

  } catch (error) {
    console.error("Accept connection error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// PUT /api/connections/:id/reject
router.put("/:id/reject", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id;

    // Find connection
    const connection = await Connection.findById(id);
    if (!connection) {
      return res.status(404).json({
        success: false,
        message: "Connection not found",
      });
    }

    // Check if current user is the recipient
    if (connection.toUserId.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only reject connections sent to you",
      });
    }

    // Check if status is pending
    if (connection.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Connection is not pending",
      });
    }

    // Update connection status
    connection.status = "rejected";
    await connection.save();

    // No notification for rejection

    res.json({
      success: true,
      message: "Connection rejected",
      connection,
    });

  } catch (error) {
    console.error("Reject connection error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;