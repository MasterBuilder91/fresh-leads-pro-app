// src/lib/scraper/scheduler.ts
import { getScraperSources, updateScraperStatus } from '@/lib/api/scrapers'
import { createScraper } from '@/lib/scraper'
import { getCloudflareContext } from '@/lib/cloudflare'

// Scheduler class to manage scraper execution
export class ScraperScheduler {
  private context: any
  private isRunning: boolean = false
  private runInterval: number = 3600000 // 1 hour in milliseconds
  private maxConcurrentScrapers: number = 2
  private requestDelay: number = 5000 // 5 seconds between requests

  constructor(context: any) {
    this.context = context
  }

  // Start the scheduler
  async start(): Promise<void> {
    if (this.isRunning) {
      return
    }

    this.isRunning = true
    await this.runSchedule()
  }

  // Stop the scheduler
  stop(): void {
    this.isRunning = false
  }

  // Run the schedule once
  async runSchedule(): Promise<void> {
    try {
      // Get all active scrapers
      const scraperSources = await getScraperSources(this.context)
      const activeScrapers = scraperSources.filter(source => source.status === 'active')

      console.log(`Running ${activeScrapers.length} active scrapers`)

      // Run scrapers with concurrency limit
      for (let i = 0; i < activeScrapers.length; i += this.maxConcurrentScrapers) {
        const batch = activeScrapers.slice(i, i + this.maxConcurrentScrapers)
        
        // Run batch in parallel
        await Promise.all(
          batch.map(async (source) => {
            try {
              const scraper = createScraper(source, this.context)
              const result = await scraper.run()
              
              console.log(`Scraper ${source.name} completed: ${result.leadsFound} leads found`)
            } catch (error) {
              console.error(`Error running scraper ${source.name}:`, error)
              await updateScraperStatus(this.context, source.id, 'error')
            }
            
            // Delay before next request to be respectful
            await new Promise(resolve => setTimeout(resolve, this.requestDelay))
          })
        )
      }
    } catch (error) {
      console.error('Error in scraper scheduler:', error)
    }
  }

  // Run a specific scraper by ID
  async runScraper(scraperId: string): Promise<{ success: boolean; leadsFound: number }> {
    try {
      const scraperSources = await getScraperSources(this.context)
      const source = scraperSources.find(s => s.id === scraperId)
      
      if (!source) {
        throw new Error(`Scraper with ID ${scraperId} not found`)
      }
      
      const scraper = createScraper(source, this.context)
      return await scraper.run()
    } catch (error) {
      console.error(`Error running scraper ${scraperId}:`, error)
      return { success: false, leadsFound: 0 }
    }
  }
}

// Create a singleton instance
let schedulerInstance: ScraperScheduler | null = null

// Get the scheduler instance
export function getScraperScheduler(context: any): ScraperScheduler {
  if (!schedulerInstance) {
    schedulerInstance = new ScraperScheduler(context)
  }
  return schedulerInstance
}
