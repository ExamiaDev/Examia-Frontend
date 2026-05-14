# Guía de Contribución - Examia Frontend

## 📋 Flujo de Desarrollo

Este proyecto sigue un modelo de **Git Flow** con tres ramas principales:

### **main** (Producción)
- Contiene la versión estable en producción
- Solo recibe merges desde releases
- **Protegida**: Requiere PR y aprobación
- Automaticamente hace backport a `develop`

### **develop** (Development)
- Rama base para desarrollo
- Contiene las features más recientes
- Se actualiza automáticamente cuando `main` cambia
- **Protegida**: Requiere PR y aprobación

### **feature/** (Features)
- Ramas temporales para nuevas funcionalidades
- Creadas desde `develop`
- Nombradas: `feature/nombre-descriptivo`
- Se eliminan después del merge

---

## 🚀 Flujo de Trabajo

### 1️⃣ **Para Empezar una Feature**

```bash
# Actualizar develop
git checkout develop
git pull origin develop

# Crear rama de feature
git checkout -b feature/mi-funcionalidad
```

**Nombre recomendado:**
```
feature/agregar-autenticacion
feature/mejorar-ui-login
feature/fix-errores-validacion
```

### 2️⃣ **Hacer Cambios y Commits**

```bash
# Hacer cambios en tu rama
git add .
git commit -m "feat: descripción del cambio"

# Cada commit debería ser atómico (cambios relacionados)
```

**Convenciones de commit:**
- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bug
- `refactor:` - Refactorización de código
- `docs:` - Cambios en documentación
- `style:` - Cambios de estilos (sin lógica)
- `test:` - Cambios en tests

Ejemplo:
```
git commit -m "feat: agregar validación de email"
git commit -m "fix: corregir bug en login"
git commit -m "refactor: simplificar AuthService"
```

### 3️⃣ **Push y Crear PR**

```bash
# Pushear tu rama
git push origin feature/mi-funcionalidad
```

Luego en GitHub:
1. Ve a [Examia Frontend - Pull Requests](https://github.com/ExamiaDev/Examia-Frontend/pulls)
2. Haz click en "New Pull Request"
3. Compara: `feature/mi-funcionalidad` → `develop`
4. Completa el template del PR
5. Espera feedback

**Template del PR:**

```markdown
## 📝 Descripción
Breve descripción de qué hace tu cambio

## 🎯 Tipo de Cambio
- [ ] ✨ Nueva funcionalidad
- [ ] 🐛 Corrección de bug
- [ ] ♻️ Refactorización
- [ ] 📚 Documentación

## 🔗 Issues Relacionados
Closes #123

## 🧪 Testing
Describe cómo testear estos cambios

## ✅ Checklist
- [ ] Mi código sigue las convenciones
- [ ] He actualizado la documentación
- [ ] No hay console.log() sin razón
- [ ] He testeado localmente
```

### 4️⃣ **Validaciones Automáticas**

Tu PR pasará automáticamente por:
- ✅ **Build**: Compila correctamente
- ✅ **Lint**: Sigue estándares de código
- ✅ **Pruebas**: Pasan todos los tests

Una vez aprobado por al menos 1 reviewer:
- Merge a `develop` ✅

---

## 🔄 Flujo de Release

Cuando estés listo para llevar cambios a producción:

### 1️⃣ **Crear Release Branch**

```bash
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0
```

### 2️⃣ **Preparar Release**

- Actualizar version en `package.json`
- Actualizar `CHANGELOG.md`
- Hacer commits de changes si es necesario

```bash
npm version major  # 1.0.0 → 2.0.0
npm version minor  # 1.0.0 → 1.1.0
npm version patch  # 1.0.0 → 1.0.1
```

### 3️⃣ **Crear PR a Main**

```bash
git push origin release/v1.0.0
```

En GitHub:
- Crear PR: `release/v1.0.0` → `main`
- Título: `release: v1.0.0`
- Esperar aprobación

### 4️⃣ **Merge a Main**

Una vez aprobado:
1. Merge a `main` (squash commit)
2. Tag automático: `v1.0.0`
3. **Backport automático** a `develop` ✅

---

## 🚨 Reglas Importantes

### ✅ Para pushear a develop:
- [ ] PR creado y descrito
- [ ] Build pasa correctamente
- [ ] Lint pasa (sin errores)
- [ ] Al menos 1 aprobación
- [ ] Todo hace sentido

### ❌ NO Permitido:
- ❌ Pushear directo a `main` o `develop`
- ❌ Commits sin describir
- ❌ Code que no compila
- ❌ Console.logs en producción

---

## 📚 Recursos

- [Convenciones de Commit](https://www.conventionalcommits.org/en/v1.0.0/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)

---

## 🤝 Preguntas?

Si tienes dudas sobre el flujo, contacta al equipo o revisa los PRs anteriores como referencia.

**¡Gracias por contribuir a Examia!** 🎓

