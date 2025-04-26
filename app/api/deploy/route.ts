// src/app/api/deploy/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { 
  checkDeploymentReadiness, 
  generateDeploymentConfig, 
  prepareDeploymentPackage,
  deployToCloudflare
} from '@/lib/deploy/deploy-utils'

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
    
    // Check if the application is ready for deployment
    const readinessCheck = await checkDeploymentReadiness()
    if (!readinessCheck.ready) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Application is not ready for deployment',
          issues: readinessCheck.issues
        },
        { status: 400 }
      )
    }
    
    // Generate deployment configuration
    const deploymentConfig = generateDeploymentConfig()
    
    // Prepare deployment package
    const packageResult = await prepareDeploymentPackage()
    if (!packageResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: packageResult.message
        },
        { status: 500 }
      )
    }
    
    // Deploy to Cloudflare
    const deployResult = await deployToCloudflare()
    if (!deployResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: deployResult.message
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Application deployed successfully',
      url: deployResult.url,
      instructions: deploymentConfig.instructions
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to deploy application' },
      { status: 500 }
    )
  }
}
