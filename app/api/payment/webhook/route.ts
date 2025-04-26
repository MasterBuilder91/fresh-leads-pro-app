// src/app/api/payment/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { handleStripeWebhook } from '@/lib/payment/stripe'

export async function POST(request: NextRequest) {
  try {
    // Get the request body as text
    const body = await request.text()
    
    // Parse the webhook payload
    const event = JSON.parse(body)
    
    // Handle the webhook event
    const result = await handleStripeWebhook(event)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json({ success: true, message: result.message })
  } catch (error: any) {
    console.error('Error handling webhook:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process webhook' },
      { status: 500 }
    )
  }
}
