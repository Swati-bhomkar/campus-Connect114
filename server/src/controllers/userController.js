import User from "../models/User.js";

/**
 * Get current user profile
 * GET /api/me
 */
export const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;

    // Return user data (exclude password)
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      user: userResponse,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user data",
      error: error.message,
    });
  }
};

/**
 * Get all users for admin
 * GET /api/users
 */
export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: admin access required",
      });
    }

    const users = await User.find({}).select("-password").lean();
    const userList = users.map(user => ({
      ...user,
      id: user._id.toString(),
      email: user.collegEmail,
    }));

    res.status(200).json({
      success: true,
      users: userList,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

/**
 * Search users with filters
 * GET /api/users/search
 */
export const searchUsers = async (req, res) => {
  try {
    const { search, role, domain, company, passOutYear, availableOnly } = req.query;
    const currentUserId = req.user._id;

    // Build filter object - always exclude current user and admins
    const filter = {
      _id: { $ne: currentUserId },
      role: { $ne: "admin" },
    };

    if (role && role !== "all") {
      filter.role = role;
    }
    if (domain && domain !== "all") {
      filter.domain = domain;
    }
    if (company && company !== "all") {
      filter.company = company;
    }
    if (passOutYear && passOutYear !== "all") {
      filter.passOutYear = Number(passOutYear);
    }
    if (availableOnly === "true") {
      filter.availableForReferrals = true;
    }

    // Text search on name and skills
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { skills: { $in: [new RegExp(search, "i")] } }
      ];
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ reputationScore: -1 })
      .lean();

    // Map _id to id and collegEmail to email
    const userList = users.map(user => ({
      ...user,
      id: user._id.toString(),
      email: user.collegEmail,
    }));

    res.status(200).json({
      success: true,
      users: userList,
    });
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search users",
      error: error.message,
    });
  }
};

/**
 * Get user by ID
 * GET /api/users/:id
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(id).select("-password").lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Map _id to id and collegEmail to email
    const userResponse = {
      ...user,
      id: user._id.toString(),
      email: user.collegEmail,
    };

    res.status(200).json({
      success: true,
      user: userResponse,
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user",
      error: error.message,
    });
  }
};

/**
 * Update current user profile
 * PUT /api/me
 */
export const updateCurrentUser = async (req, res) => {
  try {
    const { name, bio, skills, avatar } = req.body;
    const userId = req.user._id;

    // Validation
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (name.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name must be less than 100 characters",
      });
    }

    if (bio && bio.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Bio must be less than 500 characters",
      });
    }

    if (skills && (!Array.isArray(skills) || skills.length > 20)) {
      return res.status(400).json({
        success: false,
        message: "Skills must be an array with maximum 20 items",
      });
    }

    if (skills && skills.some(skill => typeof skill !== "string" || skill.length > 50)) {
      return res.status(400).json({
        success: false,
        message: "Each skill must be a string with maximum 50 characters",
      });
    }

    // Update user (only allowed fields)
    const updateData = {
      name: name.trim(),
      bio: bio ? bio.trim() : "",
      skills: skills || [],
      avatar: avatar || "",
    };

    const updatedUser = await req.user.constructor.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Return updated user data (exclude password)
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Update current user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};