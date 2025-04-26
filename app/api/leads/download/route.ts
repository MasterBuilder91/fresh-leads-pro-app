// src/app/api/leads/download/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getLeads, recordDownload } from '@/lib/api/leads'
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
      searchTerm: searchParams.get('search') || undefined
    }
    
    // Get leads with filters
    const leads = await getLeads(context, filter)
    
    // Record the download
    const filterString = Object.entries(filter)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ')
    
    await recordDownload(context, session.id, leads.length, filterString)
    
    // Convert leads to CSV
    const headers = ['Name', 'Category', 'Phone', 'Address', 'City', 'State', 'Email']
    const csvRows = [
      headers.join(','),
      ...leads.map(lead => [
        `"${lead.name.replace(/"/g, '""')}"`,
        `"${lead.category.replace(/"/g, '""')}"`,
        `"${lead.phone.replace(/"/g, '""')}"`,
        `"${lead.address.replace(/"/g, '""')}"`,
        `"${lead.city.replace(/"/g, '""')}"`,
        `"${lead.state.replace(/"/g, '""')}"`,
        `"${lead.email.replace(/"/g, '""')}"`
      ].join(','))
    ]
    
    const csv = csvRows.join('\n')
    
    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="leads.csv"'
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to download leads' },
      { status: 500 }
    )
  }
}
