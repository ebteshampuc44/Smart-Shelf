import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';

// ── helpers ──────────────────────────────────────────────────────────────────
const slugify = (str) =>
  (str || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

// ── sub-components ────────────────────────────────────────────────────────────
const StockBadge = ({ status }) => {
  const map = {
    ok:  { label: 'In Stock',     bg: '#dcfce7', color: '#15803d', dot: '#22c55e' },
    low: { label: 'Low Stock',    bg: '#fef9c3', color: '#a16207', dot: '#eab308' },
    out: { label: 'Out of Stock', bg: '#fee2e2', color: '#b91c1c', dot: '#ef4444' },
  };
  const s = map[status] || map.ok;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: s.bg, color: s.color,
      padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, display: 'inline-block' }} />
      {s.label}
    </span>
  );
};

const ProductCard = ({ product }) => {
  const isOut = product.status === 'out';
  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14,
      padding: '18px', display: 'flex', flexDirection: 'column', gap: 10,
      opacity: isOut ? 0.65 : 1,
      transition: 'box-shadow 0.15s, transform 0.15s',
      cursor: 'default',
    }}
      onMouseEnter={e => {
        if (!isOut) {
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.09)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'none';
      }}
    >
      {/* Product image placeholder */}
      <div style={{
        height: 90, borderRadius: 10, background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 36,
      }}>
        🛒
      </div>

      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{product.name}</div>
        <div style={{ fontSize: 12, color: '#64748b' }}>{product.category}</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#2563eb' }}>{product.price}</div>
        <StockBadge status={product.status} />
      </div>

      {product.notes && (
        <div style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic' }}>{product.notes}</div>
      )}
    </div>
  );
};

// ── main ──────────────────────────────────────────────────────────────────────
const Storefront = () => {
  const { retailerName } = useParams();
  const [allUsers, setAllUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Load all registered users to find matching store
    const users = JSON.parse(localStorage.getItem('smartshelf_users') || '[]');
    setAllUsers(users);

    // Load products
    const prods = JSON.parse(localStorage.getItem('smartshelf_products') || '[]');
    setProducts(prods);
  }, []);

  // Find the retailer by slug
  const retailer = useMemo(() => {
    return allUsers.find(u => slugify(u.storeName) === retailerName) || null;
  }, [allUsers, retailerName]);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))];
    return ['All', ...cats];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });
  }, [products, search, activeCategory, statusFilter]);

  // 404 — store not found
  if (allUsers.length > 0 && !retailer) {
    return (
      <div style={{
        minHeight: '100vh', background: '#f8fafc',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16,
      }}>
        <div style={{ fontSize: 60 }}>🏪</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 }}>Store Not Found</h2>
        <p style={{ color: '#64748b', margin: 0 }}>The store "<strong>{retailerName}</strong>" doesn't exist.</p>
        <Link to="/login" style={{ color: '#2563eb', fontWeight: 600, fontSize: 14 }}>Are you a retailer? Sign in →</Link>
      </div>
    );
  }

  const displayRetailer = retailer || {
    storeName: retailerName?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Store',
    location: '', phone: '', hours: '',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Top brand bar */}
      <div style={{ background: '#0f172a', padding: '10px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
          <span style={{ color: '#60a5fa' }}>Smart</span>Shelf
        </span>
        <span style={{ fontSize: 11, color: '#475569' }}>Independent Retailer Platform</span>
      </div>

      {/* Store hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
        padding: '40px 24px',
        textAlign: 'center',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, margin: '0 auto 14px',
          border: '2px solid rgba(255,255,255,0.3)',
        }}>
          🛒
        </div>
        <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.3px' }}>
          {displayRetailer.storeName}
        </h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginTop: 10 }}>
          {displayRetailer.location && (
            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>📍 {displayRetailer.location}</span>
          )}
          {displayRetailer.phone && (
            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>📞 {displayRetailer.phone}</span>
          )}
          {displayRetailer.hours && (
            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>🕐 {displayRetailer.hours}</span>
          )}
        </div>

        {/* Stats bar */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 24,
          marginTop: 20, flexWrap: 'wrap',
        }}>
          {[
            ['📦', products.length, 'Products'],
            ['✅', products.filter(p => p.status === 'ok').length, 'In Stock'],
            ['📂', categories.length - 1, 'Categories'],
          ].map(([icon, val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{icon} {val}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px' }}>

        {/* Search + filter */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text" placeholder="Search products…"
            value={search} onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, minWidth: 200, padding: '10px 16px',
              border: '1.5px solid #e5e7eb', borderRadius: 10,
              fontSize: 14, color: '#0f172a', outline: 'none',
              background: '#fff',
            }}
          />
          <select
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            style={{
              padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10,
              fontSize: 13, color: '#475569', background: '#fff', outline: 'none', cursor: 'pointer',
            }}
          >
            <option value="all">All Availability</option>
            <option value="ok">In Stock Only</option>
            <option value="low">Low Stock</option>
          </select>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 22, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '7px 16px', borderRadius: 20, border: '1.5px solid',
                borderColor: activeCategory === cat ? '#2563eb' : '#e2e8f0',
                background: activeCategory === cat ? '#eff6ff' : '#fff',
                color: activeCategory === cat ? '#2563eb' : '#64748b',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>🛒</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>No products listed yet</div>
            <div style={{ fontSize: 13 }}>This store hasn't added any products to their catalogue yet.</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: 14 }}>
            No products match your search.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 16,
          }}>
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {/* Contact CTA */}
        {(displayRetailer.phone || displayRetailer.location) && (
          <div style={{
            marginTop: 40, background: '#fff', borderRadius: 14,
            border: '1px solid #e2e8f0', padding: '24px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: 16,
          }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Want to order or enquire?</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>Contact {displayRetailer.storeName} directly to place an order or check availability.</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {displayRetailer.phone && (
                <a href={`tel:${displayRetailer.phone}`} style={{
                  padding: '10px 20px', background: '#2563eb', color: '#fff',
                  borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none',
                }}>
                  📞 Call Us
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: 12, borderTop: '1px solid #e2e8f0', marginTop: 20 }}>
        Powered by <strong style={{ color: '#2563eb' }}>SmartShelf</strong> — Independent Retailer Platform
      </div>
    </div>
  );
};

export default Storefront;