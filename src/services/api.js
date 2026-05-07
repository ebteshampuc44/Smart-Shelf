// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const USE_DUMMY_DATA = true; // Set to false when backend is ready

// Dummy Data
const dummyUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'demo@smartshelf.com.au',
    password: 'password123',
    role: 'retailer',
    created_at: '2024-01-15T08:00:00Z',
  }
];

const dummyRetailers = [
  {
    id: 1,
    user_id: 1,
    store_name: 'Fresh Mart Sydney',
    slug: 'fresh-mart-sydney',
    description: 'Your local fresh produce market. We bring the best quality fruits and vegetables directly from farms.',
    suburb: 'Parramatta',
    state: 'NSW',
    postcode: '2150',
    phone: '(02) 9876 5432',
    trading_hours: {
      mon: '8:00am – 6:00pm',
      tue: '8:00am – 6:00pm',
      wed: '8:00am – 6:00pm',
      thu: '8:00am – 6:00pm',
      fri: '8:00am – 6:00pm',
      sat: '8:00am – 4:00pm',
      sun: '10:00am – 2:00pm',
    },
    logo_url: null,
    is_active: true,
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-01-15T08:00:00Z',
  }
];

const dummyCategories = [
  { id: 1, retailer_id: 1, name: 'Fresh Produce', sort_order: 0, products_count: 8 },
  { id: 2, retailer_id: 1, name: 'Dairy & Eggs', sort_order: 1, products_count: 5 },
  { id: 3, retailer_id: 1, name: 'Bakery', sort_order: 2, products_count: 4 },
  { id: 4, retailer_id: 1, name: 'Beverages', sort_order: 3, products_count: 6 },
  { id: 5, retailer_id: 1, name: 'Snacks', sort_order: 4, products_count: 5 },
  { id: 6, retailer_id: 1, name: 'Household', sort_order: 5, products_count: 3 },
];

