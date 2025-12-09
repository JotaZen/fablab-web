#!/bin/bash

# Script de Despliegue Automático para FabLab VPS
# Uso: ./deploy.sh [web|cms|all]
# Por defecto: all

SERVICE=${1:-all}

echo "🚀 Iniciando despliegue de: $SERVICE..."

# 1. Obtener últimos cambios
echo "📥 Bajando código desde git..."
git pull origin main || { echo "❌ Error al bajar código"; exit 1; }

# 2. Desplegar según servicio
if [ "$SERVICE" == "web" ]; then
    echo "🏗️  Reconstruyendo WEB..."
    docker compose up -d --build web
elif [ "$SERVICE" == "cms" ]; then
    echo "🏗️  Reconstruyendo CMS..."
    docker compose up -d --build cms
else
    echo "🏗️  Reconstruyendo TODO..."
    docker compose up -d --build
fi

# 3. Limpieza (opcional, borra imágenes viejas para ahorrar espacio)
docker image prune -f

echo "✅ Despliegue completado con éxito."
docker ps
