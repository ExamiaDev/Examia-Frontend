# 🏗️ Arquitectura de Examia Frontend

## Diagrama General

```
┌─────────────────────────────────────────────────────────────┐
│                   NAVEGADOR (Frontend)                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │        PRESENTATION LAYER (React Components)          │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ • LoginPage                                           │  │
│  │ • Dashboard                                           │  │
│  │ • AuthForm (Login/Register)                           │  │
│  │ • Logo, TextField, etc.                              │  │
│  └───────────────┬───────────────────────────────────────┘  │
│                  │                                           │
│                  ▼                                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │     APPLICATION LAYER (Business Logic Services)       │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ • AuthService                                         │  │
│  │   - login()                                           │  │
│  │   - register()                                         │  │
│  │   - logout()                                          │  │
│  │   - getCurrentUser()                                 │  │
│  │   - isAuthenticated()                                │  │
│  └───────────────┬───────────────────────────────────────┘  │
│                  │                                           │
│                  ▼                                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │   INFRASTRUCTURE LAYER (External Integrations)        │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │                                                        │  │
│  │  ┌──────────────────┐      ┌──────────────────────┐  │  │
│  │  │  HTTP Client     │      │  API Adapters        │  │  │
│  │  ├──────────────────┤      ├──────────────────────┤  │  │
│  │  │ • Axios Config   │      │ • AuthAPI.js         │  │  │
│  │  │ • Interceptors   │      │ • UserAPI.js         │  │  │
│  │  │ • Error Handling │      │ • ExamAPI.js         │  │  │
│  │  └──────────┬───────┘      └──────────┬───────────┘  │  │
│  │             │                         │               │  │
│  │             └────────────┬────────────┘               │  │
│  │                          │                            │  │
│  └──────────────────────────┼────────────────────────────┘  │
│                             │                                │
│                             ▼ HTTP Requests/Responses        │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
        ┌─────────────────────────────────────┐
        │   Backend API (Express/Spring)       │
        ├─────────────────────────────────────┤
        │  • POST /api/auth/login              │
        │  • POST /api/auth/register           │
        │  • GET  /api/auth/verify             │
        │  • POST /api/auth/logout             │
        └─────────────────────────────────────┘
                             │
                             ▼
        ┌─────────────────────────────────────┐
        │     Database / Auth Service          │
        └─────────────────────────────────────┘
```

---

## Domain Layer (Dominio)

```
DOMAIN/
├── models/
│   └── User.js
│       - User (clase)
│       - AuthResponse (clase)
│
└── errors/
    └── AppErrors.js
        - ValidationError
        - AuthenticationError
        - UserNotFoundError
        - InvalidCredentialsError
        - UserAlreadyExistsError
```

**Responsabilidades:**
- Definir entidades del negocio
- Definir errores personalizados
- **SIN dependencias** de frameworks

---

## Application Layer (Aplicación)

```
APPLICATION/
└── services/
    └── AuthService.js
        - login(username, password)
        - register(username, email, password)
        - logout()
        - getCurrentUser()
        - isAuthenticated()
```

**Responsabilidades:**
- Implementar lógica de negocio
- Validar inputs
- Orquestar llamadas a infrastructura
- Gestionar localStorage
- **SIN dependencias** de React

---

## Infrastructure Layer (Infraestructura)

```
INFRASTRUCTURE/
├── http/
│   └── httpClient.js
│       - Configuración de Axios
│       - Interceptores (auth, errors)
│       - Timeout
│
└── api/
    └── AuthAPI.js
        - login(username, password)
        - register(username, email, password)
        - logout()
```

**Responsabilidades:**
- Comunicación HTTP
- Parseo de respuestas
- Manejo de errores de red
- Autenticación en headers

---

## Presentation Layer (Presentación)

```
PRESENTATION/
├── components/
│   ├── AuthForm.jsx (login + register)
│   ├── Logo.jsx
│   ├── CustomTextField.jsx
│   └── ...
│
└── pages/
    ├── Dashboard.jsx
    └── auth/
        └── login/
            └── LoginPage.jsx
```

**Responsabilidades:**
- Renderizar UI
- Capturar interacciones del usuario
- Llamar a servicios
- Mostrar errores y loading states

---

## Flujo de Datos - Login

