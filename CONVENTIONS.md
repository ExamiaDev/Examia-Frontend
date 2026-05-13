# 📋 Convenciones del Proyecto - Examia Frontend

## 🎯 Objetivos

Mantener consistencia, legibilidad y mantenibilidad del código en toda la aplicación.

---

## 📝 Nombres

### Archivos

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Componentes React | PascalCase con `.jsx` | `AuthForm.jsx` |
| Servicios | PascalCase con `.js` | `AuthService.js` |
| APIs | PascalCase con `.js` | `AuthAPI.js` |
| Utilidades | camelCase con `.js` | `validateEmail.js` |
| Constantes | SCREAMING_SNAKE_CASE | `API_TIMEOUT.js` |
| Configuración | camelCase | `environment.js` |

### Variables y Funciones

```javascript
// Variables: camelCase
const isAuthenticated = true;
const userEmail = 'user@example.com';

// Constantes: SCREAMING_SNAKE_CASE
const MAX_PASSWORD_LENGTH = 128;
const API_TIMEOUT = 10000;

// Funciones: camelCase
function validateEmail(email) {}
const handleSubmit = async () => {};

// Booleanos: prefijo is/has/can
const isLoading = false;
const hasError = true;
const canEditProfile = true;
```

### Clases

```javascript
// PascalCase
class AuthService {}
class User {}
class ValidationError extends Error {}
```

---

## 📂 Estructura de Componentes React

### Componente Funcional Básico

```javascript
/**
 * AuthForm Component
 * Descripción breve de qué hace el componente
 */

import { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import CustomTextField from './CustomTextField';
import AuthService from '../../application/services/AuthService';

/**
 * Component props documentation
 * @param {Function} onSuccess - Callback cuando la autenticación es exitosa
 * @param {string} initialMode - Modo inicial: 'login' | 'register'
 */
function AuthForm({ onSuccess, initialMode = 'login' }) {
  // 1. State declarations
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2. Effects
  useEffect(() => {
    // Limpiar estado cuando cambia el modo
    setFormData({});
    setError(null);
  }, [mode]);

  // 3. Event handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        await AuthService.login(formData.username, formData.password);
      } else {
        await AuthService.register(
          formData.username,
          formData.email,
          formData.password
        );
      }
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. Render
  return (
    <Box component="form" onSubmit={handleSubmit}>
      <CustomTextField
        label="Usuario"
        name="username"
        value={formData.username || ''}
        onChange={handleFormChange}
        disabled={loading}
      />
      <Button type="submit" variant="contained" disabled={loading}>
        Enviar
      </Button>
    </Box>
  );
}

export default AuthForm;
```

### Componente con Hooks Personalizados

```javascript
import { useCallback, useMemo } from 'react';

// Hook personalizado
function useFormState(initialValues) {
  const [values, setValues] = useState(initialValues);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  return [values, handleChange, reset];
}

// Usar el hook
function MyComponent() {
  const [formData, handleChange, reset] = useFormState({});
  return <></>;
}
```

---

## 🏗 Estructura de Servicios

### Estructura de Servicio

```javascript
/**
 * Auth Service
 * Maneja toda la lógica de autenticación
 */

import AuthAPI from '../api/AuthAPI';
import { ValidationError, AuthenticationError } from '../../domain/errors/AppErrors';

export const AuthService = {
  /**
   * Realiza login con credenciales
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} Objeto con token y datos del usuario
   * @throws {ValidationError} Si faltan parámetros
   * @throws {AuthenticationError} Si falla la autenticación
   */
  login: async (username, password) => {
    // Validación
    if (!username || !password) {
      throw new ValidationError('Username and password are required');
    }

    try {
      const response = await AuthAPI.login(username, password);
      
      // Guardar en localStorage
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtiene el usuario actual del localStorage
   * @returns {Object|null}
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

export default AuthService;
```

---

## 🔌 Estructura de APIs

### Estructura de Client API

```javascript
/**
 * Auth API
 * Endpoints relacionados con autenticación
 */

import httpClient from '../http/httpClient';
import { InvalidCredentialsError } from '../../domain/errors/AppErrors';

export const AuthAPI = {
  /**
   * Login endpoint
   * @param {string} username
   * @param {string} password
   * @returns {Promise<Object>}
   */
  login: async (username, password) => {
    try {
      const response = await httpClient.post('/auth/login', {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      // Manejo de errores específicos
      if (error.response?.status === 401) {
        throw new InvalidCredentialsError('Invalid credentials');
      }
      throw error;
    }
  },
};

export default AuthAPI;
```

