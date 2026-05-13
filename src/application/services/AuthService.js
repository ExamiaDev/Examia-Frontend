/**
 * Auth Service
 * Business logic for authentication operations
 */

import AuthAPI from '../../infrastructure/api/AuthAPI';
import { AuthenticationError, ValidationError } from '../../domain/errors/AppErrors';

export const AuthService = {
  /**
   * Perform login
   * @param {string} username
   * @param {string} password
   * @returns {Promise<{token: string, user: Object}>}
   */
  login: async (username, password) => {
    // Validation
    if (!username || !password) {
      throw new ValidationError('Username and password are required');
    }

    try {
      const response = await AuthAPI.login(username, password);

      // Store token and user data
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Perform registration
   * @param {string} username
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{token: string, user: Object}>}
   */
  register: async (username, email, password) => {
    // Validation
    if (!username || !email || !password) {
      throw new ValidationError('Username, email, and password are required');
    }

    if (!isValidEmail(email)) {
      throw new ValidationError('Invalid email format');
    }

    if (password.length < 6) {
      throw new ValidationError('Password must be at least 6 characters long');
    }

    try {
      const response = await AuthAPI.register(username, email, password);

      // Store token and user data
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Perform logout
   */
  logout: async () => {
    await AuthAPI.logout();
  },

  /**
   * Get current user
   * @returns {Object|null}
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
};

/**
 * Helper function to validate email
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default AuthService;

