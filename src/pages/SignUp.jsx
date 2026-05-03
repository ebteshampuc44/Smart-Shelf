import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password || !storeName) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    const success = signup(name, email, password, storeName);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
    }}>
      <div style={{
        background: "#fff", borderRadius: 24, padding: "40px", width: "100%", maxWidth: 480,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: "#000000" }}>
            <span style={{ color: "#3b82f6" }}>Smart</span>Shelf
          </h1>
          <p style={{ color: "#555555" }}>Create your account</p>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", color: "#dc2626", padding: "12px", borderRadius: 10, marginBottom: 20, fontSize: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 500, color: "#000000" }}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 14, color: "#000000" }}
              placeholder="John Doe"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 500, color: "#000000" }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 14, color: "#000000" }}
              placeholder="you@example.com"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 500, color: "#000000" }}>Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 14, color: "#000000" }}
              placeholder="Fresh Mart"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 500, color: "#000000" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 14, color: "#000000" }}
              placeholder="••••••••"
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 500, color: "#000000" }}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 14, color: "#000000" }}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%", padding: "12px", background: "#3b82f6", color: "#fff",
              border: "none", borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: "pointer",
            }}
          >
            Sign Up
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#555555" }}>
          Already have an account? <Link to="/login" style={{ color: "#3b82f6", textDecoration: "none" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;