---

## 🎨 Estilos y Material-UI

### Usando Material-UI

```javascript
import { Box, Button, TextField, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';

// 1. Componentes directos
<Box sx={{ padding: 2, backgroundColor: '#f5f5f5' }}>
  <Button variant="contained">Click me</Button>
</Box>

// 2. Componentes estilizados
const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

// 3. Temas personalizados
const theme = createTheme({
  palette: {
    primary: {
      main: '#0052cc',
    },
    secondary: {
      main: '#7c3aed',
    },
  },
});
```

### Propiedades sx comunes

```javascript
// Espaciado
sx={{ 
  padding: 2,        // Usa unidades de tema
  margin: 1,
  marginTop: 3,
  marginX: 2,       // X = left + right
  marginY: 2,       // Y = top + bottom
}}

// Colores
sx={{
  backgroundColor: 'primary.main',
  color: 'text.primary',
  borderColor: 'divider',
}}

// Flexbox
sx={{
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
}}

// Responsive
sx={{
  fontSize: { xs: '14px', sm: '16px', md: '18px' },
  padding: { xs: 1, sm: 2, md: 3 },
}}

// Hover, Focus states
sx={{
  '&:hover': {
    backgroundColor: 'grey.100',
  },
  '&:focus': {
    outline: '2px solid blue',
  },
}}
```

---

## 🧪 Estructura de Errores

### Errores Personalizados

```javascript
/**
 * Base Error Class
 */
class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Errores Específicos
 */
export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

// Uso
try {
  // algún código
} catch (error) {
  if (error instanceof ValidationError) {
    // Manejar error de validación
  } else if (error instanceof AuthenticationError) {
    // Manejar error de autenticación
  }
}
```

---

## 📝 Comentarios

### Comentarios de Función

```javascript
/**
 * Valida si es un email válido
 * @param {string} email - El email a validar
 * @returns {boolean} True si es válido, false si no
 * 
 * @example
 * isValidEmail('user@example.com') // true
 */
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
```

### Comentarios Inline

```javascript
// ✅ Bueno: Explica el por qué
const MAX_ATTEMPTS = 5; // Limitar a 5 intentos de login para seguridad

// ❌ Malo: Explica lo obvio
const count = 5; // establece count a 5

// ✅ Bueno: TODO/FIXME/NOTE
// TODO: Implementar recuperación de contraseña
// FIXME: Este bug ocurre cuando hay muchas solicitudes simultáneas
// NOTE: El backend devuelve timestamps en UTC
```

---

## 🔄 Git & Commits

### Mensaje de Commit

```
<tipo>(<alcance>): <asunto>

<cuerpo>

<pie de página>
```

### Tipos válidos

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Documentación
- `style:` Formato/linting
- `refactor:` Refactorización
- `perf:` Mejora de performance
- `test:` Tests
- `chore:` Cambios en configuración

### Ejemplos

```bash
git commit -m "feat(auth): agregar validación de email"
git commit -m "fix(login): corregir manejo de errores 401"
git commit -m "docs: actualizar guía de instalación"
git commit -m "refactor(services): mejorar estructura de AuthService"
git commit -m "perf(api): agregar caché de respuestas"
```

---

## ✅ Checklist Antes de Commit

- [ ] El código sigue las convenciones del proyecto
- [ ] He ejecutado `npm run lint`
- [ ] He testeado manualmente la funcionalidad
- [ ] No hay `console.log` en producción
- [ ] He actualizado documentación si es necesario
- [ ] El commit tiene un mensaje descriptivo
- [ ] No hay cambios sin intención en otros archivos

---

## 🚀 Performance

### Evita

```javascript
// ❌ Crear funciones en cada render
function Component() {
  const handleClick = () => {}; // Se crea en cada render
  return <Button onClick={handleClick} />;
}

// ✅ Usa useCallback
function Component() {
  const handleClick = useCallback(() => {}, []);
  return <Button onClick={handleClick} />;
}
```

### Optimización de Re-renders

```javascript
import { memo, useMemo } from 'react';

// Memorizar componente
const ListItem = memo(({ item, onSelect }) => {
  return <div onClick={() => onSelect(item)}>{item.name}</div>;
});

// Memorizar valores
function Component() {
  const expensiveValue = useMemo(() => {
    return computeExpensiveValue(data);
  }, [data]);
}
```

---

## 📚 Referencias

- [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Material-UI API](https://mui.com/api/)

---

**Última actualización**: 2026-05-13

