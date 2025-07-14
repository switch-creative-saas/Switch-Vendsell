"use client"

import type React from "react"
import { useState, useCallback, memo } from "react"
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
import { ResponsiveContainer } from "@/components/ui/responsive-container"

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

const NavigationItem = memo(({ item, isActive, onClick }: {
  item: typeof navigation[0]
  isActive: boolean
  onClick: () => void
}) => (
  <Link
    href={item.href}
    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors w-full ${
      isActive
        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-200"
        : "text-muted-foreground hover:text-primary hover:bg-muted"
    }`}
    onClick={onClick}
  >
    <item.icon className={`mr-3 h-5 w-5 ${isActive ? "text-blue-500" : ""}`} />
    {item.name}
  </Link>
))

NavigationItem.displayName = 'NavigationItem'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const { user, store, loading } = useUser()

  const handleSignOut = useCallback(async () => {
    setSigningOut(true)
    try {
      await AuthService.signOut()
      router.push("/auth/login")
    } catch (err) {
      toast({ title: "Sign out failed", description: "Please try again.", variant: "destructive" })
    } finally {
      setSigningOut(false)
    }
  }, [router, toast])

  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

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
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" 
          onClick={closeSidebar}
        />
      )}
      <aside
        className={`hidden lg:flex flex-col w-64 h-screen bg-gradient-to-br from-blue-700/80 via-purple-700/70 to-emerald-600/80 backdrop-blur-xl shadow-2xl rounded-r-3xl transition-all duration-300 sticky top-0 left-0 z-40 overflow-y-auto border-r border-white/10`}
      >
        <div className="flex items-center justify-between h-20 px-8 border-b border-white/10 bg-white/10 backdrop-blur-md">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-extrabold text-lg">S</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Switch VendSell</span>
          </Link>
        </div>
        <div className="p-8 border-b border-white/10 bg-white/10 backdrop-blur-md">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-orange-400 rounded-xl flex items-center justify-center shadow-md">
              <Store className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-lg text-white truncate">{storeName}</p>
              <p className="text-sm text-blue-100 truncate">{storeSlug}.switch.store</p>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Badge className="bg-gradient-to-r from-blue-400 to-purple-400 text-white font-semibold w-fit shadow">{storePlan} Plan</Badge>
            <Link href={`/store/${storeSlug}`} target="_blank" className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto mt-2 sm:mt-0 border-white/30 text-white bg-white/10 hover:bg-white/20 shadow">
                <Globe className="h-4 w-4 mr-1" />
                View Store
              </Button>
            </Link>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <NavigationItem
                key={item.name}
                item={item}
                isActive={isActive}
                onClick={closeSidebar}
              />
            )
          })}
        </nav>
        <div className="p-6 border-t border-white/10 w-full bg-white/10 backdrop-blur-md">
          <div className="bg-gradient-to-r from-blue-500/80 to-purple-500/80 rounded-2xl p-4 flex flex-col gap-2 items-start w-full shadow">
            <div className="flex items-center space-x-2 mb-2">
              <HelpCircle className="h-5 w-5 text-white" />
              <span className="font-semibold text-white">Need Help?</span>
            </div>
            <p className="text-sm text-blue-100 mb-3">Get support via WhatsApp or check our help center</p>
            <Button size="sm" className="w-full bg-white/20 text-white hover:bg-white/30 shadow">Contact Support</Button>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-h-screen font-sans bg-gradient-to-br from-white via-blue-50 to-purple-50 text-gray-900 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950 transition-colors duration-300">
        <header className="bg-white/80 dark:bg-gray-900/80 shadow-md border-b border-white/10 sticky top-0 z-40 backdrop-blur-md">
          <div className="flex items-center justify-between h-20 px-4 sm:px-10">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="lg" className="lg:hidden text-blue-700 dark:text-blue-300" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-6 w-6" />
              </Button>
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
                <Input placeholder="Search products, orders..." className="pl-12 w-72 rounded-xl bg-white/60 border border-blue-100 shadow-sm" />
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="lg" className="relative text-blue-700 dark:text-blue-300">
                    <Bell className="h-6 w-6" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center p-0 shadow">0</Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-white/90 rounded-xl shadow-xl border border-blue-100">
                  <DropdownMenuItem>No new notifications</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DarkModeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="hidden md:block font-medium truncate max-w-32">{userName}</span>
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
            <Button variant="ghost" size="sm" onClick={closeSidebar}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          <div className="p-6 border-b bg-muted">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Store className="h-5 w-5 text-white" />
                </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate">{storeName}</p>
                <p className="text-sm text-muted-foreground truncate">{storeSlug}.switch.store</p>
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
            <nav className="flex-1 px-2 py-4 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                <NavigationItem
                    key={item.name}
                  item={item}
                  isActive={isActive}
                  onClick={closeSidebar}
                />
                )
              })}
            </nav>
        </aside>
        <ResponsiveContainer className="flex-1 p-4 sm:p-10">
          {children}
        </ResponsiveContainer>
      </main>
    </div>
  )
} 