import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
    const storedUser = localStorage.getItem('smartshelf_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Demo login - in real app, this would be an API call
    // For demo purposes, any email/password works
    const mockUser = {
      id: 1,
      name: email.split('@')[0],
      email: email,
      storeName: "Fresh Mart",
      avatar: "https://ui-avatars.com/api/?background=3b82f6&color=fff&name=" + email.charAt(0)
    };
    localStorage.setItem('smartshelf_user', JSON.stringify(mockUser));
    setUser(mockUser);
    return true;
  };

  const signup = (name, email, password, storeName) => {
    const newUser = {
      id: Date.now(),
      name: name,
      email: email,
      storeName: storeName,
      avatar: `https://ui-avatars.com/api/?background=3b82f6&color=fff&name=${name.charAt(0)}`
    };
    localStorage.setItem('smartshelf_user', JSON.stringify(newUser));
    setUser(newUser);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('smartshelf_user');
    setUser(null);
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    localStorage.setItem('smartshelf_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};