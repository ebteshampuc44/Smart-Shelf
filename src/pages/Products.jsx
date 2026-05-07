import React, { useState, useEffect, useCallback } from 'react';
import { products as productsApi, categories as categoriesApi } from '../services/api';

const daysLeft = (dateStr) => {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / 86400000);
};

const Badge = ({ status }) => {
  const map = {
    ok: { label: 'In Stock', bg: '#dcfce7', color: '#15803d' },
    low: { label: 'Low Stock', bg: '#fef9c3', color: '#a16207' },
    out: { label: 'Out of Stock', bg: '#fee2e2', color: '#b91c1c' },
  };
  const s = map[status] || map.ok;
  return (
    <span style={{
      background: s.bg, color: s.color, fontSize: 11, fontWeight: 700,
      padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap',
    }}>{s.label}</span>
  );
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showHistory, setShowHistory] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingStock, setUpdatingStock] = useState(null);

  const emptyForm = {
    name: '',
    description: '',
    category_id: '',
    price: '',
    stock_quantity: '',
    low_stock_threshold: '5',
    expiry_date: '',
    image_url: '',
    is_visible: true,
  };
  const [form, setForm] = useState(emptyForm);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productsApi.getAll({ per_page: 100 }),
        categoriesApi.getAll(),
      ]);
      setProducts(productsRes.data.data.data || []);
      setCategories(categoriesRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [fetchData]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...form,
        price: parseFloat(form.price),
        stock_quantity: parseInt(form.stock_quantity),
        low_stock_threshold: parseInt(form.low_stock_threshold) || 5,
        category_id: form.category_id ? parseInt(form.category_id) : null,
      };
      
      const response = await productsApi.create(submitData);
      setProducts([response.data.data, ...products]);
      setShowModal(false);
      setForm(emptyForm);
    } catch (error) {
      console.error('Failed to create product:', error);
      alert(error.response?.data?.message || 'Failed to create product');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...form,
        price: parseFloat(form.price),
        low_stock_threshold: parseInt(form.low_stock_threshold) || 5,
        category_id: form.category_id ? parseInt(form.category_id) : null,
      };
      
      const response = await productsApi.update(editingProduct.id, submitData);
      setProducts(products.map(p => p.id === editingProduct.id ? response.data.data : p));
      setShowModal(false);
      setEditingProduct(null);
      setForm(emptyForm);
    } catch (error) {
      console.error('Failed to update product:', error);
      alert(error.response?.data?.message || 'Failed to update product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This action cannot be undone.')) return;
    try {
      await productsApi.delete(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product');
    }
  };

  const updateStock = async (id, newStock) => {
    const quantity = Math.max(0, parseInt(newStock) || 0);
    setUpdatingStock(id);
    try {
      const response = await productsApi.updateStock(id, quantity);
      setProducts(products.map(p => p.id === id ? response.data.data : p));
    } catch (error) {
      console.error('Failed to update stock:', error);
      alert('Failed to update stock');
    } finally {
      setUpdatingStock(null);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setForm({
        name: product.name || '',
        description: product.description || '',
        category_id: product.category_id || '',
        price: product.price || '',
        stock_quantity: product.stock_quantity || '',
        low_stock_threshold: product.low_stock_threshold || '5',
        expiry_date: product.expiry_date || '',
        image_url: product.image_url || '',
        is_visible: product.is_visible !== false,
      });
    } else {
      setEditingProduct(null);
      setForm(emptyForm);
    }
    setShowModal(true);
  };

  const filtered = products.filter(p => {
    const matchSearch = search === '' || 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category?.name || '').toLowerCase().includes(search.toLowerCase());
    
    let matchStatus = true;
    if (filterStatus === 'low') matchStatus = p.is_low_stock && p.stock_quantity > 0;
    else if (filterStatus === 'out') matchStatus = p.stock_quantity === 0;
    else if (filterStatus === 'ok') matchStatus = !p.is_low_stock && p.stock_quantity > 0;
    
    return matchSearch && matchStatus;
  });

  const statusCounts = {
    all: products.length,
    ok: products.filter(p => !p.is_low_stock && p.stock_quantity > 0).length,
    low: products.filter(p => p.is_low_stock && p.stock_quantity > 0).length,
    out: products.filter(p => p.stock_quantity === 0).length,
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px', border: '1.5px solid #e5e7eb',
    borderRadius: 8, fontSize: 13, color: '#0f172a',
    outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle = { display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, color: '#374151' };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTop: '3px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#0f172a' }}>Products</h2>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 3, marginBottom: 0 }}>{products.length} total items</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input
            type="text" placeholder="Search name, category…"
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ padding: '9px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 13, width: 220, color: '#0f172a', outline: 'none' }}
          />
          <button onClick={() => openModal()} style={{
            background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10,
            padding: '9px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 13,
          }}>
            + Add Product
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {[['all', 'All'], ['ok', 'In Stock'], ['low', 'Low Stock'], ['out', 'Out of Stock']].map(([val, label]) => (
          <button key={val} onClick={() => setFilterStatus(val)} style={{
            padding: '6px 14px', borderRadius: 20, border: '1.5px solid',
            borderColor: filterStatus === val ? '#2563eb' : '#e2e8f0',
            background: filterStatus === val ? '#eff6ff' : '#fff',
            color: filterStatus === val ? '#2563eb' : '#64748b',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>
            {label} <span style={{ opacity: 0.7 }}>({statusCounts[val]})</span>
          </button>
        ))}
      </div>

      {products.length === 0 ? (
        <div style={{
          background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14,
          padding: '70px 20px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>No Products Yet</h3>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>Add your first product to start tracking inventory</p>
          <button onClick={() => openModal()} style={{
            background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10,
            padding: '11px 26px', fontWeight: 700, cursor: 'pointer', fontSize: 14,
          }}>
            + Add Your First Product
          </button>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 700 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Product', 'Category', 'Stock', 'Price', 'Expiry', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const pct = p.low_stock_threshold > 0 ? Math.min(100, Math.round((p.stock_quantity / p.low_stock_threshold) * 100)) : 0;
                const days = daysLeft(p.expiry_date);
                const expiryColor = days === null ? '#94a3b8' : days < 0 ? '#dc2626' : days <= 3 ? '#d97706' : days <= 7 ? '#ca8a04' : '#16a34a';
                const isUpdating = updatingStock === p.id;

                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '13px 14px' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.name}</div>
                      {p.description && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{p.description.slice(0, 50)}</div>}
                    </td>
                    <td style={{ padding: '13px 14px', color: '#475569' }}>{p.category?.name || '—'}</td>
                    <td style={{ padding: '13px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                          type="number" min="0" value={p.stock_quantity}
                          onChange={e => updateStock(p.id, e.target.value)}
                          disabled={isUpdating}
                          style={{ width: 70, padding: '5px 8px', border: '1.5px solid #e5e7eb', borderRadius: 7, fontSize: 12, textAlign: 'center' }}
                        />
                        {p.low_stock_threshold > 0 && (
                          <div style={{ minWidth: 60 }}>
                            <div style={{ width: 50, height: 4, background: '#f1f5f9', borderRadius: 2 }}>
                              <div style={{ width: `${Math.min(100, pct)}%`, height: '100%', background: p.is_low_stock ? '#f59e0b' : '#22c55e', borderRadius: 2 }} />
                            </div>
                            <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>≤{p.low_stock_threshold}</div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '13px 14px', fontWeight: 600, color: '#0f172a' }}>${parseFloat(p.price).toFixed(2)}</td>
                    <td style={{ padding: '13px 14px' }}>
                      {p.expiry_date ? (
                        <span style={{ fontSize: 12, fontWeight: 600, color: expiryColor }}>
                          {days < 0 ? 'Expired' : days === 0 ? 'Today' : `${days}d left`}
                        </span>
                      ) : <span style={{ color: '#cbd5e1' }}>—</span>}
                    </td>
                    <td style={{ padding: '13px 14px' }}>
                      <Badge status={p.stock_quantity === 0 ? 'out' : p.is_low_stock ? 'low' : 'ok'} />
                    </td>
                    <td style={{ padding: '13px 14px' }}>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={() => openModal(p)} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: 12, fontWeight: 600, padding: 0 }}>Edit</button>
                        <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 12, fontWeight: 600, padding: 0 }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
              No products match your search.
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20,
        }}>
          <div style={{
            background: '#fff', borderRadius: 16, padding: 28,
            width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#0f172a' }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#94a3b8' }}>×</button>
            </div>

            <form onSubmit={editingProduct ? handleUpdate : handleCreate}>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Product Name *</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Category</label>
                <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} style={inputStyle}>
                  <option value="">Uncategorized</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, minHeight: 80 }} placeholder="Product description..." />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>Price *</label>
                  <input type="number" step="0.01" min="0" required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Stock Quantity *</label>
                  <input type="number" min="0" required value={form.stock_quantity} onChange={e => setForm({ ...form, stock_quantity: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>Low Stock Alert ≤</label>
                  <input type="number" min="0" value={form.low_stock_threshold} onChange={e => setForm({ ...form, low_stock_threshold: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Expiry Date</label>
                  <input type="date" value={form.expiry_date} onChange={e => setForm({ ...form, expiry_date: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.is_visible} onChange={e => setForm({ ...form, is_visible: e.target.checked })} style={{ width: 16, height: 16 }} />
                  <span style={{ fontSize: 13, color: '#374151' }}>Show on storefront</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{
                  flex: 1, padding: '11px', background: '#f1f5f9', border: 'none',
                  borderRadius: 9, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#475569',
                }}>
                  Cancel
                </button>
                <button type="submit" style={{
                  flex: 1, padding: '11px', background: '#2563eb', color: '#fff',
                  border: 'none', borderRadius: 9, cursor: 'pointer', fontSize: 14, fontWeight: 700,
                }}>
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;