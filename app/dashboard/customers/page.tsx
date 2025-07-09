"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Search,
  MoreHorizontal,
  Eye,
  Mail,
  Phone,
  MapPin,
  Users,
  UserPlus,
  TrendingUp,
  ShoppingBag,
  Download,
  CheckCircle,
  Truck,
  Package,
  Clock,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const customers = [
  {
    id: "CUST-001",
    name: "Adunni Okafor",
    email: "adunni@example.com",
    phone: "+234 801 234 5678",
    location: "Lagos, Nigeria",
    totalOrders: 3,
    totalSpent: 75000,
    lastOrder: "2024-01-15T10:30:00Z",
    joinedDate: "2023-12-01T00:00:00Z",
    status: "active",
    segment: "vip",
    paymentOption: "Card",
  },
  {
    id: "CUST-002",
    name: "Emeka Johnson",
    email: "emeka@example.com",
    phone: "+234 802 345 6789",
    location: "Abuja, Nigeria",
    totalOrders: 2,
    totalSpent: 34000,
    lastOrder: "2024-01-14T15:45:00Z",
    joinedDate: "2023-11-15T00:00:00Z",
    status: "active",
    segment: "regular",
    paymentOption: "Bank Transfer",
  },
  {
    id: "CUST-003",
    name: "Fatima Abdul",
    email: "fatima@example.com",
    phone: "+234 803 456 7890",
    location: "Port Harcourt, Nigeria",
    totalOrders: 1,
    totalSpent: 27000,
    lastOrder: "2024-01-13T12:20:00Z",
    joinedDate: "2024-01-10T00:00:00Z",
    status: "active",
    segment: "new",
    paymentOption: "USSD",
  },
  {
    id: "CUST-004",
    name: "Chidi Okwu",
    email: "chidi@example.com",
    phone: "+234 804 567 8901",
    location: "Enugu, Nigeria",
    totalOrders: 4,
    totalSpent: 120000,
    lastOrder: "2024-01-12T08:15:00Z",
    joinedDate: "2023-10-20T00:00:00Z",
    status: "active",
    segment: "vip",
    paymentOption: "Card",
  },
  {
    id: "CUST-005",
    name: "Kemi Adebayo",
    email: "kemi@example.com",
    phone: "+234 805 678 9012",
    location: "Ibadan, Nigeria",
    totalOrders: 1,
    totalSpent: 0, // Cancelled order
    lastOrder: "2024-01-11T16:40:00Z",
    joinedDate: "2024-01-11T00:00:00Z",
    status: "inactive",
    segment: "at-risk",
    paymentOption: "Bank Transfer",
  },
  {
    id: "CUST-006",
    name: "Tunde Bakare",
    email: "tunde@example.com",
    phone: "+234 806 789 0123",
    location: "Kano, Nigeria",
    totalOrders: 5,
    totalSpent: 89000,
    lastOrder: "2024-01-10T14:30:00Z",
    joinedDate: "2023-09-05T00:00:00Z",
    status: "active",
    segment: "regular",
    paymentOption: "Card",
  },
]

