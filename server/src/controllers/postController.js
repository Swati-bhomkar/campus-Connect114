import Post from "../models/Post.js";
import Connection from "../models/Connection.js";

/**
 * Create a new post
 * POST /api/posts
 */
export const createPost = async (req, res) => {
  try {
    const { type, title, description, company, domain, metadata, imageUrl } = req.body;
    const authorId = req.user._id;

    const post = new Post({
      authorId,
      type,
      title,
      description,
      company,
      domain,
      metadata,
      imageUrl: imageUrl || null,
    });

    await post.save();

    // Return post with author info
    const postResponse = post.toObject();
    postResponse.id = postResponse._id.toString();
    delete postResponse._id;
    delete postResponse.__v;

    // Add lightweight author fields
    postResponse.authorName = req.user.name;
    postResponse.authorAvatar = req.user.avatar || "";

    res.status(201).json({
      success: true,
      post: postResponse,
    });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create post",
    });
  }
};

/**
 * Get current user's posts
 * GET /api/posts/me
 */
export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      authorId: req.user._id,
      status: "published",
    })
      .sort({ createdAt: -1 })
      .lean();

    // Transform posts
    const transformedPosts = posts.map(post => ({
      id: post._id.toString(),
      authorId: post.authorId.toString(),
      type: post.type,
      title: post.title,
      description: post.description,
      company: post.company,
      domain: post.domain,
      batch: req.user.passOutYear, // Use user's batch
      createdAt: post.createdAt.toISOString(),
      imageUrl: post.imageUrl,
      flagged: post.flagged,
      metadata: post.metadata,
      authorName: req.user.name,
      authorAvatar: req.user.avatar || "",
    }));

    res.status(200).json({
      success: true,
      posts: transformedPosts,
    });
  } catch (error) {
    console.error("Get my posts error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
    });
  }
};

/**
 * Get network feed posts (current user + connected users)
 * GET /api/posts/feed
 */
export const getFeedPosts = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Get accepted connections
    const connections = await Connection.find({
      $or: [
        { fromUserId: currentUserId },
        { toUserId: currentUserId }
      ],
      status: "accepted",
    }).lean();

    // Extract connected user IDs
    const connectedUserIds = connections.map(conn => 
      conn.fromUserId.toString() === currentUserId.toString() 
        ? conn.toUserId 
        : conn.fromUserId
    );

    // Include current user
    const authorIds = [currentUserId, ...connectedUserIds];

    // Get posts from current user and connected users
    const posts = await Post.find({
      authorId: { $in: authorIds },
      status: "published",
    })
      .sort({ createdAt: -1 })
      .populate("authorId", "name avatar company passOutYear")
      .lean();

    // Transform posts
    const transformedPosts = posts.map(post => ({
      id: post._id.toString(),
      authorId: post.authorId._id.toString(),
      type: post.type,
      title: post.title,
      description: post.description,
      company: post.company,
      domain: post.domain,
      batch: post.authorId.passOutYear,
      createdAt: post.createdAt.toISOString(),
      imageUrl: post.imageUrl,
      flagged: post.flagged,
      metadata: post.metadata,
      authorName: post.authorId.name,
      authorAvatar: post.authorId.avatar || "",
    }));

    res.status(200).json({
      success: true,
      posts: transformedPosts,
    });
  } catch (error) {
    console.error("Get feed posts error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch feed posts",
    });
  }
};