const dummyProducts = [
  {
    id: 1,
    retailer_id: 1,
    category_id: 1,
    name: 'Fresh Strawberries',
    description: 'Sweet and juicy Australian grown strawberries. Perfect for desserts or healthy snacks.',
    price: 4.99,
    stock_quantity: 25,
    low_stock_threshold: 10,
    expiry_date: '2025-05-20',
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 1, name: 'Fresh Produce' },
    created_at: '2024-02-10T10:00:00Z',
    updated_at: '2024-05-10T14:30:00Z',
  },
  {
    id: 2,
    retailer_id: 1,
    category_id: 1,
    name: 'Organic Bananas',
    description: 'Certified organic bananas from Far North Queensland.',
    price: 3.49,
    stock_quantity: 8,
    low_stock_threshold: 10,
    expiry_date: '2025-05-12',
    image_url: null,
    is_visible: true,
    is_low_stock: true,
    in_stock: true,
    category: { id: 1, name: 'Fresh Produce' },
    created_at: '2024-02-15T10:00:00Z',
    updated_at: '2024-05-11T09:15:00Z',
  },
  {
    id: 3,
    retailer_id: 1,
    category_id: 1,
    name: 'Red Apples',
    description: 'Crisp and sweet Red Delicious apples.',
    price: 5.99,
    stock_quantity: 0,
    low_stock_threshold: 10,
    expiry_date: '2025-05-18',
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: false,
    category: { id: 1, name: 'Fresh Produce' },
    created_at: '2024-03-01T10:00:00Z',
    updated_at: '2024-05-09T16:20:00Z',
  },
  {
    id: 4,
    retailer_id: 1,
    category_id: 2,
    name: 'Free Range Eggs (12pk)',
    description: 'Barn-laid free range eggs from happy hens.',
    price: 7.99,
    stock_quantity: 15,
    low_stock_threshold: 8,
    expiry_date: '2025-05-25',
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 2, name: 'Dairy & Eggs' },
    created_at: '2024-03-10T10:00:00Z',
    updated_at: '2024-05-10T11:00:00Z',
  },
  {
    id: 5,
    retailer_id: 1,
    category_id: 2,
    name: 'Full Cream Milk (2L)',
    description: 'Fresh full cream milk from local dairy.',
    price: 3.99,
    stock_quantity: 6,
    low_stock_threshold: 8,
    expiry_date: '2025-05-14',
    image_url: null,
    is_visible: true,
    is_low_stock: true,
    in_stock: true,
    category: { id: 2, name: 'Dairy & Eggs' },
    created_at: '2024-03-15T10:00:00Z',
    updated_at: '2024-05-11T08:45:00Z',
  },
  {
    id: 6,
    retailer_id: 1,
    category_id: 2,
    name: 'Greek Yogurt (1kg)',
    description: 'Thick and creamy Greek style yogurt.',
    price: 5.49,
    stock_quantity: 12,
    low_stock_threshold: 6,
    expiry_date: '2025-05-19',
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 2, name: 'Dairy & Eggs' },
    created_at: '2024-03-20T10:00:00Z',
    updated_at: '2024-05-09T14:00:00Z',
  },
  {
    id: 7,
    retailer_id: 1,
    category_id: 3,
    name: 'Sourdough Bread',
    description: 'Artisan sourdough bread baked fresh daily.',
    price: 6.99,
    stock_quantity: 3,
    low_stock_threshold: 5,
    expiry_date: '2025-05-13',
    image_url: null,
    is_visible: true,
    is_low_stock: true,
    in_stock: true,
    category: { id: 3, name: 'Bakery' },
    created_at: '2024-03-25T10:00:00Z',
    updated_at: '2024-05-11T07:30:00Z',
  },
  {
    id: 8,
    retailer_id: 1,
    category_id: 3,
    name: 'Wholemeal Wraps (8pk)',
    description: 'Soft wholemeal wraps, perfect for lunches.',
    price: 4.49,
    stock_quantity: 20,
    low_stock_threshold: 8,
    expiry_date: '2025-05-22',
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 3, name: 'Bakery' },
    created_at: '2024-04-01T10:00:00Z',
    updated_at: '2024-05-08T12:00:00Z',
  },
  {
    id: 9,
    retailer_id: 1,
    category_id: 4,
    name: 'Orange Juice (1L)',
    description: 'Freshly squeezed orange juice, no added sugar.',
    price: 4.99,
    stock_quantity: 18,
    low_stock_threshold: 10,
    expiry_date: '2025-05-16',
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 4, name: 'Beverages' },
    created_at: '2024-04-05T10:00:00Z',
    updated_at: '2024-05-10T09:00:00Z',
  },
  {
    id: 10,
    retailer_id: 1,
    category_id: 4,
    name: 'Sparkling Water (1.25L)',
    description: 'Refreshing sparkling mineral water.',
    price: 2.49,
    stock_quantity: 30,
    low_stock_threshold: 15,
    expiry_date: null,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 4, name: 'Beverages' },
    created_at: '2024-04-10T10:00:00Z',
    updated_at: '2024-05-07T15:00:00Z',
  },
  {
    id: 11,
    retailer_id: 1,
    category_id: 5,
    name: 'Potato Chips (150g)',
    description: 'Sea salt flavoured kettle cooked chips.',
    price: 3.99,
    stock_quantity: 5,
    low_stock_threshold: 10,
    expiry_date: '2025-06-01',
    image_url: null,
    is_visible: true,
    is_low_stock: true,
    in_stock: true,
    category: { id: 5, name: 'Snacks' },
    created_at: '2024-04-15T10:00:00Z',
    updated_at: '2024-05-11T10:00:00Z',
  },
  {
    id: 12,
    retailer_id: 1,
    category_id: 5,
    name: 'Mixed Nuts (500g)',
    description: 'Healthy mix of almonds, cashews and walnuts.',
    price: 12.99,
    stock_quantity: 7,
    low_stock_threshold: 8,
    expiry_date: '2025-06-15',
    image_url: null,
    is_visible: true,
    is_low_stock: true,
    in_stock: true,
    category: { id: 5, name: 'Snacks' },
    created_at: '2024-04-20T10:00:00Z',
    updated_at: '2024-05-09T13:00:00Z',
  },
];

const dummyStockHistory = [
  { id: 1, product_id: 1, previous_quantity: 20, new_quantity: 25, change: 5, note: 'Restocked', created_at: '2024-05-10T14:30:00Z' },
  { id: 2, product_id: 2, previous_quantity: 12, new_quantity: 8, change: -4, note: 'Sold', created_at: '2024-05-11T09:15:00Z' },
  { id: 3, product_id: 5, previous_quantity: 10, new_quantity: 6, change: -4, note: 'Sold', created_at: '2024-05-11T08:45:00Z' },
];

