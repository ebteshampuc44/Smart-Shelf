// pages/Dashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { dashboard as dashboardApi, products as productsApi, categories as categoriesApi } from '../services/api';

const daysUntilExpiry = (dateStr) => {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const StatCard = ({ icon, label, value, sub, color }) => (
  <div style={{
    background: '#fff', borderRadius: 14, padding: '18px 20px',
    border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 14,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  }}>
    <div style={{
      width: 48, height: 48, borderRadius: 12, background: color + '18',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <span style={{ color, fontSize: 22 }}>{icon}</span>
    </div>
    <div>
      <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>{sub}</div>}
    </div>
  </div>
);

const SectionCard = ({ title, children }) => (
  <div style={{
    background: '#fff', borderRadius: 14, padding: '20px',
    border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  }}>
    <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>{title}</div>
    {children}
  </div>
);

const Dashboard = () => {
  const { user, retailer } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes, dashboardRes] = await Promise.all([
          productsApi.getAll({ per_page: 100 }),
          categoriesApi.getAll(),
          dashboardApi.getOverview(),
        ]);
        
        setProducts(productsRes.data.data.data || []);
        setCategories(categoriesRes.data.data || []);
        setDashboardData(dashboardRes.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const stats = useMemo(() => {
    if (!dashboardData) {
      return { total: products.length, inStock: 0, lowStock: 0, outOfStock: 0 };
    }
    return {
      total: dashboardData.total_products || products.length,
      inStock: (products.length - (dashboardData.low_stock_count || 0) - (dashboardData.out_of_stock || 0)),
      lowStock: dashboardData.low_stock_count || 0,
      outOfStock: dashboardData.out_of_stock || 0,
    };
  }, [products, dashboardData]);

  const categoryData = useMemo(() => {
    const map = new Map();
    categories.forEach(cat => {
      map.set(cat.id, { category: cat.name, inStock: 0, lowStock: 0, outOfStock: 0 });
    });
    map.set('uncategorized', { category: 'Uncategorized', inStock: 0, lowStock: 0, outOfStock: 0 });
    
    products.forEach(p => {
      const catId = p.category_id || 'uncategorized';
      if (!map.has(catId)) {
        map.set(catId, { category: p.category?.name || 'Uncategorized', inStock: 0, lowStock: 0, outOfStock: 0 });
      }
      const entry = map.get(catId);
      if (p.stock_quantity === 0) entry.outOfStock++;
      else if (p.is_low_stock) entry.lowStock++;
      else entry.inStock++;
    });
    
    return Array.from(map.values()).filter(d => d.inStock > 0 || d.lowStock > 0 || d.outOfStock > 0).slice(0, 6);
  }, [products, categories]);

  const expiryAlerts = useMemo(() => {
    return products
      .map(p => ({ ...p, days: daysUntilExpiry(p.expiry_date) }))
      .filter(p => p.days !== null && p.days <= 7 && p.days >= 0)
      .sort((a, b) => a.days - b.days);
  }, [products]);

  const lowStockItems = useMemo(() =>
    products.filter(p => p.stock_quantity <= p.low_stock_threshold && p.stock_quantity > 0).slice(0, 5),
    [products]);

  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTop: '3px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#0f172a' }}>
          {greet()}, {user?.name?.split(' ')[0]} 👋
        </h2>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
          Here's what's happening in <strong>{retailer?.store_name || user?.storeName}</strong> today.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        gap: 14, marginBottom: 22,
      }}>
        <StatCard icon="📦" label="Total Products" value={stats.total} sub="All tracked items" color="#6366f1" />
        <StatCard icon="✅" label="In Stock" value={stats.inStock} sub={stats.total ? `${Math.round((stats.inStock / stats.total) * 100)}% of total` : '—'} color="#22c55e" />
        <StatCard icon="⚠️" label="Low Stock" value={stats.lowStock} sub="Needs reorder soon" color="#f59e0b" />
        <StatCard icon="❌" label="Out of Stock" value={stats.outOfStock} sub="Urgent action needed" color="#ef4444" />
      </div>

      {(expiryAlerts.length > 0 || lowStockItems.length > 0) && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : (expiryAlerts.length > 0 && lowStockItems.length > 0 ? '1fr 1fr' : '1fr'),
          gap: 14, marginBottom: 22,
        }}>
          {expiryAlerts.length > 0 && (
            <SectionCard title={`🗓️ Expiry Alerts (${expiryAlerts.length})`}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {expiryAlerts.map(p => (
                  <div key={p.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '9px 12px', borderRadius: 8,
                    background: p.days === 0 ? '#fef2f2' : p.days <= 3 ? '#fffbeb' : '#f0fdf4',
                    border: `1px solid ${p.days === 0 ? '#fecaca' : p.days <= 3 ? '#fde68a' : '#bbf7d0'}`,
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{p.category?.name || 'Uncategorized'}</div>
                    </div>
                    <div style={{
                      fontSize: 12, fontWeight: 700,
                      color: p.days === 0 ? '#dc2626' : p.days <= 3 ? '#d97706' : '#16a34a',
                    }}>
                      {p.days === 0 ? 'Expires today' : `${p.days}d left`}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {lowStockItems.length > 0 && (
            <SectionCard title={`📉 Low Stock (${lowStockItems.length})`}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {lowStockItems.map(p => {
                  const pct = (p.stock_quantity / p.low_stock_threshold) * 100;
                  const barColor = '#f59e0b';
                  return (
                    <div key={p.id} style={{
                      padding: '9px 12px', borderRadius: 8, background: '#fffbeb',
                      border: '1px solid #fde68a',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{p.name}</span>
                        <span style={{ fontSize: 12, color: '#64748b' }}>{p.stock_quantity} / {p.low_stock_threshold}</span>
                      </div>
                      <div style={{ height: 4, background: '#f1f5f9', borderRadius: 2 }}>
                        <div style={{ width: `${Math.min(100, pct)}%`, height: '100%', background: barColor, borderRadius: 2 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          )}
        </div>
      )}

      {products.length > 0 ? (
        <SectionCard title="📊 Stock by Category">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13, color: '#0f172a', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="inStock" fill="#22c55e" radius={[4, 4, 0, 0]} name="In Stock" stackId="a" />
              <Bar dataKey="lowStock" fill="#f59e0b" radius={[0, 0, 0, 0]} name="Low Stock" stackId="a" />
              <Bar dataKey="outOfStock" fill="#ef4444" radius={[4, 4, 0, 0]} name="Out of Stock" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 16, marginTop: 8, justifyContent: 'center' }}>
            {[['#22c55e', 'In Stock'], ['#f59e0b', 'Low Stock'], ['#ef4444', 'Out of Stock']].map(([c, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
                {l}
              </div>
            ))}
          </div>
        </SectionCard>
      ) : (
        <SectionCard title="📊 Stock Overview">
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>No products yet</div>
            <div style={{ fontSize: 13 }}>Go to <strong>Products</strong> to add your first item and charts will appear here.</div>
          </div>
        </SectionCard>
      )}
    </div>
  );
};

export default Dashboard;