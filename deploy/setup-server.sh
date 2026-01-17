#!/bin/bash
set -e

echo "========================================="
echo "AliMed Server Setup Script"
echo "========================================="

# Update system
echo "[1/7] Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker
echo "[2/7] Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
else
    echo "Docker already installed"
fi

# Install Docker Compose
echo "[3/7] Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    echo "Docker Compose already installed"
fi

# Install .NET 9 SDK
echo "[4/7] Installing .NET 9 SDK..."
if ! command -v dotnet &> /dev/null; then
    wget https://dot.net/v1/dotnet-install.sh -O dotnet-install.sh
    chmod +x dotnet-install.sh
    ./dotnet-install.sh --channel 9.0
    echo 'export DOTNET_ROOT=$HOME/.dotnet' >> ~/.bashrc
    echo 'export PATH=$PATH:$DOTNET_ROOT:$DOTNET_ROOT/tools' >> ~/.bashrc
    source ~/.bashrc
    rm dotnet-install.sh
else
    echo ".NET already installed"
fi

# Install nginx
echo "[5/7] Installing nginx..."
sudo apt-get install -y nginx

# Install Node.js 20
echo "[6/7] Installing Node.js 20..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "Node.js already installed"
fi

# Install certbot for SSL
echo "[7/7] Installing certbot..."
sudo apt-get install -y certbot python3-certbot-nginx

echo ""
echo "========================================="
echo "✅ Server setup complete!"
echo "========================================="
echo "Installed versions:"
docker --version
docker-compose --version
$HOME/.dotnet/dotnet --version || dotnet --version
node --version
nginx -v
certbot --version
echo ""
echo "Next steps:"
echo "1. Clone the repository"
echo "2. Run deploy-backend.sh"
echo "3. Run deploy-frontend.sh"
echo "4. Run setup-nginx.sh"
