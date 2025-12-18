# Dockerfile - Next.js Web App

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1

# Argumentos de construcción para Next.js (Client-side vars burn-in)
ARG NEXT_PUBLIC_STRAPI_URL
ARG NEXT_PUBLIC_VESSEL_API_URL
ARG NEXT_PUBLIC_LARAVEL_URL
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET

# Mapear ARGs a ENVs para el build
ENV NEXT_PUBLIC_STRAPI_URL=$NEXT_PUBLIC_STRAPI_URL
ENV NEXT_PUBLIC_VESSEL_API_URL=$NEXT_PUBLIC_VESSEL_API_URL
ENV NEXT_PUBLIC_LARAVEL_URL=$NEXT_PUBLIC_LARAVEL_URL
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nextjs && \
    adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static
USER nextjs
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
EXPOSE 3000
CMD ["node", "server.js"]
