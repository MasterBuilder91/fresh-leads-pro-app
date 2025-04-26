// src/app/api/subscriptions/plans/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPlans } from '@/lib/api/subscriptions'
import { getSession } from '@/lib/auth'
import { getCloudflareContext } from '@/lib/cloudflare'

export async function GET(request: NextRequest) {
  try {
    // No authentication required for viewing plans
    const context = getCloudflareContext()
    
    // Get all subscription plans
    const plans = await getPlans(context)
    
    return NextResponse.json({ plans })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get subscription plans' },
      { status: 500 }
    )
  }
}
