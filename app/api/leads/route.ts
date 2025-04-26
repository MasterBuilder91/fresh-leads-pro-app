// src/app/api/leads/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getLeads, getLeadById, createLead } from '@/lib/api/leads'
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
    const { searchParams } = new URL(request.url)
    
    // Parse filter parameters
    const filter = {
      category: searchParams.get('category') || undefined,
      state: searchParams.get('state') || undefined,
      city: searchParams.get('city') || undefined,
      searchTerm: searchParams.get('search') || undefined,
      limit: searchParams.has('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      offset: searchParams.has('offset') ? parseInt(searchParams.get('offset')!) : undefined
    }
    
    // Get leads with filters
    const leads = await getLeads(context, filter)
    
    return NextResponse.json({ leads })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get leads' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    if (session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }
    
    const context = getCloudflareContext()
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.category || !body.city || !body.state) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Create the lead
    const leadId = await createLead(context, {
      name: body.name,
      category: body.category,
      phone: body.phone || '',
      address: body.address || '',
      city: body.city,
      state: body.state,
      email: body.email || '',
      source: body.source || '',
      source_url: body.source_url || ''
    })
    
    return NextResponse.json({ success: true, leadId })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create lead' },
      { status: 500 }
    )
  }
}
