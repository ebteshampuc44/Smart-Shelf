// src/pages/Storefront.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storefront as storefrontApi } from '../services/api';

const StockBadge = ({ product }) => {
  const isOut = product.stock_quantity === 0;
  const isLow = product.is_low_stock && !isOut;
  
  if (isOut) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        background: '#fee2e2', color: '#b91c1c',
        padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
        Out of Stock
      </span>
    );
  }
  
  if (isLow) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        background: '#fef9c3', color: '#a16207',
        padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#eab308', display: 'inline-block' }} />
        Low Stock
      </span>
    );
  }
  
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: '#dcfce7', color: '#15803d',
      padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
      In Stock
    </span>
  );
};

const ProductCard = ({ product }) => {
  const isOut = product.stock_quantity === 0;
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
      <div style={{
        height: 90, borderRadius: 10, background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 36,
      }}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} style={{ height: 80, width: 'auto', objectFit: 'contain', borderRadius: 8 }} />
        ) : (
          '🛒'
        )}
      </div>

      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{product.name}</div>
        <div style={{ fontSize: 12, color: '#64748b' }}>{product.category?.name || 'Uncategorized'}</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#2563eb' }}>${parseFloat(product.price).toFixed(2)}</div>
        <StockBadge product={product} />
      </div>

      {product.description && (
        <div style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic' }}>{product.description.slice(0, 80)}</div>
      )}
    </div>
  );
};

const Storefront = () => {
  const { retailerName } = useParams();
  const [retailer, setRetailer] = useState(null);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchStorefront = async () => {
      setLoading(true);
      try {
        // Fetch retailer info
        const retailerRes = await storefrontApi.getStore(retailerName);
        const retailerData = retailerRes.data.data;
        setRetailer(retailerData);
        
        // Fetch products for this store
        const productsRes = await storefrontApi.getStoreProducts(retailerName, { per_page: 100 });
        const productList = productsRes.data.data.data || [];
        setProducts(productList);
        
        // Extract unique categories
        const uniqueCats = [...new Set(productList.map(p => p.category?.name).filter(Boolean))];
        setCategories(['All', ...uniqueCats]);
        
        setNotFound(false);
      } catch (error) {
        console.error('Failed to fetch storefront:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStorefront();
  }, [retailerName]);

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.category?.name || '').toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === 'All' || p.category?.name === activeCategory;
      return matchSearch && matchCat;
    });
  }, [products, search, activeCategory]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTop: '3px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (notFound || !retailer) {
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

  const inStockCount = products.filter(p => p.stock_quantity > 0).length;

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
          {retailer.logo_url ? (
            <img src={retailer.logo_url} alt={retailer.store_name} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            '🛒'
          )}
        </div>
        <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.3px' }}>
          {retailer.store_name}
        </h1>
        
        {retailer.description && (
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, maxWidth: 500, margin: '0 auto' }}>{retailer.description}</p>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginTop: 10 }}>
          {retailer.suburb && (
            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>📍 {retailer.suburb}, {retailer.state} {retailer.postcode}</span>
          )}
          {retailer.phone && (
            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>📞 {retailer.phone}</span>
          )}
        </div>

        {/* Stats bar */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 24,
          marginTop: 20, flexWrap: 'wrap',
        }}>
          {[
            ['📦', products.length, 'Products'],
            ['✅', inStockCount, 'In Stock'],
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
        </div>

        {/* Category tabs */}
        {categories.length > 1 && (
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
        )}

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
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 20,
          }}>
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {/* Contact CTA */}
        {(retailer.phone || retailer.suburb) && (
          <div style={{
            marginTop: 40, background: '#fff', borderRadius: 14,
            border: '1px solid #e2e8f0', padding: '24px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: 16,
          }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Want to order or enquire?</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>Contact {retailer.store_name} directly to place an order or check availability.</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {retailer.phone && (
                <a href={`tel:${retailer.phone}`} style={{
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