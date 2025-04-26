// src/app/api/leads/categories/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getLeadCategories } from '@/lib/api/leads'
import { getSession } from '@/lib/auth'
import { getCloudflareContext } from '@/lib/cloudflare'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const context = getCloudflareContext()
    
    // Get lead categories
    const categories = await getLeadCategories(context)
    
    return NextResponse.json({ categories })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get lead categories' },
      { status: 500 }
    )
  }
}
