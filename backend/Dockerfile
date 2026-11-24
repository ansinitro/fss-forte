# Build stage
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Install git and build essentials
RUN apk add --no-cache git build-base

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o astana-api ./cmd/api

# Production minimal runner
FROM alpine:3.19

RUN apk --no-cache add ca-certificates tzdata

WORKDIR /app

COPY --from=builder /app/astana-api .
COPY --from=builder /app/internal/database/migrations ./internal/database/migrations

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["./astana-api"]
