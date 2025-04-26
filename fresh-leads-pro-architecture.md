# Fresh Leads Pro - Technical Architecture

## 1. Technology Stack

### Frontend
- **Framework**: Next.js (React-based framework)
  - Provides server-side rendering for better SEO
  - Supports API routes for backend functionality
  - Offers excellent developer experience
- **Styling**: Tailwind CSS
  - Utility-first CSS framework for rapid UI development
  - Responsive design capabilities for mobile/desktop compatibility
- **State Management**: React Context API + React Query
  - Context API for global state management
  - React Query for server state management and data fetching
- **UI Components**: Custom components with Tailwind styling
  - Clean, modern design with white background and soft blues/greens
  - Large, clear action buttons for main functions

### Backend
- **Framework**: Next.js API Routes
  - Serverless functions for API endpoints
  - Simplified deployment model
- **Authentication**: NextAuth.js
  - Secure authentication system
  - Support for email/password and social logins
- **Database**: Cloudflare D1 (SQLite-compatible)
  - Serverless SQL database
  - Integrated with Cloudflare Workers
- **File Storage**: Cloudflare R2
  - Object storage for CSV exports and other files
- **Payment Processing**: Stripe
  - Subscription management
  - Secure payment processing
  - Webhook integration for payment events

### Web Scraper Module
- **Language**: Node.js
  - JavaScript runtime for scraping tasks
- **Libraries**:
  - Puppeteer for browser automation
  - Cheerio for HTML parsing
  - Axios for HTTP requests
- **Scheduling**: Cron jobs via Cloudflare Workers
  - Scheduled scraping tasks
  - Rate limiting and respectful scraping

### Deployment
- **Hosting**: Cloudflare Pages + Workers
  - Global CDN for frontend assets
  - Serverless backend functions
  - Edge computing capabilities

## 2. Database Schema

### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'))
);
```

### Subscriptions Table
```sql
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due')),
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Plans Table
```sql
CREATE TABLE plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  interval TEXT NOT NULL CHECK (interval IN ('weekly', 'monthly')),
  features TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Leads Table
```sql
CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  email TEXT,
  source TEXT,
  source_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Lead Categories Table
```sql
CREATE TABLE lead_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### User Downloads Table
```sql
CREATE TABLE user_downloads (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  download_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  lead_count INTEGER NOT NULL,
  filters TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Scraper Sources Table
```sql
CREATE TABLE scraper_sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT NOT NULL,
  scraper_type TEXT NOT NULL,
  config TEXT NOT NULL,
  last_run TIMESTAMP,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 3. API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout
- `GET /api/auth/session` - Get current session

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users/me/subscription` - Get user subscription details

### Leads
- `GET /api/leads` - Get leads with filtering
- `GET /api/leads/categories` - Get lead categories
- `GET /api/leads/download` - Download leads as CSV
- `GET /api/leads/stats` - Get lead statistics

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/leads/stats` - Get lead statistics (admin only)
- `GET /api/admin/scrapers` - Get scraper sources (admin only)
- `POST /api/admin/scrapers` - Create scraper source (admin only)
- `PUT /api/admin/scrapers/:id` - Update scraper source (admin only)
- `POST /api/admin/scrapers/:id/run` - Run scraper manually (admin only)

### Subscriptions
- `GET /api/subscriptions/plans` - Get available subscription plans
- `POST /api/subscriptions/create` - Create new subscription
- `PUT /api/subscriptions/cancel` - Cancel subscription
- `POST /api/subscriptions/webhook` - Stripe webhook endpoint

## 4. Web Scraper Architecture

### Scraper Manager
- Central controller for all scraping operations
- Manages scheduling and execution of scraper tasks
- Handles rate limiting and error recovery

### Scraper Types
1. **HTML Scrapers**
   - Parse HTML content from public websites
   - Extract structured data using selectors
   - Handle pagination and navigation

2. **API Scrapers**
   - Connect to public APIs
   - Parse JSON/XML responses
   - Handle authentication if required

3. **PDF Scrapers**
   - Extract data from public PDF documents
   - Parse tables and structured content
   - Convert to structured data format

### Data Processing Pipeline
1. **Collection** - Raw data gathering from sources
2. **Cleaning** - Remove duplicates, fix formatting issues
3. **Normalization** - Standardize data formats
4. **Categorization** - Assign leads to appropriate categories
5. **Storage** - Save processed data to database

### Scraper Configuration
- JSON-based configuration for each scraper
- Defines selectors, pagination rules, and data mapping
- Allows for easy addition of new data sources

## 5. User Interface Design

### Dashboard
- Clean, modern interface with white background and soft blue/green accents
- Key metrics displayed prominently
- Quick access to lead browsing and downloads

### Lead Browser
- Filterable table of leads
- Search functionality by multiple criteria
- Preview of lead details
- Bulk selection for download

### Admin Panel
- Scraper management interface
- User management
- Subscription overview
- System statistics

### Subscription Management
- Plan selection interface
- Payment processing
- Subscription status and history

## 6. Security Considerations

### Data Protection
- Encryption of sensitive data at rest
- HTTPS for all communications
- Rate limiting to prevent abuse

### Authentication
- Secure password hashing
- JWT-based authentication
- Role-based access control

### Scraping Ethics
- Respect robots.txt directives
- Implement rate limiting for all scrapers
- Only access publicly available data
- Maintain proper user agents and identification

## 7. Scalability Considerations

### Database Optimization
- Proper indexing for frequent queries
- Pagination for large result sets
- Caching frequently accessed data

### Scraper Scaling
- Distributed scraping tasks
- Queue-based processing
- Automatic retries with exponential backoff

### Frontend Performance
- Code splitting and lazy loading
- Static generation where possible
- Image optimization

## 8. Implementation Phases

### Phase 1: Core Platform
- User authentication
- Basic dashboard
- Lead browsing and filtering
- Simple CSV export

### Phase 2: Subscription System
- Payment integration
- Subscription plans
- Access control based on subscription

### Phase 3: Scraper Implementation
- Basic scraper framework
- Initial data sources
- Admin controls for scrapers

### Phase 4: Advanced Features
- Enhanced filtering
- Lead scoring
- Email campaign integration
- Mobile optimization

## 9. Monitoring and Maintenance

### Performance Monitoring
- API response times
- Database query performance
- Frontend load times

### Error Tracking
- Centralized error logging
- Automatic alerts for critical issues
- User feedback collection

### Data Quality
- Regular validation of scraped data
- Duplicate detection
- Data freshness monitoring
