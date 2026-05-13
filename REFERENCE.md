# 🔖 Referencia Rápida - Examia Frontend

## ⚡ Comandos

```bash
npm run dev          # Desarrollo 🚀
npm run build        # Build producción 📦
npm run preview      # Vista previa 👀
npm run lint         # Verificar código ✓
```

---

## 📂 Estructura Rápida

```
src/
├── domain/         ← Lógica pura (errores, modelos)
├── application/    ← Servicios (AuthService)
├── infrastructure/ ← APIs (AuthAPI, httpClient)
├── presentation/   ← Componentes React
├── config/         ← Configuración
└── assets/         ← Imágenes/logos
```

---

## 🔐 Flujo de Autenticación

1. **Usuario** llena formulario
2. **AuthForm** (componente) captura datos
3. **AuthService** valida y llama a API
4. **AuthAPI** hace POST a backend
5. **Backend** responde con token
6. **LocalStorage** guarda token
7. **Router** redirige a dashboard

---

## 📲 Endpoints Backend Requeridos

```
POST   /api/auth/login       { username, password }
POST   /api/auth/register    { username, email, password }
DELETE /api/auth/logout
GET    /api/auth/verify
```

---

## 🎨 Componentes Principales

| Componente | Ubicación | Función |
|-----------|-----------|---------|
| `AuthForm` | presentation/components | Login + Registro |
| `LoginPage` | presentation/pages/auth/login | Envoltorio de auth |
| `Dashboard` | presentation/pages | Post-login |
| `Logo` | presentation/components | Logo de Examia |

---

## 🛠 Variables de Entorno

```env
VITE_API_URL=http://localhost:8080/api
```

---

## 📚 Documentación

| Archivo | Contenido |
|---------|----------|
| README.md | Documentación completa |
| QUICKSTART.md | Inicio en 5 minutos |
| DEVELOPMENT.md | Guía de desarrollo |
| CONVENTIONS.md | Estándares de código |
| ARCHITECTURE.md | Diagramas |
| PROJECT_SUMMARY.md | Resumen del proyecto |
| **ESTE ARCHIVO** | Referencia rápida |

---

## 🚀 Comenzar

```bash
# Instalar
npm install

# Desarrollo
npm run dev

# Ir a http://localhost:5173
```

---

## 🔒 Seguridad

- ✅ Token JWT guardado en localStorage
- ✅ Incluido automáticamente en headers
- ✅ Validaciones de formulario
- ✅ Manejo de errores

---

## 🧪 Testing API

```bash
# Con curl
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'
```

---

## 🔄 Ciclo de Desarrollo

```
1. Modificar código
   ↓
2. Vite hot-reload automático
   ↓
3. Ver cambios en navegador
   ↓
4. Repetir
```

---

## 🐛 Debugging

```javascript
// En consola del navegador (F12)
localStorage.getItem('authToken')     // Ver token
localStorage.getItem('user')           // Ver usuario
localStorage.clear()                   // Limpiar todo
```

---

## ✨ Features Implementadas

- ✅ Login/Registro en una sola vista
- ✅ Toggle contraseña visible/oculta
- ✅ Validaciones de formulario
- ✅ Manejo de errores específicos
- ✅ Sessions persistentes
- ✅ Responsive design
- ✅ Material-UI styling
- ✅ Clean architecture

---

## 🗺 Roadmap

### Próximo (v0.2)
- Recuperación de contraseña
- OAuth (Google/GitHub)
- Perfil de usuario

### Futuro (v0.3+)
- Crear exámenes
- Quiz player
- Reportes

---

## 📞 Troubleshooting

| Problema | Solución |
|----------|----------|
| Port 5173 en uso | `npm run dev -- --port 3000` |
| Backend no responde | Verifica URL en .env |
| Cambios no aplican | Refresh F5 o npm run dev |
| Dependencies error | `npm install` o `npm ci` |

---

## 🎯 Primeros Pasos

1. Lee **QUICKSTART.md** (5 min)
2. Lee **DEVELOPMENT.md** (20 min)
3. Explora la carpeta `src/` 
4. Inicia con `npm run dev`
5. ¡Código! 🚀

---

**Última actualización**: 2026-05-13  
**Versión**: 0.1.0

