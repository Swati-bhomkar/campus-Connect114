import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// GET /api/notifications
router.get("/", authenticateToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate("userId", "name");

    res.json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// PUT /api/notifications/read-all
router.put("/read-all", authenticateToken, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, read: false },
      { read: true }
    );

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Mark read error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;