const orders = [
  {
    id: "ORD-001",
    orderNumber: "ORD-001",
    customer: {
      name: "Adunni Okafor",
      email: "adunni@example.com",
      phone: "+234 801 234 5678",
    },
    items: [{ name: "Ankara Dress Set", quantity: 1, price: 25000 }],
    total: 25000,
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "Paystack",
    shippingAddress: {
      street: "123 Victoria Island",
      city: "Lagos",
      state: "Lagos State",
      country: "Nigeria",
    },
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-18T14:20:00Z",
  },
  {
    id: "ORD-002",
    orderNumber: "ORD-002",
    customer: {
      name: "Emeka Johnson",
      email: "emeka@example.com",
      phone: "+234 802 345 6789",
    },
    items: [{ name: "Traditional Cap", quantity: 2, price: 8500 }],
    total: 17000,
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "Flutterwave",
    shippingAddress: {
      street: "456 Garki District",
      city: "Abuja",
      state: "FCT",
      country: "Nigeria",
    },
    createdAt: "2024-01-14T15:45:00Z",
    updatedAt: "2024-01-15T09:10:00Z",
  },
  {
    id: "ORD-003",
    orderNumber: "ORD-003",
    customer: {
      name: "Fatima Abdul",
      email: "fatima@example.com",
      phone: "+234 803 456 7890",
    },
    items: [
      { name: "Gele Headwrap", quantity: 1, price: 12000 },
      { name: "Beaded Necklace", quantity: 1, price: 15000 },
    ],
    total: 27000,
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "Bank Transfer",
    shippingAddress: {
      street: "789 GRA Phase 2",
      city: "Port Harcourt",
      state: "Rivers State",
      country: "Nigeria",
    },
    createdAt: "2024-01-13T12:20:00Z",
    updatedAt: "2024-01-13T12:20:00Z",
  },
  {
    id: "ORD-004",
    orderNumber: "ORD-004",
    customer: {
      name: "Chidi Okwu",
      email: "chidi@example.com",
      phone: "+234 804 567 8901",
    },
    items: [{ name: "Agbada Complete Set", quantity: 1, price: 45000 }],
    total: 45000,
    status: "shipped",
    paymentStatus: "paid",
    paymentMethod: "Paystack",
    shippingAddress: {
      street: "321 New Haven",
      city: "Enugu",
      state: "Enugu State",
      country: "Nigeria",
    },
    createdAt: "2024-01-12T08:15:00Z",
    updatedAt: "2024-01-16T11:30:00Z",
  },
  {
    id: "ORD-005",
    orderNumber: "ORD-005",
    customer: {
      name: "Kemi Adebayo",
      email: "kemi@example.com",
      phone: "+234 805 678 9012",
    },
    items: [
      { name: "Ankara Dress Set", quantity: 1, price: 25000 },
      { name: "Traditional Cap", quantity: 1, price: 8500 },
    ],
    total: 33500,
    status: "cancelled",
    paymentStatus: "refunded",
    paymentMethod: "Paystack",
    shippingAddress: {
      street: "654 Bodija Estate",
      city: "Ibadan",
      state: "Oyo State",
      country: "Nigeria",
    },
    createdAt: "2024-01-11T16:40:00Z",
    updatedAt: "2024-01-12T10:25:00Z",
  },
]

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
      return "bg-muted text-foreground/80"
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
      return "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300"
    default:
      return "bg-muted text-foreground/80"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return CheckCircle
    case "shipped":
      return Truck
    case "processing":
      return Package
    case "pending":
      return Clock
    case "cancelled":
      return XCircle
    default:
      return Clock
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

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [segmentFilter, setSegmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const { toast } = useToast()
  const [profileModal, setProfileModal] = useState<{ open: boolean; customer: typeof customers[0] | null }>({ open: false, customer: null })
  const [ordersModal, setOrdersModal] = useState<{ open: boolean; customer: typeof customers[0] | null }>({ open: false, customer: null })
  const [customerPaymentOption, setCustomerPaymentOption] = useState<string | null>(null)

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSegment = segmentFilter === "all" || customer.segment === segmentFilter
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter

    return matchesSearch && matchesSegment && matchesStatus
  })

  const stats = [
    {
      title: "Total Customers",
      value: customers.length.toString(),
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "New This Month",
      value: customers
        .filter((c) => new Date(c.joinedDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        .length.toString(),
      icon: UserPlus,
      color: "text-green-600",
    },
    {
      title: "VIP Customers",
      value: customers.filter((c) => c.segment === "vip").length.toString(),
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Avg. Order Value",
      value: formatCurrency(
        customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.filter((c) => c.totalOrders > 0).length || 0,
      ),
      icon: ShoppingBag,
      color: "text-blue-500",
    },
  ]

  // CSV Export
  const handleExport = () => {
    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Location",
      "Total Orders",
      "Total Spent",
      "Last Order",
      "Joined Date",
      "Status",
      "Segment",
    ]
    const rows = filteredCustomers.map((c) => [
      c.id,
      c.name,
      c.email,
      c.phone,
      c.location,
      c.totalOrders,
      c.totalSpent,
      c.lastOrder,
      c.joinedDate,
      c.status,
      c.segment,
    ])
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "customers.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast({ title: "Exported customers as CSV" })
  }

  return (
    <DashboardLayout>
      <Toaster />
      {/* Profile Modal */}
      <Dialog open={profileModal.open} onOpenChange={(open) => {
        setProfileModal({ open, customer: open ? profileModal.customer : null })
        if (!open) setCustomerPaymentOption(null)
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Customer Profile</DialogTitle>
            <DialogDescription>
              {profileModal.customer && (
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {profileModal.customer.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{profileModal.customer.name}</div>
                      <div className="text-sm text-muted-foreground">{profileModal.customer.email}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="font-medium">Phone:</span> {profileModal.customer.phone}</div>
                    <div><span className="font-medium">Location:</span> {profileModal.customer.location}</div>
                    <div><span className="font-medium">Orders:</span> {profileModal.customer.totalOrders}</div>
                    <div><span className="font-medium">Spent:</span> {formatCurrency(profileModal.customer.totalSpent)}</div>
                    <div><span className="font-medium">Joined:</span> {formatDate(profileModal.customer.joinedDate)}</div>
                    <div><span className="font-medium">Status:</span> {profileModal.customer.status}</div>
                    <div><span className="font-medium">Segment:</span> {profileModal.customer.segment}</div>
                  </div>
                  {/* Payment Option Edit */}
                  {profileModal.customer && (
                    <div className="mt-4">
                      <Label htmlFor="payment-option">Payment Option</Label>
                      <Select
                        value={customerPaymentOption ?? profileModal.customer.paymentOption}
                        onValueChange={(val) => {
                          setCustomerPaymentOption(val)
                          profileModal.customer && (profileModal.customer.paymentOption = val) // update demo data
                          toast({ title: `Payment option updated for ${profileModal.customer?.name}` })
                        }}
                      >
                        <SelectTrigger id="payment-option" className="mt-1 w-full">
                          <SelectValue placeholder="Select payment option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Card">Card</SelectItem>
                          <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                          <SelectItem value="USSD">USSD</SelectItem>
                          <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                          <SelectItem value="QR Code">QR Code</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {/* Orders Modal */}
      <Dialog open={ordersModal.open} onOpenChange={(open) => setOrdersModal({ open, customer: open ? ordersModal.customer : null })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Orders for {ordersModal.customer?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {orders.filter((o) => o.customer.email === ordersModal.customer?.email).length === 0 && (
              <div className="text-center py-8">
                <Package className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <div className="text-muted-foreground">No orders found for this customer.</div>
              </div>
            )}
            {orders.filter((o) => o.customer.email === ordersModal.customer?.email).map((order, idx) => {
              const StatusIcon = getStatusIcon(order.status)
              return (
                <div key={order.id} className="border rounded-lg p-4 hover:bg-muted transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-muted rounded-lg transition-colors">
                        <StatusIcon className="h-5 w-5 text-foreground/80" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-foreground transition-colors">{order.orderNumber}</h3>
                          <Badge className={getStatusColor(order.status) + " transition-colors"}>{order.status}</Badge>
                          <Badge className={getPaymentStatusColor(order.paymentStatus) + " transition-colors"}>{order.paymentStatus}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground transition-colors">
                          {order.items.length} item(s) • {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground transition-colors">{formatCurrency(order.total)}</p>
                      <p className="text-sm text-muted-foreground transition-colors">{order.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="mt-3 pl-12">
                    <div className="text-sm text-muted-foreground transition-colors">
                      {order.items.map((item, idx) => (
                        <span key={idx}>
                          {item.quantity}x {item.name}
                          {idx < order.items.length - 1 && ", "}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground/70 mt-1 transition-colors">
                      Ship to: {order.shippingAddress.city}, {order.shippingAddress.state}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground transition-colors">Customers</h1>
            <p className="text-muted-foreground mt-1 transition-colors">Manage your customer relationships</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
              onClick={() => {
                if (filteredCustomers.length === 0) {
                  toast({ title: "No customers to email" })
                  return
                }
                const emails = filteredCustomers.map((c) => c.email).join(",")
                window.location.href = `mailto:${emails}`
                toast({ title: `Opened mail client for ${filteredCustomers.length} customers` })
              }}
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Campaign
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-card text-foreground transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground transition-colors">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground transition-colors">{stat.value}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-full transition-colors">
                      <stat.icon className="h-6 w-6 text-foreground/80" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <Card className="bg-card text-foreground transition-colors">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  className="pl-10 bg-background text-foreground transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                <SelectTrigger className="w-full sm:w-48 bg-background text-foreground transition-colors">
                  <SelectValue placeholder="Customer Segment" />
                </SelectTrigger>
                <SelectContent className="bg-popover text-foreground transition-colors">
                  <SelectItem value="all">All Segments</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 bg-background text-foreground transition-colors">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover text-foreground transition-colors">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card className="bg-card text-foreground transition-colors">
          <CardHeader>
            <CardTitle>Customer List</CardTitle>
            <CardDescription>
              {filteredCustomers.length} of {customers.length} customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCustomers.map((customer, index) => (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border rounded-lg p-4 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-foreground transition-colors">{customer.name}</h3>
                          <Badge className={getSegmentColor(customer.segment) + " transition-colors"}>{customer.segment}</Badge>
                          <Badge className={getStatusColor(customer.status) + " transition-colors"}>{customer.status}</Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground transition-colors">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>{customer.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{customer.phone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{customer.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground transition-colors">{customer.totalOrders}</p>
                        <p className="text-xs text-muted-foreground transition-colors">Orders</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground transition-colors">{formatCurrency(customer.totalSpent)}</p>
                        <p className="text-xs text-muted-foreground transition-colors">Total Spent</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground transition-colors">{formatDate(customer.lastOrder)}</p>
                        <p className="text-xs text-muted-foreground transition-colors">Last Order</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover text-foreground transition-colors">
                          <DropdownMenuItem
                            onClick={async () => {
                              setLoadingAction(`profile-${customer.id}`)
                              setProfileModal({ open: true, customer })
                              setTimeout(() => setLoadingAction(null), 800)
                            }}
                            disabled={loadingAction === `profile-${customer.id}`}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={async () => {
                              setLoadingAction(`email-${customer.id}`)
                              window.location.href = `mailto:${customer.email}`
                              toast({ title: `Opened mail client for ${customer.name}` })
                              setTimeout(() => setLoadingAction(null), 800)
                            }}
                            disabled={loadingAction === `email-${customer.id}`}
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={async () => {
                              setLoadingAction(`orders-${customer.id}`)
                              setOrdersModal({ open: true, customer })
                              setTimeout(() => setLoadingAction(null), 800)
                            }}
                            disabled={loadingAction === `orders-${customer.id}`}
                          >
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            View Orders
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredCustomers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2 transition-colors">No customers found</h3>
                <p className="text-muted-foreground mb-4 transition-colors">
                  {searchTerm || segmentFilter !== "all" || statusFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Customers will appear here when they make their first purchase"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
