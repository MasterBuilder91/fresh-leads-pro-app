// src/lib/api/users.ts
import { Database, getDatabase } from '../database'
import { generateUniqueId } from '../utils'
import { hashPassword, verifyPassword, createSession, UserSession } from '../auth'

export interface User {
  id: string
  email: string
  name: string
  password_hash: string
  created_at: string
  updated_at: string
  role: 'user' | 'admin'
}

export interface UserCreateInput {
  email: string
  name: string
  password: string
  company?: string
}

export async function getUserById(context: any, id: string): Promise<User | null> {
  const db = getDatabase(context)
  return db.get<User>('users', id)
}

export async function getUserByEmail(context: any, email: string): Promise<User | null> {
  const db = getDatabase(context)
  const users = await db.query<User>(
    'SELECT * FROM users WHERE email = ? LIMIT 1',
    [email]
  )
  return users.length > 0 ? users[0] : null
}

export async function createUser(context: any, userData: UserCreateInput): Promise<string> {
  const db = getDatabase(context)
  
  // Check if user already exists
  const existingUser = await getUserByEmail(context, userData.email)
  if (existingUser) {
    throw new Error('User with this email already exists')
  }
  
  const now = new Date().toISOString()
  const passwordHash = await hashPassword(userData.password)
  
  const newUser = {
    id: generateUniqueId(),
    email: userData.email,
    name: userData.name,
    password_hash: passwordHash,
    created_at: now,
    updated_at: now,
    role: 'user' // Default role
  }
  
  return db.insert('users', newUser)
}

export async function updateUser(context: any, id: string, userData: Partial<User>): Promise<boolean> {
  const db = getDatabase(context)
  
  const updateData = {
    ...userData,
    updated_at: new Date().toISOString()
  }
  
  return db.update('users', id, updateData)
}

export async function deleteUser(context: any, id: string): Promise<boolean> {
  const db = getDatabase(context)
  return db.delete('users', id)
}

export async function authenticateUser(context: any, email: string, password: string): Promise<string | null> {
  const user = await getUserByEmail(context, email)
  
  if (!user) {
    return null
  }
  
  const passwordValid = await verifyPassword(password, user.password_hash)
  
  if (!passwordValid) {
    return null
  }
  
  const session: UserSession = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  }
  
  return createSession(session)
}

export async function getAllUsers(context: any): Promise<User[]> {
  const db = getDatabase(context)
  return db.query<User>('SELECT * FROM users ORDER BY created_at DESC')
}

export async function getUserStats(context: any): Promise<{
  totalUsers: number
  activeUsers: number
  newUsersThisMonth: number
}> {
  const db = getDatabase(context)
  
  // Get total users
  const totalUsers = await db.count('users')
  
  // Get active users (with active subscriptions)
  const activeUsers = await db.count(
    'users',
    'id IN (SELECT user_id FROM subscriptions WHERE status = ? AND current_period_end > ?)',
    ['active', new Date().toISOString()]
  )
  
  // Get new users this month
  const firstDayOfMonth = new Date()
  firstDayOfMonth.setDate(1)
  firstDayOfMonth.setHours(0, 0, 0, 0)
  
  const newUsersThisMonth = await db.count(
    'users',
    'created_at >= ?',
    [firstDayOfMonth.toISOString()]
  )
  
  return {
    totalUsers,
    activeUsers,
    newUsersThisMonth
  }
}