// Helper to initialize localStorage with dummy data
export const initializeDummyData = () => {
  if (!localStorage.getItem('smartshelf_users')) {
    localStorage.setItem('smartshelf_users', JSON.stringify(dummyUsers));
  }
  if (!localStorage.getItem('smartshelf_retailers')) {
    localStorage.setItem('smartshelf_retailers', JSON.stringify(dummyRetailers));
  }
  if (!localStorage.getItem('smartshelf_categories')) {
    localStorage.setItem('smartshelf_categories', JSON.stringify(dummyCategories));
  }
  if (!localStorage.getItem('smartshelf_products')) {
    localStorage.setItem('smartshelf_products', JSON.stringify(dummyProducts));
  }
  if (!localStorage.getItem('smartshelf_stock_history')) {
    localStorage.setItem('smartshelf_stock_history', JSON.stringify(dummyStockHistory));
  }
};

// Dummy API Service
const dummyApi = {
  // Auth
  register: async (data) => {
    const users = JSON.parse(localStorage.getItem('smartshelf_users') || '[]');
    const exists = users.find(u => u.email === data.email);
    if (exists) throw { response: { data: { message: 'Email already exists' }, status: 422 } };
    
    const newUser = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'retailer',
      created_at: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem('smartshelf_users', JSON.stringify(users));
    
    const newRetailer = {
      id: Date.now(),
      user_id: newUser.id,
      store_name: data.store_name,
      slug: data.store_name.toLowerCase().replace(/\s+/g, '-'),
      description: '',
      suburb: data.suburb,
      state: data.state,
      postcode: data.postcode,
      phone: data.phone || '',
      trading_hours: { mon: '9am-5pm', tue: '9am-5pm', wed: '9am-5pm', thu: '9am-5pm', fri: '9am-5pm', sat: '9am-1pm', sun: 'Closed' },
      is_active: true,
      created_at: new Date().toISOString(),
    };
    const retailers = JSON.parse(localStorage.getItem('smartshelf_retailers') || '[]');
    retailers.push(newRetailer);
    localStorage.setItem('smartshelf_retailers', JSON.stringify(retailers));
    
    const token = 'dummy_jwt_token_' + Date.now();
    localStorage.setItem('smartshelf_token', token);
    
    return {
      data: {
        success: true,
        token,
        token_type: 'bearer',
        expires_in: 86400,
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
        retailer: newRetailer,
      }
    };
  },
  
  login: async (email, password) => {
    const users = JSON.parse(localStorage.getItem('smartshelf_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw { response: { data: { message: 'Invalid email or password.' }, status: 401 } };
    
    const retailers = JSON.parse(localStorage.getItem('smartshelf_retailers') || '[]');
    const retailer = retailers.find(r => r.user_id === user.id);
    
    const token = 'dummy_jwt_token_' + Date.now();
    localStorage.setItem('smartshelf_token', token);
    localStorage.setItem('smartshelf_user', JSON.stringify(user));
    localStorage.setItem('smartshelf_retailer', JSON.stringify(retailer));
    
    return {
      data: {
        success: true,
        token,
        token_type: 'bearer',
        expires_in: 86400,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        retailer,
      }
    };
  },
  
  logout: async () => {
    localStorage.removeItem('smartshelf_token');
    localStorage.removeItem('smartshelf_user');
    localStorage.removeItem('smartshelf_retailer');
    return { data: { success: true, message: 'Logged out' } };
  },
  
  me: async () => {
    const user = JSON.parse(localStorage.getItem('smartshelf_user'));
    const retailer = JSON.parse(localStorage.getItem('smartshelf_retailer'));
    if (!user) throw { response: { status: 401 } };
    return { data: { success: true, user, retailer } };
  },
  
  // Categories
  getCategories: async () => {
    const categories = JSON.parse(localStorage.getItem('smartshelf_categories') || '[]');
    const retailer = JSON.parse(localStorage.getItem('smartshelf_retailer'));
    const userCategories = categories.filter(c => c.retailer_id === retailer?.id);
    const products = JSON.parse(localStorage.getItem('smartshelf_products') || '[]');
    const withCount = userCategories.map(c => ({
      ...c,
      products_count: products.filter(p => p.category_id === c.id).length
    }));
    return { data: { success: true, data: withCount } };
  },
  
  createCategory: async (data) => {
    const categories = JSON.parse(localStorage.getItem('smartshelf_categories') || '[]');
    const retailer = JSON.parse(localStorage.getItem('smartshelf_retailer'));
    const newCategory = {
      id: Date.now(),
      retailer_id: retailer.id,
      name: data.name,
      sort_order: data.sort_order || 0,
      created_at: new Date().toISOString(),
    };
    categories.push(newCategory);
    localStorage.setItem('smartshelf_categories', JSON.stringify(categories));
    return { data: { success: true, data: newCategory } };
  },
  
  updateCategory: async (id, data) => {
    const categories = JSON.parse(localStorage.getItem('smartshelf_categories') || '[]');
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...data, updated_at: new Date().toISOString() };
      localStorage.setItem('smartshelf_categories', JSON.stringify(categories));
    }
    return { data: { success: true, data: categories[index] } };
  },
  
  deleteCategory: async (id) => {
    const categories = JSON.parse(localStorage.getItem('smartshelf_categories') || '[]');
    const filtered = categories.filter(c => c.id !== id);
    localStorage.setItem('smartshelf_categories', JSON.stringify(filtered));
    
    const products = JSON.parse(localStorage.getItem('smartshelf_products') || '[]');
    const updatedProducts = products.map(p => p.category_id === id ? { ...p, category_id: null } : p);
    localStorage.setItem('smartshelf_products', JSON.stringify(updatedProducts));
    
    return { data: { success: true } };
  },
  
  // Products
  getProducts: async (params = {}) => {
    let products = JSON.parse(localStorage.getItem('smartshelf_products') || '[]');
    const retailer = JSON.parse(localStorage.getItem('smartshelf_retailer'));
    let filtered = products.filter(p => p.retailer_id === retailer?.id);
    
    if (params.category_id) {
      filtered = filtered.filter(p => p.category_id === parseInt(params.category_id));
    }
    if (params.search) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(params.search.toLowerCase()));
    }
    if (params.low_stock) {
      filtered = filtered.filter(p => p.is_low_stock);
    }
    if (params.out_of_stock) {
      filtered = filtered.filter(p => p.stock_quantity === 0);
    }
    
    const categories = JSON.parse(localStorage.getItem('smartshelf_categories') || '[]');
    const withCategory = filtered.map(p => ({
      ...p,
      category: categories.find(c => c.id === p.category_id) || null,
      is_low_stock: p.stock_quantity <= p.low_stock_threshold && p.stock_quantity > 0,
      in_stock: p.stock_quantity > 0,
    }));
    
    return { data: { success: true, data: { data: withCategory, total: withCategory.length } } };
  },
  
  createProduct: async (data) => {
    const products = JSON.parse(localStorage.getItem('smartshelf_products') || '[]');
    const retailer = JSON.parse(localStorage.getItem('smartshelf_retailer'));
    const newProduct = {
      id: Date.now(),
      retailer_id: retailer.id,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    products.push(newProduct);
    localStorage.setItem('smartshelf_products', JSON.stringify(products));
    
    // Add stock history
    const history = JSON.parse(localStorage.getItem('smartshelf_stock_history') || '[]');
    history.push({
      id: Date.now(),
      product_id: newProduct.id,
      previous_quantity: 0,
      new_quantity: data.stock_quantity,
      change: data.stock_quantity,
      note: 'Initial stock',
      created_at: new Date().toISOString(),
    });
    localStorage.setItem('smartshelf_stock_history', JSON.stringify(history));
    
    const categories = JSON.parse(localStorage.getItem('smartshelf_categories') || '[]');
    return { data: { success: true, data: { ...newProduct, category: categories.find(c => c.id === data.category_id) } } };
  },
  
  updateProduct: async (id, data) => {
    const products = JSON.parse(localStorage.getItem('smartshelf_products') || '[]');
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...data, updated_at: new Date().toISOString() };
      localStorage.setItem('smartshelf_products', JSON.stringify(products));
    }
    const categories = JSON.parse(localStorage.getItem('smartshelf_categories') || '[]');
    return { data: { success: true, data: { ...products[index], category: categories.find(c => c.id === products[index]?.category_id) } } };
  },
  
  deleteProduct: async (id) => {
    const products = JSON.parse(localStorage.getItem('smartshelf_products') || '[]');
    const filtered = products.filter(p => p.id !== id);
    localStorage.setItem('smartshelf_products', JSON.stringify(filtered));
    return { data: { success: true } };
  },
  
  updateStock: async (id, quantity, note) => {
    const products = JSON.parse(localStorage.getItem('smartshelf_products') || '[]');
    const index = products.findIndex(p => p.id === id);
    let previous = 0;
    if (index !== -1) {
      previous = products[index].stock_quantity;
      products[index].stock_quantity = quantity;
      products[index].updated_at = new Date().toISOString();
      localStorage.setItem('smartshelf_products', JSON.stringify(products));
    }
    
    const history = JSON.parse(localStorage.getItem('smartshelf_stock_history') || '[]');
    history.push({
      id: Date.now(),
      product_id: id,
      previous_quantity: previous,
      new_quantity: quantity,
      change: quantity - previous,
      note: note || 'Stock updated',
      created_at: new Date().toISOString(),
    });
    localStorage.setItem('smartshelf_stock_history', JSON.stringify(history));
    
    const categories = JSON.parse(localStorage.getItem('smartshelf_categories') || '[]');
    return { data: { success: true, data: { ...products[index], category: categories.find(c => c.id === products[index]?.category_id) } } };
  },
  
  getDashboard: async () => {
    const retailer = JSON.parse(localStorage.getItem('smartshelf_retailer'));
    const products = JSON.parse(localStorage.getItem('smartshelf_products') || '[]');
    const myProducts = products.filter(p => p.retailer_id === retailer?.id);
    
    const total = myProducts.length;
    const lowStock = myProducts.filter(p => p.stock_quantity <= p.low_stock_threshold && p.stock_quantity > 0).length;
    const outOfStock = myProducts.filter(p => p.stock_quantity === 0).length;
    
    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);
    
    const expiringSoon = myProducts.filter(p => p.expiry_date && new Date(p.expiry_date) <= sevenDaysLater && new Date(p.expiry_date) >= today);
    const recentlyUpdated = [...myProducts].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)).slice(0, 5);
    
    return {
      data: {
        success: true,
        data: { total_products: total, low_stock_count: lowStock, out_of_stock: outOfStock, expiring_soon: expiringSoon, recently_updated: recentlyUpdated }
      }
    };
  },
  
  // Retailer
  getProfile: async () => {
    const retailer = JSON.parse(localStorage.getItem('smartshelf_retailer'));
    return { data: { success: true, data: retailer } };
  },
  
  updateProfile: async (data) => {
    const retailers = JSON.parse(localStorage.getItem('smartshelf_retailers') || '[]');
    const retailer = JSON.parse(localStorage.getItem('smartshelf_retailer'));
    const index = retailers.findIndex(r => r.id === retailer.id);
    if (index !== -1) {
      retailers[index] = { ...retailers[index], ...data, updated_at: new Date().toISOString() };
      localStorage.setItem('smartshelf_retailers', JSON.stringify(retailers));
      localStorage.setItem('smartshelf_retailer', JSON.stringify(retailers[index]));
    }
    return { data: { success: true, data: retailers[index] } };
  },
  
  getStore: async (slug) => {
    const retailers = JSON.parse(localStorage.getItem('smartshelf_retailers') || '[]');
    const retailer = retailers.find(r => r.slug === slug);
    if (!retailer) throw { response: { status: 404 } };
    return { data: { success: true, data: retailer } };
  },
  
  getPublicProducts: async (slug, params = {}) => {
    const retailers = JSON.parse(localStorage.getItem('smartshelf_retailers') || '[]');
    const retailer = retailers.find(r => r.slug === slug);
    let products = JSON.parse(localStorage.getItem('smartshelf_products') || '[]');
    let myProducts = products.filter(p => p.retailer_id === retailer?.id && p.is_visible);
    
    if (params.category_id) {
      myProducts = myProducts.filter(p => p.category_id === parseInt(params.category_id));
    }
    if (params.search) {
      myProducts = myProducts.filter(p => p.name.toLowerCase().includes(params.search.toLowerCase()));
    }
    
    const categories = JSON.parse(localStorage.getItem('smartshelf_categories') || '[]');
    const withCategory = myProducts.map(p => ({
      ...p,
      category: categories.find(c => c.id === p.category_id) || null,
      is_low_stock: p.stock_quantity <= p.low_stock_threshold && p.stock_quantity > 0,
    }));
    
    return { data: { success: true, retailer, data: { data: withCategory } } };
  },
};

