import axios from "axios";
import { store } from "../redux/store";
import { logout } from "../redux/slices/authSlice";

/**
 * Base API instance with default configuration
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
});

/**
 * Request interceptor to attach authentication token
 * Automatically adds Bearer token to all requests if available
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
 * Automatically logs out user if token is invalid or expired
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
 */
export const authAPI = {
  /**
   * Register a new user
   * @param data User registration data
   * @returns API response with token and user data
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
   * @param data User login credentials
   * @returns API response with token and user data
   */
  login: async (data: { email: string; password: string }) => {
    const response = await api.post("/auth/login", data);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response;
  },

  /**
   * Get current authenticated user's data
   * @returns API response with user data
   */
  getCurrentUser: () => api.get("/auth/me"),

  /**
   * Logout current user
   * Clears token from storage and resets auth state
   */
  logout: () => {
    localStorage.removeItem("token");
    store.dispatch(logout());
  }
};

/**
 * Forum API endpoints
 */
export const forumAPI = {
  getAll: () => api.get("/forums"),
  getById: (id: number) => api.get(`/forums/${id}`),
  create: (data: { title: string; description: string; tags?: string[] }) =>
    api.post("/forums", data),
  update: (id: number, data: { title: string; description: string; tags?: string[] }) =>
    api.put(`/forums/${id}`, data),
  delete: (id: number) => api.delete(`/forums/${id}`),
  like: (id: number) => api.post(`/forums/${id}/like`),
};

/**
 * Comment API endpoints
 */
export const commentAPI = {
  getByForum: (forumId: number) => api.get(`/comments/forum/${forumId}`),
  create: (forumId: number, data: { content: string }) =>
    api.post(`/comments/forum/${forumId}`, data),
  update: (id: number, data: { content: string }) =>
    api.put(`/comments/${id}`, data),
  delete: (id: number) => api.delete(`/comments/${id}`),
  like: (id: number) => api.post(`/comments/${id}/like`),
};

export default api;