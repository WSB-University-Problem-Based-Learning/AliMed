# 🚀 Quick Deployment to 130.162.222.70

## Option 1: Automated (Windows)

```powershell
cd deploy
.\deploy-windows.ps1
```

Then SSH to the server and run the backend/frontend deployment.

## Option 2: Manual Upload

```powershell
# Upload files
scp -i ~/.ssh/alimed.key -r deploy ubuntu@130.162.222.70:~/

# SSH to server
ssh -i ~/.ssh/alimed.key ubuntu@130.162.222.70

# On server, run:
cd ~/deploy
chmod +x *.sh
./setup-server.sh

# Logout and login again, then:
cd ~/deploy
./deploy-backend.sh
./deploy-frontend.sh
./setup-nginx.sh
```

## Configure Secrets

Before deploying, you need to set up GitHub OAuth:

1. **Edit backend secrets** (on server):
   ```bash
   nano ~/alimed/deploy/.env
   ```
   Update:
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`

2. **Edit frontend secrets** (on server):
   ```bash
   nano ~/alimed/src/frontend/AliMed.Web/.env.production
   ```
   Update:
   - `VITE_GITHUB_CLIENT_ID`

3. **Restart backend**:
   ```bash
   sudo systemctl restart alimed-backend
   ```

## Access Application

- **Frontend**: http://130.162.222.70
- **API**: http://130.162.222.70/api/
- **Swagger**: http://130.162.222.70:5056/swagger

## Test Users

- `pacjent1` (PESEL: 90050112345)
- `pacjent2` (PESEL: 85112054321)
- `admin_alimed` (Admin)

See [DEPLOYMENT.md](DEPLOYMENT.md) for full documentation.
