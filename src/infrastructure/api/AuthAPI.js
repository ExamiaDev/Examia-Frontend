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
