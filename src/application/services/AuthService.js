import AuthAPI from '../../infrastructure/api/AuthAPI';
import { ValidationError } from '../../domain/errors/AppErrors';
import { debugJwt } from '../../utils/jwt';

// Extrae el JWT del response soportando distintos nombres de campo
const extractToken = (response) =>
  response?.token || response?.accessToken || response?.jwt || response?.access_token || null;

const persistSession = (response, extras = {}) => {
  const token = extractToken(response);
  if (token) {
    localStorage.setItem('authToken', token);
    debugJwt(token, 'authToken guardado');
  } else {
    console.warn('[Auth] El response no contiene un token reconocible:', response);
  }
  const user = {
    email: response.email,
    nombre: response.nombre,
    apellido: response.apellido,
    role: response.role,
    ...extras,
  };
  localStorage.setItem('user', JSON.stringify(user));
};

export const AuthService = {
  register: async ({ nombre, apellido, username, email, recoveryEmail, password, role }) => {
    if (!nombre || !apellido || !username || !email || !recoveryEmail || !password) {
      throw new ValidationError('Todos los campos son obligatorios');
    }
    if (/\s/.test(username)) {
      throw new ValidationError('El nombre de usuario no puede contener espacios');
    }

    const response = await AuthAPI.register({ nombre, apellido, username, email, recoveryEmail, password, role });
    persistSession(response);
    return response;
  },

  login: async (email, password) => {
    if (!email || !password) {
      throw new ValidationError('El email y la contraseña son obligatorios');
    }

    const response = await AuthAPI.login(email, password);
    persistSession(response);
    return response;
  },

  loginUade: async (email, legajo, password) => {
    if (!email || !legajo || !password) {
      throw new ValidationError('Email, legajo y contraseña son obligatorios');
    }

    const response = await AuthAPI.loginUade(email, legajo, password);
    persistSession(response, { legajo: response.legajo });
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
