import AuthAPI from '../../infrastructure/api/AuthAPI';
import { ValidationError } from '../../domain/errors/AppErrors';

export const AuthService = {
  register: async ({ nombre, apellido, username, email, recoveryEmail, password }) => {
    if (!nombre || !apellido || !username || !email || !recoveryEmail || !password) {
      throw new ValidationError('Todos los campos son obligatorios');
    }
    if (/\s/.test(username)) {
      throw new ValidationError('El nombre de usuario no puede contener espacios');
    }

    const response = await AuthAPI.register({ nombre, apellido, username, email, recoveryEmail, password });

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

  forgotPassword: async (email) => {
    if (!email) throw new ValidationError('El email es obligatorio');
    return AuthAPI.forgotPassword(email);
  },

  verifyResetCode: async (email, code) => {
    if (!email || !code) throw new ValidationError('Email y código son obligatorios');
    return AuthAPI.verifyResetCode(email, code);
  },

  resetPassword: async (email, code, newPassword) => {
    if (!email || !code || !newPassword) throw new ValidationError('Todos los campos son obligatorios');
    return AuthAPI.resetPassword(email, code, newPassword);
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
