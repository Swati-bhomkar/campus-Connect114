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
      status: user.accountStatus,
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