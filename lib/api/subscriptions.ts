// src/lib/api/subscriptions.ts
import { Database, getDatabase } from '../database'
import { generateUniqueId } from '../utils'

export interface Plan {
  id: string
  name: string
  description: string
  price: number
  interval: 'weekly' | 'monthly'
  features: string
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  plan_id: string
  status: 'active' | 'canceled' | 'past_due'
  current_period_start: string
  current_period_end: string
  created_at: string
  updated_at: string
}

export async function getPlans(context: any): Promise<Plan[]> {
  const db = getDatabase(context)
  return db.query<Plan>('SELECT * FROM plans ORDER BY price ASC')
}

export async function getPlanById(context: any, id: string): Promise<Plan | null> {
  const db = getDatabase(context)
  return db.get<Plan>('plans', id)
}

export async function getUserSubscription(context: any, userId: string): Promise<Subscription | null> {
  const db = getDatabase(context)
  const subscriptions = await db.query<Subscription>(
    'SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
    [userId]
  )
  return subscriptions.length > 0 ? subscriptions[0] : null
}

export async function createSubscription(
  context: any,
  userId: string,
  planId: string,
  paymentMethodId: string
): Promise<string> {
  const db = getDatabase(context)
  
  // Get the plan
  const plan = await getPlanById(context, planId)
  if (!plan) {
    throw new Error('Plan not found')
  }
  
  // In a real app, this would call Stripe to create a subscription
  // For now, we'll just create a subscription record
  
  const now = new Date()
  const currentPeriodStart = now.toISOString()
  
  // Calculate period end based on plan interval
  const periodEnd = new Date(now)
  if (plan.interval === 'weekly') {
    periodEnd.setDate(periodEnd.getDate() + 7)
  } else if (plan.interval === 'monthly') {
    periodEnd.setMonth(periodEnd.getMonth() + 1)
  }
  
  const subscription = {
    id: generateUniqueId(),
    user_id: userId,
    plan_id: planId,
    status: 'active',
    current_period_start: currentPeriodStart,
    current_period_end: periodEnd.toISOString(),
    created_at: now.toISOString(),
    updated_at: now.toISOString()
  }
  
  return db.insert('subscriptions', subscription)
}

export async function cancelSubscription(context: any, subscriptionId: string): Promise<boolean> {
  const db = getDatabase(context)
  
  // In a real app, this would call Stripe to cancel the subscription
  // For now, we'll just update the subscription status
  
  return db.update('subscriptions', subscriptionId, {
    status: 'canceled',
    updated_at: new Date().toISOString()
  })
}

export async function createPlan(context: any, plan: Omit<Plan, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
  const db = getDatabase(context)
  
  const now = new Date().toISOString()
  const newPlan = {
    ...plan,
    id: generateUniqueId(),
    created_at: now,
    updated_at: now
  }
  
  return db.insert('plans', newPlan)
}

export async function updatePlan(context: any, id: string, plan: Partial<Plan>): Promise<boolean> {
  const db = getDatabase(context)
  
  const updateData = {
    ...plan,
    updated_at: new Date().toISOString()
  }
  
  return db.update('plans', id, updateData)
}

export async function deletePlan(context: any, id: string): Promise<boolean> {
  const db = getDatabase(context)
  return db.delete('plans', id)
}

// Initialize default plans if none exist
export async function initializeDefaultPlans(context: any): Promise<void> {
  const db = getDatabase(context)
  
  const planCount = await db.count('plans')
  if (planCount > 0) {
    return
  }
  
  const now = new Date().toISOString()
  
  const weeklyPlan = {
    id: generateUniqueId(),
    name: 'Pro Weekly',
    description: 'Weekly subscription with full access to all leads',
    price: 19.99,
    interval: 'weekly',
    features: 'Unlimited lead access, CSV exports, All categories',
    created_at: now,
    updated_at: now
  }
  
  const monthlyPlan = {
    id: generateUniqueId(),
    name: 'Pro Monthly',
    description: 'Monthly subscription with full access to all leads',
    price: 49.99,
    interval: 'monthly',
    features: 'Unlimited lead access, CSV exports, All categories, Email support',
    created_at: now,
    updated_at: now
  }
  
  await db.insert('plans', weeklyPlan)
  await db.insert('plans', monthlyPlan)
}
