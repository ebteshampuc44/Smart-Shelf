import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from './Layout';

const ProtectedLayout = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Loading...</div>;
  
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

export default ProtectedLayout;