// Real API Service
const realApi = {
  auth: {
    register: (data) => axios.post(`${API_BASE_URL}/auth/register`, data),
    login: (email, password) => axios.post(`${API_BASE_URL}/auth/login`, { email, password }),
    logout: () => axios.post(`${API_BASE_URL}/auth/logout`),
    refresh: () => axios.post(`${API_BASE_URL}/auth/refresh`),
    me: () => axios.get(`${API_BASE_URL}/auth/me`),
  },
  categories: {
    getAll: () => axios.get(`${API_BASE_URL}/categories`),
    getById: (id) => axios.get(`${API_BASE_URL}/categories/${id}`),
    create: (data) => axios.post(`${API_BASE_URL}/categories`, data),
    update: (id, data) => axios.put(`${API_BASE_URL}/categories/${id}`, data),
    delete: (id) => axios.delete(`${API_BASE_URL}/categories/${id}`),
  },
  products: {
    getAll: (params) => axios.get(`${API_BASE_URL}/products`, { params }),
    getById: (id) => axios.get(`${API_BASE_URL}/products/${id}`),
    create: (data) => axios.post(`${API_BASE_URL}/products`, data),
    update: (id, data) => axios.put(`${API_BASE_URL}/products/${id}`, data),
    delete: (id) => axios.delete(`${API_BASE_URL}/products/${id}`),
    updateStock: (id, quantity, note) => axios.patch(`${API_BASE_URL}/products/${id}/stock`, { quantity, note }),
    getStockHistory: (id, page) => axios.get(`${API_BASE_URL}/products/${id}/stock-history`, { params: { page } }),
    getDashboard: () => axios.get(`${API_BASE_URL}/dashboard`),
    getPublicProducts: (slug, params) => axios.get(`${API_BASE_URL}/store/${slug}/products`, { params }),
  },
  retailer: {
    getAll: (params) => axios.get(`${API_BASE_URL}/retailers`, { params }),
    getStore: (slug) => axios.get(`${API_BASE_URL}/store/${slug}`),
    getProfile: () => axios.get(`${API_BASE_URL}/retailer/profile`),
    updateProfile: (data) => axios.put(`${API_BASE_URL}/retailer/profile`, data),
  },
};

