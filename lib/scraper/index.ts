// src/lib/scraper/index.ts
import { ScraperSource } from '@/lib/api/scrapers'
import { createLead } from '@/lib/api/leads'
import { updateScraperStatus } from '@/lib/api/scrapers'
import { getCloudflareContext } from '@/lib/cloudflare'

// Interface for scraped lead data
export interface ScrapedLead {
  name: string
  category: string
  phone: string
  address: string
  city: string
  state: string
  email: string
  source: string
  source_url: string
}

// Base scraper class that all specific scrapers will extend
export abstract class BaseScraper {
  protected source: ScraperSource
  protected context: any

  constructor(source: ScraperSource, context: any) {
    this.source = source
    this.context = context
  }

  // Abstract method that each scraper type must implement
  abstract scrape(): Promise<ScrapedLead[]>

  // Common method to save scraped leads to the database
  async saveLeads(leads: ScrapedLead[]): Promise<number> {
    let savedCount = 0

    for (const lead of leads) {
      try {
        await createLead(this.context, {
          ...lead,
          // Ensure the category matches the scraper's category
          category: this.source.category
        })
        savedCount++
      } catch (error) {
        console.error('Error saving lead:', error)
      }
    }

    return savedCount
  }

  // Method to run the scraper and handle results
  async run(): Promise<{ success: boolean; leadsFound: number }> {
    try {
      // Update scraper status to running
      await updateScraperStatus(this.context, this.source.id, 'active')

      // Run the scraper
      const leads = await this.scrape()

      // Save the leads
      const savedCount = await this.saveLeads(leads)

      // Update scraper status with success
      await updateScraperStatus(
        this.context,
        this.source.id,
        'active',
        new Date()
      )

      return { success: true, leadsFound: savedCount }
    } catch (error) {
      // Update scraper status with error
      await updateScraperStatus(this.context, this.source.id, 'error')
      console.error('Scraper error:', error)
      return { success: false, leadsFound: 0 }
    }
  }
}

// Factory function to create the appropriate scraper based on type
export function createScraper(source: ScraperSource, context: any): BaseScraper {
  // Parse the scraper configuration
  const config = JSON.parse(source.config)

  switch (source.scraper_type) {
    case 'HTML':
      return new HtmlScraper(source, context, config)
    case 'API':
      return new ApiScraper(source, context, config)
    case 'PDF':
      return new PdfScraper(source, context, config)
    default:
      throw new Error(`Unsupported scraper type: ${source.scraper_type}`)
  }
}

// HTML Scraper implementation
class HtmlScraper extends BaseScraper {
  private config: any

  constructor(source: ScraperSource, context: any, config: any) {
    super(source, context)
    this.config = config
  }

  async scrape(): Promise<ScrapedLead[]> {
    // In a real implementation, this would use Puppeteer or Cheerio
    // to scrape HTML content from the source URL
    
    // For demonstration purposes, we'll return mock data
    return [
      {
        name: 'Example Business 1',
        category: this.source.category,
        phone: '(555) 123-4567',
        address: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        email: 'contact@example1.com',
        source: this.source.name,
        source_url: this.source.url
      },
      {
        name: 'Example Business 2',
        category: this.source.category,
        phone: '(555) 987-6543',
        address: '456 Oak Ave',
        city: 'Springfield',
        state: 'IL',
        email: 'info@example2.com',
        source: this.source.name,
        source_url: this.source.url
      }
    ]
  }
}

// API Scraper implementation
class ApiScraper extends BaseScraper {
  private config: any

  constructor(source: ScraperSource, context: any, config: any) {
    super(source, context)
    this.config = config
  }

  async scrape(): Promise<ScrapedLead[]> {
    // In a real implementation, this would make API requests
    // to the source URL and parse the responses
    
    // For demonstration purposes, we'll return mock data
    return [
      {
        name: 'API Source Business 1',
        category: this.source.category,
        phone: '(555) 111-2222',
        address: '789 Pine St',
        city: 'Springfield',
        state: 'IL',
        email: 'contact@apisource1.com',
        source: this.source.name,
        source_url: this.source.url
      }
    ]
  }
}

// PDF Scraper implementation
class PdfScraper extends BaseScraper {
  private config: any

  constructor(source: ScraperSource, context: any, config: any) {
    super(source, context)
    this.config = config
  }

  async scrape(): Promise<ScrapedLead[]> {
    // In a real implementation, this would download and parse PDF files
    // from the source URL
    
    // For demonstration purposes, we'll return mock data
    return [
      {
        name: 'PDF Document Business',
        category: this.source.category,
        phone: '(555) 333-4444',
        address: '101 Document Rd',
        city: 'Springfield',
        state: 'IL',
        email: 'info@pdfsource.com',
        source: this.source.name,
        source_url: this.source.url
      }
    ]
  }
}
