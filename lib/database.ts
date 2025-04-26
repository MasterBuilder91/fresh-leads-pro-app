// src/lib/database.ts
import { D1Database } from '@cloudflare/workers-types'

// This is a wrapper around the Cloudflare D1 database
// It provides a simplified interface for common operations

export class Database {
  private db: D1Database

  constructor(db: D1Database) {
    this.db = db
  }

  // Generic query method
  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const result = await this.db.prepare(sql).bind(...params).all()
    return result.results as T[]
  }

  // Get a single row by ID
  async get<T = any>(table: string, id: string): Promise<T | null> {
    const result = await this.db
      .prepare(`SELECT * FROM ${table} WHERE id = ?`)
      .bind(id)
      .first()
    return result as T | null
  }

  // Insert a new row
  async insert(table: string, data: Record<string, any>): Promise<string> {
    const keys = Object.keys(data)
    const placeholders = keys.map(() => '?').join(', ')
    const values = Object.values(data)

    const sql = `
      INSERT INTO ${table} (${keys.join(', ')})
      VALUES (${placeholders})
      RETURNING id
    `

    const result = await this.db.prepare(sql).bind(...values).first()
    return result?.id as string
  }

  // Update an existing row
  async update(table: string, id: string, data: Record<string, any>): Promise<boolean> {
    const keys = Object.keys(data)
    const setClause = keys.map(key => `${key} = ?`).join(', ')
    const values = [...Object.values(data), id]

    const sql = `
      UPDATE ${table}
      SET ${setClause}
      WHERE id = ?
    `

    const result = await this.db.prepare(sql).bind(...values).run()
    return result.success
  }

  // Delete a row
  async delete(table: string, id: string): Promise<boolean> {
    const result = await this.db
      .prepare(`DELETE FROM ${table} WHERE id = ?`)
      .bind(id)
      .run()
    return result.success
  }

  // Count rows with optional WHERE clause
  async count(table: string, whereClause?: string, params: any[] = []): Promise<number> {
    let sql = `SELECT COUNT(*) as count FROM ${table}`
    if (whereClause) {
      sql += ` WHERE ${whereClause}`
    }

    const result = await this.db.prepare(sql).bind(...params).first()
    return result?.count as number || 0
  }

  // Transaction support
  async transaction<T>(callback: (db: Database) => Promise<T>): Promise<T> {
    // Note: D1 doesn't have explicit transaction support in the API yet
    // This is a placeholder for future implementation
    return callback(this)
  }
}

// Helper function to get database instance
export function getDatabase(context: any): Database {
  if (!context.env.DB) {
    throw new Error('Database binding not found')
  }
  return new Database(context.env.DB)
}
