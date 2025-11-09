import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import app from ''

// Configure axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
axios.defaults.headers.common['Content-Type'] = 'application/json';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      console.log('Fetching user data from /api/auth/me');
      const response = await axios.get('/api/auth/me');
      console.log('User data fetched successfully:', response.data.user);
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      console.error('Error response status:', error.response?.status);
      console.error('Error response data:', error.response?.data);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const requestId = `login-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    try {
      console.log(`[${requestId}] Attempting login with:`, { email, password: '***' });
      console.log(`[${requestId}] API URL:`, `${axios.defaults.baseURL}/api/auth/login`);
      console.log(`[${requestId}] Request headers:`, axios.defaults.headers.common);
      const response = await axios.post('/api/auth/login', { email, password, requestId });
      console.log(`[${requestId}] Login response status:`, response.status);
      console.log(`[${requestId}] Login response:`, response.data);
      const { token, user } = response.data;

      console.log(`[${requestId}] Setting token in localStorage:`, token ? 'Token present' : 'No token');
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log(`[${requestId}] Setting user in state:`, user);
      setUser(user);

      console.log(`[${requestId}] Login successful, returning success`);
      return { success: true };
    } catch (error) {
      console.error(`[${requestId}] Login error:`, error);
      console.error(`[${requestId}] Error response status:`, error.response?.status);
      console.error(`[${requestId}] Error response data:`, error.response?.data);
      console.error(`[${requestId}] Error message:`, error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log('Attempting registration with:', { ...userData, password: '***' });
      const response = await axios.post('/api/auth/register', userData);
      console.log('Registration response status:', response.status);
      console.log('Registration response:', response.data);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response status:', error.response?.status);
      console.error('Error response data:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
