// src/app/api/test/run/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { runTests } from '@/lib/test/test-runner'
import { getSession } from '@/lib/auth'

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
    
    // Run the tests
    const testResults = await runTests()
    
    return NextResponse.json(testResults)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to run tests' },
      { status: 500 }
    )
  }
}
