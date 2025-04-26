# Fresh Leads Pro - README

## Project Overview

Fresh Leads Pro is a SaaS web application designed to provide small service businesses (plumbers, landscapers, electricians, cleaners, etc.) with fast, easy access to updated local leads. The application gathers publicly available data from various sources and organizes it by category, helping service businesses find fresh opportunities.

## Features

- **Clean Dashboard**: User-friendly interface for subscribers
- **Lead Management**: Browse, search, and filter leads by various criteria
- **Lead Categories**: Organized by customer type (homeowner, church, business, etc.)
- **Geographic Filtering**: Filter leads by city and state
- **Data Export**: Download lead lists as CSV files
- **Subscription System**: Weekly or monthly payment plans
- **Admin Dashboard**: Manage scraping and user accounts
- **Web Scraper Module**: Ethically collect data from public sources

## Technology Stack

### Frontend
- Next.js (React framework)
- Tailwind CSS for styling
- React Context API for state management
- Responsive design for mobile/desktop compatibility

### Backend
- Next.js API Routes
- NextAuth.js for authentication
- Cloudflare D1 (SQLite-compatible) database
- Cloudflare Workers for serverless functions

### Deployment
- Cloudflare Pages for hosting
- Cloudflare D1 for database
- Cloudflare Workers for background tasks

## Project Structure

```
fresh-leads-pro/
├── migrations/              # Database migration files
│   └── 0001_initial.sql     # Initial database schema
├── src/
│   ├── app/                 # Next.js pages and API routes
│   │   ├── api/             # Backend API endpoints
│   │   ├── auth/            # Authentication pages
│   │   ├── dashboard/       # Dashboard pages
│   │   ├── leads/           # Lead browsing pages
│   │   ├── account/         # Account management pages
│   │   └── admin/           # Admin pages
│   ├── components/          # Reusable React components
│   │   └── layout/          # Layout components
│   ├── lib/                 # Utility functions and business logic
│   │   ├── api/             # API functions
│   │   ├── auth.ts          # Authentication utilities
│   │   ├── database.ts      # Database wrapper
│   │   ├── scraper/         # Web scraping module
│   │   ├── payment/         # Payment processing
│   │   ├── test/            # Testing utilities
│   │   └── deploy/          # Deployment utilities
│   └── hooks/               # Custom React hooks
├── public/                  # Static assets
├── DEPLOYMENT.md            # Deployment instructions
└── USER_GUIDE.md            # User documentation
```

## Getting Started

### Development Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up local database:
   ```
   wrangler d1 execute DB --local --file=migrations/0001_initial.sql
   ```
4. Start the development server:
   ```
   npm run dev
   ```

### Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## Documentation

- [User Guide](USER_GUIDE.md): Instructions for end users
- [Deployment Guide](DEPLOYMENT.md): Instructions for deploying the application
- [Architecture Document](fresh-leads-pro-architecture.md): Technical architecture details

## Ethical Considerations

Fresh Leads Pro is designed to ethically gather publicly available information:

- Only scrapes public databases and directories
- Respects robots.txt directives
- Uses rate limiting to avoid server strain
- Does not scrape private residential-only lists unless tied to a public service
- Provides value to both service providers and potential customers

## License

This project is proprietary software.

## Support

For support inquiries, please contact support@freshleadspro.com
