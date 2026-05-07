// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
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
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      // Token expired or invalid
      if (status === 401) {
        localStorage.removeItem('smartshelf_token');
        localStorage.removeItem('smartshelf_user');
        localStorage.removeItem('smartshelf_retailer');
        window.location.href = '/login';
      }
      
      // Log other errors
      console.error('API Error:', { status, data });
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// ============ AUTH ENDPOINTS ============
export const auth = {
  /**
   * Register a new retailer account
   * @param {Object} data - { name, email, password, password_confirmation, store_name, suburb, state, postcode, phone }
   */
  register: (data) => api.post('/auth/register', data),
  
  /**
   * Login with email and password
   * @param {string} email 
   * @param {string} password 
   */
  login: (email, password) => api.post('/auth/login', { email, password }),
  
  /**
   * Logout current user
   */
  logout: () => api.post('/auth/logout'),
  
  /**
   * Refresh JWT token
   */
  refresh: () => api.post('/auth/refresh'),
  
  /**
   * Get current authenticated user
   */
  me: () => api.get('/auth/me'),
};

// ============ RETAILER ENDPOINTS ============
export const retailer = {
  /**
   * Get all active retailers (public)
   * @param {Object} params - { search, suburb, page }
   */
  getAll: (params = {}) => api.get('/retailers', { params }),
  
  /**
   * Get public storefront by slug
   * @param {string} slug 
   */
  getStore: (slug) => api.get(`/store/${slug}`),
  
  /**
   * Get authenticated retailer's profile
   */
  getProfile: () => api.get('/retailer/profile'),
  
  /**
   * Update authenticated retailer's profile
   * @param {Object} data 
   */
  updateProfile: (data) => api.put('/retailer/profile', data),
};

// ============ CATEGORIES ENDPOINTS ============
export const categories = {
  /**
   * Get all categories for authenticated retailer
   */
  getAll: () => api.get('/categories'),
  
  /**
   * Get single category by ID
   * @param {number} id 
   */
  getById: (id) => api.get(`/categories/${id}`),
  
  /**
   * Create new category
   * @param {Object} data - { name, sort_order }
   */
  create: (data) => api.post('/categories', data),
  
  /**
   * Update category
   * @param {number} id 
   * @param {Object} data - { name, sort_order }
   */
  update: (id, data) => api.put(`/categories/${id}`, data),
  
  /**
   * Delete category
   * @param {number} id 
   */
  delete: (id) => api.delete(`/categories/${id}`),
};

// ============ PRODUCTS ENDPOINTS ============
export const products = {
  /**
   * Get all products for authenticated retailer
   * @param {Object} params - { search, category_id, low_stock, out_of_stock, page, per_page }
   */
  getAll: (params = {}) => api.get('/products', { params }),
  
  /**
   * Get single product by ID
   * @param {number} id 
   */
  getById: (id) => api.get(`/products/${id}`),
  
  /**
   * Create new product
   * @param {Object} data - { name, description, category_id, price, stock_quantity, low_stock_threshold, expiry_date, image_url, is_visible }
   */
  create: (data) => api.post('/products', data),
  
  /**
   * Update product
   * @param {number} id 
   * @param {Object} data 
   */
  update: (id, data) => api.put(`/products/${id}`, data),
  
  /**
   * Delete product
   * @param {number} id 
   */
  delete: (id) => api.delete(`/products/${id}`),
  
  /**
   * Update stock quantity
   * @param {number} id 
   * @param {number} quantity 
   * @param {string} note 
   */
  updateStock: (id, quantity, note = '') => api.patch(`/products/${id}/stock`, { quantity, note }),
  
  /**
   * Get stock history for product
   * @param {number} id 
   * @param {number} page 
   */
  getStockHistory: (id, page = 1) => api.get(`/products/${id}/stock-history`, { params: { page } }),
  
  /**
   * Get dashboard overview
   */
  getDashboard: () => api.get('/dashboard'),
  
  /**
   * Get public products for storefront
   * @param {string} slug 
   * @param {Object} params - { search, category_id, page }
   */
  getPublicProducts: (slug, params = {}) => api.get(`/store/${slug}/products`, { params }),
};

// Default export
export default api;