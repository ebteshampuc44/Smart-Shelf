// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const USE_DUMMY_DATA = true; // Set to false when backend is ready

// Dummy Data from your database
const dummyUsers = [
  {
    id: 1,
    name: 'Demo Retailer',
    email: 'demo@smartshelf.com.au',
    password: 'password123',
    role: 'retailer',
    created_at: '2024-01-15T08:00:00Z',
  },
  {
    id: 2,
    name: 'Maria Nguyen',
    email: 'maria@example.com.au',
    password: 'password123',
    role: 'retailer',
    created_at: '2024-02-01T08:00:00Z',
  }
];

const dummyRetailers = [
  {
    id: 'b63707a3-409f-4ee0-830f-b357facc58a1',
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
  },
  {
    id: 'a17137b7-4089-4f14-a9cf-37fa08334173',
    user_id: 2,
    store_name: "Maria's Fresh Produce",
    slug: 'marias-fresh-produce',
    description: 'Fresh fruit and vegetables, direct from local farms.',
    suburb: 'Cabramatta',
    state: 'NSW',
    postcode: '2166',
    phone: '(02) 9000 1234',
    trading_hours: {
      mon: '7:00am – 6:00pm',
      tue: '7:00am – 6:00pm',
      wed: '7:00am – 6:00pm',
      thu: '7:00am – 6:00pm',
      fri: '7:00am – 6:00pm',
      sat: '7:00am – 4:00pm',
      sun: 'Closed',
    },
    logo_url: null,
    is_active: true,
    created_at: '2024-02-01T08:00:00Z',
    updated_at: '2024-02-01T08:00:00Z',
  }
];

// Categories from your database
const dummyCategories = [
  // Fresh Mart Sydney Categories (retailer_id: b63707a3-409f-4ee0-830f-b357facc58a1)
  { id: 1, retailer_id: 'b63707a3-409f-4ee0-830f-b357facc58a1', name: 'Fresh Produce', sort_order: 0, products_count: 0 },
  { id: 2, retailer_id: 'b63707a3-409f-4ee0-830f-b357facc58a1', name: 'Dairy', sort_order: 1, products_count: 0 },
  { id: 3, retailer_id: 'b63707a3-409f-4ee0-830f-b357facc58a1', name: 'Dry Goods', sort_order: 2, products_count: 0 },
  { id: 4, retailer_id: 'b63707a3-409f-4ee0-830f-b357facc58a1', name: 'Bakery', sort_order: 3, products_count: 0 },
  { id: 5, retailer_id: 'b63707a3-409f-4ee0-830f-b357facc58a1', name: 'Beverages', sort_order: 4, products_count: 0 },
  { id: 6, retailer_id: 'b63707a3-409f-4ee0-830f-b357facc58a1', name: 'Meat & Seafood', sort_order: 5, products_count: 0 },
  { id: 7, retailer_id: 'b63707a3-409f-4ee0-830f-b357facc58a1', name: 'Deli & Cheese', sort_order: 6, products_count: 0 },
  { id: 8, retailer_id: 'b63707a3-409f-4ee0-830f-b357facc58a1', name: 'Pantry', sort_order: 7, products_count: 0 },
  
  // Maria's Fresh Produce Categories (retailer_id: a17137b7-4089-4f14-a9cf-37fa08334173)
  { id: 9, retailer_id: 'a17137b7-4089-4f14-a9cf-37fa08334173', name: 'Fresh Produce', sort_order: 0, products_count: 0 },
  { id: 10, retailer_id: 'a17137b7-4089-4f14-a9cf-37fa08334173', name: 'Dairy', sort_order: 1, products_count: 0 },
  { id: 11, retailer_id: 'a17137b7-4089-4f14-a9cf-37fa08334173', name: 'Dry Goods', sort_order: 2, products_count: 0 },
  { id: 12, retailer_id: 'a17137b7-4089-4f14-a9cf-37fa08334173', name: 'Bakery', sort_order: 3, products_count: 0 },
  { id: 13, retailer_id: 'a17137b7-4089-4f14-a9cf-37fa08334173', name: 'Beverages', sort_order: 4, products_count: 0 },
  { id: 14, retailer_id: 'a17137b7-4089-4f14-a9cf-37fa08334173', name: 'Meat & Seafood', sort_order: 5, products_count: 0 },
  { id: 15, retailer_id: 'a17137b7-4089-4f14-a9cf-37fa08334173', name: 'Deli & Cheese', sort_order: 6, products_count: 0 },
  { id: 16, retailer_id: 'a17137b7-4089-4f14-a9cf-37fa08334173', name: 'Pantry', sort_order: 7, products_count: 0 },
];

