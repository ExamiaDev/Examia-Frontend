/**
 * Environment Configuration
 * Centralized configuration for different environments
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const config = {
  api: {
    baseUrl: API_BASE_URL,
    timeout: 10000,
  },
};

export default config;

