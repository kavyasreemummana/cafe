import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

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
  const [error, setError] = useState(null);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (apiService.isAuthenticated()) {
          const response = await apiService.getProfile();
          if (response.success) {
            setUser(response.data);
          } else {
            // Token is invalid, clear it
            apiService.clearToken();
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        apiService.clearToken();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await apiService.login(credentials);
      
      if (response.success) {
        setUser(response.data.user);
        return { success: true };
      } else {
        setError(response.error || 'Login failed');
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await apiService.register(userData);
      
      if (response.success) {
        setUser(response.data.user);
        return { success: true };
      } else {
        setError(response.error || 'Registration failed');
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    apiService.logout();
    setUser(null);
    setError(null);
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await apiService.updateProfile(profileData);
      
      if (response.success) {
        setUser(response.data);
        return { success: true };
      } else {
        setError(response.error || 'Profile update failed');
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = error.message || 'Profile update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Change password function
  const changePassword = async (passwordData) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await apiService.changePassword(passwordData);
      
      if (response.success) {
        return { success: true };
      } else {
        setError(response.error || 'Password change failed');
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = error.message || 'Password change failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