// Choose which API to use
const apiService = USE_DUMMY_DATA ? dummyApi : realApi;

// Export with same interface
export const auth = {
  register: (data) => apiService.register(data),
  login: (email, password) => apiService.login(email, password),
  logout: () => apiService.logout(),
  refresh: () => apiService.refresh ? apiService.refresh() : Promise.resolve({ data: {} }),
  me: () => apiService.me(),
};

export const categories = {
  getAll: () => apiService.getCategories(),
  getById: (id) => apiService.getCategoryById ? apiService.getCategoryById(id) : apiService.getCategories().then(res => ({ data: { data: res.data.data.find(c => c.id === id) } })),
  create: (data) => apiService.createCategory(data),
  update: (id, data) => apiService.updateCategory(id, data),
  delete: (id) => apiService.deleteCategory(id),
};

export const products = {
  getAll: (params) => apiService.getProducts(params),
  getById: (id) => apiService.getProductById ? apiService.getProductById(id) : apiService.getProducts().then(res => ({ data: { data: res.data.data.data.find(p => p.id === id) } })),
  create: (data) => apiService.createProduct(data),
  update: (id, data) => apiService.updateProduct(id, data),
  delete: (id) => apiService.deleteProduct(id),
  updateStock: (id, quantity, note) => apiService.updateStock(id, quantity, note),
  getStockHistory: (id, page) => apiService.getStockHistory ? apiService.getStockHistory(id, page) : Promise.resolve({ data: { data: [] } }),
  getDashboard: () => apiService.getDashboard(),
  getPublicProducts: (slug, params) => apiService.getPublicProducts(slug, params),
};

export const retailer = {
  getAll: (params) => apiService.getAllRetailers ? apiService.getAllRetailers(params) : Promise.resolve({ data: { data: [] } }),
  getStore: (slug) => apiService.getStore(slug),
  getProfile: () => apiService.getProfile(),
  updateProfile: (data) => apiService.updateProfile(data),
};

export default { auth, categories, products, retailer };