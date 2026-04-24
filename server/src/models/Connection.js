import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  purpose: {
    type: String,
    enum: ["resume_review", "career_guidance", "referral"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent duplicate pending/accepted connections between same users
connectionSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

export default mongoose.model("Connection", connectionSchema);