```
1. USER INPUT
   └─┬──────────────────────────────┐
     │ Login Form                   │
     │ username: "john"             │
     │ password: "secret123"        │
     └──┬───────────────────────────┘
        │
2. COMPONENT HANDLES SUBMIT
   └─┬──────────────────────────────┐
     │ AuthForm.jsx                 │
     │ handleLoginSubmit()           │
     └──┬───────────────────────────┘
        │
3. CALL APPLICATION SERVICE
   └─┬──────────────────────────────┐
     │ AuthService.login()          │
     │ - Validates inputs           │
     │ - Calls AuthAPI              │
     └──┬───────────────────────────┘
        │
4. CALL INFRASTRUCTURE API
   └─┬──────────────────────────────┐
     │ AuthAPI.login()              │
     │ - Makes HTTP request         │
     └──┬───────────────────────────┘
        │
5. HTTP REQUEST
   └─┬──────────────────────────────┐
     │ POST /api/auth/login         │
     │ { username, password }       │
     └──┬───────────────────────────┘
        │
6. BACKEND PROCESSING
   └─┬──────────────────────────────┐
     │ Backend validates            │
     │ Backend returns token        │
     └──┬───────────────────────────┘
        │
7. HTTP RESPONSE
   └─┬──────────────────────────────┐
     │ { token, user }              │
     └──┬───────────────────────────┘
        │
8. SAVE IN SERVICE
   └─┬──────────────────────────────┐
     │ AuthService stores:          │
     │ - token in localStorage      │
     │ - user data in localStorage  │
     └──┬───────────────────────────┘
        │
9. UPDATE COMPONENT STATE
   └─┬──────────────────────────────┐
     │ AuthForm shows success       │
     │ Calls onSuccess callback     │
     └──┬───────────────────────────┘
        │
10. NAVIGATE
    └─────────────────────────────────┐
      Redirect to /dashboard           │
      └─────────────────────────────────┘
```

---

## Estado Global y Persistencia

```
LocalStorage
├── authToken
│   └─ JWT token para requests
│
└── user
    ├── id
    ├── username
    ├── email
    └── createdAt

SessionStorage (opcional)
└─ Datos temporales de sesión
```

---

## Integraciones Externas

### Backend API
```
Base URL: http://localhost:8080/api

Endpoints necesarios:
- POST   /auth/login        (username, password)
- POST   /auth/register     (username, email, password)
- GET    /auth/verify       (headers: Authorization)
- DELETE /auth/logout
```

### Servicios Externos (Futuro)
```
- Google OAuth (autenticación)
- Stripe (pagos)
- SendGrid (emails)
- AWS S3 (archivos)
```

---

## Flujo de Errores

```
Exception en Backend
        │
        ▼
Axios Interceptor catch
        │
        ├─ Mapear status code a error específico
        │
        ▼
AuthAPI.js lanza error de dominio
        │
        ├─ ValidationError
        ├─ AuthenticationError
        ├─ InvalidCredentialsError
        ├─ UserAlreadyExistsError
        └─ ...
        │
        ▼
AuthService.js catch (re-throw)
        │
        ▼
Componente React catch
        │
        ├─ Mostrar mensaje de error
        ├─ Deshabilitar botones
        └─ Permitir reintentos
```

---

## Ciclo de Vida de Componente (Login)

```
MOUNT
  │
  ├─ useEffect: [verificar si ya autenticado]
  │  └─ Si autenticado → redirect a /dashboard
  │
RENDER
  │
  ├─ Form vacío
  ├─ Botones habilitados
  ├─ Sin errores
  │
USER INTERACTION
  │
  ├─ onChange: [actualizar formData state]
  ├─ onSubmit: [procesar login]
  │
LOADING STATE
  │
  ├─ isLoading = true
  ├─ Botones disabled
  ├─ Mostrar spinner
  │
API CALL
  │
  ├─ Success: [guardar token, redirect]
  ├─ Error: [mostrar error, reset estado]
  │
CLEANUP
  │
  └─ finally: [isLoading = false]
```

---

## Configuración e Inicialización

```
main.jsx
  │
  ├─ createRoot
  ├─ StrictMode
  │
  ▼
App.jsx
  │
  ├─ ThemeProvider (Material-UI)
  ├─ CssBaseline
  ├─ Router
  │
  ▼
Routes
  │
  ├─ /login       → LoginPage
  ├─ /dashboard   → Dashboard
  └─ /            → Redirect to /login
```

---

## Patrones de Desarrollo

### Pattern: Service Injection
```javascript
// En componente
const handleSubmit = async (credentials) => {
  try {
    await AuthService.login(credentials.username, credentials.password);
  } catch (error) {
    // manejar error
  }
};
```

### Pattern: Error Boundary
```javascript
// En futuro
<ErrorBoundary>
  <LoginPage />
</ErrorBoundary>
```

### Pattern: Protected Route
```javascript
// En futuro
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

### Pattern: Custom Hooks
```javascript
// En futuro
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  // ...
  return { user, loading, login, logout };
};
```

---

## Performance Considerations

```
✅ Code Splitting (React.lazy)
  - Lazy load Dashboard

✅ Memoization
  - memo() para componentes
  - useMemo() para valores
  - useCallback() para funciones

✅ Bundle Size
  - Material-UI 9.x es ligero
  - Axios vs Fetch (axios es mejor)

✅ Network
  - Interceptores para auth
  - Timeouts configurados
  - Manejo de errores

✅ Storage
  - localStorage (5-10MB)
  - Validar antes de JSON.parse()
```

---

**Última actualización**: 2026-05-13

