# ── Stage 1: Build Go Backend ──
FROM golang:1.22-alpine AS backend-builder
WORKDIR /app/backend
RUN apk add --no-cache git build-base
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ ./
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /app/astana-api ./cmd/api

# ── Stage 2: Build Next.js Frontend ──
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci
COPY frontend/ ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── Stage 3: Production Runner ──
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=80
ENV HOSTNAME="0.0.0.0"

RUN apk --no-cache add ca-certificates wget

# Copy Go backend binary and migrations
COPY --from=backend-builder /app/astana-api /app/astana-api
COPY backend/internal/database/migrations /app/internal/database/migrations

# Copy Next.js standalone server and static assets
COPY --from=frontend-builder /app/frontend/public /app/public
COPY --from=frontend-builder /app/frontend/.next/standalone ./
COPY --from=frontend-builder /app/frontend/.next/static /app/.next/static

# Start script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 80 8080

CMD ["/app/start.sh"]
