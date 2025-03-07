import axios from 'axios';
import { store } from '../redux/store';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch({ type: 'auth/logout' });
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

// Forum endpoints
export const forumAPI = {
  getAll: () => api.get('/forums'),
  getById: (id: number) => api.get(`/forums/${id}`),
  create: (data: { title: string; description: string; tags?: string[] }) =>
    api.post('/forums', data),
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