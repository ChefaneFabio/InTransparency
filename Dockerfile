# Multi-stage Dockerfile for InTransparency platform

# Stage 1: Build frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./
RUN npm ci --only=production

# Copy frontend source code
COPY frontend/ ./

# Build frontend
RUN npm run build

# Stage 2: Build backend API
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

# Copy backend package files
COPY backend/api/package*.json ./
RUN npm ci --only=production

# Copy backend source code
COPY backend/api/ ./

# Build backend (if TypeScript)
RUN npm run build || echo "No build step needed"

# Stage 3: Setup Python AI Service
FROM python:3.11-slim AS ai-service-builder

WORKDIR /app/ai-service

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY backend/ai-service/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy AI service source code
COPY backend/ai-service/ ./

# Stage 4: Production image
FROM node:18-alpine AS production

# Install Python for AI service
RUN apk add --no-cache python3 py3-pip

WORKDIR /app

# Copy built frontend
COPY --from=frontend-builder /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder /app/frontend/public ./frontend/public
COPY --from=frontend-builder /app/frontend/package.json ./frontend/

# Copy built backend
COPY --from=backend-builder /app/backend ./backend

# Copy AI service
COPY --from=ai-service-builder /app/ai-service ./ai-service

# Install global dependencies
RUN npm install -g pm2

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose ports
EXPOSE 3000 3001 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start command
CMD ["pm2-runtime", "start", "ecosystem.config.js"]