# Deployment Setup Guide

## Automated GitHub to Server Deployment

This repository is now configured for automatic deployment from GitHub to your server.

### How it works:
- When you push to `main` or `feature/frontend` branches, GitHub Actions will:
  1. Build your React application
  2. Deploy the built files to your server via SSH

### ✅ Server Configuration - COMPLETED

The server has been configured with:
- SSH key authentication
- Deployment directory: `/home/a_dev/alimed-web`
- Public key installed in `~/.ssh/authorized_keys`

### 🔧 Required: Configure GitHub Secrets

**IMPORTANT**: You must add the following secrets to GitHub to enable automated deployment.

Go to your GitHub repository settings:
`https://github.com/WSB-University-Problem-Based-Learning/AliMed/settings/secrets/actions`

Click "New repository secret" and add each of the following:

#### Secret 1: SSH_PRIVATE_KEY
```
The private SSH key is stored locally at: C:\Users\alexk\.ssh\github_deploy_final
Copy the entire content of this file (including BEGIN and END lines)
```

#### Secret 2: REMOTE_HOST
```
Your server IP address
```

#### Secret 3: REMOTE_USER
```
Your server username
```

#### Secret 4: REMOTE_TARGET
```
/home/a_dev/alimed-web
```

### 📝 Step-by-Step Guide to Add Secrets:

1. **Open your browser** and go to:
   https://github.com/WSB-University-Problem-Based-Learning/AliMed/settings/secrets/actions

2. **Get the private key** from your local machine:
   - Location: `C:\Users\alexk\.ssh\github_deploy_final`
   - Copy the ENTIRE file content

3. **Add each secret**:
   - Click "New repository secret"
   - Enter the secret **Name** (exactly as shown above)
   - Paste the **Value** 
   - Click "Add secret"

4. **Verify** all 4 secrets are added

**NOTE**: The secrets are already configured in GitHub. You don't need to do anything unless you want to update them.

### Testing the Deployment:
1. Commit and push the workflow file:
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "Add automated deployment workflow"
   git push origin feature/frontend
   ```

2. Go to GitHub Actions tab to monitor the deployment:
   `https://github.com/WSB-University-Problem-Based-Learning/AliMed/actions`

### Manual Trigger:
You can also manually trigger deployment from the GitHub Actions tab by clicking "Run workflow".

### Deployment Path on Server:
The built files will be deployed to: `/home/a_dev/alimed-web/`

### Setting up Web Server (Optional):
If you want to serve the application via Nginx or Apache:

**Nginx example:**
```bash
sudo nano /etc/nginx/sites-available/alimed
```

Add:
```nginx
server {
    listen 80;
    server_name 43.106.30.243;
    
    root /home/a_dev/alimed-web;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/alimed /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Troubleshooting:
- Check GitHub Actions logs for build/deployment errors
- Verify SSH connection: `ssh a_dev@43.106.30.243`
- Check server logs: `tail -f /var/log/nginx/error.log`
