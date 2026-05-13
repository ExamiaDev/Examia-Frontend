import httpClient from '../http/httpClient';
import { AuthenticationError, InvalidCredentialsError, UserAlreadyExistsError } from '../../domain/errors/AppErrors';

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

  /**
   * @param {{ nombre: string, apellido: string, email: string, password: string, role: 'ALUMNO'|'PROFESOR' }} data
   */
  register: async ({ nombre, apellido, email, password, role }) => {
    try {
      const response = await httpClient.post('/auth/register', {
        nombre,
        apellido,
        email,
        password,
        role,
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new UserAlreadyExistsError('Ya existe una cuenta con ese correo electrónico');
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
    } catch {
      // Endpoint pendiente de implementación en backend
      // Se silencia el error intencionalmente — no revelar si el email existe
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
