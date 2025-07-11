"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, MoreHorizontal, Eye, Mail, Phone, MapPin, User, TrendingUp, TrendingDown } from "lucide-react"
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

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  location?: string
  totalOrders: number
  totalSpent: number
  lastOrder: string
  joinedDate: string
  status: string
  segment: string
}

export default function CustomersPage() {
  const { store } = useUser()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [segmentFilter, setSegmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const router = useRouter()

  useEffect(() => {
    if (store) {
      loadCustomers()
    }
  }, [store])

  const loadCustomers = async () => {
    if (!store) return

    try {
      setLoading(true)
      const orders = await DatabaseService.getOrdersByStore(store.id)
      
      // Group orders by customer to create customer profiles
      const customerMap = new Map<string, Customer>()
      
      orders.forEach(order => {
        const customerId = order.customer_id
        const existingCustomer = customerMap.get(customerId)
        
        if (existingCustomer) {
          existingCustomer.totalOrders += 1
          existingCustomer.totalSpent += order.total_amount
          if (new Date(order.created_at) > new Date(existingCustomer.lastOrder)) {
            existingCustomer.lastOrder = order.created_at
          }
        } else {
          customerMap.set(customerId, {
            id: customerId,
            name: `Customer ${customerId.slice(0, 8)}`,
            email: `customer-${customerId.slice(0, 8)}@example.com`,
            phone: undefined,
            location: undefined,
            totalOrders: 1,
            totalSpent: order.total_amount,
            lastOrder: order.created_at,
            joinedDate: order.created_at,
            status: 'active',
            segment: order.total_amount > 50000 ? 'vip' : order.total_amount > 20000 ? 'regular' : 'new'
          })
        }
      })
      
      const customersData = Array.from(customerMap.values())
      setCustomers(customersData)
    } catch (error) {
      console.error('Error loading customers:', error)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case "vip":
        return "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300"
      case "regular":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300"
      case "new":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
      case "at-risk":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300"
      default:
        return "bg-muted text-foreground/80"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
      case "inactive":
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300"
      default:
        return "bg-muted text-foreground/80"
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSegment = segmentFilter === "all" || customer.segment === segmentFilter
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter
    
    return matchesSearch && matchesSegment && matchesStatus
  })

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading customers...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
            <p className="text-muted-foreground">
              Manage and analyze your customer base.
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Search and filter your customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Segments</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Customers Grid */}
        {filteredCustomers.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCustomers.map((customer) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{customer.name}</h3>
                          <p className="text-sm text-muted-foreground">{customer.email}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            Contact
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Orders</span>
                        <span className="font-medium">{customer.totalOrders}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Spent</span>
                        <span className="font-medium">{formatCurrency(customer.totalSpent)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Last Order</span>
                        <span className="text-sm">{formatDate(customer.lastOrder)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Joined</span>
                        <span className="text-sm">{formatDate(customer.joinedDate)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <Badge className={getSegmentColor(customer.segment)}>
                        {customer.segment.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(customer.status)}>
                        {customer.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <User className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No customers found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm || segmentFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your filters or search terms."
                  : "When customers place orders, they will appear here."}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        {filteredCustomers.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Showing {filteredCustomers.length} of {customers.length} customers</span>
                <span>Total Value: {formatCurrency(filteredCustomers.reduce((sum, customer) => sum + customer.totalSpent, 0))}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
