// src/lib/auth.ts
import { cookies } from 'next/headers'
import { jwtVerify, SignJWT } from 'jose'

// In a real app, this would be an environment variable
const JWT_SECRET = new TextEncoder().encode('fresh-leads-pro-secret-key')

export interface UserSession {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
}

export async function createSession(user: UserSession): Promise<string> {
  const expiresIn = 60 * 60 * 24 * 7 // 7 days
  
  const token = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
  
  return token
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = cookies()
  const token = cookieStore.get('session')?.value
  
  if (!token) return null
  
  try {
    const verified = await jwtVerify(token, JWT_SECRET)
    return verified.payload as unknown as UserSession
  } catch (error) {
    return null
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  cookies().set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function clearSessionCookie(): Promise<void> {
  cookies().delete('session')
}

export async function hashPassword(password: string): Promise<string> {
  // In a real app, use a proper password hashing library like bcrypt
  // This is a simplified version for demonstration
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // In a real app, use a proper password verification
  const hashedInput = await hashPassword(password)
  return hashedInput === hash
}
