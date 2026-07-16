#!/usr/bin/env bash
# One-time bootstrap for a fresh Ubuntu 22.04/24.04 droplet running the
# Bayan Signage Strapi backend. Run as root over SSH:
#
#   bash setup-droplet.sh api.yourdomain.com
#
# See ../DEPLOYMENT.md for the full manual walkthrough this automates,
# including how to generate the Strapi secrets it will prompt you for.
set -euo pipefail

DOMAIN="${1:?Usage: setup-droplet.sh <domain, e.g. api.bayansignage.com>}"
APP_DIR=/var/www/bayansignage-strapi
REPO_URL=https://github.com/printajo-dev/bayansignage_strapi.git

echo "==> Installing system packages"
apt-get update
apt-get install -y curl git nginx certbot python3-certbot-nginx postgresql postgresql-contrib

echo "==> Installing Node.js 20 LTS"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

echo "==> Installing PM2"
npm install -g pm2

echo "==> Setting up Postgres database"
if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='strapi'" | grep -q 1; then
  DB_PASSWORD=$(openssl rand -base64 24)
  sudo -u postgres psql -c "CREATE ROLE strapi WITH LOGIN PASSWORD '$DB_PASSWORD';"
  sudo -u postgres psql -c "CREATE DATABASE bayansignage OWNER strapi;"
  echo ">>> Generated Postgres password for user 'strapi': $DB_PASSWORD"
  echo ">>> Save this now -- you'll need it for DATABASE_URL in .env below."
else
  echo "Postgres role 'strapi' already exists, skipping creation."
fi

echo "==> Cloning repository to $APP_DIR"
mkdir -p /var/www
if [ -d "$APP_DIR/.git" ]; then
  echo "$APP_DIR already exists, skipping clone"
else
  git clone "$REPO_URL" "$APP_DIR"
fi
cd "$APP_DIR"

echo "==> Environment file"
if [ ! -f .env ]; then
  cp .env.example .env
  echo ">>> Edit $APP_DIR/.env now:"
  echo "      - fill in APP_KEYS, API_TOKEN_SALT, ADMIN_JWT_SECRET, TRANSFER_TOKEN_SALT, JWT_SECRET, ENCRYPTION_KEY"
  echo "        (generate each with: node -e \"console.log(require('crypto').randomBytes(16).toString('base64'))\")"
  echo "      - set DATABASE_CLIENT=postgres and DATABASE_URL=postgresql://strapi:<password>@127.0.0.1:5432/bayansignage"
  echo "      - set CORS_ALLOWED_ORIGINS to the frontend's real domain"
  read -rp "Press enter once .env is filled in..."
fi

echo "==> Installing dependencies and building"
npm ci
npm run build

echo "==> Starting under PM2"
pm2 start deploy/ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root || true

echo "==> Configuring Nginx"
sed "s/api\.bayansignage\.com/$DOMAIN/" deploy/nginx.conf > /etc/nginx/sites-available/bayansignage-strapi
ln -sf /etc/nginx/sites-available/bayansignage-strapi /etc/nginx/sites-enabled/bayansignage-strapi
nginx -t
systemctl reload nginx

echo "==> Requesting SSL certificate"
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m admin@bayansignage.com --redirect

echo "==> Done. Strapi should be live at https://$DOMAIN"
echo "    Admin panel: https://$DOMAIN/admin (first visit creates the admin account)"
echo "    Future deploys: git pull && npm ci && npm run build && pm2 reload bayansignage-strapi"
