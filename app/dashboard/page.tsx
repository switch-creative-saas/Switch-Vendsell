"use client"
import { motion } from "framer-motion"
import {
  BarChart3,
  ShoppingBag,
  Users,
  TrendingUp,
  Plus,
  Eye,
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/dashboard-layout"
import Link from "next/link"

const stats = [
  {
    title: "Total Sales",
    value: "₦2,450,000",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
  {
    title: "Orders",
    value: "1,234",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: ShoppingBag,
  },
  {
    title: "Customers",
    value: "856",
    change: "+15.3%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    change: "-2.1%",
    changeType: "negative" as const,
    icon: BarChart3,
  },
]

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Adunni Okafor",
    product: "Ankara Dress Set",
    amount: "₦25,000",
    status: "completed",
    date: "2 hours ago",
  },
  {
    id: "ORD-002",
    customer: "Emeka Johnson",
    product: "Traditional Cap",
    amount: "₦8,500",
    status: "processing",
    date: "4 hours ago",
  },
  {
    id: "ORD-003",
    customer: "Fatima Abdul",
    product: "Gele Headwrap",
    amount: "₦12,000",
    status: "pending",
    date: "6 hours ago",
  },
  {
    id: "ORD-004",
    customer: "Chidi Okwu",
    product: "Agbada Complete Set",
    amount: "₦45,000",
    status: "completed",
    date: "1 day ago",
  },
]

const topProducts = [
  {
    name: "Ankara Dress Set",
    sales: 45,
    revenue: "₦1,125,000",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Traditional Cap",
    sales: 32,
    revenue: "₦272,000",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Gele Headwrap",
    sales: 28,
    revenue: "₦336,000",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Agbada Complete Set",
    sales: 15,
    revenue: "₦675,000",
    image: "/placeholder.svg?height=40&width=40",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-blue-100 text-blue-800"
    case "processing":
      return "bg-yellow-100 text-yellow-800"
    case "pending":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return CheckCircle
    case "processing":
      return Package
    case "pending":
      return Clock
    default:
      return AlertCircle
  }
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your store.</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Link href="/dashboard/products/new">
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
            <Link href="/store/preview" target="_blank">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View Store
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="dark:bg-[#18181b]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className={`text-sm ${stat.changeType === "positive" ? "text-blue-500" : "text-red-600"}`}>
                        {stat.change} from last month
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-full ${stat.changeType === "positive" ? "bg-blue-100" : "bg-red-100"}`}
                    >
                      <stat.icon
                        className={`h-6 w-6 ${stat.changeType === "positive" ? "text-blue-500" : "text-red-600"}`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card className="dark:bg-[#18181b]">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Your latest customer orders</CardDescription>
                </div>
                <Link href="/dashboard/orders">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => {
                    const StatusIcon = getStatusIcon(order.status)
                    return (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg bg-card dark:bg-[#232326]">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-muted rounded-lg">
                            <StatusIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{order.customer}</p>
                            <p className="text-sm text-muted-foreground">{order.product}</p>
                            <p className="text-xs text-muted-foreground">{order.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">{order.amount}</p>
                          <Badge className={getStatusColor(order.status) + ' dark:bg-blue-900 dark:text-blue-200'}>{order.status}</Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <div>
            <Card className="dark:bg-[#18181b]">
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Best performing products this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={product.name} className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                        <div className="w-full bg-muted rounded-full h-2 mt-1">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(product.sales / 50) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{product.revenue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="dark:bg-[#18181b]">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to manage your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/dashboard/products/new">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Plus className="h-6 w-6" />
                  <span>Add Product</span>
                </Button>
              </Link>
              <Link href="/dashboard/orders">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <ShoppingBag className="h-6 w-6" />
                  <span>View Orders</span>
                </Button>
              </Link>
              <Link href="/dashboard/customers">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Users className="h-6 w-6" />
                  <span>Customers</span>
                </Button>
              </Link>
              <Link href="/dashboard/analytics">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <BarChart3 className="h-6 w-6" />
                  <span>Analytics</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
