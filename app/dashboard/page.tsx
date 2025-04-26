'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BarChart, 
  Users, 
  Building, 
  Home, 
  Church, 
  School, 
  Download,
  ArrowRight
} from 'lucide-react'

export default function DashboardPage() {
  // This would be fetched from API in a real app
  const stats = {
    totalLeads: 12458,
    newLeadsToday: 124,
    downloadsThisMonth: 37,
    subscriptionStatus: 'active',
    subscriptionEnds: '2025-05-26',
    leadsByCategory: [
      { name: 'Homeowners', count: 5842 },
      { name: 'Businesses', count: 3216 },
      { name: 'Religious Orgs', count: 1245 },
      { name: 'Schools', count: 987 },
      { name: 'Nonprofits', count: 1168 }
    ]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button>
          Browse Leads
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Leads</p>
                <p className="text-2xl font-bold">{stats.totalLeads.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">New Today</p>
                <p className="text-2xl font-bold">{stats.newLeadsToday}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Downloads This Month</p>
                <p className="text-2xl font-bold">{stats.downloadsThisMonth}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Download className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Subscription</p>
                <p className="text-lg font-medium capitalize">{stats.subscriptionStatus}</p>
                <p className="text-xs text-gray-500">Renews: {new Date(stats.subscriptionEnds).toLocaleDateString()}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <BarChart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Leads by Category</CardTitle>
          <CardDescription>
            Breakdown of available leads by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.leadsByCategory.map((category) => (
              <div key={category.name} className="flex items-center">
                <div className="p-2 mr-4 rounded-full bg-gray-100">
                  {category.name === 'Homeowners' && <Home className="h-5 w-5 text-gray-600" />}
                  {category.name === 'Businesses' && <Building className="h-5 w-5 text-gray-600" />}
                  {category.name === 'Religious Orgs' && <Church className="h-5 w-5 text-gray-600" />}
                  {category.name === 'Schools' && <School className="h-5 w-5 text-gray-600" />}
                  {category.name === 'Nonprofits' && <Users className="h-5 w-5 text-gray-600" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-sm text-gray-500">{category.count.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2" 
                      style={{ width: `${(category.count / stats.totalLeads) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button variant="outline" className="w-full">
              View All Categories
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Browse Leads</h3>
              <p className="text-sm text-gray-500">
                Search and filter through our database of leads
              </p>
              <Button className="w-full">
                Browse Now
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto p-3 bg-secondary/10 rounded-full w-fit">
                <Download className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-medium">Download CSV</h3>
              <p className="text-sm text-gray-500">
                Export leads to CSV for your marketing campaigns
              </p>
              <Button variant="outline" className="w-full">
                Download
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto p-3 bg-gray-100 rounded-full w-fit">
                <Settings className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="font-medium">Account Settings</h3>
              <p className="text-sm text-gray-500">
                Manage your subscription and account preferences
              </p>
              <Button variant="outline" className="w-full">
                Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
