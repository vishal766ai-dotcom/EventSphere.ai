# Multi-Stage Production Dockerfile for Google Cloud Run
# Stage 1: Build Frontend
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production Server
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY package*.json ./
RUN npm ci --omit=dev

# Copy server code and built static frontend from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

EXPOSE 8080

CMD ["node", "server/index.js"]
