/**
 * HTTP Client
 * Centralized HTTP client using Axios with interceptors
 */

import axios from 'axios';
import { config } from '../../config/environment';

const httpClient = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('[HTTP]', config.method?.toUpperCase(), config.baseURL + config.url, token ? '(con token)' : '(sin token)');
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
httpClient.interceptors.response.use(
  (response) => {
    console.log('[HTTP]', response.config.method?.toUpperCase(), response.config.url, '→', response.status);
    return response;
  },
  (error) => {
    const url = error.config?.url ?? '';
    const status = error.response?.status;
    console.error('[HTTP] Error', error.config?.method?.toUpperCase(), url, '→', status, error.message);

    // Solo redirigir a login si el 401 viene de un endpoint protegido (no de auth)
    if (status === 401 && !url.includes('/auth/')) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default httpClient;

