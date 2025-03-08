import axios from "axios";
import { store } from "../redux/store";
import { logout } from "../redux/slices/authSlice";

/**
 * API Service Configuration
 * 
 * This module handles all API communication with the backend.
 * Features:
 * - Centralized API configuration
 * - Automatic token management
 * - Error handling
 * - Type-safe endpoints
 */

/**
 * Base API instance with default configuration
 * Uses environment variables for base URL
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
});

/**
 * Request interceptor to attach authentication token
 * - Automatically adds Bearer token to all requests if available
 * - Gets token from localStorage
 * - Sets Authorization header
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor to handle authentication errors
 * - Handles 401/403 errors
 * - Automatically logs out user on auth errors
 * - Cleans up invalid tokens
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && [401, 403].includes(error.response.status)) {
      localStorage.removeItem("token");
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

/**
 * Authentication API endpoints
 * Handles all auth-related operations
 */
export const authAPI = {
  /**
   * Register a new user
   * @param data User registration data (username, email, password)
   * @returns API response with token and user data
   * @description Creates new user account and returns auth token
   */
  register: async (data: { username: string; email: string; password: string }) => {
    const response = await api.post("/auth/register", data);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response;
  },

  /**
   * Login existing user
   * @param data User login credentials (email, password)
   * @returns API response with token and user data
   * @description Authenticates user and returns auth token
   */
  login: async (data: { email: string; password: string }) => {
    const response = await api.post("/auth/login", data);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response;
  },

  /**
   * Get current user data
   * @returns API response with user data
   * @description Validates token and returns current user info
   */
  getCurrentUser: () => api.get("/auth/me"),

  /**
   * Logout current user
   * @description Cleans up auth state and removes token
   */
  logout: () => {
    localStorage.removeItem("token");
    store.dispatch(logout());
  }
};

/**
 * Forum API endpoints
 * Handles all forum-related operations
 */
export const forumAPI = {
  /** Get all forums */
  getAll: () => api.get("/forums"),
  
  /** Get forum by ID */
  getById: (id: number) => api.get(`/forums/${id}`),
  
  /** Create new forum */
  create: (data: { title: string; description: string; tags?: string[] }) =>
    api.post("/forums", data),
  
  /** Update existing forum */
  update: (id: number, data: { title: string; description: string; tags?: string[] }) =>
    api.put(`/forums/${id}`, data),
  
  /** Delete forum */
  delete: (id: number) => api.delete(`/forums/${id}`),
  
  /** Like/unlike forum */
  like: (id: number) => api.post(`/forums/${id}/like`),
};

/**
 * Comment API endpoints
 * Handles all comment-related operations
 */
export const commentAPI = {
  /** Get comments for a forum */
  getByForum: (forumId: number) => api.get(`/comments/forum/${forumId}`),
  
  /** Create new comment */
  create: (forumId: number, data: { content: string }) =>
    api.post(`/comments/forum/${forumId}`, data),
  
  /** Update existing comment */
  update: (id: number, data: { content: string }) =>
    api.put(`/comments/${id}`, data),
  
  /** Delete comment */
  delete: (id: number) => api.delete(`/comments/${id}`),
  
  /** Like/unlike comment */
  like: (id: number) => api.post(`/comments/${id}/like`),
};

export default api;