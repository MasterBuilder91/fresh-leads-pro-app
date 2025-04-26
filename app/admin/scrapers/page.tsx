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
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Database, 
  Plus, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Trash
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock data for scraper sources
const mockScrapers = [
  {
    id: '1',
    name: 'Springfield Property Records',
    url: 'https://property.springfield-il.gov/records',
    category: 'Property Owners',
    scraper_type: 'HTML',
    last_run: '2025-04-25T14:32:00Z',
    status: 'active',
    leads_found: 1245
  },
  {
    id: '2',
    name: 'Illinois Business Registry',
    url: 'https://business.illinois.gov/directory',
    category: 'Small Businesses',
    scraper_type: 'HTML',
    last_run: '2025-04-24T09:15:00Z',
    status: 'active',
    leads_found: 876
  },
  {
    id: '3',
    name: 'Springfield Chamber of Commerce',
    url: 'https://springfieldchamber.org/members',
    category: 'Small Businesses',
    scraper_type: 'HTML',
    last_run: '2025-04-23T16:45:00Z',
    status: 'active',
    leads_found: 432
  },
  {
    id: '4',
    name: 'Illinois Religious Organizations',
    url: 'https://illinois.gov/religious-orgs',
    category: 'Religious Organizations',
    scraper_type: 'HTML',
    last_run: '2025-04-22T11:20:00Z',
    status: 'error',
    leads_found: 0
  },
  {
    id: '5',
    name: 'Springfield Schools Directory',
    url: 'https://springfield-il.edu/schools',
    category: 'Schools',
    scraper_type: 'HTML',
    last_run: '2025-04-21T13:05:00Z',
    status: 'paused',
    leads_found: 87
  }
];

export default function AdminScrapersPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case 'paused':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Paused
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };
  
  const handleRunScraper = (id: string) => {
    setIsRunning(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsRunning(false);
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Manage Scrapers</h1>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Scraper
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Scraper</DialogTitle>
                <DialogDescription>
                  Create a new scraper to collect leads from a public data source.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Scraper Name</Label>
                  <Input id="name" placeholder="e.g., City Business Directory" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">Source URL</Label>
                  <Input id="url" placeholder="https://example.com/directory" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Lead Category</Label>
                  <Input id="category" placeholder="e.g., Small Businesses" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="config">Scraper Configuration</Label>
                  <Textarea 
                    id="config" 
                    placeholder='{"selectors": {"name": ".business-name", "phone": ".phone", "address": ".address"}}' 
                    className="h-24"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>
                  Create Scraper
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Scraper Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Scrapers</p>
                <p className="text-2xl font-bold">{mockScrapers.length}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Database className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Scrapers</p>
                <p className="text-2xl font-bold">
                  {mockScrapers.filter(s => s.status === 'active').length}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Leads Collected</p>
                <p className="text-2xl font-bold">
                  {mockScrapers.reduce((sum, scraper) => sum + scraper.leads_found, 0).toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Scrapers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Scraper Sources</CardTitle>
          <CardDescription>
            Manage and monitor your data collection sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Scrapers</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="issues">Issues</TabsTrigger>
            </TabsList>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">URL</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="hidden md:table-cell">Last Run</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockScrapers
                    .filter(scraper => {
                      if (activeTab === 'all') return true;
                      if (activeTab === 'active') return scraper.status === 'active';
                      if (activeTab === 'issues') return scraper.status === 'error' || scraper.status === 'paused';
                      return true;
                    })
                    .map((scraper) => (
                      <TableRow key={scraper.id}>
                        <TableCell className="font-medium">{scraper.name}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-sm text-gray-500 truncate block max-w-[200px]">
                            {scraper.url}
                          </span>
                        </TableCell>
                        <TableCell>{scraper.category}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {scraper.last_run ? new Date(scraper.last_run).toLocaleDateString() : 'Never'}
                        </TableCell>
                        <TableCell>{getStatusBadge(scraper.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRunScraper(scraper.id)}
                              disabled={isRunning}
                            >
                              <RefreshCw className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  {mockScrapers.filter(scraper => {
                    if (activeTab === 'all') return true;
                    if (activeTab === 'active') return scraper.status === 'active';
                    if (activeTab === 'issues') return scraper.status === 'error' || scraper.status === 'paused';
                    return true;
                  }).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No scrapers found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
