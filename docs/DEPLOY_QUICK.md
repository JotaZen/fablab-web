# 🚀 Despliegue Rápido

## Requisitos
- Docker + Docker Compose
- Git

## Instalar

```bash
git clone https://github.com/TU_USUARIO/fablab-web.git
cd fablab-web
cp .env.example .env   # Editar con tus valores
cd docker
docker compose up -d --build
```

## URLs

| Servicio | URL |
|----------|-----|
| Web | localhost:3011 |
| CMS | localhost:3010 |

## Actualizar

```bash
cd docker && git pull && docker compose up -d --build
```
