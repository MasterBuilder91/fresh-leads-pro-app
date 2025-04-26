# Fresh Leads Pro - Deployment Guide

This document provides instructions for deploying the Fresh Leads Pro application to Cloudflare Pages.

## Prerequisites

- Cloudflare account with Pages and D1 access
- Node.js 18+ and npm installed
- Git installed

## Deployment Steps

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/fresh-leads-pro.git
cd fresh-leads-pro
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create D1 Database

```bash
wrangler d1 create fresh-leads-pro-db
```

This will output a database ID that you'll need for the next step.

### 4. Update Configuration

Edit the `wrangler.toml` file and uncomment the database section:

```toml
[[d1_databases]]
binding = "DB"
database_name = "fresh-leads-pro-db"
database_id = "YOUR_DATABASE_ID" # Replace with the ID from step 3
```

### 5. Initialize Database

```bash
wrangler d1 execute fresh-leads-pro-db --file=migrations/0001_initial.sql
```

### 6. Build the Application

```bash
npm run build
```

### 7. Deploy to Cloudflare Pages

```bash
npm run deploy
```

This will deploy the application to Cloudflare Pages and output the URL where your application is available.

## Post-Deployment Steps

1. Access the application at the URL provided after deployment
2. Log in with the default admin credentials:
   - Email: admin@freshleadspro.com
   - Password: admin123
3. Change the default admin password immediately
4. Configure scraper sources in the admin dashboard
5. Set up subscription plans if needed

## Troubleshooting

If you encounter any issues during deployment:

1. Check the Cloudflare Pages deployment logs
2. Ensure all environment variables are correctly set
3. Verify database migrations were applied successfully
4. Check that the D1 database binding is correctly configured

## Maintenance

- Regular backups of the D1 database are recommended
- Monitor scraper performance and adjust rate limits if needed
- Update subscription plans as your business needs change

## Security Considerations

- Change the default admin password immediately after deployment
- Regularly rotate API keys and secrets
- Monitor for unusual activity in the admin dashboard
- Ensure scrapers respect robots.txt and terms of service of target sites
