import axios from "axios";
import { store } from "../redux/store";
import { logout } from "../redux/slices/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let isRefreshing = false;
let failedQueue: any[] = [];

// Store last visited page
const saveLastPage = () => {
  localStorage.setItem("lastPage", window.location.pathname);
};

// Restore last visited page
const getLastPage = () => localStorage.getItem("lastPage") || "/";

// Process queued requests
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Attach token to requests
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

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized (401) and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        try {
          const token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token available");
        }

        // Try to get current user to validate token
        await authAPI.getCurrentUser();

        processQueue(null, token);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(logout());
        localStorage.removeItem("token");

        // Save last visited page before redirecting
        saveLastPage();

        // Redirect to login, but return to the same page after login
        window.location.href = `/login?redirect=${getLastPage()}`;
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  getCurrentUser: () => api.get("/auth/me"),
};

// Forum endpoints
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

// Comment endpoints
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