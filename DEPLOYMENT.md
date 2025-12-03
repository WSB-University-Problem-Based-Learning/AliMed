# Deployment Setup Guide

## Automated GitHub to Server Deployment

This repository is now configured for automatic deployment from GitHub to your server.

### How it works:
- When you push to `main` or `feature/frontend` branches, GitHub Actions will:
  1. Build your React application
  2. Deploy the built files to your server via SSH

### Setup Required:

#### 1. Generate SSH Key Pair (if not already done)
On your local machine or the server, run:
```bash
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/github_deploy
```

#### 2. Add Public Key to Server
Copy the public key to your server:
```bash
ssh-copy-id -i ~/.ssh/github_deploy.pub a_dev@43.106.30.243
```

Or manually add it to the server:
```bash
ssh a_dev@43.106.30.243
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
# Paste the content of github_deploy.pub here
chmod 600 ~/.ssh/authorized_keys
```

#### 3. Configure GitHub Secrets
Go to your GitHub repository settings:
`https://github.com/WSB-University-Problem-Based-Learning/AliMed/settings/secrets/actions`

Add the following secrets:

- **SSH_PRIVATE_KEY**: Content of `~/.ssh/github_deploy` (private key)
- **REMOTE_HOST**: `43.106.30.243`
- **REMOTE_USER**: `a_dev`
- **REMOTE_TARGET**: `/home/a_dev/alimed-web` (or your preferred deployment path)

#### 4. Prepare Server Directory
SSH into your server and create the deployment directory:
```bash
ssh a_dev@43.106.30.243
mkdir -p /home/a_dev/alimed-web
chmod 755 /home/a_dev/alimed-web
```

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
