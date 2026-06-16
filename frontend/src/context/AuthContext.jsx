import React, { createContext, useState, useEffect } from 'react';
import { tokenStorage } from '@/utils/tokenStorage';
import { authService } from '@/services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session state on startup
  useEffect(() => {
    const initAuth = async () => {
      const token = tokenStorage.getToken();
      if (token) {
        try {
          const profileData = await authService.getProfile();
          setUser(profileData.data);
        } catch (error) {
          console.warn('Failed to restore auth session, token may be invalid:', error.message);
          tokenStorage.removeToken();
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();

    // Listen for global unauthorized events to automatically clean up user profile
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth-unauthorized', handleUnauthorized);
    };
  }, []);

  /**
   * Triggers login service call to dispatch OTP to user email.
   * Note: This does not log the user in yet (no token is returned).
   */
  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Verifies the 6-digit login OTP and stores token on success.
   */
  const verifyLoginOtp = async (email, otp) => {
    setLoading(true);
    try {
      const data = await authService.verifyLoginOtp({ email, otp });
      tokenStorage.setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Triggers register service call to send verification OTP to user email.
   */
  const register = async (name, email, password) => {
    try {
      const response = await authService.register({ name, email, password });
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Verifies the 6-digit registration OTP and stores token on success.
   */
  const verifyRegisterOtp = async (email, otp) => {
    setLoading(true);
    try {
      const data = await authService.verifyRegisterOtp({ email, otp });
      tokenStorage.setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Destroys credentials and clears local states.
   */
  const logout = () => {
    tokenStorage.removeToken();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    verifyLoginOtp,
    register,
    verifyRegisterOtp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
