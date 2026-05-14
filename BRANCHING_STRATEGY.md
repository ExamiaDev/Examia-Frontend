# 🌳 Flujo de Branching - Examia Frontend

## Diagrama General

```
┌─────────────────────────────────────────────────────────────┐
│                    REPOSITORIO EXAMIA                       │
└─────────────────────────────────────────────────────────────┘

                          ╔════════════╗
                          ║    main    ║  (PRODUCCIÓN)
                          ╚════════════╝
                               │
                         [tag: v1.0.0]
                               │
                  ┌────────────────────────┐
                  │  Backport automático   │
                  │  (cuando se mergea)    │
                  └────────────────────────┘
                               │
                               ▼
                          ╔════════════╗
                          ║  develop   ║  (DESARROLLO)
                          ╚════════════╝
                               │
                ┌──────────────┬┴┬──────────────┐
                │              │  │              │
                ▼              ▼  ▼              ▼
         ┌────────────┐  ┌────────────┐  ┌────────────┐
         │  feature/  │  │  feature/  │  │  feature/  │
         │    auth    │  │    ui      │  │  reports   │
         └────────────┘  └────────────┘  └────────────┘
```

---

## 📊 Ciclo de Vida de una Feature

### Paso 1: Crear Feature Branch

```
develop (main branch)
  │
  ├─ (git checkout -b feature/mi-funcionalidad)
  │
  └─ feature/mi-funcionalidad
```

### Paso 2: Trabajar en la Feature

```
feature/mi-funcionalidad
  │
  ├─ commit 1: "feat: agregar validación"
  ├─ commit 2: "fix: corregir bug"
  └─ commit 3: "refactor: mejorar código"
```

### Paso 3: Crear Pull Request

```
feature/mi-funcionalidad  ──┐
                            │
                      PR #123 (Abierto)
                            │
                         develop
```

**Validaciones Automáticas:**
- ✅ Build
- ✅ Lint
- ✅ Tests

### Paso 4: Revisión y Aprobación

```
   Revisor 1
       │
       ├─ Revisa código
       ├─ Sugiere cambios
       ├─ Aprueba ✓
       │
      develop
```

### Paso 5: Merge a Develop

```
feature/mi-funcionalidad ──┐
                           │
                        MERGE
                           │
                        develop (actualizado)
                           │
                    (rama feature se borra)
```

---

## 🔄 Ciclo de Vida de una Release

### Paso 1: Crear Release Branch

```
develop
  │
  ├─ (git checkout -b release/v1.0.0)
  │
  └─ release/v1.0.0
     ├─ Actualizar version en package.json
     └─ Actualizar CHANGELOG.md
```

### Paso 2: Crear PR a Main

```
release/v1.0.0  ──┐
                   │
              PR (Release)
                   │
                  main
```

**Validaciones:**
- ✅ Build
- ✅ Lint
- ✅ Tests (suite completa)

### Paso 3: Merge a Main

```
release/v1.0.0 ──┐
                  │
               MERGE
                  │
              main (v1.0.0)
    ┌──────┬──────┴──────┬──────┐
    │      │             │      │
   tag   backport    develop    main
        automático  (actualizado)
```

### Paso 4: Backport Automático a Develop

```
main (después del merge)
  │
  └─ GitHub Actions Workflow
     │
     ├─ git fetch main
     ├─ git checkout develop
     ├─ git merge main
     └─ git push develop
         │
         ▼
      develop (sincronizado)
```

---

## 🚀 Flujo Completo en Acción

```
Día 1:
  Desarrollador A crea:
    ├─ feature/agregar-login
    └─ feature/mejorar-dashboard

Día 3:
  feature/agregar-login
    │
    └─ PR #101 → develop
       ├─ Build ✓
       ├─ Lint ✓
       ├─ Reviewers: 1 aprobación
       └─ MERGE ✓

Día 5:
  feature/mejorar-dashboard
    │
    └─ PR #102 → develop
       ├─ Build ✓
       ├─ Lint ✓
       ├─ Reviewers: 1 aprobación
       └─ MERGE ✓

Día 7:
  develop (tiene 2 features nuevas)
    │
    └─ Crear release/v1.1.0
       │
       ├─ Actualizar version
       ├─ Actualizar CHANGELOG
       │
       └─ PR #103 → main
          ├─ Build ✓
          ├─ Lint ✓
          ├─ Merge ✓
          │
          ├─ Tag: v1.1.0
          ├─ Backport automático
          │
          └─ develop (sincronizado)
             │
             ├─ feature/agregar-login ✓ 
             ├─ feature/mejorar-dashboard ✓
             └─ (listo para nuevas features)
```

---

## 📋 Protecciones de Ramas

### **main** (Producción)
```
┌─ Requiere PR: ✓
├─ Requiere aprobación: ✓ (1 mínimo)
├─ Requiere status checks: ✓
├─ Desestima reviews obsoletas: ✓
├─ Permite force push: ✗
└─ Permite delete: ✗
```

### **develop** (Desarrollo)
```
┌─ Requiere PR: ✓
├─ Requiere aprobación: ✓ (1 mínimo)
├─ Requiere status checks: ✓
├─ Desestima reviews obsoletas: ✓
├─ Permite force push: ✗
└─ Permite delete: ✗
```

### **feature/** (Temporal)
```
└─ Sin protecciones (puedes pushear y borrar libremente)
```

---

## 🤖 GitHub Actions Workflows

### 1. `validate-pr.yml`
**Cuándo corre:** En cada PR a develop o main
**Qué hace:**
- Instala dependencias
- Corre ESLint
- Construye el proyecto
- Comenta resultados en el PR

### 2. `backport-main-to-develop.yml`
**Cuándo corre:** Después de un merge a main
**Qué hace:**
- Descarga cambios de main
- Mergea automáticamente a develop
- Si hay conflictos, crea un PR manual
- Comenta en el PR original

---

## ⚡ Comandos Rápidos

```bash
# Crear y pushear feature
git checkout -b feature/nombre
git push -u origin feature/nombre

# Sync con develop
git fetch origin
git rebase origin/develop

# Crear PR desde línea de comandos
gh pr create --base develop --head feature/nombre

# Revisar PR
gh pr view

# Mergear PR
gh pr merge --squash

# Versioning
npm version patch    # 1.0.0 → 1.0.1
npm version minor    # 1.0.0 → 1.1.0
npm version major    # 1.0.0 → 2.0.0
```

---

## 🎯 Beneficios de Este Flujo

✅ **Estabilidad**: main siempre listo para producción
✅ **Transparencia**: Todos los cambios en PRs
✅ **Calidad**: Validaciones automáticas
✅ **Sincronización**: develop siempre actualizado
✅ **Trazabilidad**: Historial completo de cambios
✅ **Escalabilidad**: Múltiples features en paralelo

---

## 📚 Referencias

- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**¡Este flujo asegura que Examia se desarrolle de forma organizada y profesional!** 🎓

