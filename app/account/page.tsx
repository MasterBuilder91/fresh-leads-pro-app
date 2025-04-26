'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { 
  CreditCard, 
  User, 
  Bell, 
  Lock,
  CheckCircle
} from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'

export default function AccountPage() {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Account</h1>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      defaultValue="John Smith" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      defaultValue="john@example.com" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input 
                      id="company" 
                      defaultValue="Smith Plumbing Services" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      defaultValue="(555) 123-4567" 
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Subscription Tab */}
        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>
                Manage your subscription and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Plan */}
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-lg">Pro Monthly Plan</h3>
                    <p className="text-sm text-gray-500">$49.99 per month</p>
                  </div>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    Active
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  <p>Your subscription renews on May 26, 2025</p>
                  <p className="mt-1">Unlimited access to all leads and categories</p>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline" size="sm">
                    Change Plan
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                    Cancel Subscription
                  </Button>
                </div>
              </div>
              
              {/* Payment Method */}
              <div>
                <h3 className="font-medium text-lg mb-4">Payment Method</h3>
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <CreditCard className="h-6 w-6 text-gray-500" />
                  <div>
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-sm text-gray-500">Expires 12/2026</p>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    Update
                  </Button>
                </div>
              </div>
              
              {/* Billing History */}
              <div>
                <h3 className="font-medium text-lg mb-4">Billing History</h3>
                <div className="rounded-md border">
                  <div className="flex items-center justify-between p-4 border-b">
                    <div>
                      <p className="font-medium">Apr 26, 2025</p>
                      <p className="text-sm text-gray-500">Pro Monthly Plan</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$49.99</p>
                      <p className="text-sm text-green-600">Paid</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border-b">
                    <div>
                      <p className="font-medium">Mar 26, 2025</p>
                      <p className="text-sm text-gray-500">Pro Monthly Plan</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$49.99</p>
                      <p className="text-sm text-green-600">Paid</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">Feb 26, 2025</p>
                      <p className="text-sm text-gray-500">Pro Monthly Plan</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$49.99</p>
                      <p className="text-sm text-green-600">Paid</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Receive email notifications about your account
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div>
                  <Label className="text-base mb-3 block">Email Preferences</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="new-leads" className="flex items-center space-x-2 cursor-pointer">
                        <span>New leads notifications</span>
                      </Label>
                      <Switch id="new-leads" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="billing" className="flex items-center space-x-2 cursor-pointer">
                        <span>Billing and subscription updates</span>
                      </Label>
                      <Switch id="billing" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="marketing" className="flex items-center space-x-2 cursor-pointer">
                        <span>Marketing and promotional emails</span>
                      </Label>
                      <Switch id="marketing" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="tips" className="flex items-center space-x-2 cursor-pointer">
                        <span>Tips and best practices</span>
                      </Label>
                      <Switch id="tips" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Change Password */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Change Password</h3>
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input 
                    id="current-password" 
                    type="password" 
                    placeholder="••••••••" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    placeholder="••••••••" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    placeholder="••••••••" 
                  />
                </div>
                <Button>Update Password</Button>
              </div>
              
              <Separator />
              
              {/* Two-Factor Authentication */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="font-medium text-lg">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
              
              <Separator />
              
              {/* Session Management */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Active Sessions</h3>
                <div className="rounded-md border">
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-gray-500">Chrome on Windows • IP: 192.168.1.1</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10 w-full">
                      Sign Out All Other Devices
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
