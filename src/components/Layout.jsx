import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Icons
const Icons = {
  Dashboard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  Products: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  Logout: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Menu: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  Close: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
};

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setSidebarOpen(true);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.profile-dropdown')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showDropdown]);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <Icons.Dashboard /> },
    { name: "Products", path: "/products", icon: <Icons.Products /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowDropdown(false);
  };

  const goToProfile = () => {
    navigate('/profile');
    setShowDropdown(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex" }}>
      {/* Sidebar Overlay */}
      {sidebarOpen && isMobile && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.5)", zIndex: 998,
          }}
        />
      )}

      {/* Sidebar */}
      <div style={{
        position: isMobile ? "fixed" : "sticky",
        top: 0, left: 0, height: "100vh", width: isMobile ? "280px" : "260px",
        background: "#fff", borderRight: "1px solid #e2e8f0",
        transform: sidebarOpen ? "translateX(0)" : `translateX(${isMobile ? "-100%" : "0"})`,
        transition: "transform 0.3s ease", zIndex: 999,
        display: "flex", flexDirection: "column", overflowY: "auto",
      }}>
        {/* Logo */}
        <div style={{
          padding: "20px", borderBottom: "1px solid #f1f5f9",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: "#000000" }}>
            <span style={{ color: "#3b82f6" }}>Smart</span>Shelf
          </span>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <Icons.Close />
            </button>
          )}
        </div>

        {/* User Info */}
        {user && (
          <div style={{ padding: "16px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 12 }}>
            <img src={user.avatar} alt="avatar" style={{ width: 40, height: 40, borderRadius: "50%" }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#000000" }}>{user.name}</div>
              <div style={{ fontSize: 12, color: "#555555" }}>{user.storeName || "Store Owner"}</div>
            </div>
          </div>
        )}

        {/* Menu */}
        <div style={{ padding: "16px", flex: 1 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => isMobile && setSidebarOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                  marginBottom: 8, borderRadius: 10, textDecoration: "none",
                  background: isActive ? "#eff6ff" : "transparent",
                  color: isActive ? "#3b82f6" : "#000000", 
                  fontWeight: isActive ? 600 : 500,
                  transition: "all 0.2s",
                }}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Logout */}
        <div style={{ padding: "16px", borderTop: "1px solid #f1f5f9" }}>
          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
              width: "100%", borderRadius: 10, border: "none", background: "#fef2f2",
              color: "#dc2626", fontWeight: 500, cursor: "pointer",
            }}
          >
            <Icons.Logout />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Topbar */}
        <div style={{
          background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "12px 20px",
          display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, zIndex: 100,
        }}>
          {isMobile && (
            <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <Icons.Menu />
            </button>
          )}
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0, color: "#000000" }}>
              {menuItems.find(m => m.path === location.pathname)?.name || "Dashboard"}
            </h2>
          </div>
          
          {/* Profile Icon with Dropdown */}
          <div className="profile-dropdown" style={{ position: "relative" }}>
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                width: 38, height: 38, borderRadius: "50%", background: "#3b82f6",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", fontSize: 15, fontWeight: 600, color: "#fff",
                textTransform: "uppercase",
                transition: "all 0.2s",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            
            {/* Dropdown Menu */}
            {showDropdown && (
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", right: 0,
                width: 220, background: "#fff", borderRadius: 12,
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0",
                zIndex: 200, overflow: "hidden",
              }}>
                {/* User Info in Dropdown */}
                <div style={{
                  padding: "12px 16px", borderBottom: "1px solid #f1f5f9",
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%", background: "#3b82f6",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 600, color: "#fff",
                  }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#000000" }}>{user?.name}</div>
                    <div style={{ fontSize: 11, color: "#555555" }}>{user?.email}</div>
                  </div>
                </div>
                
                {/* Profile Link */}
                <button
                  onClick={goToProfile}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    width: "100%", padding: "12px 16px",
                    background: "transparent", border: "none",
                    cursor: "pointer", fontSize: 13, color: "#000000",
                    textAlign: "left", transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <Icons.Settings />
                  <span>My Profile</span>
                </button>
                
                {/* Divider */}
                <div style={{ height: 1, background: "#f1f5f9" }} />
                
                {/* Logout */}
                <button
                  onClick={handleLogout}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    width: "100%", padding: "12px 16px",
                    background: "transparent", border: "none",
                    cursor: "pointer", fontSize: 13, color: "#dc2626",
                    textAlign: "left", transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#fef2f2"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <Icons.Logout />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Page Content */}
        <div style={{ padding: "20px" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;