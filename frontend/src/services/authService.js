import api from './api';

export const authService = {
  /**
   * Submit registration details
   * @param {Object} data - { name, email, password }
   * @returns {Promise<any>}
   */
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  /**
   * Verify registration OTP code
   * @param {Object} data - { email, otp }
   * @returns {Promise<any>}
   */
  verifyRegisterOtp: async (data) => {
    const response = await api.post('/auth/verify-register-otp', data);
    return response.data;
  },

  /**
   * Submit login details to trigger OTP dispatch
   * @param {Object} data - { email, password }
   * @returns {Promise<any>}
   */
  login: async (data) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  /**
   * Verify login OTP code to receive access token
   * @param {Object} data - { email, otp }
   * @returns {Promise<any>}
   */
  verifyLoginOtp: async (data) => {
    const response = await api.post('/auth/verify-login-otp', data);
    return response.data;
  },

  /**
   * Retrieve active authenticated profile details
   * @returns {Promise<any>}
   */
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};
export default authService;
