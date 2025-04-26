// src/app/api/auth/session/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get the current session
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }
    
    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.id,
        email: session.email,
        name: session.name,
        role: session.role
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get session' },
      { status: 500 }
    )
  }
}
