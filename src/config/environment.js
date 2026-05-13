/**
 * Environment Configuration
 * Centralized configuration for different environments
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

console.log('[Examia] VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('[Examia] API_BASE_URL:', API_BASE_URL);

export const config = {
  api: {
    baseUrl: API_BASE_URL,
    timeout: 10000,
  },
};

export default config;

