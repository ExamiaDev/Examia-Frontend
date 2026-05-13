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

  /**
   * @param {{ nombre: string, apellido: string, email: string, password: string, role: 'ALUMNO'|'PROFESOR' }} data
   */
  register: async ({ nombre, apellido, email, password, role }) => {
    if (!nombre || !apellido || !email || !password || !role) {
      throw new ValidationError('Todos los campos son obligatorios');
    }
    if (!isValidEmail(email)) {
      throw new ValidationError('Formato de email inválido');
    }
    if (password.length < 6) {
      throw new ValidationError('La contraseña debe tener al menos 6 caracteres');
    }

    const response = await AuthAPI.register({ nombre, apellido, email, password, role });

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

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default AuthService;
