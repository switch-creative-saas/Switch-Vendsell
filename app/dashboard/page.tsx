"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Users, ShoppingBag, DollarSign, Package, Plus, ArrowRight, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useUser } from "@/contexts/UserContext"
import { DatabaseService } from "@/lib/database"
import Link from "next/link"

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  revenueChange: number
  ordersChange: number
  customersChange: number
  productsChange: number
}

interface RecentOrder {
  id: string
  orderNumber: string
  customer: {
    name: string
    email: string
  }
  total: number
  status: string
  createdAt: string
}

interface TopProduct {
  id: string
  name: string
  sales: number
  revenue: number
}

export default function DashboardPage() {
  const { user, store } = useUser()
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    revenueChange: 0,
    ordersChange: 0,
    customersChange: 0,
    productsChange: 0
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (store) {
      loadDashboardData()
    }
  }, [store])

  const loadDashboardData = async () => {
    if (!store) return

    try {
      setLoading(true)
      
      // Load products
      const products = await DatabaseService.getProductsByStore(store.id)
      
      // Load orders
      const orders = await DatabaseService.getOrdersByStore(store.id)
      
      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0)
      const totalOrders = orders.length
      const totalProducts = products.length
      
      // For now, we'll use a simple calculation for customers (unique customer IDs)
      const uniqueCustomers = new Set(orders.map(order => order.customer_id)).size
      
      setStats({
        totalRevenue,
        totalOrders,
        totalCustomers: uniqueCustomers,
        totalProducts,
        revenueChange: 0, // We'll implement this with historical data later
        ordersChange: 0,
        customersChange: 0,
        productsChange: 0
      })

      // Set recent orders (last 5)
      const recent = orders.slice(0, 5).map(order => ({
        id: order.id,
        orderNumber: order.order_number,
        customer: {
          name: `Customer ${order.customer_id.slice(0, 8)}`,
          email: `customer@example.com`
        },
        total: order.total_amount,
        status: order.status,
        createdAt: order.created_at
      }))
      setRecentOrders(recent)

      // Set top products (for now, just show all products)
      const top = products.slice(0, 5).map(product => ({
        id: product.id,
        name: product.name,
        sales: 0, // We'll implement this with order items later
        revenue: 0
      }))
      setTopProducts(top)

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
      case "shipped":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300"
      case "processing":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300"
      case "pending":
        return "bg-muted text-foreground/80"
      case "cancelled":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300"
      default:
        return "bg-muted text-foreground/80"
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard data...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.first_name || 'User'}!</h1>
            <p className="text-muted-foreground">
              Here's what's happening with your store today.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/dashboard/products/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.revenueChange >= 0 ? "+" : ""}{stats.revenueChange}% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.ordersChange >= 0 ? "+" : ""}{stats.ordersChange}% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCustomers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.customersChange >= 0 ? "+" : ""}{stats.customersChange}% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.productsChange >= 0 ? "+" : ""}{stats.productsChange}% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Orders and Top Products */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders from your customers</CardDescription>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">{order.customer.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatCurrency(order.total)}</p>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No orders yet</p>
                  <p className="text-sm text-muted-foreground">Start selling to see your orders here</p>
                </div>
              )}
              {recentOrders.length > 0 && (
                <div className="mt-4">
                  <Link href="/dashboard/orders">
                    <Button variant="outline" className="w-full">
                      View All Orders
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Your best-selling products</CardDescription>
            </CardHeader>
            <CardContent>
              {topProducts.length > 0 ? (
                <div className="space-y-4">
                  {topProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatCurrency(product.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No products yet</p>
                  <p className="text-sm text-muted-foreground">Add your first product to start selling</p>
                </div>
              )}
              {topProducts.length > 0 && (
                <div className="mt-4">
                  <Link href="/dashboard/products">
                    <Button variant="outline" className="w-full">
                      View All Products
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Link href="/dashboard/products/new">
                <Button variant="outline" className="w-full h-20 flex-col">
                  <Plus className="h-6 w-6 mb-2" />
                  Add Product
                </Button>
              </Link>
              <Link href="/dashboard/design">
                <Button variant="outline" className="w-full h-20 flex-col">
                  <Package className="h-6 w-6 mb-2" />
                  Customize Store
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button variant="outline" className="w-full h-20 flex-col">
                  <Settings className="h-6 w-6 mb-2" />
                  Store Settings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
