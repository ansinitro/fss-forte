#!/bin/sh
set -e

echo "Starting Astana Education Platform Backend (Go API on 8080)..."
PORT=8080 /app/astana-api &

echo "Starting Astana Education Platform Frontend (Next.js on 80)..."
PORT=80 HOSTNAME="0.0.0.0" exec node server.js
