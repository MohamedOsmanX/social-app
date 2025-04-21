import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get('/api/users/profile');
      setUser(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user:', err);
      logout(); // If token is invalid, logout user
      setLoading(false);
    }
  };

  const login = async (emailOrUsername, password) => {
    try {
      setError('');
      console.log('AuthContext: Sending login request...', {emailOrUsername, password});
      
      // Make sure we're sending the exact field names the backend expects
      const res = await axios.post('/api/auth/login', { 
        emailOrUsername, 
        password 
      });
      
      console.log('AuthContext: Login response:', res.data);
      
      if (res.data && res.data.token) {
        const { token, user } = res.data;
        
        console.log('AuthContext: Login successful, setting token and user...');
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setUser(user);
        console.log('AuthContext: User state updated', user);
        return { success: true };
      } else {
        console.error('AuthContext: Login response missing token or user data');
        return { 
          success: false, 
          error: 'Invalid response from server' 
        };
      }
    } catch (err) {
      console.error('AuthContext: Login error:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Login failed. Please check your credentials.' 
      };
    }
  };

  const register = async (userData) => {
    try {
      setError('');
      console.log('AuthContext: Sending registration request...', userData);
      
      const res = await axios.post('/api/auth/register', userData);
      console.log('AuthContext: Registration response:', res.data);
      
      if (res.data && res.data.token) {
        const { token, user } = res.data;
        
        console.log('AuthContext: Registration successful, setting token and user...');
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setUser(user);
        console.log('AuthContext: User state updated', user);
        return { success: true };
      } else {
        console.error('AuthContext: Registration response missing token or user data');
        return { 
          success: false, 
          error: 'Invalid response from server' 
        };
      }
    } catch (err) {
      console.error('AuthContext: Registration error:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await axios.put('/api/users/profile', profileData);
      setUser(res.data);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Profile update failed' 
      };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 