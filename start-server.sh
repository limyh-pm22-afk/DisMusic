#!/usr/bin/env bash
set -euo pipefail

# start-server.sh — installs dependencies and starts the app from repo root
# Usage: chmod +x start-server.sh && ./start-server.sh

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

echo "Installing dependencies (production)..."
npm install --production

echo "Starting application..."
npm start
