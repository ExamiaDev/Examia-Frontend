# Examia Frontend 🎓

Frontend profesional para Examia - Una plataforma integral de evaluación educativa que ayuda a estudiantes y educadores a **evaluar, entender y mejorar**.

## 📋 Tabla de Contenidos

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

### Autenticación y Autorización 🔐
- **Login seguro**: Ingresa con usuario y contraseña
- **Registro de usuarios**: Crea una nueva cuenta con validaciones
- **Sesiones persistentes**: Mantén la sesión activa entre recargas
- **Manejo robusto de errores**: Manejo de credenciales inválidas y usuarios existentes

### Interfaz de Usuario 🎨
- **Diseño responsivo**: Optimizado para desktop, tablet y móvil
- **Material-UI components**: Componentes profesionales y accesibles
- **Tema personalizado**: Colores y tipografía coherentes
- **Contraseña oculta**: Alternancia segura de visibilidad de contraseña
- **Transiciones fluidas**: Animaciones suaves entre estados

### Navegación 🧭
- **Router protegido**: Redirección automática basada en autenticación
- **Rutas lógicas**: Estructura clara de navegación (`/login`, `/dashboard`)
- **Persistencia de sesión**: Sesión automática al cargar la página

---

## 🛠 Tecnologías

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

## 📦 Requisitos Previos

Asegúrate de tener instalado:

- **Node.js** versión 16 o superior ([descargar](https://nodejs.org/))
- **npm** versión 7 o superior (incluido con Node.js)
- **Backend de Examia** ejecutándose en `http://localhost:8080` ([Repositorio Backend](https://github.com/ExamiaDev/Examia-Backend))

---

## 🚀 Instalación

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

## 💻 Uso

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

## 📁 Estructura del Proyecto

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
├── presentation/          # Presentation Layer (UI)
│   ├── components/
│   │   ├── AuthForm.jsx      # Formulario de login/registro
│   │   ├── CustomTextField.jsx
│   │   └── Logo.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx     # Página principal
│   │   └── auth/
│   │       └── login/
│   │           └── LoginPage.jsx
│   └── layouts/
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

## 🏗 Arquitectura Clean

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

## 🧩 Componentes

### AuthForm
Componente principal que maneja tanto login como registro.

**Props:**
- `onSuccess`: Callback ejecutado tras autenticación exitosa

**Funcionalidades:**
- Toggle entre modo login y registro
- Validación de formularios
- Visibilidad de contraseña
- Manejo de errores
- Loading states

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

## 🔌 API Endpoints

El frontend consume los siguientes endpoints del backend:

### Autenticación

#### Login
```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "username": "string",
  "password": "string"
}

Response (200 OK):
{
  "token": "jwt_token",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  }
}

Response (401 Unauthorized):
{
  "message": "Invalid username or password"
}
```

#### Registro
```
POST /api/auth/register
Content-Type: application/json

Request:
{
  "username": "string",
  "email": "string",
  "password": "string"
}

Response (201 Created):
{
  "token": "jwt_token",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  }
}

Response (409 Conflict):
{
  "message": "User already exists with this username or email"
}
```

---

## 🛠 Desarrollo

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

## 📦 Build y Despliegue

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

## 🧪 Testing (Próximamente)

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

## 🚨 Manejo de Errores

### Errores Comunes

#### "Cannot connect to backend"
- Verifica que el backend esté ejecutándose
- Comprueba la URL en `.env`
- Revisa la consola del navegador para ver errores

#### "Invalid credentials"
- Usuario o contraseña incorrectos
- Verifica que el usuario existe en el backend

#### "User already exists"
- El email o username ya está registrado
- Usa credenciales diferentes

#### "Token expired"
- La sesión ha expirado
- Se redirige automáticamente al login
- Inicia sesión nuevamente

---

## 📚 Recursos

- [React Documentation](https://react.dev)
- [Material-UI Documentation](https://mui.com)
- [React Router Documentation](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)
- [Vite Documentation](https://vitejs.dev)
- [Backend Examia](https://github.com/ExamiaDev/Examia-Backend)

---

## 📄 Licencia

Este proyecto es parte de Examia y está bajo licencia MIT.

---

## 👥 Contribuidores

- **Tu Nombre** - Desarrollo inicial

---

## 📧 Contacto

Para preguntas o sugerencias:
- 📧 Email: info@examia.com
- 🐙 GitHub Issues: [Crear issue](https://github.com/ExamiaDev/Examia-Frontend/issues)

---

## 🗺 Roadmap

### v0.2.0 (Próximo)
- [ ] Recuperación de contraseña
- [ ] Autenticación con Google/GitHub
- [ ] Perfil de usuario
- [ ] Tests automatizados

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

**¡Gracias por usar Examia! 🎓**

**Evalúa. Entiende. Mejora.**
