import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on initial load
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/user/login', { email, password });
      const { token, checkUser } = response.data;
      
      setUser(checkUser);
      setToken(token);
      
      localStorage.setItem('user', JSON.stringify(checkUser));
      localStorage.setItem('token', token);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || error.response?.data?.error?.[0]?.msg || 'Login failed'
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await api.post('/user/register', { username, email, password, role: 'user' });
      const { token, user: newUser } = response.data;
      
      setUser(newUser);
      setToken(token);
      
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', token);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || error.response?.data?.error?.[0]?.msg || 'Registration failed'
      };
    }
  };

  const logout = async () => {
    try {
      await api.get('/user/logout');
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
