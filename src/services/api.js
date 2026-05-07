import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smartshelf_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('smartshelf_token');
      localStorage.removeItem('smartshelf_user');
      localStorage.removeItem('smartshelf_retailer');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============ AUTH ENDPOINTS ============
export const auth = {
  register: (data) => api.post('/auth/register', data),
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
  me: () => api.get('/auth/me'),
};

// ============ RETAILER ENDPOINTS ============
export const retailer = {
  getAll: (params) => api.get('/retailers', { params }),
  getStore: (slug) => api.get(`/store/${slug}`),
  getProfile: () => api.get('/retailer/profile'),
  updateProfile: (data) => api.put('/retailer/profile', data),
};

// ============ CATEGORIES ENDPOINTS ============
export const categories = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// ============ PRODUCTS ENDPOINTS ============
export const products = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  updateStock: (id, quantity, note = '') => api.patch(`/products/${id}/stock`, { quantity, note }),
  getStockHistory: (id, page = 1) => api.get(`/products/${id}/stock-history`, { params: { page } }),
  getDashboard: () => api.get('/dashboard'),
  getPublicProducts: (slug, params = {}) => api.get(`/store/${slug}/products`, { params }),
};

export default api;