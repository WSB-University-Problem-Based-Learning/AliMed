# 🚀 AliMed Production Deployment Guide

## Overview
AliMed is deployed to an Oracle Cloud VM running Ubuntu.
- **Frontend**: Served by Nginx as static files.
- **Backend**: Runs as a Systemd service (`alimed-api`) on port 5056.
- **Database**: Oracle Heatwave MySQL (managed service).
- **Deployment**: Fully automated via GitHub Actions.

## Server Information
- **IP**: `130.162.222.70`
- **SSH**: `ssh -i ~/.ssh/alimed.key ubuntu@130.162.222.70`
- **OS**: Ubuntu 22.04 LTS

## 🔄 Automated Deployment
Deployment is handled automatically by GitHub Actions workflows.

| Component | Trigger | Workflow |
|-----------|---------|----------|
| **Backend** | Push to `main` | `.github/workflows/backend.yml` builds & tests. On success, `deploy.yml` deploys to server. |
| **Frontend** | Push to `main`| `.github/workflows/frontend.yml` builds. On success, `deploy.yml` deploys to server. |

### Required GitHub Secrets
The following secrets must be configured in the GitHub Repository settings:
- `SSH_PRIVATE_KEY`: Private SSH key for `ubuntu` user.
- `REMOTE_HOST`: `130.162.222.70`
- `REMOTE_USER`: `ubuntu`
- `REMOTE_TARGET`: `/home/ubuntu/www` (Frontend path)
- `REMOTE_TARGET_BACKEND`: `/opt/alimed/api` (Backend path)

## 🛠️ Manual Server Operations
Although deployment is automated, you may need to access the server for monitoring or troubleshooting.

### Checking Service Status
```bash
# Check Backend API
sudo systemctl status alimed-api

# Check Nginx (Frontend & Proxy)
sudo systemctl status nginx
```

### Viewing Logs
```bash
# Backend Live Logs
sudo journalctl -u alimed-api -f

# Nginx Access Logs
sudo tail -f /var/log/nginx/access.log

# Nginx Error Logs
sudo tail -f /var/log/nginx/error.log
```

### Restarting Services manually
If necessary:
```bash
sudo systemctl restart alimed-api
sudo systemctl restart nginx
```

## 🔐 Configuration Management
Configuration is managed via files on the server that are **NOT** in the repository.
- **Backend**: `/opt/alimed/api/appsettings.Production.json` (Database connection, etc.)
- **Nginx**: `/etc/nginx/sites-enabled/default` (or similar config file)

**Do not overwrite these files during deployment.** The deployment script only updates the application binaries.
