"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Users, ShoppingBag, DollarSign, Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useUser } from "@/contexts/UserContext"
import { useEffect, useState } from "react"
import { DatabaseService } from "@/lib/database"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount)
}

const formatPercentage = (value: number) => {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`
}

export default function AnalyticsPage() {
  const { store } = useUser()
  const [overview, setOverview] = useState<any>(null)
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [salesByLocation, setSalesByLocation] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!store) return
    setLoading(true)
    Promise.all([
      DatabaseService.getDashboardMetrics(store.id),
      DatabaseService.getTopProducts(store.id),
      DatabaseService.getSalesByLocation(store.id)
    ]).then(([metrics, products, locations]) => {
      setOverview(metrics)
      setTopProducts(products)
      setSalesByLocation(locations)
    }).finally(() => setLoading(false))
  }, [store])
  if (loading) return <div>Loading analytics...</div>
  if (!overview && !topProducts.length && !salesByLocation.length) return <div>No analytics data yet. Start selling to see insights!</div>

  const overviewStats = [
    {
      title: "Total Revenue",
      value: formatCurrency(overview.totalRevenue.value),
      change: formatPercentage(overview.totalRevenue.change),
      trend: overview.totalRevenue.trend,
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: overview.totalOrders.value.toLocaleString(),
      change: formatPercentage(overview.totalOrders.change),
      trend: overview.totalOrders.trend,
      icon: ShoppingBag,
    },
    {
      title: "Total Customers",
      value: overview.totalCustomers.value.toLocaleString(),
      change: formatPercentage(overview.totalCustomers.change),
      trend: overview.totalCustomers.trend,
      icon: Users,
    },
    {
      title: "Conversion Rate",
      value: `${overview.conversionRate.value}%`,
      change: formatPercentage(overview.conversionRate.change),
      trend: overview.conversionRate.trend,
      icon: TrendingUp,
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">Track your store's performance and insights</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Select defaultValue="30days">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <div className="flex items-center mt-1">
                        {stat.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                          {stat.change}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">vs last month</span>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-full">
                      <stat.icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Best performing products this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.sales} sales</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                      <div className="flex items-center">
                        {product.growth > 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                        )}
                        <span className={`text-xs ${product.growth > 0 ? "text-green-600" : "text-red-600"}`}>
                          {formatPercentage(product.growth)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sales by Location */}
          <Card>
            <CardHeader>
              <CardTitle>Sales by Location</CardTitle>
              <CardDescription>Revenue breakdown by Nigerian states</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesByLocation.map((location) => (
                  <div key={location.state} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{location.state}</span>
                      <span className="text-sm text-gray-600">{formatCurrency(location.revenue)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${location.percentage}%` }} />
                      </div>
                      <span className="text-sm text-gray-600 w-12">{location.percentage}%</span>
                    </div>
                    <p className="text-xs text-gray-500">{location.orders} orders</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Traffic sources data is not fetched in the new_code, so this section will be empty or show a placeholder */}
              {/* For now, we'll keep the structure but it will be empty unless trafficSources data is added */}
              {/* <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{source.source}</h4>
                    <Badge variant="outline">{source.percentage}%</Badge>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{source.visitors.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">visitors</p>
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-xs text-gray-500">Conversion: {source.conversion}%</p>
                  </div>
                </div> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
