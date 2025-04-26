// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { clearSessionCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Clear the session cookie
    await clearSessionCookie()
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to log out' },
      { status: 500 }
    )
  }
}
