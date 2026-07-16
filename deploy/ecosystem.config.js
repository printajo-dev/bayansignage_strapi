// PM2 process definition for the Strapi backend on its droplet.
// Usage: pm2 start deploy/ecosystem.config.js
const path = require("path");

module.exports = {
  apps: [
    {
      name: "bayansignage-strapi",
      cwd: path.join(__dirname, ".."),
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
      },
      max_memory_restart: "512M",
      autorestart: true,
    },
  ],
};
