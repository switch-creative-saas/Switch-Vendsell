"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  ShoppingBag,
  Package,
  TrendingUp,
  Users,
  DollarSign,
  ArrowUpRight,
  Plus,
  Store,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AuthService } from "@/lib/auth"
import { DatabaseService } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"

interface DashboardStats {
  totalStores: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalStores: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser()
        if (!currentUser) {
          toast({ title: "Authentication required", description: "Please sign in to access the dashboard", variant: "destructive" })
          return
        }

        setUser(currentUser)

        // Fetch user's stores
        const stores = await AuthService.getUserStores(currentUser.id)
        
        // Calculate stats from stores
        let totalProducts = 0
        let totalOrders = 0
        let totalRevenue = 0

        for (const store of stores) {
          const products = await DatabaseService.getProductsByStore(store.id)
          const orders = await DatabaseService.getOrdersByStore(store.id)
          
          totalProducts += products.length
          totalOrders += orders.length
          totalRevenue += orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0)
        }

        setStats({
          totalStores: stores.length,
          totalProducts,
          totalOrders,
          totalRevenue
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        toast({ title: "Error", description: "Failed to load dashboard data", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [toast])

  const dashboardStats = [
    {
      title: "Total Stores",
      value: stats.totalStores.toString(),
      icon: Store,
      color: "text-blue-600",
      description: "Your online stores"
    },
    {
      title: "Total Products",
      value: stats.totalProducts.toString(),
      icon: Package,
      color: "text-green-600",
      description: "Products across all stores"
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      color: "text-purple-600",
      description: "Orders received"
    },
    {
      title: "Total Revenue",
      value: `₦${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-orange-600",
      description: "Revenue generated"
    },
  ]

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.first_name || user?.email}! Here's what's happening with your stores.
            </p>
          </div>
          <Link href="/dashboard/stores/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Store
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {dashboardStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <Link href="/dashboard/stores">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Store className="mr-2 h-5 w-5" />
                  Manage Stores
                </CardTitle>
                <CardDescription>
                  View and manage your online stores
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <Link href="/dashboard/products">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Manage Products
                </CardTitle>
                <CardDescription>
                  Add and manage your products
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <Link href="/dashboard/orders">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  View Orders
                </CardTitle>
                <CardDescription>
                  Track and manage customer orders
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>

        {/* Empty State */}
        {stats.totalStores === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Store className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No stores yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first store to start selling online
              </p>
              <Link href="/dashboard/stores/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Store
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
