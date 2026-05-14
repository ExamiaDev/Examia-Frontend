import AuthAPI from '../../infrastructure/api/AuthAPI';
import { ValidationError } from '../../domain/errors/AppErrors';

export const AuthService = {
  login: async (email, password) => {
    if (!email || !password) {
      throw new ValidationError('El email y la contraseña son obligatorios');
    }

    const response = await AuthAPI.login(email, password);

    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }
    const user = {
      email: response.email,
      nombre: response.nombre,
      apellido: response.apellido,
      role: response.role,
    };
    localStorage.setItem('user', JSON.stringify(user));

    return response;
  },

  logout: async () => {
    await AuthAPI.logout();
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
};

export default AuthService;
