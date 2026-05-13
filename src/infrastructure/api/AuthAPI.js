/**
 * Auth API
 * API endpoints for authentication operations
 */

import httpClient from '../http/httpClient';
import { AuthenticationError, InvalidCredentialsError, UserAlreadyExistsError } from '../../domain/errors/AppErrors';

export const AuthAPI = {
  /**
   * Login with username and password
   * @param {string} username - User username
   * @param {string} password - User password
   * @returns {Promise<{token: string, user: Object}>}
   */
  login: async (username, password) => {
    try {
      const response = await httpClient.post('/auth/login', {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new InvalidCredentialsError('Invalid username or password');
      }
      if (error.response?.data?.message) {
        throw new AuthenticationError(error.response.data.message);
      }
      throw new AuthenticationError('Login failed. Please try again.');
    }
  },

  /**
   * Register a new user
   * @param {string} username - User username
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{token: string, user: Object}>}
   */
  register: async (username, email, password) => {
    try {
      const response = await httpClient.post('/auth/register', {
        username,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new UserAlreadyExistsError('User already exists with this username or email');
      }
      if (error.response?.data?.message) {
        throw new AuthenticationError(error.response.data.message);
      }
      throw new AuthenticationError('Registration failed. Please try again.');
    }
  },

  /**
   * Logout the current user
   */
  logout: async () => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
};

export default AuthAPI;

