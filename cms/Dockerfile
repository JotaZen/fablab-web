# ===============================================
# Dockerfile - Strapi CMS
# Multi-stage build para producción
# ===============================================

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Build de producción
ENV NODE_ENV=production
RUN npm run build

# ===============================================
# Production stage
# ===============================================
FROM node:18-alpine AS runner

WORKDIR /app

# Crear usuario no-root
RUN addgroup --system --gid 1001 strapi && \
    adduser --system --uid 1001 strapi

# Copiar desde builder
COPY --from=builder --chown=strapi:strapi /app/package*.json ./
COPY --from=builder --chown=strapi:strapi /app/node_modules ./node_modules
COPY --from=builder --chown=strapi:strapi /app/dist ./dist
COPY --from=builder --chown=strapi:strapi /app/public ./public
COPY --from=builder --chown=strapi:strapi /app/dist/config ./config
COPY --from=builder --chown=strapi:strapi /app/src ./src
COPY --from=builder --chown=strapi:strapi /app/database ./database
COPY --from=builder --chown=strapi:strapi /app/favicon.png ./favicon.png

# Crear directorio de uploads
RUN mkdir -p /app/public/uploads && chown -R strapi:strapi /app/public/uploads



USER strapi

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337

EXPOSE 1337

CMD ["npm", "run", "start"]
