#!/bin/bash
# Setup script para Examia Frontend

echo "🎓 Examia Frontend - Setup Script"
echo "=================================="

# Verificar que Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo "Descárgalo en: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Instalar dependencias
echo ""
echo "📦 Instalando dependencias..."
npm install

# Crear .env si no existe
if [ ! -f .env ]; then
    echo ""
    echo "⚙️  Creando archivo .env..."
    cp .env.example .env
    echo "✅ Archivo .env creado"
fi

echo ""
echo "=================================="
echo "✅ Setup completado correctamente!"
echo ""
echo "Para iniciar el desarrollo, ejecuta:"
echo "  npm run dev"
echo ""
echo "La app estará disponible en:"
echo "  http://localhost:5173"
echo ""
echo "Documentación:"
echo "  - README.md - Documentación completa"
echo "  - QUICKSTART.md - Inicio rápido"
echo "  - DEVELOPMENT.md - Guía de desarrollo"
echo "  - CONVENTIONS.md - Convenciones de código"
echo ""