// Products from your database
const dummyProducts = [
  // Fresh Mart Sydney Products (retailer_id: b63707a3-409f-4ee0-830f-b357facc58a1)
  {
    id: '5c69c688-1810-4c55-8d01-5c5316154346',
    retailer_id: 'b63707a3-409f-4ee0-830f-b357facc58a1',
    category_id: 1,
    name: 'Granny Smith Apples',
    description: 'Crisp Australian-grown apples, sold per kg.',
    price: 3.99,
    unit: 'kg',
    sku: 'FP-001',
    stock_quantity: 45,
    low_stock_threshold: 10,
    expiry_date: '2026-05-07',
    expiry_warning_days: 2,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 1, name: 'Fresh Produce' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: '2c292a2b-74ea-4bcb-8d67-f954a4b232b1',
    retailer_id: 'b63707a3-409f-4ee0-830f-b357facc58a1',
    category_id: 1,
    name: 'Heirloom Tomatoes',
    description: 'Mixed heirloom tomatoes from the Hunter Valley.',
    price: 6.50,
    unit: 'kg',
    sku: 'FP-002',
    stock_quantity: 3,
    low_stock_threshold: 5,
    expiry_date: '2026-05-04',
    expiry_warning_days: 2,
    image_url: null,
    is_visible: true,
    is_low_stock: true,
    in_stock: true,
    category: { id: 1, name: 'Fresh Produce' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: '95cfbac8-0c04-4c56-ae35-b112df66f775',
    retailer_id: 'b63707a3-409f-4ee0-830f-b357facc58a1',
    category_id: 1,
    name: 'Baby Spinach',
    description: 'Pre-washed 200g bags.',
    price: 3.50,
    unit: 'bag',
    sku: 'FP-003',
    stock_quantity: 12,
    low_stock_threshold: 5,
    expiry_date: '2026-05-03',
    expiry_warning_days: 1,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 1, name: 'Fresh Produce' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: 'dc0eee32-15e8-4967-a566-acf54d5ec8de',
    retailer_id: 'b63707a3-409f-4ee0-830f-b357facc58a1',
    category_id: 1,
    name: 'Cavendish Bananas',
    description: 'Ripe and ready, sold per kg.',
    price: 2.99,
    unit: 'kg',
    sku: 'FP-004',
    stock_quantity: 0,
    low_stock_threshold: 8,
    expiry_date: '2026-05-05',
    expiry_warning_days: 2,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: false,
    category: { id: 1, name: 'Fresh Produce' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: '794e738c-6763-4910-8dac-44ad6553f043',
    retailer_id: 'b63707a3-409f-4ee0-830f-b357facc58a1',
    category_id: 1,
    name: 'Broccoli Head',
    description: 'Large fresh broccoli heads, each approx 500g.',
    price: 2.50,
    unit: 'each',
    sku: 'FP-005',
    stock_quantity: 20,
    low_stock_threshold: 6,
    expiry_date: '2026-05-06',
    expiry_warning_days: 2,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 1, name: 'Fresh Produce' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: '892a8d59-fd76-440b-a89e-e1b9e7425822',
    retailer_id: 'b63707a3-409f-4ee0-830f-b357facc58a1',
    category_id: 2,
    name: 'Full Cream Milk 2L',
    description: 'Local NSW dairy farm milk.',
    price: 3.20,
    unit: 'each',
    sku: 'DA-001',
    stock_quantity: 30,
    low_stock_threshold: 8,
    expiry_date: '2026-05-10',
    expiry_warning_days: 3,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 2, name: 'Dairy' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: 'a45b8ab9-ea5d-433d-af7e-b4a4d1f61807',
    retailer_id: 'b63707a3-409f-4ee0-830f-b357facc58a1',
    category_id: 2,
    name: 'Free Range Eggs 12pk',
    description: 'Cage-free eggs from Hillside Farm.',
    price: 7.50,
    unit: 'dozen',
    sku: 'DA-002',
    stock_quantity: 4,
    low_stock_threshold: 5,
    expiry_date: '2026-05-21',
    expiry_warning_days: 5,
    image_url: null,
    is_visible: true,
    is_low_stock: true,
    in_stock: true,
    category: { id: 2, name: 'Dairy' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: '72b66047-3a00-4c7d-bac7-08058a22aacf',
    retailer_id: 'b63707a3-409f-4ee0-830f-b357facc58a1',
    category_id: 2,
    name: 'Greek Yoghurt 500g',
    description: 'Creamy natural Greek style yoghurt.',
    price: 4.99,
    unit: 'each',
    sku: 'DA-003',
    stock_quantity: 15,
    low_stock_threshold: 4,
    expiry_date: '2026-05-14',
    expiry_warning_days: 3,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 2, name: 'Dairy' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: 'de8e5d0c-11b8-4ebd-a90e-dfa145a05c5a',
    retailer_id: 'b63707a3-409f-4ee0-830f-b357facc58a1',
    category_id: 2,
    name: 'Tasty Cheese Block 500g',
    description: 'Mild tasty cheddar, great for cooking.',
    price: 8.99,
    unit: 'each',
    sku: 'DA-004',
    stock_quantity: 10,
    low_stock_threshold: 3,
    expiry_date: '2026-05-30',
    expiry_warning_days: 5,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 2, name: 'Dairy' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: 'bac7a254-32c9-4745-bcd6-5bac94320fda',
    retailer_id: 'b63707a3-409f-4ee0-830f-b357facc58a1',
    category_id: 3,
    name: 'Jasmine Rice 5kg',
    description: 'Premium Thai jasmine rice.',
    price: 12.99,
    unit: 'bag',
    sku: 'DG-001',
    stock_quantity: 20,
    low_stock_threshold: 5,
    expiry_date: null,
    expiry_warning_days: 3,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 3, name: 'Dry Goods' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: '7399aaf0-b86c-4ff8-9f86-0b993e8797f9',
    retailer_id: 'b63707a3-409f-4ee0-830f-b357facc58a1',
    category_id: 3,
    name: 'Pasta Penne 500g',
    description: 'Italian durum wheat penne rigate.',
    price: 2.50,
    unit: 'each',
    sku: 'DG-002',
    stock_quantity: 35,
    low_stock_threshold: 8,
    expiry_date: null,
    expiry_warning_days: 3,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 3, name: 'Dry Goods' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: '3b6ae219-4f04-4ddc-9c45-cacc1d598382',
    retailer_id: 'b63707a3-409f-4ee0-830f-b357facc58a1',
    category_id: 3,
    name: 'Rolled Oats 1kg',
    description: 'Organic Australian rolled oats.',
    price: 4.50,
    unit: 'bag',
    sku: 'DG-003',
    stock_quantity: 18,
    low_stock_threshold: 5,
    expiry_date: null,
    expiry_warning_days: 3,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 3, name: 'Dry Goods' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: 'dc779bf4-e501-434a-92f5-c854d13b92c9',
    retailer_id: 'b63707a3-409f-4ee0-830f-b357facc58a1',
    category_id: 4,
    name: 'Sourdough Loaf',
    description: 'Freshly baked 700g sourdough loaf.',
    price: 7.00,
    unit: 'each',
    sku: 'BK-001',
    stock_quantity: 6,
    low_stock_threshold: 3,
    expiry_date: '2026-05-03',
    expiry_warning_days: 1,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 4, name: 'Bakery' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: '31158722-91bf-4a18-a312-17cc3ab61a03',
    retailer_id: 'b63707a3-409f-4ee0-830f-b357facc58a1',
    category_id: 4,
    name: 'Croissants 4-pack',
    description: 'Butter croissants, baked fresh daily.',
    price: 6.50,
    unit: 'pack',
    sku: 'BK-002',
    stock_quantity: 0,
    low_stock_threshold: 4,
    expiry_date: '2026-05-02',
    expiry_warning_days: 1,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: false,
    category: { id: 4, name: 'Bakery' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: 'c710fc6c-09ea-4d0d-8c67-7ecf609324a7',
    retailer_id: 'b63707a3-409f-4ee0-830f-b357facc58a1',
    category_id: 5,
    name: 'Orange Juice 1L',
    description: 'Cold-pressed, no added sugar.',
    price: 5.50,
    unit: 'each',
    sku: 'BV-001',
    stock_quantity: 22,
    low_stock_threshold: 6,
    expiry_date: '2026-05-12',
    expiry_warning_days: 3,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 5, name: 'Beverages' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: 'd122a070-4497-4c0c-92e6-a3ca25785fa7',
    retailer_id: 'b63707a3-409f-4ee0-830f-b357facc58a1',
    category_id: 5,
    name: 'Sparkling Water 6pk',
    description: 'Natural mineral sparkling water 330ml cans.',
    price: 6.99,
    unit: 'pack',
    sku: 'BV-002',
    stock_quantity: 14,
    low_stock_threshold: 4,
    expiry_date: null,
    expiry_warning_days: 3,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 5, name: 'Beverages' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: 'b5c66356-9bfc-4225-b8a3-348ecaf57fe5',
    retailer_id: 'b63707a3-409f-4ee0-830f-b357facc58a1',
    category_id: 6,
    name: 'Chicken Breast Fillet',
    description: 'Free-range Australian chicken breast, per kg.',
    price: 14.99,
    unit: 'kg',
    sku: 'MS-001',
    stock_quantity: 8,
    low_stock_threshold: 3,
    expiry_date: '2026-05-03',
    expiry_warning_days: 1,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 6, name: 'Meat & Seafood' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: 'af13d372-3470-4e53-973f-12886c4fef28',
    retailer_id: 'b63707a3-409f-4ee0-830f-b357facc58a1',
    category_id: 6,
    name: 'Atlantic Salmon Fillet',
    description: 'Fresh Tasmanian salmon, skin-on, per kg.',
    price: 32.00,
    unit: 'kg',
    sku: 'MS-002',
    stock_quantity: 2,
    low_stock_threshold: 3,
    expiry_date: '2026-05-02',
    expiry_warning_days: 1,
    image_url: null,
    is_visible: true,
    is_low_stock: true,
    in_stock: true,
    category: { id: 6, name: 'Meat & Seafood' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: '006e9dac-d939-4b37-997b-ea3259d6cd82',
    retailer_id: 'b63707a3-409f-4ee0-830f-b357facc58a1',
    category_id: 7,
    name: 'Kalamata Olives 250g',
    description: 'House-marinated in herbs and olive oil.',
    price: 6.50,
    unit: 'each',
    sku: 'DC-001',
    stock_quantity: 10,
    low_stock_threshold: 3,
    expiry_date: '2026-05-20',
    expiry_warning_days: 4,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 7, name: 'Deli & Cheese' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: '1b206134-45df-4f54-a468-c341e789702a',
    retailer_id: 'b63707a3-409f-4ee0-830f-b357facc58a1',
    category_id: 7,
    name: 'Brie Wheel 200g',
    description: 'Creamy French-style brie.',
    price: 9.99,
    unit: 'each',
    sku: 'DC-002',
    stock_quantity: 5,
    low_stock_threshold: 2,
    expiry_date: '2026-05-10',
    expiry_warning_days: 3,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 7, name: 'Deli & Cheese' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: '30229e09-0fbc-4f9e-8fec-1caa5e2f9743',
    retailer_id: 'b63707a3-409f-4ee0-830f-b357facc58a1',
    category_id: 8,
    name: 'Extra Virgin Olive Oil',
    description: 'Cold-pressed South Australian EVOO, 500ml.',
    price: 13.50,
    unit: 'each',
    sku: 'PA-001',
    stock_quantity: 12,
    low_stock_threshold: 3,
    expiry_date: null,
    expiry_warning_days: 3,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 8, name: 'Pantry' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: 'bef05c74-9219-40fb-bb5c-c72b8dc063ac',
    retailer_id: 'b63707a3-409f-4ee0-830f-b357facc58a1',
    category_id: 8,
    name: 'Crushed Tomatoes 400g',
    description: 'Italian peeled and crushed tomatoes.',
    price: 2.20,
    unit: 'each',
    sku: 'PA-002',
    stock_quantity: 40,
    low_stock_threshold: 10,
    expiry_date: null,
    expiry_warning_days: 3,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 8, name: 'Pantry' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },

  // Maria's Fresh Produce Products (retailer_id: a17137b7-4089-4f14-a9cf-37fa08334173)
  {
    id: '3d726844-f31f-4c4c-9bb4-a68787515a29',
    retailer_id: 'a17137b7-4089-4f14-a9cf-37fa08334173',
    category_id: 9,
    name: 'Granny Smith Apples',
    description: 'Crisp Australian-grown apples, sold per kg.',
    price: 3.99,
    unit: 'kg',
    sku: 'FP-001',
    stock_quantity: 45,
    low_stock_threshold: 10,
    expiry_date: '2026-05-07',
    expiry_warning_days: 2,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 9, name: 'Fresh Produce' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: '0c098c58-652f-4d90-8eef-772ae2504257',
    retailer_id: 'a17137b7-4089-4f14-a9cf-37fa08334173',
    category_id: 9,
    name: 'Heirloom Tomatoes',
    description: 'Mixed heirloom tomatoes from the Hunter Valley.',
    price: 6.50,
    unit: 'kg',
    sku: 'FP-002',
    stock_quantity: 3,
    low_stock_threshold: 5,
    expiry_date: '2026-05-04',
    expiry_warning_days: 2,
    image_url: null,
    is_visible: true,
    is_low_stock: true,
    in_stock: true,
    category: { id: 9, name: 'Fresh Produce' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: '926d4fbb-2f76-461e-bcf6-58257b43850f',
    retailer_id: 'a17137b7-4089-4f14-a9cf-37fa08334173',
    category_id: 9,
    name: 'Baby Spinach',
    description: 'Pre-washed 200g bags.',
    price: 3.50,
    unit: 'bag',
    sku: 'FP-003',
    stock_quantity: 12,
    low_stock_threshold: 5,
    expiry_date: '2026-05-03',
    expiry_warning_days: 1,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 9, name: 'Fresh Produce' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: 'dd0d18b0-cfd2-42db-bfc2-25b2a6512c13',
    retailer_id: 'a17137b7-4089-4f14-a9cf-37fa08334173',
    category_id: 9,
    name: 'Cavendish Bananas',
    description: 'Ripe and ready, sold per kg.',
    price: 2.99,
    unit: 'kg',
    sku: 'FP-004',
    stock_quantity: 0,
    low_stock_threshold: 8,
    expiry_date: '2026-05-05',
    expiry_warning_days: 2,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: false,
    category: { id: 9, name: 'Fresh Produce' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: '1986ea42-b9ae-49d1-bf3b-77bb3721d2a3',
    retailer_id: 'a17137b7-4089-4f14-a9cf-37fa08334173',
    category_id: 9,
    name: 'Broccoli Head',
    description: 'Large fresh broccoli heads, each approx 500g.',
    price: 2.50,
    unit: 'each',
    sku: 'FP-005',
    stock_quantity: 20,
    low_stock_threshold: 6,
    expiry_date: '2026-05-06',
    expiry_warning_days: 2,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 9, name: 'Fresh Produce' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: '3266cf13-756d-4720-bfae-ed35affb0497',
    retailer_id: 'a17137b7-4089-4f14-a9cf-37fa08334173',
    category_id: 10,
    name: 'Full Cream Milk 2L',
    description: 'Local NSW dairy farm milk.',
    price: 3.20,
    unit: 'each',
    sku: 'DA-001',
    stock_quantity: 30,
    low_stock_threshold: 8,
    expiry_date: '2026-05-10',
    expiry_warning_days: 3,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 10, name: 'Dairy' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: '21f59b6b-c225-470a-a19f-a13a9b508eb6',
    retailer_id: 'a17137b7-4089-4f14-a9cf-37fa08334173',
    category_id: 10,
    name: 'Free Range Eggs 12pk',
    description: 'Cage-free eggs from Hillside Farm.',
    price: 7.50,
    unit: 'dozen',
    sku: 'DA-002',
    stock_quantity: 4,
    low_stock_threshold: 5,
    expiry_date: '2026-05-21',
    expiry_warning_days: 5,
    image_url: null,
    is_visible: true,
    is_low_stock: true,
    in_stock: true,
    category: { id: 10, name: 'Dairy' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: 'add6f418-6357-42cb-bdfa-fafb236c2afe',
    retailer_id: 'a17137b7-4089-4f14-a9cf-37fa08334173',
    category_id: 10,
    name: 'Greek Yoghurt 500g',
    description: 'Creamy natural Greek style yoghurt.',
    price: 4.99,
    unit: 'each',
    sku: 'DA-003',
    stock_quantity: 15,
    low_stock_threshold: 4,
    expiry_date: '2026-05-14',
    expiry_warning_days: 3,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 10, name: 'Dairy' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: '99c7c2ff-70c6-4d25-a824-e2b34134dc20',
    retailer_id: 'a17137b7-4089-4f14-a9cf-37fa08334173',
    category_id: 10,
    name: 'Tasty Cheese Block 500g',
    description: 'Mild tasty cheddar, great for cooking.',
    price: 8.99,
    unit: 'each',
    sku: 'DA-004',
    stock_quantity: 10,
    low_stock_threshold: 3,
    expiry_date: '2026-05-30',
    expiry_warning_days: 5,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 10, name: 'Dairy' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: '441683ef-8b7a-433f-bb5c-e3a6389f24d0',
    retailer_id: 'a17137b7-4089-4f14-a9cf-37fa08334173',
    category_id: 11,
    name: 'Jasmine Rice 5kg',
    description: 'Premium Thai jasmine rice.',
    price: 12.99,
    unit: 'bag',
    sku: 'DG-001',
    stock_quantity: 20,
    low_stock_threshold: 5,
    expiry_date: null,
    expiry_warning_days: 3,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 11, name: 'Dry Goods' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: '044eeaf6-5beb-4486-bf2d-146c2160de19',
    retailer_id: 'a17137b7-4089-4f14-a9cf-37fa08334173',
    category_id: 11,
    name: 'Pasta Penne 500g',
    description: 'Italian durum wheat penne rigate.',
    price: 2.50,
    unit: 'each',
    sku: 'DG-002',
    stock_quantity: 35,
    low_stock_threshold: 8,
    expiry_date: null,
    expiry_warning_days: 3,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 11, name: 'Dry Goods' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: '538d731a-b22a-40ab-b17c-547ca536afd5',
    retailer_id: 'a17137b7-4089-4f14-a9cf-37fa08334173',
    category_id: 11,
    name: 'Rolled Oats 1kg',
    description: 'Organic Australian rolled oats.',
    price: 4.50,
    unit: 'bag',
    sku: 'DG-003',
    stock_quantity: 18,
    low_stock_threshold: 5,
    expiry_date: null,
    expiry_warning_days: 3,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 11, name: 'Dry Goods' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: 'a846b5d2-21f2-43a6-b747-9341d258f57d',
    retailer_id: 'a17137b7-4089-4f14-a9cf-37fa08334173',
    category_id: 12,
    name: 'Sourdough Loaf',
    description: 'Freshly baked 700g sourdough loaf.',
    price: 7.00,
    unit: 'each',
    sku: 'BK-001',
    stock_quantity: 6,
    low_stock_threshold: 3,
    expiry_date: '2026-05-03',
    expiry_warning_days: 1,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 12, name: 'Bakery' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: '0b27b222-c609-442c-9a69-6dcfb070f433',
    retailer_id: 'a17137b7-4089-4f14-a9cf-37fa08334173',
    category_id: 12,
    name: 'Croissants 4-pack',
    description: 'Butter croissants, baked fresh daily.',
    price: 6.50,
    unit: 'pack',
    sku: 'BK-002',
    stock_quantity: 0,
    low_stock_threshold: 4,
    expiry_date: '2026-05-02',
    expiry_warning_days: 1,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: false,
    category: { id: 12, name: 'Bakery' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: '4b4b4101-3e6d-4f78-819e-220a365cf9b1',
    retailer_id: 'a17137b7-4089-4f14-a9cf-37fa08334173',
    category_id: 13,
    name: 'Orange Juice 1L',
    description: 'Cold-pressed, no added sugar.',
    price: 5.50,
    unit: 'each',
    sku: 'BV-001',
    stock_quantity: 22,
    low_stock_threshold: 6,
    expiry_date: '2026-05-12',
    expiry_warning_days: 3,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 13, name: 'Beverages' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: 'cdc3e9ce-b399-42f3-bf12-0e738d7b4c80',
    retailer_id: 'a17137b7-4089-4f14-a9cf-37fa08334173',
    category_id: 13,
    name: 'Sparkling Water 6pk',
    description: 'Natural mineral sparkling water 330ml cans.',
    price: 6.99,
    unit: 'pack',
    sku: 'BV-002',
    stock_quantity: 14,
    low_stock_threshold: 4,
    expiry_date: null,
    expiry_warning_days: 3,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 13, name: 'Beverages' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: '646db48f-3a8b-431c-b1ff-9656bea81ca8',
    retailer_id: 'a17137b7-4089-4f14-a9cf-37fa08334173',
    category_id: 14,
    name: 'Chicken Breast Fillet',
    description: 'Free-range Australian chicken breast, per kg.',
    price: 14.99,
    unit: 'kg',
    sku: 'MS-001',
    stock_quantity: 8,
    low_stock_threshold: 3,
    expiry_date: '2026-05-03',
    expiry_warning_days: 1,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 14, name: 'Meat & Seafood' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: '515d2736-96e8-4c09-9bf0-4926c964aa4c',
    retailer_id: 'a17137b7-4089-4f14-a9cf-37fa08334173',
    category_id: 14,
    name: 'Atlantic Salmon Fillet',
    description: 'Fresh Tasmanian salmon, skin-on, per kg.',
    price: 32.00,
    unit: 'kg',
    sku: 'MS-002',
    stock_quantity: 2,
    low_stock_threshold: 3,
    expiry_date: '2026-05-02',
    expiry_warning_days: 1,
    image_url: null,
    is_visible: true,
    is_low_stock: true,
    in_stock: true,
    category: { id: 14, name: 'Meat & Seafood' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: '242585ff-4e69-45f1-b558-61c4355a523c',
    retailer_id: 'a17137b7-4089-4f14-a9cf-37fa08334173',
    category_id: 15,
    name: 'Kalamata Olives 250g',
    description: 'House-marinated in herbs and olive oil.',
    price: 6.50,
    unit: 'each',
    sku: 'DC-001',
    stock_quantity: 10,
    low_stock_threshold: 3,
    expiry_date: '2026-05-20',
    expiry_warning_days: 4,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 15, name: 'Deli & Cheese' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: 'c3148d7f-468c-4ea0-b77b-741bb0a42902',
    retailer_id: 'a17137b7-4089-4f14-a9cf-37fa08334173',
    category_id: 15,
    name: 'Brie Wheel 200g',
    description: 'Creamy French-style brie.',
    price: 9.99,
    unit: 'each',
    sku: 'DC-002',
    stock_quantity: 5,
    low_stock_threshold: 2,
    expiry_date: '2026-05-10',
    expiry_warning_days: 3,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 15, name: 'Deli & Cheese' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: 'ae49256c-8986-4027-a234-9cc5480575c2',
    retailer_id: 'a17137b7-4089-4f14-a9cf-37fa08334173',
    category_id: 16,
    name: 'Extra Virgin Olive Oil',
    description: 'Cold-pressed South Australian EVOO, 500ml.',
    price: 13.50,
    unit: 'each',
    sku: 'PA-001',
    stock_quantity: 12,
    low_stock_threshold: 3,
    expiry_date: null,
    expiry_warning_days: 3,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 16, name: 'Pantry' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
  {
    id: '55461272-2094-421c-aa6e-ec21c10f0598',
    retailer_id: 'a17137b7-4089-4f14-a9cf-37fa08334173',
    category_id: 16,
    name: 'Crushed Tomatoes 400g',
    description: 'Italian peeled and crushed tomatoes.',
    price: 2.20,
    unit: 'each',
    sku: 'PA-002',
    stock_quantity: 40,
    low_stock_threshold: 10,
    expiry_date: null,
    expiry_warning_days: 3,
    image_url: null,
    is_visible: true,
    is_low_stock: false,
    in_stock: true,
    category: { id: 16, name: 'Pantry' },
    created_at: '2026-04-30T17:59:35Z',
    updated_at: '2026-04-30T17:59:35Z',
  },
];

// Update products_count for categories
dummyCategories.forEach(category => {
  category.products_count = dummyProducts.filter(p => p.category_id === category.id).length;
});

const dummyStockHistory = [
  { id: 1, product_id: '5c69c688-1810-4c55-8d01-5c5316154346', previous_quantity: 40, new_quantity: 45, change: 5, note: 'Restocked', created_at: '2026-04-30T10:30:00Z' },
  { id: 2, product_id: '2c292a2b-74ea-4bcb-8d67-f954a4b232b1', previous_quantity: 8, new_quantity: 3, change: -5, note: 'Sold', created_at: '2026-04-29T14:20:00Z' },
  { id: 3, product_id: 'dc0eee32-15e8-4967-a566-acf54d5ec8de', previous_quantity: 5, new_quantity: 0, change: -5, note: 'Sold out', created_at: '2026-04-28T16:45:00Z' },
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

// Dummy API Service (same as before - keeping the implementation)
const dummyApi = {
  // Auth
  register: async (data) => {
    const users = JSON.parse(localStorage.getItem('smartshelf_users') || '[]');
    const exists = users.find(u => u.email === data.email);
    if (exists) throw { response: { data: { message: 'Email already exists' }, status: 422 } };
    
    const newUser = {
      id: users.length + 1,
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'retailer',
      created_at: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem('smartshelf_users', JSON.stringify(users));
    
    const newRetailer = {
      id: crypto.randomUUID ? crypto.randomUUID() : 'retailer_' + Date.now(),
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
    return { data: { success: true, data: userCategories } };
  },
  
  createCategory: async (data) => {
    const categories = JSON.parse(localStorage.getItem('smartshelf_categories') || '[]');
    const retailer = JSON.parse(localStorage.getItem('smartshelf_retailer'));
    const newCategory = {
      id: Math.max(...categories.map(c => c.id), 0) + 1,
      retailer_id: retailer.id,
      name: data.name,
      sort_order: data.sort_order || 0,
      products_count: 0,
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
      id: crypto.randomUUID ? crypto.randomUUID() : 'prod_' + Date.now(),
      retailer_id: retailer.id,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    products.push(newProduct);
    localStorage.setItem('smartshelf_products', JSON.stringify(products));
    
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
    if (index !== -1) {
      products[index].stock_quantity = quantity;
      products[index].updated_at = new Date().toISOString();
      localStorage.setItem('smartshelf_products', JSON.stringify(products));
    }
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
    let myProducts = products.filter(p => p.retailer_id === retailer?.id && p.is_visible !== false);
    
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

// Real API Service (same as before)
const realApi = {
  // ... (keep your real API implementation)
};

// Choose which API to use
const USE_DUMMY_DATA = true;
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