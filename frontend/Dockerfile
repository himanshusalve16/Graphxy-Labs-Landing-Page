# syntax=docker/dockerfile:1
# Stage 1: Build – offline npm install using pre-populated host cache
# No HTTPS calls are made inside the container, bypassing the Docker Desktop
# OpenSSL GCM cipher bug on Windows/Hyper-V/WSL2 hosts.
FROM node:22-alpine AS build

WORKDIR /app

# Copy package manifests
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY shared/package*.json ./shared/

# Copy the pre-populated npm cache from the host (populated by scripts/populate-docker-cache.ps1)
# This cache was created on Windows where TLS works, and the content-addressed
# format (.npm-docker-cache/_cacache/) is fully cross-platform.
COPY .npm-docker-cache /root/.npm

# Install dependencies OFFLINE – zero network calls, zero SSL issues.
# Native binaries (rollup-linux-x64-musl, esbuild-linux-x64) are fetched
# from the cache as pre-built npm packages – no compilation required.
RUN npm ci --workspace=frontend --workspace=shared --include-workspace-root \
    --offline --cache /root/.npm

# Copy source after installing deps (maximises layer cache reuse)
COPY shared/ ./shared/
COPY frontend/ ./frontend/

# Build static assets
ENV NODE_ENV=production
RUN npm run build --workspace=frontend

# Stage 2: Serve with Nginx (tiny final image)
FROM nginx:alpine

COPY --from=build /app/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
