# ---- Stage 1: Build ----
FROM node:22-alpine AS build

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copiar manifiestos de dependencias primero (cache de capas)
COPY package.json pnpm-lock.yaml ./

# Montar .npmrc como secreto para autenticación con GitHub Packages
RUN --mount=type=secret,id=npmrc,target=/app/.npmrc \
    pnpm install --frozen-lockfile

# Copiar el resto del código fuente
COPY . .

# Build de producción con base-href /admin/
RUN npx ng build --configuration=production --base-href /admin/

# ---- Stage 2: Serve ----
FROM nginx:1.27-alpine AS production

# Eliminar configuración por defecto de nginx
RUN rm -rf /etc/nginx/conf.d/default.conf /usr/share/nginx/html/*

# Copiar configuración personalizada de nginx
COPY devops/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar artefactos de build a /admin/ para que coincida con base-href
COPY --from=build /app/dist/fleet.ui/browser /usr/share/nginx/html/admin

# Script de entrypoint para inyectar variables de entorno en runtime
COPY devops/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
