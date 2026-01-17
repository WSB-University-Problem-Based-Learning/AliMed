#!/bin/bash
set -e

echo "========================================="
echo "AliMed Backend Deployment"
echo "========================================="

# Configuration
APP_DIR="/home/ubuntu/alimed"
BACKEND_DIR="$APP_DIR/WebAPI/API.Alimed"
DEPLOY_DIR="/home/ubuntu/alimed/deploy"

# Clone or update repository
echo "[1/5] Cloning/updating repository..."
if [ ! -d "$APP_DIR" ]; then
    cd /home/ubuntu
    git clone https://github.com/yourusername/AliMed.git alimed
    cd alimed
else
    cd $APP_DIR
    git pull origin main
fi

# Create .env file for production
echo "[2/5] Creating production .env file..."
cd $DEPLOY_DIR
cat > .env << EOF
# MySQL Configuration
MYSQL_ROOT_PASSWORD=AlimEd2026!SecureRootPass
MYSQL_PASSWORD=AlimEd2026!SecureDbPass

# JWT Configuration (CHANGE THIS!)
JWT_SECRET_KEY=$(openssl rand -base64 32)

# GitHub OAuth (CHANGE THIS!)
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
EOF

echo "⚠️  IMPORTANT: Edit $DEPLOY_DIR/.env and set your GitHub OAuth credentials!"

# Start MySQL with Docker Compose
echo "[3/5] Starting MySQL..."
cd $DEPLOY_DIR
docker-compose -f docker-compose.prod.yml up -d mysql

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
sleep 15

# Build and run backend
echo "[4/5] Building and running backend..."
cd $BACKEND_DIR

# Restore dependencies
$HOME/.dotnet/dotnet restore || dotnet restore

# Run migrations
echo "Running database migrations..."
$HOME/.dotnet/dotnet ef database update || dotnet ef database update

# Build application
$HOME/.dotnet/dotnet build -c Release || dotnet build -c Release

# Publish application
$HOME/.dotnet/dotnet publish -c Release -o /home/ubuntu/alimed-backend-publish || dotnet publish -c Release -o /home/ubuntu/alimed-backend-publish

# Create systemd service
echo "[5/5] Creating systemd service..."
sudo tee /etc/systemd/system/alimed-backend.service > /dev/null << EOF
[Unit]
Description=AliMed Backend API
After=network.target mysql.service

[Service]
Type=notify
User=ubuntu
WorkingDirectory=/home/ubuntu/alimed-backend-publish
ExecStart=/home/ubuntu/.dotnet/dotnet /home/ubuntu/alimed-backend-publish/API.Alimed.dll
Restart=always
RestartSec=10
KillSignal=SIGINT
SyslogIdentifier=alimed-backend
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=ASPNETCORE_URLS=http://0.0.0.0:5056
Environment=DOTNET_ROOT=/home/ubuntu/.dotnet
EnvironmentFile=/home/ubuntu/alimed/deploy/.env

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and start service
sudo systemctl daemon-reload
sudo systemctl enable alimed-backend
sudo systemctl restart alimed-backend

echo ""
echo "========================================="
echo "✅ Backend deployment complete!"
echo "========================================="
echo "Service status:"
sudo systemctl status alimed-backend --no-pager
echo ""
echo "Check logs with: sudo journalctl -u alimed-backend -f"
echo "API should be available at: http://localhost:5056"
