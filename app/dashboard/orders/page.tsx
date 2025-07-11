"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, MoreHorizontal, Eye, Package, Truck, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useUser } from "@/contexts/UserContext"
import { DatabaseService, Order } from "@/lib/database"
import { useRouter } from "next/navigation"

export default function OrdersPage() {
  const { store } = useUser()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all")
  const router = useRouter()

  useEffect(() => {
    if (store) {
      loadOrders()
    }
  }, [store])

  const loadOrders = async () => {
    if (!store) return

    try {
      setLoading(true)
      const ordersData = await DatabaseService.getOrdersByStore(store.id)
      setOrders(ordersData)
    } catch (error) {
      console.error('Error loading orders:', error)
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300"
      case "failed":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300"
      case "refunded":
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300"
      default:
        return "bg-muted text-foreground/80"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "processing":
        return <Package className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPaymentStatus = paymentStatusFilter === "all" || order.payment_status === paymentStatusFilter
    
    return matchesSearch && matchesStatus && matchesPaymentStatus
  })

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            <p className="text-muted-foreground">
              Manage and track your customer orders.
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Search and filter your orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payment Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <div>
                            <h3 className="font-semibold">{order.order_number}</h3>
                            <p className="text-sm text-muted-foreground">
                              Customer ID: {order.customer_id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(order.total_amount)}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          <Badge className={getPaymentStatusColor(order.payment_status)}>
                            {order.payment_status}
                          </Badge>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/orders/${order.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Package className="mr-2 h-4 w-4" />
                              Update Status
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Truck className="mr-2 h-4 w-4" />
                              Track Shipment
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm || statusFilter !== "all" || paymentStatusFilter !== "all"
                  ? "Try adjusting your filters or search terms."
                  : "When customers place orders, they will appear here."}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        {filteredOrders.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Showing {filteredOrders.length} of {orders.length} orders</span>
                <span>Total Value: {formatCurrency(filteredOrders.reduce((sum, order) => sum + order.total_amount, 0))}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
