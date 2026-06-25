# syntax=docker/dockerfile:1
# Production-ready Node.js backend – offline npm install using pre-populated host cache
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
EXPOSE 5000

# Copy package manifests
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY shared/package*.json ./shared/

# Copy the pre-populated npm cache from the host (populated by scripts/populate-docker-cache.ps1)
COPY .npm-docker-cache /root/.npm

# Install dependencies OFFLINE – zero network calls, zero SSL issues.
# pg (node-postgres) is pure JavaScript – no native compilation required.
RUN npm ci --workspace=backend --workspace=shared --include-workspace-root \
    --offline --cache /root/.npm

# Copy sources after deps are installed
COPY shared/ ./shared/
COPY backend/ ./backend/
COPY db/ ./db/

WORKDIR /app/backend

# Run under non-root node user for security hardening
USER node

CMD ["node", "src/server.js"]
