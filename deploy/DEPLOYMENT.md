# 🚀 AliMed Production Deployment Guide

## Server Information
- **IP**: <SERVER_IP>
- **SSH**: `ssh -i ~/.ssh/alimed.key ubuntu@<SERVER_IP>`
- **OS**: Ubuntu (latest)

## 📋 Quick Deployment

### Step 1: Upload deployment scripts to server

From your local machine:

```powershell
# Upload deployment scripts
scp -i ~/.ssh/alimed.key -r deploy ubuntu@<SERVER_IP>:~/
```

### Step 2: Connect to server

```powershell
ssh -i ~/.ssh/alimed.key ubuntu@<SERVER_IP>
```

### Step 3: Run deployment scripts (in order)

```bash
# 1. Setup server (install Docker, .NET, Node, nginx)
cd ~/deploy
chmod +x *.sh
./setup-server.sh

# Logout and login again to apply Docker group changes
exit
ssh -i ~/.ssh/alimed.key ubuntu@<SERVER_IP>

# 2. Deploy backend
cd ~/deploy
./deploy-backend.sh

# 3. Deploy frontend
./deploy-frontend.sh

# 4. Setup nginx reverse proxy
./setup-nginx.sh
```

### Step 4: Configure secrets

Edit the environment file:

```bash
nano /home/ubuntu/alimed/deploy/.env
```

Update these values:
- `GITHUB_CLIENT_ID`: Your GitHub OAuth App Client ID
- `GITHUB_CLIENT_SECRET`: Your GitHub OAuth App Client Secret

Also edit frontend config:

```bash
nano /home/ubuntu/alimed/src/frontend/AliMed.Web/.env.production
```

Update:
- `VITE_GITHUB_CLIENT_ID`: Your GitHub OAuth App Client ID

Restart backend after changes:

```bash
sudo systemctl restart alimed-backend
```

## 🔍 Verification

### Check services status

```bash
# Backend service
sudo systemctl status alimed-backend

# MySQL container
docker ps | grep alimed_mysql

# Nginx
sudo systemctl status nginx
```

### Check logs

```bash
# Backend logs (live)
sudo journalctl -u alimed-backend -f

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Test endpoints

```bash
# Health check
curl http://<SERVER_IP>/health

# API health
curl http://<SERVER_IP>/api/health

# Get facilities
curl http://<SERVER_IP>/api/Placowki

# Get doctors
curl http://<SERVER_IP>/api/Lekarze
```

## 🌐 Access Application

- **Frontend**: http://<SERVER_IP>
- **API Swagger**: http://<SERVER_IP>:5056/swagger
- **API Base**: http://<SERVER_IP>/api/

## 🔐 GitHub OAuth Configuration

Update your GitHub OAuth App settings:

1. Go to: https://github.com/settings/developers
2. Select your OAuth App
3. Update **Authorization callback URL** to:
   - `http://<SERVER_IP>/auth/callback`
   - (Or your domain if you set one up)

## 🔄 Updating Application

### Update backend:

```bash
cd /home/ubuntu/alimed
git pull origin main
cd ~/deploy
./deploy-backend.sh
```

### Update frontend:

```bash
cd /home/ubuntu/alimed
git pull origin main
cd ~/deploy
./deploy-frontend.sh
```

## 🛠️ Troubleshooting

### Backend not starting

```bash
# Check detailed logs
sudo journalctl -u alimed-backend -n 100 --no-pager

# Check if port is in use
sudo lsof -i :5056

# Manually test backend
cd /home/ubuntu/alimed-backend-publish
ASPNETCORE_URLS=http://0.0.0.0:5056 dotnet API.Alimed.dll
```

### MySQL connection issues

```bash
# Check MySQL container
docker logs alimed_mysql

# Connect to MySQL
docker exec -it alimed_mysql mysql -u alimed_user -p
# Enter password from .env file

# Inside MySQL:
SHOW DATABASES;
USE alimed_db;
SHOW TABLES;
```

### Frontend not loading

```bash
# Check nginx config
sudo nginx -t

# Check nginx logs
sudo tail -f /var/log/nginx/error.log

# Check file permissions
ls -la /var/www/alimed
```

### API CORS errors

Update backend appsettings.json allowed origins:

```bash
nano /home/ubuntu/alimed/WebAPI/API.Alimed/appsettings.json
```

Add your server IP to allowed origins, then rebuild.

## 🔒 Security Hardening (Optional)

### Setup UFW firewall

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS (for future SSL)
sudo ufw enable
```

### Setup SSL with Let's Encrypt (requires domain)

```bash
# First, point a domain to <SERVER_IP>
# Then run:
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Automatic SSL renewal

```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## 📊 Monitoring

### System resources

```bash
# CPU and memory
htop

# Disk usage
df -h

# Docker stats
docker stats
```

### Application metrics

```bash
# Backend process
ps aux | grep dotnet

# Active connections
sudo netstat -tlnp | grep -E ':(80|5056|3306)'
```

## 🎯 Test User Accounts

Seeded demo accounts (from AppDbContext.cs):

- Username: `pacjent1` (Alicja Bąk, PESEL: 90050112345)
- Username: `pacjent2` (Robert Cygan, PESEL: 85112054321)
- Username: `pacjent3` (Karolina Duda, PESEL: 75021598765)
- Username: `pacjent4` (Maksymilian Falkowski, PESEL: 01081033344)
- Username: `pacjent5` (Zofia Górecka, PESEL: 68092288899)
- Username: `admin_alimed` (Admin account)

## 📞 Support Commands

```bash
# Restart all services
sudo systemctl restart alimed-backend nginx
docker restart alimed_mysql

# View all logs at once
sudo journalctl -u alimed-backend -f &
sudo tail -f /var/log/nginx/error.log &
docker logs -f alimed_mysql

# Clean restart
sudo systemctl stop alimed-backend
docker-compose -f /home/ubuntu/alimed/deploy/docker-compose.prod.yml down
docker-compose -f /home/ubuntu/alimed/deploy/docker-compose.prod.yml up -d
sudo systemctl start alimed-backend
```
