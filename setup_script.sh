#!/bin/bash

# Shopify Automation Tool Setup Script
# This script automates the setup process for the Shopify Automation Tool

echo "====================================================="
echo "  Shopify Automation Tool - Automated Setup Script   "
echo "====================================================="
echo ""
echo "This script will help you set up the Shopify Automation Tool"
echo "with minimal technical knowledge required."
echo ""
echo "Please make sure you have:"
echo "  1. SSH access to your server"
echo "  2. Sudo privileges"
echo "  3. A domain name (optional but recommended)"
echo "  4. OpenAI API key for LLM integration"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

# Update system
echo ""
echo "Step 1: Updating your system..."
sudo apt update
sudo apt upgrade -y

# Install required software
echo ""
echo "Step 2: Installing required software..."
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs postgresql postgresql-contrib redis-server git

# Verify installations
echo ""
echo "Step 3: Verifying installations..."
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"
echo "PostgreSQL status: $(sudo systemctl is-active postgresql)"
echo "Redis status: $(sudo systemctl is-active redis)"

# Database setup
echo ""
echo "Step 4: Setting up database..."
read -p "Enter a secure password for the database user: " DB_PASSWORD

# Create database and user
sudo -u postgres psql -c "CREATE DATABASE shopify_automation;"
sudo -u postgres psql -c "CREATE USER shopify_user WITH ENCRYPTED PASSWORD '$DB_PASSWORD';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE shopify_automation TO shopify_user;"

echo "Database setup complete!"

# Application setup
echo ""
echo "Step 5: Setting up application..."
read -p "Enter the directory where you want to install the application [/var/www]: " INSTALL_DIR
INSTALL_DIR=${INSTALL_DIR:-/var/www}

# Create directory if it doesn't exist
sudo mkdir -p $INSTALL_DIR
sudo chown -R $USER:$USER $INSTALL_DIR

# Clone repository
echo ""
echo "Step 5.1: Cloning repository..."
read -p "Enter your GitHub repository URL: " REPO_URL
git clone $REPO_URL $INSTALL_DIR/shopify-automation-tool

# Set up backend
echo ""
echo "Step 5.2: Setting up backend..."
cd $INSTALL_DIR/shopify-automation-tool/backend
npm install

# Create environment file
cat > .env << EOF
PORT=3001
NODE_ENV=production
DB_HOST=localhost
DB_NAME=shopify_automation
DB_USER=shopify_user
DB_PASSWORD=$DB_PASSWORD
JWT_SECRET=$(openssl rand -hex 32)
EOF

read -p "Enter your OpenAI API key: " OPENAI_API_KEY
echo "OPENAI_API_KEY=$OPENAI_API_KEY" >> .env

# Set up frontend
echo ""
echo "Step 5.3: Setting up frontend..."
cd $INSTALL_DIR/shopify-automation-tool/frontend
npm install

# Create environment file
read -p "Enter your server IP or domain name: " SERVER_ADDRESS
cat > .env << EOF
NEXT_PUBLIC_API_URL=http://$SERVER_ADDRESS:3001
EOF

# Build frontend
echo ""
echo "Step 5.4: Building frontend..."
npm run build

# Set up PM2
echo ""
echo "Step 6: Setting up process manager..."
sudo npm install -g pm2

# Start backend
cd $INSTALL_DIR/shopify-automation-tool/backend
pm2 start src/index.js --name shopify-backend

# Start frontend
cd $INSTALL_DIR/shopify-automation-tool/frontend
pm2 start npm --name shopify-frontend -- start

# Make PM2 start on boot
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER
pm2 save

# Set up Nginx
echo ""
echo "Step 7: Setting up Nginx..."
sudo apt install -y nginx

# Create Nginx configuration
cat > /tmp/shopify-automation << EOF
server {
    listen 80;
    server_name bizzguru.de;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo mv /tmp/shopify-automation /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/shopify-automation /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Set up SSL (optional)
echo ""
echo "Step 8: Setting up SSL (optional)..."
read -p "Do you want to set up SSL with Let's Encrypt? (y/n): " SETUP_SSL

if [ "$SETUP_SSL" = "y" ]; then
    sudo apt install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d bizzguru.de
    echo "SSL setup complete!"
else
    echo "Skipping SSL setup."
fi

# Final steps
echo ""
echo "====================================================="
echo "  Shopify Automation Tool - Setup Complete!          "
echo "====================================================="
echo ""
echo "Your application is now running at: http://$SERVER_ADDRESS"
if [ "$SETUP_SSL" = "y" ]; then
    echo "Secure access: https://$SERVER_ADDRESS"
fi
echo ""
echo "Backend API: http://$SERVER_ADDRESS:3001"
echo "Frontend: http://$SERVER_ADDRESS"
echo ""
echo "To check the status of your application:"
echo "  pm2 status"
echo ""
echo "To view logs:"
echo "  pm2 logs shopify-backend"
echo "  pm2 logs shopify-frontend"
echo ""
echo "Thank you for using the Shopify Automation Tool!"
echo "====================================================="
