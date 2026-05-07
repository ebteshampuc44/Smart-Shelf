// pages/SignUp.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignUp = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    store_name: '',
    suburb: '',
    state: 'NSW',
    postcode: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const setField = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const states = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const { name, email, password, password_confirmation, store_name, suburb, postcode } = form;
    if (!name || !email || !password || !store_name || !suburb || !postcode) {
      setError('Please fill in all required fields');
      return;
    }
    if (password !== password_confirmation) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    setLoading(true);
    const result = await signup(form);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb',
    borderRadius: 10, fontSize: 14, color: '#0f172a',
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
  };
  const labelStyle = { display: 'block', marginBottom: 7, fontSize: 13, fontWeight: 600, color: '#374151' };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{
        position: 'fixed', inset: 0, opacity: 0.04,
        backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
        backgroundSize: '40px 40px', pointerEvents: 'none',
      }} />

      <div style={{
        background: '#fff', borderRadius: 20, padding: '40px 36px',
        width: '100%', maxWidth: 520,
        boxShadow: '0 25px 60px rgba(0,0,0,0.35)', position: 'relative',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a', marginBottom: 6 }}>
            <span style={{ color: '#2563eb' }}>Smart</span>Shelf
          </div>
          <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Create your retailer account</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', color: '#dc2626', padding: '11px 14px', borderRadius: 10, marginBottom: 18, fontSize: 13, border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Full Name *</label>
            <input type="text" value={form.name} onChange={setField('name')} placeholder="John Doe" style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
          </div>
          
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Email Address *</label>
            <input type="email" value={form.email} onChange={setField('email')} placeholder="you@example.com" style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
          </div>
          
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Store Name *</label>
            <input type="text" value={form.store_name} onChange={setField('store_name')} placeholder="Fresh Mart" style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Suburb *</label>
              <input type="text" value={form.suburb} onChange={setField('suburb')} placeholder="Cabramatta" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
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
              <input type="text" value={form.postcode} onChange={setField('postcode')} placeholder="2166" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
            </div>
            <div>
              <label style={labelStyle}>Phone (optional)</label>
              <input type="tel" value={form.phone} onChange={setField('phone')} placeholder="(02) 9000 1234" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            <div>
              <label style={labelStyle}>Password *</label>
              <input type="password" value={form.password} onChange={setField('password')} placeholder="••••••••" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
            </div>
            <div>
              <label style={labelStyle}>Confirm Password *</label>
              <input type="password" value={form.password_confirmation} onChange={setField('password_confirmation')} placeholder="••••••••" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            style={{
              width: '100%', padding: '12px', background: loading ? '#93c5fd' : '#2563eb',
              color: '#fff', border: 'none', borderRadius: 10, fontSize: 15,
              fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 22, fontSize: 13, color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;