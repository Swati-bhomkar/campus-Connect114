import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["job_opening", "internship_opening", "referral_opportunity", "event"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    required: true,
  },
  visibility: {
    type: String,
    enum: ["public", "alumni_only", "students_only"],
    default: "public",
  },
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "published",
  },
  imageUrl: {
    type: String,
    default: null,
  },
  flagged: {
    type: Boolean,
    default: false,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
  engagement: {
    views: {
      type: Number,
      default: 0,
    },
    applications: {
      type: Number,
      default: 0,
    },
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
}, { timestamps: true });

// Indexes for common queries
postSchema.index({ authorId: 1 });
postSchema.index({ type: 1 });
postSchema.index({ status: 1 });
postSchema.index({ visibility: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ type: 1, status: 1, visibility: 1, createdAt: -1 });

// Lightweight metadata validation
postSchema.pre("save", function(next) {
  const post = this;

  // Required fields by type
  const requiredFields = {
    job_opening: [
      "roleTitle",
      "location",
      "applicationLink"
    ],

    internship_opening: [
      "internshipDuration",
      "mode",
      "applicationLink"
    ],

    referral_opportunity: [
      "roleTitle"
    ],

    event: [
      "eventCategory",
      "organizer",
      "eventDate"
    ],
  };

  // Enum validations
  const enumValidations = {
    applicationMethod: ["external_link", "platform_apply", "email"],
    mode: ["remote", "hybrid", "on-site"],
    eventMode: ["online", "offline", "hybrid"],
  };

  const fields = requiredFields[post.type];
  if (!fields) {
    return next(new Error(`Invalid post type: ${post.type}`));
  }

  // Check required fields exist
  for (const field of fields) {
    if (!post.metadata[field]) {
      return next(new Error(`Missing required metadata field: ${field} for type ${post.type}`));
    }
  }

  // Check enums
  for (const [field, values] of Object.entries(enumValidations)) {
    if (post.metadata[field] && !values.includes(post.metadata[field])) {
      return next(new Error(`Invalid ${field}: ${post.metadata[field]}`));
    }
  }

  // Type checks for specific fields
  if (post.type === "job_opening" && post.metadata.salaryRange) {
    const sr = post.metadata.salaryRange;
    if (typeof sr.min !== "number" || typeof sr.max !== "number") {
      return next(new Error("salaryRange min/max must be numbers"));
    }
  }

  if (post.type === "referral_opportunity" && post.metadata.slotsRemaining === undefined) {
    post.metadata.slotsRemaining = post.metadata.referralSlots || 1;
  }

  // Optional: Support eligibleBatches for job_opening and internship_opening
  if (post.metadata.eligibleBatches && Array.isArray(post.metadata.eligibleBatches)) {
    // Lightweight validation - ensure all elements are numbers
    const validBatches = post.metadata.eligibleBatches.every(batch => 
      typeof batch === "number" && batch >= 2021 && batch <= 2027
    );
    if (!validBatches) {
      return next(new Error("eligibleBatches must be an array of numbers between 2021 and 2027"));
    }
  }

  next();
});

const Post = mongoose.model("Post", postSchema);

export default Post;