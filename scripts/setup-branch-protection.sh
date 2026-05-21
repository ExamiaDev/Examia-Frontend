#!/bin/bash
# Este script configura las protecciones de ramas en GitHub
# NOTA: Requiere GitHub CLI (gh) y permisos de admin

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW} Configurando protecciones de ramas...${NC}\n"

# Verificar si gh está instalado
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI no está instalado${NC}"
    echo "Instálalo con: https://cli.github.com"
    exit 1
fi

REPO="ExamiaDev/Examia-Frontend"

echo -e "${YELLOW} Ramas a proteger:${NC}"
echo "1. main"
echo "2. develop"
echo ""

# Función para proteger rama
protect_branch() {
    local branch=$1
    local pr_required=$2
    local require_reviews=$3
    local dismiss_stale=$4
    
    echo -e "${YELLOW} Protegiendo rama: ${GREEN}${branch}${NC}"
    
    # Requerir PR antes de merge
    gh api repos/$REPO/branches/$branch/protection \
        -X PUT \
        -F required_pull_request_reviews[require_code_owner_reviews]=false \
        -F required_pull_request_reviews[required_approving_review_count]=$require_reviews \
        -F required_pull_request_reviews[dismiss_stale_reviews]=$dismiss_stale \
        -F required_status_checks[strict]=true \
        -F required_status_checks[contexts][] \
        -F dismiss_stale_reviews=true \
        -F require_code_owner_reviews=false \
        -F enforce_admins=true \
        -F allow_force_pushes=false \
        -F allow_deletions=false
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Rama ${branch} protegida${NC}\n"
    else
        echo -e "${RED}❌ Error protegiendo ${branch}${NC}\n"
    fi
}

# Proteger main (requiere 1 aprobación)
protect_branch "main" true 1 true

# Proteger develop (requiere 1 aprobación)
protect_branch "develop" true 1 true

echo -e "${GREEN}✅ Protecciones configuradas exitosamente${NC}\n"

echo -e "${YELLOW} Configuración aplicada:${NC}"
echo "✓ Requiere PR para todos los cambios"
echo "✓ Requiere 1 aprobación antes de merge"
echo "✓ Desestima reviews obsoletas automáticamente"
echo "✓ No permite force push"
echo "✓ No permite borrar rama"
echo ""
echo -e "${GREEN} ¡Flujo de trabajo configurado!${NC}"
