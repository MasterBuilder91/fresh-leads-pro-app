# Cloudflare Deployment Guide with Screenshots

This visual guide will walk you through deploying Fresh Leads Pro to Cloudflare step by step.

## 1. Cloudflare Dashboard Overview

After logging in to Cloudflare with your Google account, you'll see a dashboard like this:

```
[Dashboard Screenshot]
Left sidebar with options like:
- Home
- Websites
- Workers & Pages
- R2
- D1
- etc.
```

## 2. Creating a D1 Database

1. Click on "D1" in the left sidebar
2. Click "Create database"
3. Name it "fresh-leads-pro-db"
4. Select a location close to your target users
5. Click "Create"

```
[D1 Creation Screenshot]
Form with:
- Database name field
- Location dropdown
- Create button
```

After creation, you'll see your database details page with a database ID. Make note of this ID.

## 3. Setting Up Cloudflare Pages

1. Click on "Workers & Pages" in the left sidebar
2. Click "Create application"
3. Select "Pages" tab
4. Click "Connect to Git" (or "Direct Upload" if you prefer)

```
[Pages Creation Screenshot]
Options showing:
- Connect to Git
- Direct Upload
```

### If using Git:
1. Connect to your GitHub/GitLab account
2. Select your repository
3. Configure build settings:
   - Framework preset: Next.js
   - Build command: npm run build
   - Build output directory: .next
   - Node.js version: 18 (or higher)

### If using Direct Upload:
1. Upload the fresh-leads-pro-deployment.zip file
2. Extract it on your local machine first if you need to make any configuration changes

## 4. Configuring Environment Variables

1. Go to your Pages project settings
2. Click on "Environment variables"
3. Add the following variables:
   - DB: your D1 database binding (will be configured in next step)

```
[Environment Variables Screenshot]
Form showing variable name and value fields
```

## 5. Setting Up D1 Database Binding

1. Go to your Pages project settings
2. Click on "Functions"
3. Scroll to "D1 database bindings"
4. Click "Add binding"
5. Variable name: DB
6. D1 database: select your fresh-leads-pro-db

```
[D1 Binding Screenshot]
Form showing binding configuration
```

## 6. Initializing the Database

1. Install Wrangler CLI on your computer:
   ```
   npm install -g wrangler
   ```

2. Log in to your Cloudflare account:
   ```
   wrangler login
   ```

3. Initialize the database with our schema:
   ```
   wrangler d1 execute fresh-leads-pro-db --file=migrations/0001_initial.sql
   ```

## 7. Deploying Updates

Whenever you need to update your application:

1. Go to "Workers & Pages"
2. Select your project
3. Click "Deployments"
4. Click "Deploy"
5. Upload a new version of your files

## 8. Accessing Your Application

After deployment, you'll receive a URL like:
```
https://fresh-leads-pro.pages.dev
```

This is your application's public address. You can also configure a custom domain in the Pages settings if you have one.

## 9. First Login

1. Access your application URL
2. Log in with the default admin credentials:
   - Email: admin@freshleadspro.com
   - Password: admin123
3. Immediately change the default password in the account settings

## 10. Deployment Checklist

- [ ] Created Cloudflare account
- [ ] Created D1 database
- [ ] Set up Pages project
- [ ] Configured environment variables
- [ ] Set up D1 database binding
- [ ] Initialized database with schema
- [ ] Deployed application
- [ ] Accessed application and logged in
- [ ] Changed default admin password
- [ ] Configured web scrapers (optional)
