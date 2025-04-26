-- migrations/0001_initial.sql
-- Initial database schema for Fresh Leads Pro

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  company TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'))
);

-- Subscription plans table
CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  interval TEXT NOT NULL CHECK (interval IN ('weekly', 'monthly')),
  features TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due')),
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (plan_id) REFERENCES plans(id)
);

-- Lead categories table
CREATE TABLE IF NOT EXISTS lead_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category) REFERENCES lead_categories(name)
);

-- User downloads table
CREATE TABLE IF NOT EXISTS user_downloads (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  download_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  lead_count INTEGER NOT NULL,
  filters TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Scraper sources table
CREATE TABLE IF NOT EXISTS scraper_sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT NOT NULL,
  scraper_type TEXT NOT NULL,
  config TEXT NOT NULL,
  last_run TIMESTAMP,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category) REFERENCES lead_categories(name)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_category ON leads(category);
CREATE INDEX IF NOT EXISTS idx_leads_state ON leads(state);
CREATE INDEX IF NOT EXISTS idx_leads_city ON leads(city);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_downloads_user_id ON user_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_scraper_sources_status ON scraper_sources(status);

-- Insert default lead categories
INSERT INTO lead_categories (id, name, description) VALUES
('cat_1', 'Homeowners', 'Individual property owners'),
('cat_2', 'Religious Organizations', 'Churches, mosques, temples, and other religious institutions'),
('cat_3', 'Small Businesses', 'Local small businesses and shops'),
('cat_4', 'New Startups', 'Recently established businesses'),
('cat_5', 'Property Managers', 'Companies managing rental properties'),
('cat_6', 'Nonprofits', 'Nonprofit organizations and charities'),
('cat_7', 'Schools', 'Educational institutions including public and private schools'),
('cat_8', 'Daycare Centers', 'Childcare and daycare facilities'),
('cat_9', 'Event Venues', 'Locations for hosting events and gatherings')
ON CONFLICT(name) DO NOTHING;

-- Insert default subscription plans
INSERT INTO plans (id, name, description, price, interval, features) VALUES
('plan_weekly', 'Pro Weekly', 'Weekly subscription with full access to all leads', 19.99, 'weekly', 'Unlimited lead access, CSV exports, All categories'),
('plan_monthly', 'Pro Monthly', 'Monthly subscription with full access to all leads', 49.99, 'monthly', 'Unlimited lead access, CSV exports, All categories, Email support')
ON CONFLICT(id) DO NOTHING;

-- Insert admin user (password: admin123)
INSERT INTO users (id, email, name, password_hash, role) VALUES
('user_admin', 'admin@freshleadspro.com', 'Admin User', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'admin')
ON CONFLICT(email) DO NOTHING;
