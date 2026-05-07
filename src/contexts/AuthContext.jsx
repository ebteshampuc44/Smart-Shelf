// src/contexts/AuthContext.jsx
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
        const storedRetailer = localStorage.getItem('smartshelf_retailer');
        if (storedRetailer) {
          setRetailerProfile(JSON.parse(storedRetailer));
        }
        try {
          const response = await auth.me();
          if (response.data.user) {
            setUser(response.data.user);
            setRetailerProfile(response.data.retailer);
            localStorage.setItem('smartshelf_user', JSON.stringify(response.data.user));
            localStorage.setItem('smartshelf_retailer', JSON.stringify(response.data.retailer));
          }
        } catch (error) {
          console.error('Auth check failed:', error);
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
      localStorage.setItem('smartshelf_retailer', JSON.stringify(retailerData));
      
      setUser(userData);
      setRetailerProfile(retailerData);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
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
      localStorage.setItem('smartshelf_retailer', JSON.stringify(retailerData));
      
      setUser(userDataResponse);
      setRetailerProfile(retailerData);
      
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      const errors = error.response?.data?.errors;
      let message = 'Registration failed. Please try again.';
      if (errors) {
        message = Object.values(errors).flat().join(', ');
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('smartshelf_token');
    localStorage.removeItem('smartshelf_user');
    localStorage.removeItem('smartshelf_retailer');
    setUser(null);
    setRetailerProfile(null);
  };

  const updateProfile = async (updatedData) => {
    try {
      const response = await retailer.updateProfile(updatedData);
      const updatedRetailer = response.data.data;
      setRetailerProfile(updatedRetailer);
      localStorage.setItem('smartshelf_retailer', JSON.stringify(updatedRetailer));
      return { success: true, data: updatedRetailer };
    } catch (error) {
      console.error('Update profile error:', error);
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
      localStorage.setItem('smartshelf_retailer', JSON.stringify(response.data.retailer));
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