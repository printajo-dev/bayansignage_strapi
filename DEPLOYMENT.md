# Deploying the backend to a DigitalOcean Droplet

This app is deployed to its **own droplet**, separate from the Next.js
frontend (see [bayan-signage's DEPLOYMENT.md](https://github.com/printajo-dev/bayan-signage/blob/main/DEPLOYMENT.md)
for that side). They only talk to each other over HTTP -- the frontend
posts leads to this backend's public URL, and this backend needs the
frontend's URL in `CORS_ALLOWED_ORIGINS`.

## What you need first

- A droplet: Ubuntu 22.04 or 24.04 LTS, 1 GB RAM minimum (2 GB
  recommended if running Postgres on the same droplet).
- A domain or subdomain pointed at the droplet's IP via an `A` record,
  e.g. `api.bayansignage.com` -> `203.0.113.20`.
- The frontend's real domain, to lock down CORS.

## Option A -- automated bootstrap

SSH into the fresh droplet as root and run:

```bash
curl -fsSL https://raw.githubusercontent.com/printajo-dev/bayansignage_strapi/main/deploy/setup-droplet.sh -o setup-droplet.sh
bash setup-droplet.sh api.bayansignage.com
```

This installs Node.js 20, PM2, Nginx, Certbot, and Postgres; creates a
`strapi` database role and `bayansignage` database; clones the repo to
`/var/www/bayansignage-strapi`; prompts you to fill in `.env`; builds the
app; starts it under PM2; configures Nginx as a reverse proxy; and
requests a Let's Encrypt certificate. Read it before running it --
`deploy/setup-droplet.sh` in this repo is the exact script.

## Option B -- manual walkthrough

### 1. System packages

```bash
apt-get update
apt-get install -y curl git nginx certbot python3-certbot-nginx postgresql postgresql-contrib
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
npm install -g pm2
```

### 2. Database

SQLite (the dev default) works but doesn't handle concurrent writes well
under real traffic -- use Postgres in production:

```bash
sudo -u postgres psql -c "CREATE ROLE strapi WITH LOGIN PASSWORD 'CHANGE_ME';"
sudo -u postgres psql -c "CREATE DATABASE bayansignage OWNER strapi;"
```

### 3. Clone and configure

```bash
mkdir -p /var/www && cd /var/www
git clone https://github.com/printajo-dev/bayansignage_strapi.git bayansignage-strapi
cd bayansignage-strapi
cp .env.example .env
nano .env
```

In `.env`, at minimum set:

- `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`,
  `JWT_SECRET`, `ENCRYPTION_KEY` -- generate each with:
  ```bash
  node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
  ```
- `DATABASE_CLIENT=postgres`
- `DATABASE_URL=postgresql://strapi:CHANGE_ME@127.0.0.1:5432/bayansignage`
- `DATABASE_SSL=false` (local Postgres on the same droplet doesn't need TLS)
- `CORS_ALLOWED_ORIGINS=https://bayansignage.com,https://www.bayansignage.com`
- Optionally `BREVO_SMTP_*` and `PERFEX_API_*` for lead notifications --
  both integrations fail gracefully if left unset.

### 4. Build and start

```bash
npm ci
npm run build
pm2 start deploy/ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root   # follow the printed instructions
```

The app now listens on `127.0.0.1:1337` (see `deploy/ecosystem.config.js`).
Visit `https://api.bayansignage.com/admin` once it's live to create the
first Strapi admin account.

### 5. Nginx reverse proxy + SSL

```bash
cp deploy/nginx.conf /etc/nginx/sites-available/bayansignage-strapi
# edit the server_name line if your domain differs from api.bayansignage.com
ln -s /etc/nginx/sites-available/bayansignage-strapi /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
certbot --nginx -d api.bayansignage.com
```

### 6. Firewall

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

Postgres should stay bound to `localhost` only (the default) -- don't
open `5432` on the firewall.

## Redeploying after a change

Manually:

```bash
cd /var/www/bayansignage-strapi
git pull origin main
npm ci
npm run build
pm2 reload bayansignage-strapi
```

## Automatic deploy on `git push` (recommended)

`.github/workflows/deploy.yml` runs this same sequence over SSH
automatically whenever CI passes on `main`. To enable it, add these
repo secrets (Settings -> Secrets and variables -> Actions):

| Secret | Value |
|---|---|
| `DROPLET_HOST` | the backend droplet's IP address |
| `DROPLET_USER` | SSH user, e.g. `root` |
| `DROPLET_SSH_KEY` | private key with SSH access to that user (generate a dedicated deploy key, don't reuse your personal one) |
| `DROPLET_PORT` | optional, only needed if SSH isn't on port 22 |

These are separate from the frontend repo's secrets -- each repo deploys
to its own droplet independently.

## Backups

Postgres data lives only on this droplet unless you back it up. At minimum:

```bash
# daily dump, keep 7 days -- add to root's crontab
pg_dump -U strapi bayansignage | gzip > /var/backups/bayansignage-$(date +\%F).sql.gz
find /var/backups -name 'bayansignage-*.sql.gz' -mtime +7 -delete
```

Also back up `public/uploads/` if using local media storage (Strapi's
default) rather than an S3-compatible provider.

## Logs and process management

```bash
pm2 logs bayansignage-strapi
pm2 status
pm2 restart bayansignage-strapi   # hard restart
pm2 reload bayansignage-strapi    # zero-downtime reload
```
