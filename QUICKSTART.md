# 🚀 Guía Rápida de Inicio - Examia Frontend

## ⚡ Quick Start (5 minutos)

### Prerrequisitos
- Node.js 16+ instalado
- Backend de Examia ejecutándose en `http://localhost:8080`

### Instalación

```bash
# 1. Clonar

git clone https://github.com/ExamiaDev/Examia-Frontend.git
cd Examia-Frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (opcional)
# Por defecto ya apunta a http://localhost:8080/api
cp .env.example .env

# 4. Iniciar desarrollo
npm run dev
```

La aplicación estará disponible en **http://localhost:5173**

---

## 📝 Primeros Pasos

### 1. Probar Login/Registro

1. Abre http://localhost:5173
2. Haz click en "¿No tienes cuenta? Regístrate"
3. Ingresa:
   - **Usuario**: testuser
   - **Email**: test@example.com
   - **Contraseña**: password123
   - **Confirmar Contraseña**: password123
4. Haz click en "Registrarse"
5. Si es exitoso, serás redirigido al dashboard

### 2. Probar Login

1. Con tus credenciales, ingresa el usuario y contraseña
2. Haz click en "Acceder"
3. Verás el dashboard de bienvenida

---

## 🛠 Comandos Disponibles

```bash
# Desarrollo
npm run dev           # Inicia servidor con hot-reload

# Build
npm run build         # Crea build optimizado en dist/
npm run preview       # Vista previa del build

# Calidad de código
npm run lint          # Verifica código con ESLint
```

---

## 📂 Estructura Base

```
src/
├── domain/           # Modelos y errores (sin React)
├── application/      # Servicios y lógica
├── infrastructure/   # APIs y HTTP
├── presentation/     # Componentes y páginas
└── config/          # Configuración
```

Para más detalles, ver `DEVELOPMENT.md` y `CONVENTIONS.md`

---

## 🆘 Solución de Problemas

### "Cannot connect to backend"
```bash
# Verifica que el backend esté ejecutándose
curl http://localhost:8080/api/health

# O ajusta la URL en .env
VITE_API_URL=http://localhost:8080/api
```

### "Port 5173 already in use"
```bash
# Usar otro puerto
npm run dev -- --port 3000
```

### "Dependencies error"
```bash
# Limpiar e reinstalar
rm -r node_modules package-lock.json
npm install
```

---

## 📚 Documentación Completa

- **README.md** - Documentación completa del proyecto
- **DEVELOPMENT.md** - Guía detallada de desarrollo
- **CONVENTIONS.md** - Convenciones de código

---

## 🎯 Próximos Pasos

1. Lee `DEVELOPMENT.md` para entender la arquitectura
2. Revisa `CONVENTIONS.md` para seguir estándares
3. Explora los archivos en `src/` para familiarizarte
4. ¡Empieza a codificar! 🚀

---

**¿Necesitas ayuda? Abre un issue en GitHub.**

