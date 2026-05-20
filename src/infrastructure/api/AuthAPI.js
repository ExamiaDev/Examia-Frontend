import httpClient from '../http/httpClient';
import { AuthenticationError, InvalidCredentialsError } from '../../domain/errors/AppErrors';

export const AuthAPI = {
  login: async (email, password) => {
    try {
      const response = await httpClient.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new InvalidCredentialsError('Email o contraseña incorrectos');
      }
      if (error.response?.data?.message) {
        throw new AuthenticationError(error.response.data.message);
      }
      throw new AuthenticationError('Error al iniciar sesión. Intentá de nuevo.');
    }
  },

  register: async (data) => {
    try {
      const response = await httpClient.post('/auth/register', data);
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new AuthenticationError(error.response.data.message || 'El usuario ya existe');
      }
      if (error.response?.data?.message) {
        throw new AuthenticationError(error.response.data.message);
      }
      throw new AuthenticationError('Error al registrarse. Intentá de nuevo.');
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await httpClient.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new AuthenticationError(error.response.data.message);
      }
      throw new AuthenticationError('Error al enviar el código. Intentá de nuevo.');
    }
  },

  verifyResetCode: async (email, code) => {
    try {
      const response = await httpClient.post('/auth/verify-reset-code', { email, code });
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new AuthenticationError(error.response.data.message);
      }
      throw new AuthenticationError('Código inválido o expirado.');
    }
  },

  resetPassword: async (email, code, newPassword) => {
    try {
      const response = await httpClient.post('/auth/reset-password', { email, code, newPassword });
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new AuthenticationError(error.response.data.message);
      }
      throw new AuthenticationError('Error al restablecer la contraseña.');
    }
  },

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
