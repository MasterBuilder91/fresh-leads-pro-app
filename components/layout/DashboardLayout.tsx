'use client'

import { ReactNode } from 'react'
import { 
  LayoutDashboard, 
  Search, 
  Download, 
  Users, 
  Settings, 
  LogOut,
  Database
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: ReactNode
}

interface NavItem {
  href: string
  label: string
  icon: ReactNode
  adminOnly?: boolean
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const isAdmin = false // This would be determined by user role in a real app
  
  const navItems: NavItem[] = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      href: '/leads',
      label: 'Browse Leads',
      icon: <Search className="h-5 w-5" />
    },
    {
      href: '/downloads',
      label: 'My Downloads',
      icon: <Download className="h-5 w-5" />
    },
    {
      href: '/account',
      label: 'My Account',
      icon: <Settings className="h-5 w-5" />
    },
    {
      href: '/admin/users',
      label: 'Manage Users',
      icon: <Users className="h-5 w-5" />,
      adminOnly: true
    },
    {
      href: '/admin/scrapers',
      label: 'Manage Scrapers',
      icon: <Database className="h-5 w-5" />,
      adminOnly: true
    }
  ]
  
  const filteredNavItems = navItems.filter(item => !item.adminOnly || isAdmin)
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="p-6">
          <Link href="/" className="flex items-center">
            <span className="logo-text">Fresh Leads Pro</span>
          </Link>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2 px-4">
            {filteredNavItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-gray-600 rounded-md hover:bg-gray-50 hover:text-primary transition-colors",
                    pathname === item.href && "bg-primary/10 text-primary font-medium"
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="px-4 mt-8">
            <div className="border-t border-gray-200 pt-4">
              <button className="flex items-center w-full px-4 py-3 text-gray-600 rounded-md hover:bg-gray-50 hover:text-primary transition-colors">
                <LogOut className="h-5 w-5" />
                <span className="ml-3">Sign Out</span>
              </button>
            </div>
          </div>
        </nav>
      </aside>
      
      {/* Mobile Header */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-white border-b border-gray-200 md:hidden">
          <div className="flex items-center justify-between p-4">
            <Link href="/" className="flex items-center">
              <span className="logo-text">Fresh Leads Pro</span>
            </Link>
            {/* Mobile menu button would go here */}
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
