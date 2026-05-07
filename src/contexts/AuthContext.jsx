// contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, retailer } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [retailerProfile, setRetailerProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('smartshelf_token');
      const storedUser = localStorage.getItem('smartshelf_user');
      
      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
        try {
          // Verify token is still valid
          const response = await auth.me();
          setUser(response.data.user);
          setRetailerProfile(response.data.retailer);
          localStorage.setItem('smartshelf_user', JSON.stringify(response.data.user));
        } catch (error) {
          // Token expired or invalid
          localStorage.removeItem('smartshelf_token');
          localStorage.removeItem('smartshelf_user');
          setUser(null);
          setRetailerProfile(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await auth.login(email, password);
      const { token, user: userData, retailer: retailerData } = response.data;
      
      localStorage.setItem('smartshelf_token', token);
      localStorage.setItem('smartshelf_user', JSON.stringify(userData));
      
      setUser(userData);
      setRetailerProfile(retailerData);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid email or password.';
      return { success: false, error: message };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await auth.register(userData);
      const { token, user: userDataResponse, retailer: retailerData } = response.data;
      
      localStorage.setItem('smartshelf_token', token);
      localStorage.setItem('smartshelf_user', JSON.stringify(userDataResponse));
      
      setUser(userDataResponse);
      setRetailerProfile(retailerData);
      
      return { success: true };
    } catch (error) {
      const errors = error.response?.data?.errors;
      let message = 'Registration failed. Please try again.';
      if (errors) {
        message = Object.values(errors).flat().join(', ');
      }
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await auth.logout();
    } catch (error) {
      // Ignore errors on logout
    }
    localStorage.removeItem('smartshelf_token');
    localStorage.removeItem('smartshelf_user');
    setUser(null);
    setRetailerProfile(null);
  };

  const updateProfile = async (updatedData) => {
    try {
      const response = await retailer.updateProfile(updatedData);
      const updatedRetailer = response.data.data;
      setRetailerProfile(updatedRetailer);
      
      // Update user store name if changed
      if (updatedData.store_name && user) {
        const updatedUser = { ...user, name: updatedData.store_name };
        setUser(updatedUser);
        localStorage.setItem('smartshelf_user', JSON.stringify(updatedUser));
      }
      
      return { success: true, data: updatedRetailer };
    } catch (error) {
      const errors = error.response?.data?.errors;
      let message = 'Update failed.';
      if (errors) {
        message = Object.values(errors).flat().join(', ');
      }
      return { success: false, error: message };
    }
  };

  const refreshProfile = async () => {
    try {
      const response = await auth.me();
      setUser(response.data.user);
      setRetailerProfile(response.data.retailer);
      localStorage.setItem('smartshelf_user', JSON.stringify(response.data.user));
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  const value = {
    user,
    retailer: retailerProfile,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    refreshProfile,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};