import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Field = ({ label, value }) => (
  <div style={{ padding: '14px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
    <span style={{ fontSize: 13, color: '#64748b', flexShrink: 0 }}>{label}</span>
    <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', textAlign: 'right', wordBreak: 'break-word' }}>{value || <span style={{ color: '#cbd5e1', fontWeight: 400 }}>Not set</span>}</span>
  </div>
);

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    storeName: user?.storeName || '',
    location: user?.location || '',
    phone: user?.phone || '',
    hours: user?.hours || '',
  });

  const set = (f) => (e) => setForm(prev => ({ ...prev, [f]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(form);
    setMessage('Profile updated successfully!');
    setIsEditing(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const storefrontSlug = user?.storeName
    ? user.storeName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    : 'my-store';

  const inputStyle = {
    width: '100%', padding: '10px 12px', border: '1.5px solid #e5e7eb',
    borderRadius: 8, fontSize: 14, color: '#0f172a',
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s',
  };
  const labelStyle = { display: 'block', marginBottom: 7, fontSize: 12, fontWeight: 600, color: '#374151' };

  return (
    <div style={{ maxWidth: 580, margin: '0 auto' }}>
      {/* Header card */}
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
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <h2 style={{ color: '#fff', margin: 0, fontSize: 22, fontWeight: 800 }}>{user?.name}</h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', marginTop: 6, fontSize: 14 }}>{user?.storeName}</p>
        {/* View storefront button */}
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
            textDecoration: 'none', backdropFilter: 'blur(4px)',
          }}
        >
          🏪 View My Storefront ↗
        </a>
      </div>

      {/* Content card */}
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

        {!isEditing ? (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Account</div>
            <Field label="Full Name" value={user?.name} />
            <Field label="Email Address" value={user?.email} />

            <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 18, marginBottom: 4 }}>Store Details</div>
            <Field label="Store Name" value={user?.storeName} />
            <Field label="Location / Suburb" value={user?.location} />
            <Field label="Phone / Contact" value={user?.phone} />
            <Field label="Trading Hours" value={user?.hours} />

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
            <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Account</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input type="text" value={form.name} onChange={set('name')} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input type="email" value={form.email} onChange={set('email')} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
            </div>

            <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14, marginTop: 6 }}>Store Details</div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Store Name</label>
              <input type="text" value={form.storeName} onChange={set('storeName')} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Location / Suburb</label>
                <input type="text" value={form.location} onChange={set('location')} placeholder="e.g. Parramatta, NSW" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
              <div>
                <label style={labelStyle}>Phone / Contact</label>
                <input type="text" value={form.phone} onChange={set('phone')} placeholder="02 9XXX XXXX" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Trading Hours</label>
              <input type="text" value={form.hours} onChange={set('hours')} placeholder="Mon–Fri 7am–6pm, Sat 8am–4pm" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={() => setIsEditing(false)} style={{
                flex: 1, padding: '12px', background: '#f1f5f9', border: 'none',
                borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 14, color: '#475569',
              }}>Cancel</button>
              <button type="submit" style={{
                flex: 1, padding: '12px', background: '#2563eb', color: '#fff',
                border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 14,
              }}>Save Changes</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;