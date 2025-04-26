'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Download, 
  FileText, 
  Calendar, 
  Filter
} from 'lucide-react'

// Mock data for downloads
const mockDownloads = [
  {
    id: '1',
    date: '2025-04-25T14:32:00Z',
    leadCount: 124,
    filters: 'Category: Schools, State: IL',
    fileName: 'schools_il_2025-04-25.csv'
  },
  {
    id: '2',
    date: '2025-04-22T09:15:00Z',
    leadCount: 87,
    filters: 'Category: Religious Organizations, State: IL',
    fileName: 'religious_il_2025-04-22.csv'
  },
  {
    id: '3',
    date: '2025-04-18T16:45:00Z',
    leadCount: 215,
    filters: 'Category: Homeowners, State: IL',
    fileName: 'homeowners_il_2025-04-18.csv'
  },
  {
    id: '4',
    date: '2025-04-15T11:20:00Z',
    leadCount: 56,
    filters: 'Category: Small Businesses, State: IL',
    fileName: 'businesses_il_2025-04-15.csv'
  },
  {
    id: '5',
    date: '2025-04-10T13:05:00Z',
    leadCount: 143,
    filters: 'Category: All Categories, State: IL',
    fileName: 'all_il_2025-04-10.csv'
  }
];

export default function DownloadsPage() {
  const [activeTab, setActiveTab] = useState('recent')
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Downloads</h1>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Download New Leads
        </Button>
      </div>
      
      {/* Download Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Downloads</p>
                <p className="text-2xl font-bold">37</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Download className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Leads Downloaded</p>
                <p className="text-2xl font-bold">2,458</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Last Download</p>
                <p className="text-2xl font-bold">Apr 25, 2025</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Downloads History */}
      <Card>
        <CardHeader>
          <CardTitle>Download History</CardTitle>
          <CardDescription>
            View and re-download your previous lead exports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="recent" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="recent">Recent Downloads</TabsTrigger>
              <TabsTrigger value="all">All Downloads</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recent">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Leads</TableHead>
                      <TableHead className="hidden md:table-cell">Filters</TableHead>
                      <TableHead>File</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockDownloads.map((download) => (
                      <TableRow key={download.id}>
                        <TableCell>
                          {new Date(download.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{download.leadCount}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center">
                            <Filter className="h-4 w-4 mr-2 text-gray-500" />
                            {download.filters}
                          </div>
                        </TableCell>
                        <TableCell>{download.fileName}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Get
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="all">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Leads</TableHead>
                      <TableHead className="hidden md:table-cell">Filters</TableHead>
                      <TableHead>File</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* This would show all downloads in a real app */}
                    {mockDownloads.map((download) => (
                      <TableRow key={download.id}>
                        <TableCell>
                          {new Date(download.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{download.leadCount}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center">
                            <Filter className="h-4 w-4 mr-2 text-gray-500" />
                            {download.filters}
                          </div>
                        </TableCell>
                        <TableCell>{download.fileName}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Get
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
