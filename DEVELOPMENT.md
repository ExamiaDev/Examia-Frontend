# 📚 Guía de Desarrollo - Examia Frontend

Bienvenido a Examia Frontend. Esta guía te ayudará a entender la estructura del proyecto y cómo empezar a desarrollar.

## 🎯 Objetivos del Proyecto

Examia es una plataforma de evaluación educativa con:
- Sistema de autenticación seguro
- Interfaz responsiva y moderna
- Arquitectura escalable y mantenible
- Experiencia de usuario intuitiva

## 📂 Estructura de Carpetas Explicada

```
src/
├── domain/              # Lógica de negocio pura (Sin dependencias de React)
│   ├── models/
│   │   └── User.js     # Clases que representan entidades
│   └── errors/
│       └── AppErrors.js # Errores personalizados
│
├── application/        # Casos de uso y orquestación
│   └── services/
│       └── AuthService.js  # Lógica de autenticación
│
├── infrastructure/     # Integraciones externas (APIs, HTTP)
│   ├── api/
│   │   └── AuthAPI.js  # Llamadas HTTP a endpoints
│   └── http/
│       └── httpClient.js # Cliente HTTP configurado
│
├── presentation/       # Componentes React
│   ├── components/     # Componentes reutilizables
│   ├── pages/          # Páginas completas
│   └── layouts/        # Layouts comunes
│
├── config/            # Configuración global
├── utils/             # Utilidades compartidas
└── App.jsx            # Componente raíz
```

## 🔄 Flujo de Datos

```
User Input (Component)
    ↓
AuthForm (Component)
    ↓
AuthService (Application Layer)
    ↓
AuthAPI (Infrastructure Layer)
    ↓
HTTP Client (Axios)
    ↓
Backend API
    ↓
Response → LocalStorage → Dashboard
```

## 🛠 Cómo Agregar una Nueva Funcionalidad

### Ejemplo: Agregar endpoint para obtener perfil de usuario

#### 1. Crear modelo en Domain
```javascript
// src/domain/models/User.js
export class UserProfile {
  constructor(id, username, email, role, createdAt) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.role = role;
    this.createdAt = createdAt;
  }
}
```

#### 2. Agregar error personalizado si es necesario
```javascript
// src/domain/errors/AppErrors.js
export class ForbiddenError extends Error {
  constructor(message = 'Access forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}
```

#### 3. Agregar llamada a API
```javascript
// src/infrastructure/api/UserAPI.js
export const UserAPI = {
  getProfile: async (userId) => {
    try {
      const response = await httpClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new ForbiddenError();
      }
      throw error;
    }
  },
};
```

#### 4. Agregar servicio en Application
```javascript
// src/application/services/UserService.js
export const UserService = {
  getProfile: async (userId) => {
    const profile = await UserAPI.getProfile(userId);
    return new UserProfile(profile.id, profile.username, ...);
  },
};
```

#### 5. Usar en Componente React
```javascript
// src/presentation/pages/ProfilePage.jsx
import { useEffect, useState } from 'react';
import UserService from '../../../application/services/UserService';

const ProfilePage = ({ userId }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    UserService.getProfile(userId).then(setProfile);
  }, [userId]);

  return <div>{profile?.username}</div>;
};
```

## 🧩 Patrones Comunes

### Manejo de Errores
```javascript
try {
  await SomeService.doSomething();
} catch (error) {
  if (error.name === 'ValidationError') {
    // Mostrar error de validación al usuario
  } else if (error.name === 'AuthenticationError') {
    // Redirigir al login
  } else {
    // Error genérico
  }
}
```

### Loading States
```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const handleSubmit = async () => {
  setLoading(true);
  setError(null);
  
  try {
    await someAsyncOperation();
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Validación de Formularios
```javascript
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 6;
};
```

## 🔐 Seguridad

### Almacenamiento de Token
- Los tokens se guardan en `localStorage`
- Se incluyen automáticamente en headers con Axios interceptor
- Se limpian al cerrar sesión

### Protección de Rutas
```javascript
// En App.jsx, agregar ProtectedRoute
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};
```

## 📝 Convenciones de Código

### Nombres de Archivos
- Componentes React: PascalCase (e.g., `AuthForm.jsx`)
- Servicios/APIs: PascalCase (e.g., `AuthService.js`)
- Utilidades: camelCase (e.g., `validateEmail.js`)
- Constantes: SCREAMING_SNAKE_CASE (e.g., `API_TIMEOUT`)

### Estructura de Componentes
```javascript
// 1. Imports
import { useState, useEffect } from 'react';
import SomeAPI from '../../../infrastructure/api/SomeAPI';

// 2. Component
function MyComponent(props) {
  // 3. State
  const [state, setState] = useState(null);
  
  // 4. Effects
  useEffect(() => {
    // ...
  }, []);
  
  // 5. Handlers
  const handleClick = () => {};
  
  // 6. Render
  return <div>Component</div>;
}

// 7. Export
export default MyComponent;
```

## 🧪 Testing (Futuro)

Cuando se implemente testing:

```bash
# Ejecutar todos los tests
npm run test

# Tests en watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## 🐛 Debugging Tips

### Ver token en consola
```javascript
console.log(localStorage.getItem('authToken'));
```

### Ver usuario actual
```javascript
console.log(localStorage.getItem('user'));
```

### Limpiar sesión
```javascript
localStorage.clear();
location.reload();
```

### Inspeccionar peticiones HTTP
1. Abre DevTools (F12)
2. Ve a Network tab
3. Busca peticiones POST/GET
4. Revisa Request/Response

## 📚 Recursos Útiles

- [Material-UI Docs](https://mui.com)
- [React Hooks](https://react.dev/reference/react)
- [Axios Docs](https://axios-http.com)
- [React Router](https://reactrouter.com)

## ❓ FAQ

**P: ¿Cómo agrego un nuevo endpoint?**
A: Sigue los 5 pasos en la sección "Cómo agregar una nueva funcionalidad"

**P: ¿Dónde agrego validaciones?**
A: En `AuthService` o en el componente, dependiendo de si es lógica de negocio o UI

**P: ¿Cómo manejo errores del backend?**
A: Captura en el `catch` de `AuthAPI` y lanza un error personalizado del `domain/errors`

**P: ¿Cómo persisto datos?**
A: Usa `localStorage` en el servicio, como lo hace `AuthService`

---

**¿Preguntas? Abre un issue en GitHub o contacta al equipo.**

