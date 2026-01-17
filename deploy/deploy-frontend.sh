#!/bin/bash
set -e

echo "========================================="
echo "AliMed Frontend Deployment"
echo "========================================="

# Configuration
APP_DIR="/home/ubuntu/alimed"
FRONTEND_DIR="$APP_DIR/src/frontend/AliMed.Web"
NGINX_ROOT="/var/www/alimed"

# Update repository
echo "[1/4] Updating repository..."
cd $APP_DIR
git pull origin main

# Install dependencies
echo "[2/4] Installing frontend dependencies..."
cd $FRONTEND_DIR
npm ci

# Create production .env
echo "[3/4] Creating production environment..."
cat > .env.production << EOF
VITE_API_BASE_URL=http://130.162.222.70:5056
VITE_GITHUB_CLIENT_ID=your_github_client_id_here
EOF

echo "⚠️  IMPORTANT: Edit $FRONTEND_DIR/.env.production and set your GitHub Client ID!"

# Build frontend
echo "[4/4] Building frontend..."
npm run build

# Deploy to nginx
echo "Deploying to nginx..."
sudo mkdir -p $NGINX_ROOT
sudo rm -rf $NGINX_ROOT/*
sudo cp -r dist/* $NGINX_ROOT/
sudo chown -R www-data:www-data $NGINX_ROOT

echo ""
echo "========================================="
echo "✅ Frontend deployment complete!"
echo "========================================="
echo "Frontend files deployed to: $NGINX_ROOT"
echo "Frontend should be available at: http://130.162.222.70"
