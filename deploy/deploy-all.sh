#!/bin/bash
# Complete automated deployment - runs all scripts in sequence

set -e

echo "========================================="
echo "🚀 AliMed Complete Deployment"
echo "========================================="
echo ""
echo "This script will:"
echo "1. Setup server (Docker, .NET, Node, nginx)"
echo "2. Deploy MySQL database"
echo "3. Deploy backend API"
echo "4. Deploy frontend"
echo "5. Configure nginx"
echo ""
read -p "Press Enter to continue or Ctrl+C to abort..."

# Run all deployment scripts
./setup-server.sh
echo ""
echo "✅ Server setup complete. Please logout and login again for Docker group changes."
echo "Then run: ./deploy-backend.sh && ./deploy-frontend.sh && ./setup-nginx.sh"
