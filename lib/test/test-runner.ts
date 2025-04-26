// src/lib/test/test-runner.ts
import { initializeTestData, testDatabaseConnection, testApiEndpoint } from './test-utils'

// Main test runner function
export async function runTests(): Promise<{
  success: boolean;
  results: Record<string, { success: boolean; message: string }>;
}> {
  console.log('Starting Fresh Leads Pro application tests...')
  
  const results: Record<string, { success: boolean; message: string }> = {}
  let overallSuccess = true
  
  try {
    // Test database connection
    console.log('Testing database connection...')
    const dbConnected = await testDatabaseConnection()
    results.database = {
      success: dbConnected,
      message: dbConnected ? 'Database connection successful' : 'Database connection failed'
    }
    if (!dbConnected) overallSuccess = false
    
    // Initialize test data
    console.log('Initializing test data...')
    try {
      await initializeTestData()
      results.initialization = {
        success: true,
        message: 'Test data initialized successfully'
      }
    } catch (error: any) {
      results.initialization = {
        success: false,
        message: `Test data initialization failed: ${error.message}`
      }
      overallSuccess = false
    }
    
    // Test authentication endpoints
    console.log('Testing authentication endpoints...')
    
    // Test registration
    const registerResult = await testApiEndpoint(
      '/api/auth/register',
      'POST',
      {
        email: `test_${Date.now()}@example.com`,
        name: 'Test User',
        password: 'password123'
      }
    )
    results.register = {
      success: registerResult.success,
      message: registerResult.success 
        ? 'Registration endpoint working' 
        : `Registration failed: ${registerResult.error}`
    }
    if (!registerResult.success) overallSuccess = false
    
    // Test login
    const loginResult = await testApiEndpoint(
      '/api/auth/login',
      'POST',
      {
        email: 'test@example.com',
        password: 'password123'
      }
    )
    results.login = {
      success: loginResult.success,
      message: loginResult.success 
        ? 'Login endpoint working' 
        : `Login failed: ${loginResult.error}`
    }
    if (!loginResult.success) overallSuccess = false
    
    // Get session token from login response
    const token = loginResult.success ? loginResult.data.token : null
    
    // Test session endpoint
    const sessionResult = await testApiEndpoint(
      '/api/auth/session',
      'GET',
      undefined,
      token
    )
    results.session = {
      success: sessionResult.success,
      message: sessionResult.success 
        ? 'Session endpoint working' 
        : `Session check failed: ${sessionResult.error}`
    }
    if (!sessionResult.success) overallSuccess = false
    
    // Test leads endpoints
    console.log('Testing leads endpoints...')
    
    // Test get leads
    const leadsResult = await testApiEndpoint(
      '/api/leads',
      'GET',
      undefined,
      token
    )
    results.getLeads = {
      success: leadsResult.success,
      message: leadsResult.success 
        ? 'Leads endpoint working' 
        : `Get leads failed: ${leadsResult.error}`
    }
    if (!leadsResult.success) overallSuccess = false
    
    // Test lead categories
    const categoriesResult = await testApiEndpoint(
      '/api/leads/categories',
      'GET',
      undefined,
      token
    )
    results.leadCategories = {
      success: categoriesResult.success,
      message: categoriesResult.success 
        ? 'Lead categories endpoint working' 
        : `Get categories failed: ${categoriesResult.error}`
    }
    if (!categoriesResult.success) overallSuccess = false
    
    // Test subscription plans
    console.log('Testing subscription endpoints...')
    
    const plansResult = await testApiEndpoint(
      '/api/subscriptions/plans',
      'GET'
    )
    results.subscriptionPlans = {
      success: plansResult.success,
      message: plansResult.success 
        ? 'Subscription plans endpoint working' 
        : `Get plans failed: ${plansResult.error}`
    }
    if (!plansResult.success) overallSuccess = false
    
    // Test payment endpoints
    console.log('Testing payment endpoints...')
    
    // Test checkout creation
    const checkoutResult = await testApiEndpoint(
      '/api/payment/create-checkout',
      'POST',
      { planId: 'plan_monthly' },
      token
    )
    results.createCheckout = {
      success: checkoutResult.success,
      message: checkoutResult.success 
        ? 'Checkout creation endpoint working' 
        : `Create checkout failed: ${checkoutResult.error}`
    }
    if (!checkoutResult.success) overallSuccess = false
    
    // Test logout
    const logoutResult = await testApiEndpoint(
      '/api/auth/logout',
      'POST',
      undefined,
      token
    )
    results.logout = {
      success: logoutResult.success,
      message: logoutResult.success 
        ? 'Logout endpoint working' 
        : `Logout failed: ${logoutResult.error}`
    }
    if (!logoutResult.success) overallSuccess = false
    
    console.log('Tests completed.')
    
    return {
      success: overallSuccess,
      results
    }
  } catch (error: any) {
    console.error('Error running tests:', error)
    
    return {
      success: false,
      results: {
        ...results,
        error: {
          success: false,
          message: `Test runner error: ${error.message}`
        }
      }
    }
  }
}
