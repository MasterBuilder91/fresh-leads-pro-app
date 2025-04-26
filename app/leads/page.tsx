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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
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
  Search, 
  Filter, 
  MapPin, 
  Phone, 
  Mail, 
  Building, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react'

// Mock data for leads
const mockLeads = [
  {
    id: '1',
    name: 'Sunshine Elementary School',
    category: 'Schools',
    phone: '(555) 123-4567',
    address: '123 Education Ave, Springfield, IL',
    email: 'info@sunshineschool.edu',
    city: 'Springfield',
    state: 'IL'
  },
  {
    id: '2',
    name: 'Green Valley Church',
    category: 'Religious Organizations',
    phone: '(555) 234-5678',
    address: '456 Faith St, Springfield, IL',
    email: 'contact@greenvalleychurch.org',
    city: 'Springfield',
    state: 'IL'
  },
  {
    id: '3',
    name: 'Riverfront Properties LLC',
    category: 'Property Managers',
    phone: '(555) 345-6789',
    address: '789 River Rd, Springfield, IL',
    email: 'leasing@riverfrontproperties.com',
    city: 'Springfield',
    state: 'IL'
  },
  {
    id: '4',
    name: 'Community Daycare Center',
    category: 'Daycare Centers',
    phone: '(555) 456-7890',
    address: '101 Child Ln, Springfield, IL',
    email: 'info@communitydaycare.org',
    city: 'Springfield',
    state: 'IL'
  },
  {
    id: '5',
    name: 'Springfield Event Venue',
    category: 'Event Venues',
    phone: '(555) 567-8901',
    address: '202 Celebration Blvd, Springfield, IL',
    email: 'events@springfieldevents.com',
    city: 'Springfield',
    state: 'IL'
  },
  {
    id: '6',
    name: 'Helping Hands Nonprofit',
    category: 'Nonprofits',
    phone: '(555) 678-9012',
    address: '303 Charity Way, Springfield, IL',
    email: 'info@helpinghands.org',
    city: 'Springfield',
    state: 'IL'
  },
  {
    id: '7',
    name: 'New Homeowner - Johnson Family',
    category: 'Homeowners',
    phone: '(555) 789-0123',
    address: '404 Maple Dr, Springfield, IL',
    email: 'johnson.family@email.com',
    city: 'Springfield',
    state: 'IL'
  },
  {
    id: '8',
    name: 'Tech Startup Inc',
    category: 'New Startups',
    phone: '(555) 890-1234',
    address: '505 Innovation Pkwy, Springfield, IL',
    email: 'hello@techstartup.co',
    city: 'Springfield',
    state: 'IL'
  }
];

// Mock data for categories
const categories = [
  'All Categories',
  'Homeowners',
  'Religious Organizations',
  'Small Businesses',
  'New Startups',
  'Property Managers',
  'Nonprofits',
  'Schools',
  'Daycare Centers',
  'Event Venues'
];

// Mock data for states
const states = [
  'All States',
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedState, setSelectedState] = useState('All States')
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [showFilters, setShowFilters] = useState(false)

  // Filter and sort leads
  const filteredLeads = mockLeads.filter(lead => {
    const matchesSearch = searchTerm === '' || 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || 
      lead.category === selectedCategory;
    
    const matchesState = selectedState === 'All States' || 
      lead.state === selectedState;
    
    return matchesSearch && matchesCategory && matchesState;
  }).sort((a, b) => {
    if (!sortField) return 0;
    
    const fieldA = a[sortField as keyof typeof a];
    const fieldB = b[sortField as keyof typeof b];
    
    if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    }
  };

  const handleSelectLead = (id: string) => {
    if (selectedLeads.includes(id)) {
      setSelectedLeads(selectedLeads.filter(leadId => leadId !== id));
    } else {
      setSelectedLeads([...selectedLeads, id]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Browse Leads</h1>
        <Button disabled={selectedLeads.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Download Selected ({selectedLeads.length})
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search leads..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="md:w-auto w-full"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {showFilters ? (
                <ChevronUp className="ml-2 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Category</label>
                <Select 
                  value={selectedCategory} 
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">State</label>
                <Select 
                  value={selectedState} 
                  onValueChange={setSelectedState}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All Categories');
                    setSelectedState('All States');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Available Leads</CardTitle>
          <CardDescription>
            {filteredLeads.length} leads found matching your criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      {sortField === 'name' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="ml-1 h-4 w-4" /> : 
                          <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center">
                      Category
                      {sortField === 'category' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="ml-1 h-4 w-4" /> : 
                          <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead 
                    className="cursor-pointer hidden md:table-cell"
                    onClick={() => handleSort('address')}
                  >
                    <div className="flex items-center">
                      Address
                      {sortField === 'address' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="ml-1 h-4 w-4" /> : 
                          <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedLeads.includes(lead.id)}
                        onCheckedChange={() => handleSelectLead(lead.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.category}</TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1 text-gray-500" />
                          {lead.phone}
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1 text-gray-500" />
                          {lead.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                        {lead.address}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredLeads.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No leads found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            Showing {filteredLeads.length} of {mockLeads.length} leads
          </div>
          <Button disabled={selectedLeads.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Download Selected ({selectedLeads.length})
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
