# 🚀 AliMed Production Server - Quick Commands

## Connection
```bash
ssh -i ~/.ssh/alimed.key ubuntu@130.162.222.70
```

## Service Management

### Backend
```bash
# Status
sudo systemctl status alimed-backend

# Start/Stop/Restart
sudo systemctl start alimed-backend
sudo systemctl stop alimed-backend
sudo systemctl restart alimed-backend

# Logs (live)
sudo journalctl -u alimed-backend -f

# Logs (last 100 lines)
sudo journalctl -u alimed-backend -n 100 --no-pager
```

### MySQL
```bash
# Check container
docker ps | grep alimed_mysql

# Logs
docker logs alimed_mysql -f

# Connect to MySQL
docker exec -it alimed_mysql mysql -u alimed_user -p
# Password from: cat ~/alimed/deploy/.env

# Inside MySQL:
SHOW DATABASES;
USE alimed_db;
SHOW TABLES;
SELECT COUNT(*) FROM Lekarze;
SELECT COUNT(*) FROM Pacjenci;
SELECT COUNT(*) FROM Wizyty;
```

### Nginx
```bash
# Status
sudo systemctl status nginx

# Restart
sudo systemctl restart nginx

# Test config
sudo nginx -t

# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

## Testing Endpoints

```bash
# Health check
curl http://130.162.222.70/health

# Get facilities
curl http://130.162.222.70/api/Placowki

# Get doctors
curl http://130.162.222.70/api/Lekarze

# Get patients (requires auth)
curl -H "Authorization: Bearer YOUR_TOKEN" http://130.162.222.70/api/Pacjenci
```

## Updating Application

### Update Backend
```bash
cd /home/ubuntu/alimed
git pull origin main
cd ~/deploy
./deploy-backend.sh
```

### Update Frontend
```bash
cd /home/ubuntu/alimed
git pull origin main
cd ~/deploy
./deploy-frontend.sh
```

### Update Both
```bash
cd /home/ubuntu/alimed
git pull origin main
cd ~/deploy
./deploy-backend.sh && ./deploy-frontend.sh
```

## Configuration Files

### Backend Environment
```bash
nano ~/alimed/deploy/.env
# After editing:
sudo systemctl restart alimed-backend
```

### Frontend Environment
```bash
nano ~/alimed/src/frontend/AliMed.Web/.env.production
# After editing, rebuild:
cd ~/deploy && ./deploy-frontend.sh
```

### Nginx Config
```bash
sudo nano /etc/nginx/sites-available/alimed
# After editing:
sudo nginx -t && sudo systemctl restart nginx
```

## Troubleshooting

### Backend Won't Start
```bash
# Check logs for errors
sudo journalctl -u alimed-backend -n 100 --no-pager

# Check if port is in use
sudo lsof -i :5056

# Try manual start (for debugging)
cd /home/ubuntu/alimed-backend-publish
ASPNETCORE_URLS=http://0.0.0.0:5056 dotnet API.Alimed.dll
```

### MySQL Connection Issues
```bash
# Check if MySQL is running
docker ps | grep mysql

# Restart MySQL
cd ~/alimed/deploy
docker-compose -f docker-compose.prod.yml restart mysql

# Check MySQL logs
docker logs alimed_mysql --tail 100
```

### Frontend Not Loading
```bash
# Check nginx status
sudo systemctl status nginx

# Check nginx config
sudo nginx -t

# Check file permissions
ls -la /var/www/alimed

# Fix permissions if needed
sudo chown -R www-data:www-data /var/www/alimed
```

## Monitoring

### System Resources
```bash
# CPU and memory
top
# or
htop

# Disk space
df -h

# Docker stats
docker stats
```

### Active Connections
```bash
sudo netstat -tlnp | grep -E ':(80|5056|3306)'
```

### Process Info
```bash
# Backend process
ps aux | grep dotnet

# Nginx processes
ps aux | grep nginx
```

## Database Operations

### Backup Database
```bash
docker exec alimed_mysql mysqldump -u alimed_user -p alimed_db > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
cat backup_20260117.sql | docker exec -i alimed_mysql mysql -u alimed_user -p alimed_db
```

### Run Migrations
```bash
cd /home/ubuntu/alimed/WebAPI/API.Alimed
dotnet ef database update
```

## Complete Restart

```bash
# Stop everything
sudo systemctl stop alimed-backend
cd ~/alimed/deploy
docker-compose -f docker-compose.prod.yml down

# Start everything
docker-compose -f docker-compose.prod.yml up -d
sleep 15  # Wait for MySQL
sudo systemctl start alimed-backend
sudo systemctl restart nginx

# Check status
sudo systemctl status alimed-backend
docker ps
sudo systemctl status nginx
```

## Useful URLs

- Frontend: http://130.162.222.70
- API: http://130.162.222.70/api/
- Swagger: http://130.162.222.70:5056/swagger
- Health: http://130.162.222.70/health

## Demo Accounts

- `pacjent1` (PESEL: 90050112345) - Alicja Bąk
- `pacjent2` (PESEL: 85112054321) - Robert Cygan
- `pacjent3` (PESEL: 75021598765) - Karolina Duda
- `pacjent4` (PESEL: 01081033344) - Maksymilian Falkowski
- `pacjent5` (PESEL: 68092288899) - Zofia Górecka
- `admin_alimed` - Admin account
