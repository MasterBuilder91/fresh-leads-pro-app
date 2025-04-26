// src/app/api/leads/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getLeadById, updateLead, deleteLead } from '@/lib/api/leads'
import { getSession } from '@/lib/auth'
import { getCloudflareContext } from '@/lib/cloudflare'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const leadId = params.id
    
    // Get lead by ID
    const lead = await getLeadById(context, leadId)
    
    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ lead })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get lead' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const leadId = params.id
    const body = await request.json()
    
    // Update the lead
    const success = await updateLead(context, leadId, body)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Lead not found or update failed' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update lead' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const leadId = params.id
    
    // Delete the lead
    const success = await deleteLead(context, leadId)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Lead not found or delete failed' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete lead' },
      { status: 500 }
    )
  }
}
