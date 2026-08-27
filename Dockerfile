# ===================================================
# Multi-Stage Dockerfile for Switch Fiber Web App
# Stage 1: Build & Bundle Compiler
# ===================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy project files and build optimized SPA bundle
COPY . .
RUN npm run lint && npm test && npm run build

# ===================================================
# Stage 2: Hardened Nginx Production Runtime
# ===================================================
FROM nginx:1.27-alpine AS runner

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled SPA bundle from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration with security headers & caching
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Health check to ensure Nginx is actively serving the SPA
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:80/ || exit 1

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
