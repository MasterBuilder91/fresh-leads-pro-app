// src/app/api/payment/create-checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/payment/stripe'
import { getSession } from '@/lib/auth'
import { getCloudflareContext } from '@/lib/cloudflare'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    
    // Validate required fields
    if (!body.planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      )
    }
    
    // Get success and cancel URLs
    const { searchParams } = new URL(request.url)
    const successUrl = searchParams.get('successUrl') || `${request.headers.get('origin')}/account`
    const cancelUrl = searchParams.get('cancelUrl') || `${request.headers.get('origin')}/pricing`
    
    // Create checkout session
    const checkoutUrl = await createCheckoutSession(
      session.id,
      body.planId,
      successUrl,
      cancelUrl
    )
    
    return NextResponse.json({ url: checkoutUrl })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
