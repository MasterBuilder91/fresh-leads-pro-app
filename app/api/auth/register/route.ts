// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '@/lib/api/users'
import { getCloudflareContext } from '@/lib/cloudflare'

export async function POST(request: NextRequest) {
  try {
    const context = getCloudflareContext()
    const body = await request.json()
    
    // Validate required fields
    if (!body.email || !body.name || !body.password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Create the user
    const userId = await createUser(context, {
      email: body.email,
      name: body.name,
      password: body.password,
      company: body.company
    })
    
    return NextResponse.json({ success: true, userId })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to register user' },
      { status: 500 }
    )
  }
}
