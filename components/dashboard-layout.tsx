"use client"

import type React from "react"

import { useState } from "react"
import {
  BarChart3,
  ShoppingBag,
  Users,
  Package,
  Settings,
  Store,
  CreditCard,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  User,
  HelpCircle,
  Palette,
  Globe,
  Bot,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { DarkModeToggle } from "@/components/ui/toggle"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/contexts/UserContext"
import { AuthService } from "@/lib/auth"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Products", href: "/dashboard/products", icon: Package },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
  { name: "Store Design", href: "/dashboard/design", icon: Palette },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { name: "AI Tools", href: "/dashboard/ai", icon: Bot },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const { user, store, loading } = useUser()

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await AuthService.signOut()
      router.push("/auth/login")
    } catch (err) {
      toast({ title: "Sign out failed", description: "Please try again.", variant: "destructive" })
    } finally {
      setSigningOut(false)
    }
  }

  // Show loading state while user data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your store...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if no user
  if (!user) {
    router.push("/auth/login")
    return null
  }

  const userName = `${user.first_name || 'User'} ${user.last_name || ''}`.trim() || 'User'
  const storeName = store?.name || `${user.first_name || 'My'}'s Store`
  const storeSlug = store?.slug || 'my-store'
  const storePlan = store?.plan || 'free'

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`hidden lg:flex flex-col w-64 h-screen bg-card shadow-lg transition-colors duration-300 sticky top-0 left-0 z-40 overflow-y-auto`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b bg-background/80 transition-colors duration-300">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold">Switch VendSell</span>
          </Link>
        </div>
        {/* Store Info */}
        <div className="p-6 border-b bg-muted transition-colors duration-300">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Store className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold">{storeName}</p>
              <p className="text-sm text-muted-foreground">{storeSlug}.switch.store</p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-100 capitalize">
              {storePlan} Plan
            </Badge>
            <Link href={`/store/${storeSlug}`} target="_blank" className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto mt-2 sm:mt-0">
                <Globe className="h-4 w-4 mr-1" />
                View Store
              </Button>
            </Link>
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors w-full ${
                  isActive
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-200"
                    : "text-muted-foreground hover:text-primary hover:bg-muted"
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${isActive ? "text-blue-500" : ""}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        {/* Help Section */}
        <div className="p-4 border-t w-full">
          <div className="bg-muted rounded-lg p-4 transition-colors duration-300 flex flex-col gap-2 items-start w-full">
            <div className="flex items-center space-x-2 mb-2">
              <HelpCircle className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Need Help?</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">Get support via WhatsApp or check our help center</p>
            <Button size="sm" className="w-full bg-blue-500 hover:bg-blue-600">
              Contact Support
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top header */}
        <header className="bg-background/80 shadow-sm border-b transition-colors duration-300 sticky top-0 z-40">
          <div className="flex items-center justify-between h-16 px-3 sm:px-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search products, orders..." className="pl-10 w-64" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                      0
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuItem>No new notifications</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DarkModeToggle />
              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="hidden md:block font-medium">{userName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} disabled={signingOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {signingOut ? "Signing out..." : "Sign out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Mobile sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold">Switch VendSell</span>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          {/* Store Info */}
          <div className="p-6 border-b bg-muted">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Store className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold">{storeName}</p>
                <p className="text-sm text-muted-foreground">{storeSlug}.switch.store</p>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-100 capitalize w-fit">
                {storePlan} Plan
              </Badge>
              <Link href={`/store/${storeSlug}`} target="_blank">
                <Button variant="outline" size="sm" className="w-full">
                  <Globe className="h-4 w-4 mr-1" />
                  View Store
                </Button>
              </Link>
            </div>
          </div>
          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors w-full ${
                    isActive
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-200"
                      : "text-muted-foreground hover:text-primary hover:bg-muted"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? "text-blue-500" : ""}`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Page content */}
        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  )
}
