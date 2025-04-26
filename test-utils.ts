// src/lib/test/test-utils.ts
import { getCloudflareContext } from '@/lib/cloudflare'
import { initializeDefaultPlans } from '@/lib/api/subscriptions'
import { initializeDefaultScraperSources } from '@/lib/api/scrapers'
import { createUser } from '@/lib/api/users'
import { hashPassword } from '@/lib/auth'

// Utility function to initialize test data
export async function initializeTestData(): Promise<void> {
  const context = getCloudflareContext()
  
  console.log('Initializing test data...')
  
  try {
    // Initialize default plans
    await initializeDefaultPlans(context)
    console.log('Default plans initialized')
    
    // Initialize default scraper sources
    await initializeDefaultScraperSources(context)
    console.log('Default scraper sources initialized')
    
    // Create test user if it doesn't exist
    try {
      await createUser(context, {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        company: 'Test Company'
      })
      console.log('Test user created')
    } catch (error) {
      console.log('Test user already exists')
    }
    
    console.log('Test data initialization complete')
  } catch (error) {
    console.error('Error initializing test data:', error)
    throw error
  }
}

// Utility function to test database connection
export async function testDatabaseConnection(): Promise<boolean> {
  const context = getCloudflareContext()
  
  try {
    // Try to execute a simple query
    const result = await context.env.DB.prepare('SELECT 1 as test').first()
    return result && result.test === 1
  } catch (error) {
    console.error('Database connection test failed:', error)
    return false
  }
}

// Utility function to test API endpoints
export async function testApiEndpoint(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any,
  token?: string
): Promise<{ success: boolean; status: number; data?: any; error?: string }> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const options: RequestInit = {
      method,
      headers
    }
    
    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body)
    }
    
    const response = await fetch(endpoint, options)
    const data = await response.json()
    
    return {
      success: response.ok,
      status: response.status,
      data: response.ok ? data : undefined,
      error: !response.ok ? (data.error || 'Unknown error') : undefined
    }
  } catch (error: any) {
    return {
      success: false,
      status: 500,
      error: error.message || 'Request failed'
    }
  }
}
