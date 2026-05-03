import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [storeName, setStoreName] = useState(user?.storeName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = updateProfile({ name, storeName, email });
    if (success) {
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{
          background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "40px 32px 60px 32px", textAlign: "center",
          }}>
            <img
              src={user?.avatar}
              alt="avatar"
              style={{
                width: 100, height: 100, borderRadius: "50%", border: "4px solid #fff",
                marginBottom: 16,
              }}
            />
            <h2 style={{ color: "#fff", margin: 0, fontSize: 24 }}>{user?.name}</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", marginTop: 8 }}>{user?.storeName}</p>
          </div>

          {/* Form */}
          <div style={{ padding: "32px", marginTop: -40, background: "#fff", borderRadius: "16px 16px 0 0" }}>
            {message && (
              <div style={{
                background: "#dcfce7", color: "#166534", padding: "12px", borderRadius: 10,
                marginBottom: 20, fontSize: 14,
              }}>
                {message}
              </div>
            )}

            {!isEditing ? (
              <div>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "12px 0", borderBottom: "1px solid #f1f5f9",
                }}>
                  <span style={{ color: "#555555" }}>Full Name</span>
                  <span style={{ fontWeight: 500, color: "#000000" }}>{user?.name}</span>
                </div>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "12px 0", borderBottom: "1px solid #f1f5f9",
                }}>
                  <span style={{ color: "#555555" }}>Store Name</span>
                  <span style={{ fontWeight: 500, color: "#000000" }}>{user?.storeName}</span>
                </div>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "12px 0", borderBottom: "1px solid #f1f5f9",
                }}>
                  <span style={{ color: "#555555" }}>Email Address</span>
                  <span style={{ fontWeight: 500, color: "#000000" }}>{user?.email}</span>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    marginTop: 24, width: "100%", padding: "12px", background: "#3b82f6",
                    color: "#fff", border: "none", borderRadius: 10, fontWeight: 600, cursor: "pointer",
                  }}
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 500, color: "#000000" }}>Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, color: "#000000" }}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 500, color: "#000000" }}>Store Name</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, color: "#000000" }}
                  />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 500, color: "#000000" }}>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, color: "#000000" }}
                  />
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    style={{
                      flex: 1, padding: "12px", background: "#f1f5f9", color: "#000000",
                      border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1, padding: "12px", background: "#3b82f6", color: "#fff",
                      border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;