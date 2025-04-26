// src/lib/api/scrapers.ts
import { Database, getDatabase } from '../database'
import { generateUniqueId } from '../utils'

export interface ScraperSource {
  id: string
  name: string
  url: string
  category: string
  scraper_type: string
  config: string
  last_run: string | null
  status: 'active' | 'paused' | 'error'
  created_at: string
  updated_at: string
}

export async function getScraperSources(context: any): Promise<ScraperSource[]> {
  const db = getDatabase(context)
  return db.query<ScraperSource>('SELECT * FROM scraper_sources ORDER BY name ASC')
}

export async function getScraperSourceById(context: any, id: string): Promise<ScraperSource | null> {
  const db = getDatabase(context)
  return db.get<ScraperSource>('scraper_sources', id)
}

export async function createScraperSource(
  context: any, 
  source: Omit<ScraperSource, 'id' | 'last_run' | 'created_at' | 'updated_at'>
): Promise<string> {
  const db = getDatabase(context)
  
  const now = new Date().toISOString()
  const newSource = {
    ...source,
    id: generateUniqueId(),
    last_run: null,
    created_at: now,
    updated_at: now
  }
  
  return db.insert('scraper_sources', newSource)
}

export async function updateScraperSource(
  context: any, 
  id: string, 
  source: Partial<ScraperSource>
): Promise<boolean> {
  const db = getDatabase(context)
  
  const updateData = {
    ...source,
    updated_at: new Date().toISOString()
  }
  
  return db.update('scraper_sources', id, updateData)
}

export async function deleteScraperSource(context: any, id: string): Promise<boolean> {
  const db = getDatabase(context)
  return db.delete('scraper_sources', id)
}

export async function updateScraperStatus(
  context: any, 
  id: string, 
  status: 'active' | 'paused' | 'error',
  lastRun: Date | null = null
): Promise<boolean> {
  const db = getDatabase(context)
  
  const updateData: Partial<ScraperSource> = {
    status,
    updated_at: new Date().toISOString()
  }
  
  if (lastRun) {
    updateData.last_run = lastRun.toISOString()
  }
  
  return db.update('scraper_sources', id, updateData)
}

export async function getScraperStats(context: any): Promise<{
  totalScrapers: number
  activeScrapers: number
  errorScrapers: number
}> {
  const db = getDatabase(context)
  
  const totalScrapers = await db.count('scraper_sources')
  const activeScrapers = await db.count('scraper_sources', 'status = ?', ['active'])
  const errorScrapers = await db.count('scraper_sources', 'status = ?', ['error'])
  
  return {
    totalScrapers,
    activeScrapers,
    errorScrapers
  }
}

// Initialize default scraper sources if none exist
export async function initializeDefaultScraperSources(context: any): Promise<void> {
  const db = getDatabase(context)
  
  const scraperCount = await db.count('scraper_sources')
  if (scraperCount > 0) {
    return
  }
  
  const now = new Date().toISOString()
  
  const defaultSources = [
    {
      id: generateUniqueId(),
      name: 'Example Property Records',
      url: 'https://example.com/property-records',
      category: 'Property Owners',
      scraper_type: 'HTML',
      config: JSON.stringify({
        selectors: {
          item: '.property-item',
          name: '.property-owner',
          address: '.property-address',
          phone: '.property-phone',
          email: '.property-email'
        },
        pagination: {
          next: '.pagination .next',
          maxPages: 10
        }
      }),
      last_run: null,
      status: 'paused',
      created_at: now,
      updated_at: now
    },
    {
      id: generateUniqueId(),
      name: 'Example Business Directory',
      url: 'https://example.com/business-directory',
      category: 'Small Businesses',
      scraper_type: 'HTML',
      config: JSON.stringify({
        selectors: {
          item: '.business-item',
          name: '.business-name',
          address: '.business-address',
          phone: '.business-phone',
          email: '.business-email'
        },
        pagination: {
          next: '.pagination .next',
          maxPages: 10
        }
      }),
      last_run: null,
      status: 'paused',
      created_at: now,
      updated_at: now
    }
  ]
  
  for (const source of defaultSources) {
    await db.insert('scraper_sources', source)
  }
}
