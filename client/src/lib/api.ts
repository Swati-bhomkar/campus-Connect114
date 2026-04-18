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