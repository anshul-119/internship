import api from './api';
import { MOCK_USER } from '@/constants';

export const authService = {
  /**
   * Submits email and password to log in.
   * Gracefully falls back to mock user data if backend API is not responding.
   */
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.warn('Authentication API failed, falling back to local simulation:', error.message || error);
      
      // Authenticate against our configured mock user constant
      if (email.toLowerCase() === MOCK_USER.EMAIL.toLowerCase() && password === MOCK_USER.PASSWORD) {
        return {
          token: 'mock_jwt_token_aura_portal_2026',
          user: {
            email: MOCK_USER.EMAIL,
            name: MOCK_USER.NAME,
            role: MOCK_USER.ROLE,
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80',
          }
        };
      }
      
      throw {
        message: 'Invalid credentials. Try admin@auraportal.com with Password123!',
        status: 400
      };
    }
  },

  /**
   * Submits user credentials to sign up.
   * Auto-authenticates and logs in on success via mock system.
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.warn('Registration API failed, falling back to local simulation:', error.message || error);
      
      return {
        token: 'mock_jwt_token_registered_user',
        user: {
          email: userData.email,
          name: userData.name,
          role: 'Registered Professional',
          avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=100&h=100&q=80',
        }
      };
    }
  },

  /**
   * Retrieves active authenticated profile details.
   */
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.warn('Fetch profile API failed, falling back to local simulation:', error.message || error);
      
      return {
        email: MOCK_USER.EMAIL,
        name: MOCK_USER.NAME,
        role: MOCK_USER.ROLE,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80',
      };
    }
  }
};
