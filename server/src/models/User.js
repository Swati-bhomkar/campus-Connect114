import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => `u_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    collegEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["student", "alumni", "admin"],
      default: "student",
    },
    domain: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    currentStatus: {
      type: String,
      enum: ["studying", "working"],
      default: "studying",
    },
    passOutYear: {
      type: Number,
      required: true,
    },
    company: {
      type: String,
      default: null,
    },
    companyVerified: {
      type: String,
      enum: ["verified", "pending", "unverified"],
      default: "unverified",
    },
    reputationScore: {
      type: Number,
      default: 0,
    },
    referralCount: {
      type: Number,
      default: 0,
    },
    availableForReferrals: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    maxReferralsPerMonth: {
      type: Number,
      default: null,
    },
    maxResumesPerDay: {
      type: Number,
      default: null,
    },
    joinedAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
    accountStatus: {
      type: String,
      enum: ["active", "limited"],
      default: "limited",
    },
    workEmail: {
      type: String,
      default: null,
    },
    isVerifiedProfessional: {
      type: Boolean,
      default: false,
    },
    isHigherStudiesVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
