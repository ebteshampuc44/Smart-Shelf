import React, { useState, useEffect } from 'react';

// ── helpers ──────────────────────────────────────────────────────────────────
const computeStatus = (stock, threshold) => {
  const s = Number(stock);
  const t = Number(threshold) || 10;
  if (s === 0) return 'out';
  if (s <= t) return 'low';
  return 'ok';
};

const daysLeft = (dateStr) => {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / 86400000);
};

const fmt = (n) => (n == null ? '—' : n < 0 ? 'Expired' : n === 0 ? 'Today' : `${n}d`);

// ── sub-components ────────────────────────────────────────────────────────────
const Badge = ({ status }) => {
  const map = {
    ok:  { label: 'In Stock',     bg: '#dcfce7', color: '#15803d' },
    low: { label: 'Low Stock',    bg: '#fef9c3', color: '#a16207' },
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

// ── main ──────────────────────────────────────────────────────────────────────
const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showHistory, setShowHistory] = useState(null); // product id
  const [isMobile, setIsMobile] = useState(false);

  const emptyForm = {
    name: '', category: '', sku: '', stock: '', maxStock: '',
    lowThreshold: '', price: '', expiryDate: '', notes: '',
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const raw = localStorage.getItem('smartshelf_products');
    if (raw) setProducts(JSON.parse(raw));
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const save = (list) => {
    setProducts(list);
    localStorage.setItem('smartshelf_products', JSON.stringify(list));
    // trigger dashboard re-read
    window.dispatchEvent(new Event('storage'));
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openModal = (product = null) => {
    setEditingProduct(product);
    setForm(product ? {
      name: product.name || '', category: product.category || '',
      sku: product.sku || '', stock: product.stock ?? '',
      maxStock: product.maxStock || '', lowThreshold: product.lowThreshold || '',
      price: product.price || '', expiryDate: product.expiryDate || '',
      notes: product.notes || '',
    } : emptyForm);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const stockNum = Number(form.stock);
    const status = computeStatus(stockNum, form.lowThreshold || 10);
    const now = new Date().toISOString();

    if (editingProduct) {
      const oldStock = editingProduct.stock;
      const historyEntry = oldStock !== stockNum
        ? { date: now, from: oldStock, to: stockNum, action: 'edit' }
        : null;
      const updated = products.map(p => p.id === editingProduct.id ? {
        ...p, ...form,
        stock: stockNum, maxStock: Number(form.maxStock) || 0,
        lowThreshold: Number(form.lowThreshold) || 10,
        status,
        history: historyEntry ? [...(p.history || []), historyEntry] : (p.history || []),
        updatedAt: now,
      } : p);
      save(updated);
    } else {
      const newProduct = {
        id: Date.now(), ...form,
        stock: stockNum, maxStock: Number(form.maxStock) || 0,
        lowThreshold: Number(form.lowThreshold) || 10,
        status, history: [{ date: now, from: 0, to: stockNum, action: 'created' }],
        createdAt: now, updatedAt: now,
      };
      save([...products, newProduct]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this product?')) save(products.filter(p => p.id !== id));
  };

  const updateStock = (id, newStock) => {
    const now = new Date().toISOString();
    save(products.map(p => {
      if (p.id !== id) return p;
      const s = Math.max(0, Number(newStock));
      const status = computeStatus(s, p.lowThreshold);
      const lastStock = p.stock;
      return {
        ...p, stock: s, status,
        history: [...(p.history || []), { date: now, from: lastStock, to: s, action: 'stock_update' }],
        updatedAt: now,
      };
    }));
  };

  const setField = (f) => (e) => setForm(prev => ({ ...prev, [f]: e.target.value }));

  const inputStyle = {
    width: '100%', padding: '10px 12px', border: '1.5px solid #e5e7eb',
    borderRadius: 8, fontSize: 13, color: '#0f172a',
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s',
  };
  const labelStyle = { display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, color: '#374151' };

  const statusCounts = {
    all: products.length,
    ok: products.filter(p => p.status === 'ok').length,
    low: products.filter(p => p.status === 'low').length,
    out: products.filter(p => p.status === 'out').length,
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#0f172a' }}>Products</h2>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 3, marginBottom: 0 }}>{products.length} total items</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input
            type="text" placeholder="Search name, SKU, category…"
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ padding: '9px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 13, width: 220, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
          />
          <button onClick={() => openModal()} style={{
            background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10,
            padding: '9px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 13,
          }}>
            + Add Product
          </button>
        </div>
      </div>

      {/* Filter tabs */}
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
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Product', 'Category', 'SKU', 'Stock', 'Price', 'Expiry', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const pct = p.maxStock > 0 ? Math.min(100, Math.round((p.stock / p.maxStock) * 100)) : 0;
                const barColor = p.status === 'ok' ? '#22c55e' : p.status === 'low' ? '#f59e0b' : '#ef4444';
                const days = daysLeft(p.expiryDate);
                const expiryColor = days === null ? '#94a3b8' : days < 0 ? '#dc2626' : days <= 3 ? '#d97706' : days <= 7 ? '#ca8a04' : '#16a34a';

                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f8fafc' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fafcff'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '13px 14px' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.name}</div>
                      {p.notes && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{p.notes}</div>}
                    </td>
                    <td style={{ padding: '13px 14px', color: '#475569' }}>{p.category || '—'}</td>
                    <td style={{ padding: '13px 14px', fontFamily: 'monospace', fontSize: 11, color: '#94a3b8' }}>{p.sku || '—'}</td>
                    <td style={{ padding: '13px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                          type="number" min="0" value={p.stock}
                          onChange={e => updateStock(p.id, e.target.value)}
                          style={{ width: 65, padding: '5px 8px', border: '1.5px solid #e5e7eb', borderRadius: 7, fontSize: 12, color: '#0f172a', textAlign: 'center' }}
                        />
                        {p.maxStock > 0 && (
                          <div>
                            <div style={{ width: 50, height: 4, background: '#f1f5f9', borderRadius: 2 }}>
                              <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: 2 }} />
                            </div>
                            <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{pct}% of {p.maxStock}</div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '13px 14px', fontWeight: 600, color: '#0f172a' }}>{p.price || '—'}</td>
                    <td style={{ padding: '13px 14px' }}>
                      {p.expiryDate ? (
                        <span style={{ fontSize: 12, fontWeight: 600, color: expiryColor }}>
                          {days < 0 ? '⚠️ Expired' : days === 0 ? '⚠️ Today' : `${fmt(days)}`}
                        </span>
                      ) : <span style={{ color: '#cbd5e1', fontSize: 12 }}>—</span>}
                    </td>
                    <td style={{ padding: '13px 14px' }}><Badge status={p.status} /></td>
                    <td style={{ padding: '13px 14px' }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <button onClick={() => openModal(p)} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: 12, fontWeight: 600, padding: 0 }}>Edit</button>
                        <button onClick={() => setShowHistory(showHistory === p.id ? null : p.id)} style={{ background: 'none', border: 'none', color: '#7c3aed', cursor: 'pointer', fontSize: 12, fontWeight: 600, padding: 0 }}>History</button>
                        <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 12, fontWeight: 600, padding: 0 }}>Delete</button>
                      </div>
                      {/* Inline history panel */}
                      {showHistory === p.id && (
                        <div style={{ marginTop: 8, padding: 10, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', minWidth: 200 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 6 }}>Stock History</div>
                          {(p.history || []).length === 0 ? (
                            <div style={{ fontSize: 11, color: '#94a3b8' }}>No history yet</div>
                          ) : [...(p.history || [])].reverse().slice(0, 5).map((h, i) => (
                            <div key={i} style={{ fontSize: 11, color: '#475569', marginBottom: 4, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                              <span>{h.from} → {h.to}</span>
                              <span style={{ color: '#94a3b8' }}>{new Date(h.date).toLocaleDateString()}</span>
                            </div>
                          ))}
                        </div>
                      )}
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

      {/* Add/Edit Modal */}
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
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#94a3b8', lineHeight: 1 }}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Product Name */}
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Product Name *</label>
                <input type="text" required value={form.name} onChange={setField('name')} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>

              {/* Category & SKU */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>Category *</label>
                  <input type="text" required value={form.category} onChange={setField('category')} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                    placeholder="e.g. Fresh Produce" />
                </div>
                <div>
                  <label style={labelStyle}>SKU</label>
                  <input type="text" value={form.sku} onChange={setField('sku')} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>
              </div>

              {/* Stock, Max, Threshold */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>Current Stock *</label>
                  <input type="number" min="0" required value={form.stock} onChange={setField('stock')} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>
                <div>
                  <label style={labelStyle}>Max Stock</label>
                  <input type="number" min="0" value={form.maxStock} onChange={setField('maxStock')} style={inputStyle}
                    placeholder="Optional"
                    onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>
                <div>
                  <label style={labelStyle}>Low Stock Alert ≤</label>
                  <input type="number" min="0" value={form.lowThreshold} onChange={setField('lowThreshold')} style={inputStyle}
                    placeholder="Default: 10"
                    onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>
              </div>

              {/* Price & Expiry */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>Price *</label>
                  <input type="text" required value={form.price} onChange={setField('price')} style={inputStyle}
                    placeholder="$0.00"
                    onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>
                <div>
                  <label style={labelStyle}>Expiry / Best Before</label>
                  <input type="date" value={form.expiryDate} onChange={setField('expiryDate')} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>
              </div>

              {/* Notes */}
              <div style={{ marginBottom: 22 }}>
                <label style={labelStyle}>Notes</label>
                <input type="text" value={form.notes} onChange={setField('notes')} style={inputStyle}
                  placeholder="Optional internal notes"
                  onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
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