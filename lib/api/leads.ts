// src/lib/api/leads.ts
import { Database, getDatabase } from '../database'
import { generateUniqueId } from '../utils'

export interface Lead {
  id: string
  name: string
  category: string
  phone: string
  address: string
  city: string
  state: string
  email: string
  source: string
  source_url: string
  created_at: string
  updated_at: string
}

export interface LeadFilter {
  category?: string
  state?: string
  city?: string
  searchTerm?: string
  limit?: number
  offset?: number
}

export async function getLeads(context: any, filter: LeadFilter): Promise<Lead[]> {
  const db = getDatabase(context)
  
  let whereConditions: string[] = []
  let params: any[] = []
  
  if (filter.category && filter.category !== 'All Categories') {
    whereConditions.push('category = ?')
    params.push(filter.category)
  }
  
  if (filter.state && filter.state !== 'All States') {
    whereConditions.push('state = ?')
    params.push(filter.state)
  }
  
  if (filter.city) {
    whereConditions.push('city = ?')
    params.push(filter.city)
  }
  
  if (filter.searchTerm) {
    whereConditions.push('(name LIKE ? OR address LIKE ? OR email LIKE ?)')
    const searchPattern = `%${filter.searchTerm}%`
    params.push(searchPattern, searchPattern, searchPattern)
  }
  
  let sql = 'SELECT * FROM leads'
  
  if (whereConditions.length > 0) {
    sql += ' WHERE ' + whereConditions.join(' AND ')
  }
  
  sql += ' ORDER BY created_at DESC'
  
  if (filter.limit) {
    sql += ' LIMIT ?'
    params.push(filter.limit)
    
    if (filter.offset) {
      sql += ' OFFSET ?'
      params.push(filter.offset)
    }
  }
  
  return db.query<Lead>(sql, params)
}

export async function getLeadById(context: any, id: string): Promise<Lead | null> {
  const db = getDatabase(context)
  return db.get<Lead>('leads', id)
}

export async function getLeadCategories(context: any): Promise<string[]> {
  const db = getDatabase(context)
  const results = await db.query<{ name: string }>('SELECT DISTINCT name FROM lead_categories ORDER BY name')
  return results.map(result => result.name)
}

export async function getLeadStats(context: any): Promise<{
  totalLeads: number
  newLeadsToday: number
  leadsByCategory: { name: string, count: number }[]
}> {
  const db = getDatabase(context)
  
  // Get total leads
  const totalLeads = await db.count('leads')
  
  // Get new leads today
  const today = new Date().toISOString().split('T')[0]
  const newLeadsToday = await db.count(
    'leads', 
    "DATE(created_at) = ?", 
    [today]
  )
  
  // Get leads by category
  const leadsByCategory = await db.query<{ name: string, count: number }>(
    `SELECT c.name, COUNT(l.id) as count 
     FROM lead_categories c
     LEFT JOIN leads l ON l.category = c.name
     GROUP BY c.name
     ORDER BY count DESC`
  )
  
  return {
    totalLeads,
    newLeadsToday,
    leadsByCategory
  }
}

export async function createLead(context: any, lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
  const db = getDatabase(context)
  
  const now = new Date().toISOString()
  const newLead = {
    ...lead,
    id: generateUniqueId(),
    created_at: now,
    updated_at: now
  }
  
  return db.insert('leads', newLead)
}

export async function updateLead(context: any, id: string, lead: Partial<Lead>): Promise<boolean> {
  const db = getDatabase(context)
  
  const updateData = {
    ...lead,
    updated_at: new Date().toISOString()
  }
  
  return db.update('leads', id, updateData)
}

export async function deleteLead(context: any, id: string): Promise<boolean> {
  const db = getDatabase(context)
  return db.delete('leads', id)
}

export async function recordDownload(
  context: any, 
  userId: string, 
  leadCount: number, 
  filters: string
): Promise<string> {
  const db = getDatabase(context)
  
  const download = {
    id: generateUniqueId(),
    user_id: userId,
    download_date: new Date().toISOString(),
    lead_count: leadCount,
    filters
  }
  
  return db.insert('user_downloads', download)
}

export async function getUserDownloads(context: any, userId: string): Promise<any[]> {
  const db = getDatabase(context)
  
  return db.query(
    `SELECT * FROM user_downloads 
     WHERE user_id = ? 
     ORDER BY download_date DESC`,
    [userId]
  )
}
