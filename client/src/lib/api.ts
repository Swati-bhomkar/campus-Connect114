// API Base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/**
 * Get authorization headers with JWT token
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Get current user profile
 */
export const getCurrentUser = async () => {
  const response = await fetch(`${API_BASE_URL}/api/me`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get user data");
  }

  // Normalize API response: map collegEmail to email
  const user = {
    ...data.user,
    email: data.user.collegEmail,
  };

  return user;
};

/**
 * Get all users for admin
 */
export const getAllUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch users");
  }

  return data.users.map((user: any) => ({
    ...user,
    id: user._id,
  }));
};

/**
 * Search users with filters
 */
export const searchUsers = async (filters: {
  search?: string;
  role?: string;
  domain?: string;
  company?: string;
  passOutYear?: string;
  availableOnly?: boolean;
}) => {
  const params = new URLSearchParams();
  
  if (filters.search) params.append("search", filters.search);
  if (filters.role && filters.role !== "all") params.append("role", filters.role);
  if (filters.domain && filters.domain !== "all") params.append("domain", filters.domain);
  if (filters.company && filters.company !== "all") params.append("company", filters.company);
  if (filters.passOutYear && filters.passOutYear !== "all") params.append("passOutYear", filters.passOutYear);
  if (filters.availableOnly) params.append("availableOnly", "true");

  const response = await fetch(`${API_BASE_URL}/api/users/search?${params}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to search users");
  }

  return data.users;
};

/**
 * Get user by ID
 */
export const getUserById = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get user");
  }

  return data.user;
};

/**
 * Update current user profile
 */
export const updateCurrentUser = async (userData: {
  name?: string;
  bio?: string;
  skills?: string[];
  avatar?: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/api/me`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update profile");
  }

  return data.user;
};

/**
 * Send connection request
 */
export const sendConnectionRequest = async (toUserId: string, purpose: string) => {
  const response = await fetch(`${API_BASE_URL}/api/connections`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ toUserId, purpose }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to send connection request");
  }

  return data;
};

/**
 * Get accepted connections for current user
 */
export const getConnections = async () => {
  const response = await fetch(`${API_BASE_URL}/api/connections`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get connections");
  }

  return data.connections;
};

/**
 * Get connection count for current user
 */
export const getConnectionCount = async () => {
  const response = await fetch(`${API_BASE_URL}/api/connections/count`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get connection count");
  }

  return data.count;
};

/**
 * Get connection status with another user
 */
export const getConnectionStatus = async (userId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/connections/status/${userId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get connection status");
  }

  return data;
};

/**
 * Get unread notification count
 */
export const getUnreadNotificationCount = async () => {
  const response = await fetch(`${API_BASE_URL}/api/notifications/unread-count`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get unread count");
  }

  return data;
};

/**
 * Cancel connection request
 */
export const cancelConnectionRequest = async (userId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/connections/${userId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to cancel connection request");
  }

  return data;
};

/**
 * Get notifications for current user
 */
export const getNotifications = async () => {
  const response = await fetch(`${API_BASE_URL}/api/notifications`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get notifications");
  }

  return data.notifications;
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsRead = async () => {
  const response = await fetch(`${API_BASE_URL}/api/notifications/read-all`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to mark notifications as read");
  }

  return data;
};

/**
 * Accept a connection request
 */
export const acceptConnection = async (connectionId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/connections/${connectionId}/accept`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to accept connection");
  }

  return data;
};

/**
 * Reject a connection request
 */
export const rejectConnection = async (connectionId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/connections/${connectionId}/reject`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to reject connection");
  }

  return data;
};

/**
 * Create a new post
 */
export const createPost = async (postData: {
  type: string;
  title: string;
  description: string;
  company: string;
  domain: string;
  metadata: object;
  imageUrl?: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/api/posts`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(postData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create post");
  }

  return data.post;
};

/**
 * Get current user's posts
 */
export const getMyPosts = async () => {
  const response = await fetch(`${API_BASE_URL}/api/posts/me`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch posts");
  }

  return data.posts;
};