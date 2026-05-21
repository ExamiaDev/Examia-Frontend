# Release Notes - Examia Frontend

## 📋 Versión: v0.2.0 (2026-05-20)

### ✨ Cambios Principales

#### 🎯 Sistema de Roles
- **Nuevo**: Enum `RoleEnum` con valores `PROFESOR` y `ALUMNO`
  - Ubicación: `src/domain/enums/RoleEnum.js`
  - Incluye funciones auxiliares:
    - `getRoleDisplayName()` - Convierte enums a labels legibles
    - `isValidRole()` - Valida si es un rol válido
  
#### 👤 Modelo de Usuario Mejorado
- **Actualizado**: Clase `User` ahora incluye campo `role`
  - Parámetro opcional con valor por defecto `ALUMNO`
  - Tipo: `PROFESOR | ALUMNO`
  - Ubicación: `src/domain/models/User.js`

#### 🖥️ Dashboard
- **Cambio**: Etiqueta de rol actualizada
  - ❌ Anterior: "Docente" 
  - ✅ Actual: "Profesor"
  - El cambio se refleja en el chip de rol del Dashboard

#### 🔐 Autenticación (Simplificada)
- **Eliminado**: Funcionalidad de registro (`/register`)
- **Eliminado**: Funcionalidad de recuperación de contraseña (`/forgot-password`)
- **Razón**: Los usuarios serán cargados directamente en la BD con credenciales asignadas
- Formulario de login optimizado con solo campos esenciales

---

## 🚀 Próximos Pasos

### 1. Dashboards por Rol
- [ ] **Dashboard Profesor**
  - Vista dedicada para profesores post-login exitoso
  - Componente: `src/presentation/pages/DashboardProfesor.jsx`
  - Funcionalidades planificadas:
    - Crear/editar exámenes
    - Gestionar estudiantes
    - Ver reportes de desempeño
  
- [ ] **Dashboard Alumno**
  - Vista dedicada para alumnos post-login exitoso
  - Componente: `src/presentation/pages/DashboardAlumno.jsx`
  - Funcionalidades planificadas:
    - Listar exámenes disponibles
    - Resolver exámenes
    - Ver calificaciones

### 2. Redirección Dinámmica
- [ ] Actualizar `App.jsx` con rutas protegidas:
  ```javascript
  /dashboard/profesor  → DashboardProfesor (solo usuarios con rol PROFESOR)
  /dashboard/alumno    → DashboardAlumno (solo usuarios con rol ALUMNO)
  /dashboard           → Redirigir según rol del usuario
  ```

### 3. Componentes de Autenticación
- [ ] Actualizar `AuthService.js` para:
  - Guardar rol del usuario en localStorage
  - Validar permisos por rol
  - Proveer método `getUserRole()`

### 4. Layout Responsivo
- [ ] Crear componentes compartidos para dashboards:
  - `DashboardHeader.jsx` - Encabezado con info del usuario
  - `DashboardSidebar.jsx` - Menú lateral por rol
  - `DashboardContent.jsx` - Contenedor principal

---

## 📊 Estadísticas

| Métrica | Valor |
|---------|-------|
| Archivos Creados | 1 |
| Archivos Modificados | 2 |
| Líneas Agregadas | 143 |
| Líneas Removidas | 280 |
| Commit: | `1a5051e` |
| Rama: | `feature/new-register-logic` |

---

## 🔄 Cambios Técnicos

### Archivos Afectados

```
src/
├── domain/
│   ├── enums/
│   │   └── RoleEnum.js (NUEVO)
│   ├── models/
│   │   └── User.js (MODIFICADO)
│   └── errors/
│
└── presentation/
    └── pages/
        └── Dashboard.jsx (MODIFICADO)
```

### Ejemplo de Uso

```javascript
import { RoleEnum, getRoleDisplayName, isValidRole } from '@/domain/enums/RoleEnum';
import { User } from '@/domain/models/User';

// Crear usuario profesor
const profesor = new User(
  1,
  'juan.perez',
  'juan.perez@uade.edu.ar',
  RoleEnum.PROFESOR
);

// Validar y mostrar
if (isValidRole(profesor.role)) {
  console.log(`Rol: ${getRoleDisplayName(profesor.role)}`); // "Rol: Profesor"
}
```

---

## 🎯 Testing Recomendado

- [ ] Login con usuario PROFESOR
  - Verificar que el chip muestre "Profesor"
  - Verificar redireccionamiento al dashboard correcto

- [ ] Login con usuario ALUMNO
  - Verificar que el chip muestre "Alumno"
  - Verificar redireccionamiento al dashboard correcto

- [ ] Validaciones de rol
  - Probar `isValidRole()` con valores válidos e inválidos
  - Probar `getRoleDisplayName()` con todos los roles

---

## 📝 Notas Importantes

⚠️ **Compatibilidad de BD**: Asegúrate de que el backend devuelva el campo `role` en la respuesta de login.

⚠️ **Estructura esperada**:
```json
{
  "id": 1,
  "username": "juan.perez",
  "email": "juan.perez@uade.edu.ar",
  "role": "PROFESOR",
  "createdAt": "2026-05-20T10:00:00"
}
```

---

## 🔗 Enlaces Relacionados

- [GitHub Repo](https://github.com/ExamiaDev/Examia-Frontend)
- [Backend Examia](https://github.com/ExamiaDev/Examia-Backend)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md)

---

**Última actualización**: 2026-05-20  
**Versión**: v0.2.0  
**Estado**: En desarrollo (feature/new-register-logic)

