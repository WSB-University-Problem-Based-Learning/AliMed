# AliMed Deployment Script for Windows
# Run this from your local machine to deploy to the server

$SERVER = "ubuntu@130.162.222.70"
$SSH_KEY = "$HOME/.ssh/alimed.key"
$REPO_DIR = "C:\Users\alexk\repos\AliMed"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "🚀 AliMed Server Deployment" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Upload deployment scripts
Write-Host "[1/3] Uploading deployment scripts..." -ForegroundColor Yellow
scp -i $SSH_KEY -r "$REPO_DIR\deploy" "${SERVER}:~/"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to upload files" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Files uploaded successfully" -ForegroundColor Green
Write-Host ""

# Step 2: Make scripts executable and run setup
Write-Host "[2/3] Setting up server..." -ForegroundColor Yellow
$setupCommand = @"
cd ~/deploy && chmod +x *.sh && ./setup-server.sh
"@

ssh -i $SSH_KEY $SERVER $setupCommand

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "✅ Server setup complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. SSH to server: ssh -i ~/.ssh/alimed.key ubuntu@130.162.222.70"
Write-Host "2. Run: cd ~/deploy && ./deploy-backend.sh"
Write-Host "3. Edit .env file with your GitHub OAuth credentials"
Write-Host "4. Run: ./deploy-frontend.sh"
Write-Host "5. Run: ./setup-nginx.sh"
Write-Host ""
Write-Host "Or run everything at once:" -ForegroundColor Cyan
Write-Host "cd ~/deploy && ./deploy-backend.sh && ./deploy-frontend.sh && ./setup-nginx.sh"
Write-Host ""
Write-Host "See deploy/DEPLOYMENT.md for detailed instructions" -ForegroundColor Gray
