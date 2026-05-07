// src/pages/Dashboard.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { products as productsApi, categories as categoriesApi } from '../services/api';

// Helper function
const daysUntilExpiry = (dateStr) => {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// Stat Card Component
const StatCard = ({ icon, label, value, sub, color, trend }) => (
  <div style={{
    background: '#fff', borderRadius: 14, padding: '18px 20px',
    border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 14,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  }}
  onMouseEnter={e => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
  }}
  onMouseLeave={e => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
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
      {trend && (
        <div style={{ fontSize: 10, color: trend > 0 ? '#22c55e' : '#ef4444', marginTop: 2 }}>
          {trend > 0 ? `↑ ${trend}` : trend < 0 ? `↓ ${Math.abs(trend)}` : '→ 0'} this week
        </div>
      )}
    </div>
  </div>
);

// Section Card Component
const SectionCard = ({ title, icon, children, action }) => (
  <div style={{
    background: '#fff', borderRadius: 14, padding: '20px',
    border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  }}>
    <div style={{ 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      marginBottom: 16, flexWrap: 'wrap', gap: 10 
    }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon && <span>{icon}</span>}
        <span>{title}</span>
      </div>
      {action && <div>{action}</div>}
    </div>
    {children}
  </div>
);

// Alert Item Component
const AlertItem = ({ product, type }) => {
  const isExpiry = type === 'expiry';
  const bgColor = isExpiry 
    ? (product.days === 0 ? '#fef2f2' : product.days <= 3 ? '#fffbeb' : '#f0fdf4')
    : '#fffbeb';
  const borderColor = isExpiry
    ? (product.days === 0 ? '#fecaca' : product.days <= 3 ? '#fde68a' : '#bbf7d0')
    : '#fde68a';
  const textColor = isExpiry
    ? (product.days === 0 ? '#dc2626' : product.days <= 3 ? '#d97706' : '#16a34a')
    : '#d97706';
  
  const message = isExpiry
    ? (product.days === 0 ? 'Expires today' : `${product.days} days left`)
    : `Only ${product.stock_quantity} left (threshold: ${product.low_stock_threshold})`;
  
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 14px', borderRadius: 10,
      background: bgColor, border: `1px solid ${borderColor}`,
    }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{product.name}</div>
        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
          {product.category?.name || 'Uncategorized'}
        </div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: textColor, textAlign: 'right' }}>
        <div>{message}</div>
        <div style={{ fontSize: 10, fontWeight: 400, marginTop: 2 }}>
          {isExpiry ? product.expiry_date : `Stock: ${product.stock_quantity}`}
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const { user, retailer } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [recentActivities, setRecentActivities] = useState([]);

  // Fetch dashboard data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes, dashboardRes] = await Promise.all([
        productsApi.getAll({ per_page: 100 }),
        categoriesApi.getAll(),
        productsApi.getDashboard(),
      ]);
      
      setProducts(productsRes.data.data.data || []);
      setCategories(categoriesRes.data.data || []);
      setDashboardData(dashboardRes.data.data);
      
      // Process recent activities from dashboard data
      if (dashboardRes.data.data?.recently_updated) {
        setRecentActivities(dashboardRes.data.data.recently_updated);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [fetchData]);

  // Auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = products.length;
    const inStock = products.filter(p => p.stock_quantity > 0 && !p.is_low_stock).length;
    const lowStock = products.filter(p => p.is_low_stock && p.stock_quantity > 0).length;
    const outOfStock = products.filter(p => p.stock_quantity === 0).length;
    const totalValue = products.reduce((sum, p) => sum + (parseFloat(p.price) * p.stock_quantity), 0);
    
    return { total, inStock, lowStock, outOfStock, totalValue };
  }, [products]);

  // Category data for bar chart
  const categoryData = useMemo(() => {
    const map = new Map();
    
    categories.forEach(cat => {
      map.set(cat.id, { 
        category: cat.name, 
        inStock: 0, 
        lowStock: 0, 
        outOfStock: 0,
        total: 0 
      });
    });
    map.set('uncategorized', { 
      category: 'Uncategorized', 
      inStock: 0, 
      lowStock: 0, 
      outOfStock: 0,
      total: 0 
    });
    
    products.forEach(p => {
      const catId = p.category_id || 'uncategorized';
      if (!map.has(catId)) {
        map.set(catId, { 
          category: p.category?.name || 'Uncategorized', 
          inStock: 0, 
          lowStock: 0, 
          outOfStock: 0,
          total: 0 
        });
      }
      const entry = map.get(catId);
      if (p.stock_quantity === 0) {
        entry.outOfStock++;
      } else if (p.is_low_stock) {
        entry.lowStock++;
      } else {
        entry.inStock++;
      }
      entry.total++;
    });
    
    return Array.from(map.values())
      .filter(d => d.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);
  }, [products, categories]);

  // Pie chart data for stock distribution
  const pieData = useMemo(() => [
    { name: 'In Stock', value: stats.inStock, color: '#22c55e' },
    { name: 'Low Stock', value: stats.lowStock, color: '#f59e0b' },
    { name: 'Out of Stock', value: stats.outOfStock, color: '#ef4444' },
  ].filter(d => d.value > 0), [stats]);

  // Expiry alerts (7 days)
  const expiryAlerts = useMemo(() => {
    const expiring = dashboardData?.expiring_soon || [];
    return expiring.map(p => ({
      ...p,
      days: daysUntilExpiry(p.expiry_date)
    })).filter(p => p.days !== null && p.days <= 7).sort((a, b) => a.days - b.days);
  }, [dashboardData]);

  // Low stock items
  const lowStockItems = useMemo(() =>
    products.filter(p => p.is_low_stock && p.stock_quantity > 0).slice(0, 5),
    [products]);

  // Format recent activities
  const formattedActivities = useMemo(() => {
    return recentActivities.map(activity => ({
      ...activity,
      formattedDate: new Date(activity.updated_at).toLocaleDateString('en-AU', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
      })
    }));
  }, [recentActivities]);

  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getGreetingEmoji = () => {
    const h = new Date().getHours();
    if (h < 12) return '🌅';
    if (h < 17) return '☀️';
    return '🌙';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: 50, height: 50, border: '3px solid #e2e8f0', 
            borderTop: '3px solid #2563eb', borderRadius: '50%', 
            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' 
          }} />
          <p style={{ color: '#64748b', fontSize: 14 }}>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with greeting */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: '#0f172a' }}>
              {greet()}, {user?.name?.split(' ')[0]} {getGreetingEmoji()}
            </h2>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 6 }}>
              Welcome back to <strong>{retailer?.store_name || 'your store'}</strong>
            </p>
          </div>
          <div style={{ 
            background: '#e0f2fe', padding: '8px 16px', borderRadius: 20,
            fontSize: 12, color: '#0369a1'
          }}>
            📅 {new Date().toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: 14, marginBottom: 24,
      }}>
        <StatCard 
          icon="📦" 
          label="Total Products" 
          value={stats.total} 
          sub={stats.total === 0 ? 'Add products to start' : 'All tracked items'} 
          color="#6366f1" 
        />
        <StatCard 
          icon="✅" 
          label="In Stock" 
          value={stats.inStock} 
          sub={stats.total ? `${Math.round((stats.inStock / stats.total) * 100)}% of total` : '—'} 
          color="#22c55e" 
        />
        <StatCard 
          icon="⚠️" 
          label="Low Stock" 
          value={stats.lowStock} 
          sub="Needs reorder soon" 
          color="#f59e0b" 
        />
        <StatCard 
          icon="❌" 
          label="Out of Stock" 
          value={stats.outOfStock} 
          sub="Urgent action needed" 
          color="#ef4444" 
        />
      </div>

      {/* Inventory Value Card */}
      <div style={{ marginBottom: 24 }}>
        <StatCard 
          icon="💰" 
          label="Inventory Value" 
          value={`$${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          sub="Total stock value at retail price" 
          color="#10b981" 
        />
      </div>

      {/* Alerts Section */}
      {(expiryAlerts.length > 0 || lowStockItems.length > 0) && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: 16, marginBottom: 24,
        }}>
          {/* Expiry Alerts */}
          {expiryAlerts.length > 0 && (
            <SectionCard 
              title={`Expiring Soon`} 
              icon="🗓️"
              action={<span style={{ fontSize: 12, color: '#64748b' }}>{expiryAlerts.length} items</span>}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {expiryAlerts.slice(0, 4).map(p => (
                  <AlertItem key={p.id} product={p} type="expiry" />
                ))}
                {expiryAlerts.length > 4 && (
                  <div style={{ textAlign: 'center', fontSize: 12, color: '#64748b', paddingTop: 8 }}>
                    +{expiryAlerts.length - 4} more items expiring soon
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* Low Stock Alerts */}
          {lowStockItems.length > 0 && (
            <SectionCard 
              title={`Low Stock Alert`} 
              icon="📉"
              action={<span style={{ fontSize: 12, color: '#64748b' }}>{lowStockItems.length} items</span>}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {lowStockItems.slice(0, 4).map(p => (
                  <AlertItem key={p.id} product={p} type="lowstock" />
                ))}
                {lowStockItems.length > 4 && (
                  <div style={{ textAlign: 'center', fontSize: 12, color: '#64748b', paddingTop: 8 }}>
                    +{lowStockItems.length - 4} more low stock items
                  </div>
                )}
              </div>
            </SectionCard>
          )}
        </div>
      )}

      {/* Charts Section */}
      {products.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr',
          gap: 16, marginBottom: 24,
        }}>
          {/* Bar Chart - Stock by Category */}
          <SectionCard title="Stock by Category" icon="📊">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData} barSize={isMobile ? 16 : 24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="category" 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={false} 
                  tickLine={false}
                  angle={isMobile ? -45 : 0}
                  textAnchor={isMobile ? 'end' : 'middle'}
                  height={isMobile ? 60 : 30}
                />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid #e2e8f0' }}
                  formatter={(value, name) => [value, name === 'inStock' ? 'In Stock' : name === 'lowStock' ? 'Low Stock' : 'Out of Stock']}
                />
                <Bar dataKey="inStock" fill="#22c55e" radius={[4, 4, 0, 0]} name="In Stock" stackId="a" />
                <Bar dataKey="lowStock" fill="#f59e0b" radius={[0, 0, 0, 0]} name="Low Stock" stackId="a" />
                <Bar dataKey="outOfStock" fill="#ef4444" radius={[4, 4, 0, 0]} name="Out of Stock" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: 16, marginTop: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: '#22c55e' }} />
                <span style={{ fontSize: 11, color: '#64748b' }}>In Stock</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: '#f59e0b' }} />
                <span style={{ fontSize: 11, color: '#64748b' }}>Low Stock</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: '#ef4444' }} />
                <span style={{ fontSize: 11, color: '#64748b' }}>Out of Stock</span>
              </div>
            </div>
          </SectionCard>

          {/* Pie Chart - Stock Distribution */}
          <SectionCard title="Stock Distribution" icon="🥧">
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value) => <span style={{ fontSize: 11, color: '#64748b' }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                No data available
              </div>
            )}
          </SectionCard>
        </div>
      ) : (
        <SectionCard title="Stock Overview" icon="📊">
          <div style={{ textAlign: 'center', padding: '50px 20px', color: '#94a3b8' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>No products yet</div>
            <div style={{ fontSize: 13, maxWidth: 300, margin: '0 auto' }}>
              Go to <strong>Products</strong> to add your first item and charts will appear here.
            </div>
          </div>
        </SectionCard>
      )}

      {/* Recent Activity Section */}
      {formattedActivities.length > 0 && (
        <SectionCard title="Recent Activity" icon="🔄">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {formattedActivities.map(activity => (
              <div key={activity.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0', borderBottom: '1px solid #f1f5f9',
              }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{activity.name}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Stock: {activity.stock_quantity} units</div>
                </div>
                <div style={{ fontSize: 11, color: '#64748b', textAlign: 'right' }}>
                  {activity.formattedDate}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Quick Actions */}
      <SectionCard title="Quick Actions" icon="⚡">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
          gap: 12 
        }}>
          <button onClick={() => window.location.href = '/products'} style={{
            padding: '12px', background: '#eff6ff', border: 'none', borderRadius: 10,
            cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#2563eb',
            transition: 'background 0.2s',
          }} onMouseEnter={e => e.currentTarget.style.background = '#dbeafe'}>
            📦 Add Product
          </button>
          <button onClick={() => window.location.href = '/profile'} style={{
            padding: '12px', background: '#f0fdf4', border: 'none', borderRadius: 10,
            cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#16a34a',
            transition: 'background 0.2s',
          }} onMouseEnter={e => e.currentTarget.style.background = '#dcfce7'}>
            🏪 Edit Store Profile
          </button>
          <a href={`/store/${retailer?.slug}`} target="_blank" rel="noreferrer" style={{
            padding: '12px', background: '#fef3c7', border: 'none', borderRadius: 10,
            cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#d97706',
            textDecoration: 'none', textAlign: 'center', display: 'block',
            transition: 'background 0.2s',
          }} onMouseEnter={e => e.currentTarget.style.background = '#fde68a'}>
            👁️ View Storefront
          </a>
        </div>
      </SectionCard>

      {/* Add spin animation keyframes */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;