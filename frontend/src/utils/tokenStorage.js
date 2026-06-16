const TOKEN_KEY = 'jwt_token';

export const tokenStorage = {
  /**
   * Retrieve token from localStorage
   * @returns {string|null}
   */
  getToken: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (e) {
      console.warn('Error reading token from localStorage:', e);
      return null;
    }
  },

  /**
   * Store token in localStorage
   * @param {string} token 
   */
  setToken: (token) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      console.warn('Error saving token to localStorage:', e);
    }
  },

  /**
   * Remove token from localStorage
   */
  removeToken: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.warn('Error removing token from localStorage:', e);
    }
  }
};
