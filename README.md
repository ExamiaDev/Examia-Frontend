# Examia Frontend 

Frontend profesional para Examia - Una plataforma integral de evaluación educativa que ayuda a estudiantes y educadores a **evaluar, entender y mejorar**.

##  Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Arquitectura Clean](#arquitectura-clean)
- [Componentes](#componentes)
- [API Endpoints](#api-endpoints)
- [Desarrollo](#desarrollo)
- [Build y Despliegue](#build-y-despliegue)
- [Contribución](#contribución)

---

## ✨ Características

### Autenticación y Autorización 
- **Login seguro**: Ingresa con email y contraseña proporcionadas por administradores
- **Sesiones persistentes**: Mantén la sesión activa entre recargas
- **Manejo robusto de errores**: Manejo de credenciales inválidas y validaciones
- **Roles diferenciados**: Soporte para roles ALUMNO y DOCENTE con dashboards específicos para cada uno

### Interfaz de Usuario 
- **Diseño responsivo**: Optimizado para desktop, tablet y móvil
- **Material-UI components**: Componentes profesionales y accesibles
- **Tema personalizado**: Colores y tipografía coherentes
- **Contraseña oculta**: Alternancia segura de visibilidad de contraseña
- **Transiciones fluidas**: Animaciones suaves entre estados

### Navegación 
- **Router protegido**: Redirección automática basada en autenticación
- **Rutas lógicas**: Estructura clara de navegación. Rutas públicas (`/login`, `/uade-login`, `/register`, `/forgot-password`) y protegidas por rol (`/docente/*`, `/alumno/*`, `/dashboard`)
- **Botón "atrás" inteligente**: hook `useGoBack` que retrocede en el historial real cuando lo hay y cae a una ruta de fallback ante deep links / refresh.
- **Persistencia de sesión**: Sesión automática al cargar la página

### Gestión de Exámenes (Docente)
- **Listado con orden y paginación**: tabla de exámenes con orden por columna (Examen, Curso, **Fecha de creación**, Estado) y paginación reutilizable.
- **Creación multi-paso**: wizard para diseñar examen, cargar respuestas modelo y generar acceso.
- **Tipos de pregunta**: texto libre, múltiple choice, tabla y árbol de decisión.
- **Estados de examen**: Borrador / Publicado / Activo, con toggle inline para publicar.
- **Monitoreo de entregas**: vista en diálogo con métricas y listado de submissions.
- **Corrección detallada**: panel de corrección por entrega con feedback al alumno y vuelta automática a la lista de entregas.

### Realización de Examen (Alumno)
- **Vigilancia activa (proctoring)**: detección de cambios de pestaña, blur de ventana, recargas y salidas de pantalla completa, con persistencia en `localStorage` para sobrevivir refreshes.
- **Timer con estados**: muestra tiempo transcurrido o restante con cambios de color (warning / danger / expirado).
- **Tablas ordenables**: hook `useSortableTable` reutilizado en exámenes disponibles, mis resultados, correcciones y métricas.

---

##  Tecnologías

### Frontend
- **React 19.x** - Librería UI moderno y reactivo
- **React Router DOM 7.x** - Navegación en la aplicación
- **Material-UI (MUI) 9.x** - Componentes UI profesionales

### HTTP & Estado
- **Axios** - Cliente HTTP para comunicación con el backend
- **LocalStorage** - Almacenamiento de sesión del lado del cliente

### Build & Desarrollo
- **Vite 8.x** - Bundler ultrarrápido y servidor de desarrollo
- **Node.js 16+** - Runtime de JavaScript

### Linting & Calidad
- **ESLint** - Verificación de código

---

##  Requisitos Previos

Asegúrate de tener instalado:

- **Node.js** versión 16 o superior ([descargar](https://nodejs.org/))
- **npm** versión 7 o superior (incluido con Node.js)
- **Backend de Examia** ejecutándose en `http://localhost:8080` ([Repositorio Backend](https://github.com/ExamiaDev/Examia-Backend))

---

##  Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/ExamiaDev/Examia-Frontend.git
cd Examia-Frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Crear archivo de configuración

Copia `.env.example` a `.env` y actualiza los valores si es necesario:

```bash
cp .env.example .env
```

---

## ⚙ Configuración

### Variables de Entorno

El archivo `.env` contiene las configuraciones del proyecto:

```env
# Backend API URL
# Por defecto apunta a un backend local en puerto 8080
VITE_API_URL=http://localhost:8080/api
```

**Nota**: Asegúrate de que el backend de Examia está ejecutándose en la URL especificada.

---

##  Uso

### Desarrollo

Inicia el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Build para Producción

Genera un build optimizado:

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

### Preview de Build

Visualiza el build de producción localmente:

```bash
npm run preview
```

### Linting

Verifica la calidad del código:

```bash
npm run lint
```

---

##  Estructura del Proyecto

Seguimos una **arquitectura clean** con separación clara de responsabilidades:

```
src/
├── assets/                 # Recursos estáticos (logos, imágenes)
│   └── logo.svg           # Logo de Examia
│
├── domain/                 # Domain Layer (Lógica de negocio)
│   ├── models/
│   │   └── User.js        # Entidades del dominio
│   └── errors/
│       └── AppErrors.js   # Errores personalizados
│
├── application/           # Application Layer (Casos de uso)
│   └── services/
│       └── AuthService.js # Lógica de autenticación
│
├── infrastructure/        # Infrastructure Layer (Integraciones externas)
│   ├── api/
│   │   └── AuthAPI.js     # Endpoints de autenticación
│   └── http/
│       └── httpClient.js  # Cliente HTTP configurado
│
| ├── presentation/          # Presentation Layer (UI)
| │   ├── components/
| │   │   ├── AuthForm.jsx      # Formulario de login
| │   │   ├── CustomTextField.jsx
| │   │   ├── AuthPageWrapper.jsx
| │   │   └── Logo.jsx
| │   ├── pages/
| │   │   ├── Dashboard.jsx     # Página principal
| │   │   └── auth/
| │   │       └── login/
| │   │           └── LoginPage.jsx
| │   └── layouts/
│
├── config/                # Configuración global
│   └── environment.js     # Variables de entorno
│
├── utils/                 # Utilidades compartidas
│
├── App.jsx               # Componente raíz con routing
├── main.jsx              # Punto de entrada
└── index.css             # Estilos globales
```

---

##  Arquitectura Clean

El proyecto sigue los principios de **Clean Architecture**:

### Capas

1. **Domain (Dominio)** 
   - Define la lógica de negocio pura
   - Modelos (`User.js`)
   - Errores personalizados (`AppErrors.js`)
   - Independiente de frameworks

2. **Application (Aplicación)**
   - Implementa casos de uso
   - Servicios (`AuthService.js`)
   - Orquesta la lógica del dominio
   - También independiente del framework

3. **Infrastructure (Infraestructura)**
   - Implementaciones técnicas
   - Clientes HTTP (`httpClient.js`)
   - Adaptadores de API (`AuthAPI.js`)
   - Responsable de la comunicación externa

4. **Presentation (Presentación)**
   - Componentes React
   - Páginas y layouts
   - Lógica de UI
   - Interacción con el usuario

### Ventajas

- ✅ Código testeable
- ✅ Separación de responsabilidades
- ✅ Fácil mantenimiento
- ✅ Escalabilidad
- ✅ Independencia de frameworks

---

##  Componentes

### AuthForm
Componente principal que maneja el login de usuarios.

**Props:**
- `onSuccess`: Callback ejecutado tras autenticación exitosa

**Funcionalidades:**
- Validación de formularios
- Visibilidad de contraseña
- Manejo de errores
- Loading states
- Manejo de respuestas del backend (usuario no existe, contraseña incorrecta)

### Logo
Componente para mostrar el logo de Examia.

**Props:**
- `width`: Ancho del logo (defecto: 120)
- `height`: Alto del logo (defecto: 120)

### CustomTextField
Envoltorio de Material-UI TextField con estilos consistentes.

### Dashboard
Página protegida que muestra información del usuario autenticado.

---

## 🪝 Hooks Personalizados

Se exponen en `src/presentation/hooks/`:

### `usePagination(data, initialRowsPerPage = 10)`
Encapsula el estado y handlers de paginación para tablas. Devuelve `{ page, rowsPerPage, handleChangePage, handleChangeRowsPerPage, paginated }`.

### `useSortableTable(data, defaultKey = null, defaultDir = 'desc')`
Provee orden multicolumna con detección automática de strings, fechas ISO y números. Devuelve `{ sorted, sortKey, sortDir, handleSort }`. Listo para combinar con `<TableSortLabel>`.

### `useGoBack(fallbackPath)`
Botón "atrás" inteligente:
- Si hay historial real (`location.key !== 'default'`), usa `navigate(-1)` para volver al lugar exacto desde donde el usuario llegó (preservando filtros, paginación, scroll).
- Si la pantalla se abrió por deep link / refresh, navega al `fallbackPath` con `replace: true`.

Se usa por ejemplo en `CorreccionDetalleContent`, `CorreccionesContent` y `ResultadoDetalleContent`.

### `useExamTimer` / `useExamProctoring`
Soporte para el flujo de realización de examen (alumno): cronómetro con estados visuales y vigilancia activa con persistencia local.

---

##  API Endpoints

El frontend consume los siguientes endpoints del backend:

### Autenticación

#### Login (Usuarios externos)
```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": "usuario@email.com",
  "password": "contraseña123"
}

Response (200 OK):
{
  "token": "jwt_token",
  "email": "usuario@email.com",
  "nombre": "Juan",
  "apellido": "Pérez",
  "role": "DOCENTE",
  "message": "Inicio de sesión exitoso"
}
```

#### Login UADE (Usuarios institucionales)
```
POST /api/auth/login-uade
Content-Type: application/json

Request:
{
  "legajo": "1234567",
  "email": "nombre.apellido@uade.edu.ar",
  "password": "contraseñaUADE"
}

Response (200 OK):
{
  "token": "jwt_token",
  "email": "nombre.apellido@uade.edu.ar",
  "nombre": "Juan",
  "apellido": "Pérez",
  "role": "ALUMNO",
  "message": "Inicio de sesión exitoso"
}
```

#### Registro (Usuarios externos)
```
POST /api/auth/register
Content-Type: application/json

Request:
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "username": "juanperez",
  "email": "juan@email.com",
  "recoveryEmail": "juan.recovery@gmail.com",
  "password": "miPassword123",
  "role": "ALUMNO"  // o "DOCENTE"
}

Response (201 Created):
{
  "token": "jwt_token",
  "email": "juan@email.com",
  "nombre": "Juan",
  "apellido": "Pérez",
  "role": "ALUMNO",
  "message": "Registro exitoso"
}
```


---

##  Desarrollo

### Flujo de Desarrollo

1. **Crear rama feature**
   ```bash
   git checkout -b feature/descripcion
   ```

2. **Realizar cambios y commitear**
   ```bash
   npm run lint  # Verificar código
   git add .
   git commit -m "feat: descripción clara del cambio"
   ```

3. **Push y Pull Request**
   ```bash
   git push origin feature/descripcion
   ```

### Convenciones de Commit

Usamos Conventional Commits:

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Formato, linting, etc.
- `refactor:` Refactorización de código
- `test:` Añadir o modificar tests
- `chore:` Cambios en configuración

Ejemplo:
```bash
git commit -m "feat: agregar validación de email en registro"
```

### Debugging

#### Browser DevTools
- Abre F12 en el navegador
- Inspecciona componentes en la pestaña React
- Revisa la consola para errores

#### LocalStorage
```javascript
// Ver datos almacenados
localStorage.getItem('authToken')
localStorage.getItem('user')

// Limpiar datos
localStorage.clear()
```

#### Network Tab
- Monitorea peticiones HTTP
- Verifica payloads de request/response
- Observa tiempos de respuesta

---

##  Build y Despliegue

### Build Optimizado

```bash
npm run build
```

Genera archivos optimizados en `dist/`:
- HTML minificado
- JavaScript optimizado
- CSS comprimido
- Assets optimizados

### Despliegue en Vercel

1. **Conectar repositorio**
   ```
   https://vercel.com/new
   ```

2. **Configurar variables de entorno**
   ```
   VITE_API_URL=https://api.examia.com/api
   ```

3. **Deploy**
   ```bash
   vercel
   ```

### Despliegue en Netlify

1. **Conectar repositorio**
   ```
   https://app.netlify.com/start
   ```

2. **Configurar build**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Variables de entorno**
   - VITE_API_URL

### Despliegue en GitHub Pages

```bash
# Instalar gh-pages
npm install --save-dev gh-pages

# Agregar a package.json
"homepage": "https://username.github.io/Examia-Frontend",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# Deploy
npm run deploy
```

---

##  Testing (Próximamente)

Se añadirán tests con:
- **Jest** - Test runner
- **React Testing Library** - Testing de componentes
- **Vitest** - Testing rápido con Vite

Comandos (cuando estén implementados):
```bash
npm run test
npm run test:coverage
```

---

##  Manejo de Errores

### Errores Comunes

#### "Cannot connect to backend"
- Verifica que el backend esté ejecutándose
- Comprueba la URL en `.env`
- Revisa la consola del navegador para ver errores

#### "Invalid credentials"
- Email o contraseña incorrectos
- Verifica que el usuario existe en el backend
- Contacta con un administrador si no tienes credenciales

#### "Token expired"
- La sesión ha expirado
- Se redirige automáticamente al login
- Inicia sesión nuevamente

---

##  Recursos

- [React Documentation](https://react.dev)
- [Material-UI Documentation](https://mui.com)
- [React Router Documentation](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)
- [Vite Documentation](https://vitejs.dev)
- [Backend Examia](https://github.com/ExamiaDev/Examia-Backend)

---

##  Licencia

Este proyecto es parte de Examia y está bajo licencia MIT.

---

##  Contribuidores

- **Tu Nombre** - Desarrollo inicial

---

##  Contacto

Para preguntas o sugerencias:
-  Email: info@examia.com
-  GitHub Issues: [Crear issue](https://github.com/ExamiaDev/Examia-Frontend/issues)

---

##  Roadmap

### v0.2.0 (Próximo)
- [ ] Autenticación con Google/GitHub
- [ ] Perfil de usuario
- [ ] Tests automatizados
- [ ] Gestión de sesiones avanzada

### v0.3.0
- [ ] Crear exámenes
- [ ] Responder exámenes
- [ ] Reportes y análisis
- [ ] Colaboración en equipo

### v1.0.0
- [ ] Todas las características principales
- [ ] Documentación completa
- [ ] Performance optimizado
- [ ] SEO mejorado

---

**¡Gracias por usar Examia! **

**Evalúa. Entiende. Mejora.**

---

## Historial de Cambios

### 20/05/2026 — Feature: New Register Logic

#### Cambios principales
- **Login externo actualizado**: El formulario de login para usuarios externos ahora usa campo "Email" genérico en lugar de "Mail institucional UADE"
- **Login UADE mejorado**: Agregado campo "Número de Legajo" para autenticación institucional
- **Registro con selección de rol**: Los usuarios externos pueden elegir si son ALUMNO o DOCENTE al registrarse
- **Usuarios UADE precargados**: Los usuarios de UADE no necesitan registrarse, están precargados en el sistema

#### Nuevos endpoints integrados
- `POST /api/auth/login` - Login para usuarios externos
- `POST /api/auth/login-uade` - Login para usuarios UADE (legajo, email, password)
- `POST /api/auth/register` - Registro con campo `role` (ALUMNO/DOCENTE)

#### Archivos modificados
- `AuthForm.jsx` - Campo email genérico para usuarios externos
- `UadeLoginForm.jsx` - Agregado campo Número de Legajo
- `RegisterForm.jsx` - Agregado selector de rol (Alumno/DOCENTE)
- `AuthAPI.js` - Nueva función `loginUade`
- `AuthService.js` - Nueva función `loginUade` y actualización de `register` con `role`
- `UadeLoginPage.jsx` - Integración con callback onSuccess

---

### 14/05/2026 — Feature: Remove Register Functionality

#### Cambios principales
- **Eliminación de registro**: Removed `RegisterPage.jsx` completely
- **Eliminación de recuperación de contraseña**: Removed `ForgotPasswordPage.jsx` completely
- **Solo login**: Aplicación ahora solo usa login con credenciales otorgadas por administradores
- **Gestión en BD**: Los usuarios son creados directamente en la base de datos por administradores

#### Cambios en la estructura
- Removidas carpetas: `src/presentation/pages/auth/register/` y `src/presentation/pages/auth/forgot-password/`
- ActualRemoción de rutas: `/register` y `/forgot-password` eliminadas de `App.jsx`
- Simplificación de `AuthForm.jsx`: Solo login, sin toggle

#### Documentación
- Actualizado README.md para reflejar solo login
- Documentación de endpoints actualizada (sin registro)
- Roadmap actualizado (sin recuperación de contraseña)

---

### 13/05/2026 — Felipe Massun

#### Nuevas pantallas de autenticación

- **`RegisterPage.jsx`** (`/register`): pantalla de registro con campos nombre, apellido, mail institucional, contraseña y confirmar contraseña. Rol fijado como `ALUMNO`. Layout en grilla CSS de 2 columnas en desktop y 1 columna en mobile. Botón "Crear cuenta" centrado.
- **`ForgotPasswordPage.jsx`** (`/forgot-password`): pantalla de recuperación de contraseña con campo de email, estado de éxito con ícono y mensaje, y link de retorno al login.
- **`AuthPageWrapper.jsx`**: componente compartido de layout para todas las pantallas de autenticación (fondo azul, logo responsive, copyright).

#### Cambios en componentes existentes

- **`AuthForm.jsx`**: simplificado a solo login. Se eliminó el toggle login/registro. Campo `username` reemplazado por `email` para alinear con el backend. Se agregaron links a `/forgot-password` y `/register`.
- **`CustomTextField.jsx`**: cambiado a `size="small"` por defecto. Eliminado `margin="normal"` para mayor control del espaciado. Corrección de `InputProps` → `slotProps.input` para compatibilidad con MUI v9 (fix del ícono de visibilidad de contraseña).
- **`Dashboard.jsx`**: muestra `nombre` + `apellido` del backend en lugar de `username`. Chip de rol en la AppBar (visible en desktop). Layout y tipografía responsive.
- **`App.jsx`**: agregadas rutas `/register` y `/forgot-password`.

#### Alineación con el backend

- **`AuthService.js`**: `login` corregido para usar `email` en lugar de `username`. `register` actualizado con la firma completa del backend `{ nombre, apellido, email, password, role }`. Corrección del almacenamiento en `localStorage` (el backend devuelve campos planos, no un objeto `user`).
- **`AuthAPI.js`**: `login` corregido para enviar `{ email, password }`. `register` corregido para enviar `{ nombre, apellido, email, password, role }`. Agregado método `forgotPassword(email)`.

#### Configuración de producción

- **`.env.production`**: creado con `VITE_API_URL` apuntando al backend en Render (`https://examia-backend-1zwg.onrender.com/api`).
- **`environment.js`**: agregados `console.log` para verificar la URL de API en runtime.
- **`httpClient.js`**: corregido el interceptor de respuesta — el redirect a `/login` ante 401 ahora solo aplica a endpoints protegidos, no a `/auth/*`. Agregados logs de request/response para debugging.
