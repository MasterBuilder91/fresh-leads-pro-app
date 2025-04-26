// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/api/users'
import { setSessionCookie } from '@/lib/auth'
import { getCloudflareContext } from '@/lib/cloudflare'

export async function POST(request: NextRequest) {
  try {
    const context = getCloudflareContext()
    const body = await request.json()
    
    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    // Authenticate the user
    const token = await authenticateUser(context, body.email, body.password)
    
    if (!token) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Set the session cookie
    await setSessionCookie(token)
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to log in' },
      { status: 500 }
    )
  }
}
