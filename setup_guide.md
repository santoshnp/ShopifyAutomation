# Shopify Automation Tool - Setup Guide

This guide will walk you through setting up the Shopify Automation Tool on your server with minimal technical knowledge required.

## Prerequisites

Before you begin, make sure you have:

1. A server with:
   - Ubuntu 20.04 or newer
   - At least 2GB RAM
   - 20GB storage
   - SSH access

2. Domain name (optional but recommended)

3. GitHub account for version control

4. OpenAI API key for LLM integration

## Step 1: Server Preparation

### 1.1 Update Your Server

```bash
sudo apt update
sudo apt upgrade -y
```

### 1.2 Install Required Software

```bash
# Install Node.js and npm
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Redis
sudo apt install -y redis-server

# Install Git
sudo apt install -y git

# Install Docker (optional, for containerized deployment)
sudo apt install -y docker.io
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
```

### 1.3 Verify Installations

```bash
# Check Node.js and npm versions
node -v  # Should show v18.x.x
npm -v   # Should show 8.x.x or higher

# Check PostgreSQL
sudo systemctl status postgresql

# Check Redis
sudo systemctl status redis
```

## Step 2: Database Setup

### 2.1 Configure PostgreSQL

```bash
# Access PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE shopify_automation;
CREATE USER shopify_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE shopify_automation TO shopify_user;

# Exit PostgreSQL
\q
```

## Step 3: Application Setup

### 3.1 Clone the Repository

```bash
# Navigate to your preferred directory
cd /var/www

# Clone the repository (replace with your GitHub repository URL after you've pushed the code)
sudo git clone https://github.com/yourusername/shopify-automation-tool.git

# Set permissions
sudo chown -R $USER:$USER /var/www/shopify-automation-tool
```

### 3.2 Set Up Backend

```bash
# Navigate to backend directory
cd /var/www/shopify-automation-tool/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit the environment file with your settings
nano .env
```

Update the `.env` file with your settings:

```
PORT=3001
NODE_ENV=production
DB_HOST=localhost
DB_NAME=shopify_automation
DB_USER=shopify_user
DB_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
```

### 3.3 Set Up Frontend

```bash
# Navigate to frontend directory
cd /var/www/shopify-automation-tool/frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit the environment file
nano .env
```

Update the frontend `.env` file:

```
NEXT_PUBLIC_API_URL=http://your_server_ip:3001
```

### 3.4 Build the Frontend

```bash
# Build the frontend
npm run build
```

## Step 4: Running the Application

### 4.1 Set Up PM2 Process Manager

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the backend
cd /var/www/shopify-automation-tool/backend
pm2 start src/index.js --name shopify-backend

# Start the frontend
cd /var/www/shopify-automation-tool/frontend
pm2 start npm --name shopify-frontend -- start

# Make PM2 start on boot
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER
pm2 save
```

### 4.2 Set Up Nginx as Reverse Proxy

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/shopify-automation
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name bizzguru.de;  # Domain name for the application

    location / {
        proxy_pass http://localhost:3000;  # Frontend
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;  # Backend
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the configuration:

```bash
sudo ln -s /etc/nginx/sites-available/shopify-automation /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

### 4.3 Set Up SSL (Optional but Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d bizzguru.de

# Follow the prompts to complete SSL setup
```

## Step 5: GitHub Integration

### 5.1 Push Your Code to GitHub

First, create a new repository on GitHub.

Then, from your local development machine (not the server):

```bash
# Initialize Git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit"

# Add remote repository
git remote add origin https://github.com/yourusername/shopify-automation-tool.git

# Push to GitHub
git push -u origin main
```

### 5.2 Set Up Deployment Workflow

Create a file `.github/workflows/deploy.yml` in your repository:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/shopify-automation-tool
            git pull
            cd backend
            npm install
            cd ../frontend
            npm install
            npm run build
            pm2 restart all
```

Add your server details as GitHub secrets in your repository settings.

## Step 6: Maintenance and Updates

### 6.1 Updating the Application

```bash
# Navigate to application directory
cd /var/www/shopify-automation-tool

# Pull latest changes
git pull

# Update backend
cd backend
npm install

# Update frontend
cd ../frontend
npm install
npm run build

# Restart services
pm2 restart all
```

### 6.2 Monitoring

```bash
# Check application status
pm2 status

# View logs
pm2 logs shopify-backend
pm2 logs shopify-frontend

# Monitor system resources
htop
```

## Troubleshooting

### Common Issues and Solutions

1. **Application not starting:**
   - Check logs: `pm2 logs`
   - Verify environment variables: `cat .env`
   - Check for port conflicts: `sudo netstat -tulpn | grep LISTEN`

2. **Database connection issues:**
   - Verify PostgreSQL is running: `sudo systemctl status postgresql`
   - Check database credentials in `.env`
   - Test connection: `psql -U shopify_user -d shopify_automation -h localhost`

3. **Nginx configuration issues:**
   - Test configuration: `sudo nginx -t`
   - Check logs: `sudo tail -f /var/log/nginx/error.log`

4. **SSL certificate issues:**
   - Renew certificate: `sudo certbot renew`
   - Check certificate status: `sudo certbot certificates`

## Support Resources

- Node.js documentation: https://nodejs.org/en/docs/
- PostgreSQL documentation: https://www.postgresql.org/docs/
- PM2 documentation: https://pm2.keymetrics.io/docs/usage/quick-start/
- Nginx documentation: https://nginx.org/en/docs/
- GitHub Actions documentation: https://docs.github.com/en/actions
