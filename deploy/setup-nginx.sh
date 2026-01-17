#!/bin/bash
set -e

echo "========================================="
echo "AliMed Nginx Configuration"
echo "========================================="

# Server IP
SERVER_IP="130.162.222.70"

# Create nginx configuration
echo "[1/3] Creating nginx configuration..."
sudo tee /etc/nginx/sites-available/alimed > /dev/null << 'EOF'
server {
    listen 80;
    server_name 130.162.222.70;

    # Frontend - React app
    root /var/www/alimed;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Frontend static files
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "public, max-age=3600";
    }

    # API proxy
    location /api/ {
        proxy_pass http://localhost:5056/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, PATCH, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type, Accept' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;

        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

# Enable site
echo "[2/3] Enabling site..."
sudo ln -sf /etc/nginx/sites-available/alimed /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload nginx
echo "[3/3] Testing and reloading nginx..."
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

echo ""
echo "========================================="
echo "✅ Nginx configuration complete!"
echo "========================================="
echo "Frontend: http://$SERVER_IP"
echo "API: http://$SERVER_IP/api/"
echo "Health: http://$SERVER_IP/health"
echo ""
echo "To enable HTTPS (recommended):"
echo "1. Set up a domain name pointing to $SERVER_IP"
echo "2. Run: sudo certbot --nginx -d yourdomain.com"
