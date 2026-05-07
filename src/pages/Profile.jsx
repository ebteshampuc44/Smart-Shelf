import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Field = ({ label, value }) => (
  <div style={{ padding: '14px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
    <span style={{ fontSize: 13, color: '#64748b', flexShrink: 0 }}>{label}</span>
    <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', textAlign: 'right' }}>{value || <span style={{ color: '#cbd5e1', fontWeight: 400 }}>Not set</span>}</span>
  </div>
);

const Profile = () => {
  const { user, retailer, updateProfile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    store_name: '',
    description: '',
    suburb: '',
    state: 'NSW',
    postcode: '',
    phone: '',
    trading_hours: {
      mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '',
    },
  });

  const states = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];

  useEffect(() => {
    if (retailer) {
      setForm({
        store_name: retailer.store_name || '',
        description: retailer.description || '',
        suburb: retailer.suburb || '',
        state: retailer.state || 'NSW',
        postcode: retailer.postcode || '',
        phone: retailer.phone || '',
        trading_hours: retailer.trading_hours || {
          mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '',
        },
      });
    }
  }, [retailer]);

  const setField = (f) => (e) => setForm(prev => ({ ...prev, [f]: e.target.value }));
  const setHoursField = (day) => (e) => setForm(prev => ({
    ...prev,
    trading_hours: { ...prev.trading_hours, [day]: e.target.value }
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const result = await updateProfile(form);
    
    if (result.success) {
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      await refreshProfile();
      setTimeout(() => setMessage(''), 3000);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const storefrontSlug = retailer?.slug || 'my-store';

  const inputStyle = {
    width: '100%', padding: '10px 12px', border: '1.5px solid #e5e7eb',
    borderRadius: 8, fontSize: 14, color: '#0f172a',
    outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle = { display: 'block', marginBottom: 7, fontSize: 12, fontWeight: 600, color: '#374151' };

  const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const dayLabels = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <div style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
        borderRadius: '16px 16px 0 0', padding: '36px 28px 48px',
        textAlign: 'center',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          border: '3px solid rgba(255,255,255,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 800, color: '#fff',
          margin: '0 auto 14px',
        }}>
          {retailer?.store_name?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase() || 'S'}
        </div>
        <h2 style={{ color: '#fff', margin: 0, fontSize: 22, fontWeight: 800 }}>{retailer?.store_name || user?.name}</h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', marginTop: 6, fontSize: 14 }}>{retailer?.suburb ? `${retailer.suburb}, ${retailer.state}` : 'Retailer'}</p>
        
        <a
          href={`/store/${storefrontSlug}`}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            marginTop: 14, padding: '8px 18px',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 20, color: '#fff', fontSize: 13, fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          🏪 View My Storefront ↗
        </a>
      </div>

      <div style={{
        background: '#fff', borderRadius: '0 0 16px 16px',
        border: '1px solid #e2e8f0', borderTop: 'none', padding: '28px',
        marginTop: -16, position: 'relative', zIndex: 1,
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
      }}>
        {message && (
          <div style={{
            background: '#f0fdf4', color: '#15803d', padding: '12px 14px',
            borderRadius: 10, marginBottom: 20, fontSize: 13, fontWeight: 500,
            border: '1px solid #bbf7d0',
          }}>
            ✓ {message}
          </div>
        )}
        
        {error && (
          <div style={{
            background: '#fef2f2', color: '#dc2626', padding: '12px 14px',
            borderRadius: 10, marginBottom: 20, fontSize: 13, fontWeight: 500,
            border: '1px solid #fecaca',
          }}>
            ⚠️ {error}
          </div>
        )}

        {!isEditing ? (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Store Information</div>
            <Field label="Store Name" value={retailer?.store_name} />
            <Field label="Description" value={retailer?.description} />
            <Field label="Location" value={retailer?.suburb ? `${retailer.suburb}, ${retailer.state} ${retailer.postcode}` : '—'} />
            <Field label="Phone" value={retailer?.phone} />

            <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 18, marginBottom: 4 }}>Trading Hours</div>
            {days.map(day => (
              <Field key={day} label={dayLabels[day]} value={retailer?.trading_hours?.[day] || 'Closed'} />
            ))}

            <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 18, marginBottom: 4 }}>Account</div>
            <Field label="Email" value={user?.email} />
            <Field label="Member Since" value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'} />

            <button onClick={() => setIsEditing(true)} style={{
              marginTop: 24, width: '100%', padding: '12px', background: '#2563eb',
              color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700,
              fontSize: 14, cursor: 'pointer',
            }}>
              Edit Profile
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Store Information</div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Store Name *</label>
              <input type="text" required value={form.store_name} onChange={setField('store_name')} style={inputStyle} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Description</label>
              <textarea value={form.description} onChange={setField('description')} style={{ ...inputStyle, minHeight: 80 }} placeholder="Tell customers about your store..." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Suburb *</label>
                <input type="text" required value={form.suburb} onChange={setField('suburb')} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>State *</label>
                <select value={form.state} onChange={setField('state')} style={inputStyle}>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Postcode *</label>
                <input type="text" required value={form.postcode} onChange={setField('postcode')} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input type="tel" value={form.phone} onChange={setField('phone')} style={inputStyle} />
              </div>
            </div>

            <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14, marginTop: 6 }}>Trading Hours</div>

            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 8, marginBottom: 12, alignItems: 'center' }}>
              {days.map(day => (
                <React.Fragment key={day}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#64748b' }}>{dayLabels[day]}</span>
                  <input type="text" value={form.trading_hours[day]} onChange={setHoursField(day)} placeholder="e.g. 9am–5pm or Closed" style={inputStyle} />
                </React.Fragment>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button type="button" onClick={() => setIsEditing(false)} style={{
                flex: 1, padding: '12px', background: '#f1f5f9', border: 'none',
                borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 14, color: '#475569',
              }}>Cancel</button>
              <button type="submit" disabled={loading} style={{
                flex: 1, padding: '12px', background: loading ? '#93c5fd' : '#2563eb', color: '#fff',
                border: 'none', borderRadius: 10, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14,
              }}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;