"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Search,
  MoreHorizontal,
  Eye,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { Label } from "@/components/ui/label"

// Define the Order type
type OrderType = {
  id: string;
  orderNumber: string;
  customer: { name: string; email: string; phone: string };
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: { street: string; city: string; state: string; country: string };
  createdAt: string;
  updatedAt: string;
}

const orders: OrderType[] = [
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
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [invoiceOrder, setInvoiceOrder] = useState<OrderType | null>(null)
  const [statusOrder, setStatusOrder] = useState<OrderType | null>(null)
  const [statusValue, setStatusValue] = useState<string>("")
  const [detailsOrder, setDetailsOrder] = useState<OrderType | null>(null)
  const { toast } = useToast()
  const [exporting, setExporting] = useState(false)
  const [ordersState, setOrdersState] = useState<OrderType[]>(orders)
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [customerPaymentOption, setCustomerPaymentOption] = useState<string | null>(null)

  const filteredOrders = ordersState.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter

    return matchesSearch && matchesStatus && matchesPayment
  })

  const stats = [
    {
      title: "Total Orders",
      value: ordersState.length.toString(),
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Pending Orders",
      value: ordersState.filter((o) => o.status === "pending").length.toString(),
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Completed Orders",
      value: ordersState.filter((o) => o.status === "delivered").length.toString(),
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(ordersState.filter((o) => o.paymentStatus === "paid").reduce((sum, o) => sum + o.total, 0)),
      icon: RefreshCw,
      color: "text-blue-500",
    },
  ]

  // Handler to update order status in local state (demo)
  const handleStatusSave = () => {
    if (!statusOrder) return
    // Update the order in the orders array (in real app, call API)
    const idx = ordersState.findIndex((o) => o.id === statusOrder.id)
    if (idx !== -1) {
      ordersState[idx].status = statusValue
    }
    toast({ title: "Order status updated", description: `Status set to ${statusValue}`, variant: "default" })
    setStatusOrder(null)
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const doc = new jsPDF()
      autoTable(doc, {
        head: [["Order #", "Customer", "Email", "Status", "Payment", "Total", "Date"]],
        body: filteredOrders.map((order) => [
          order.orderNumber,
          order.customer.name,
          order.customer.email,
          order.status,
          order.paymentStatus,
          order.total,
          formatDate(order.createdAt),
        ]),
      })
      doc.save("orders.pdf")
      toast({ title: "Exported orders as PDF", variant: "default" })
    } catch (err) {
      toast({ title: "Export failed", description: String(err), variant: "destructive" })
    } finally {
      setExporting(false)
    }
  }

  // Fetch orders (simulate with timeout, or connect to Supabase if available)
  const fetchOrders = async () => {
    setLoadingOrders(true)
    try {
      // Simulate fetch (replace with Supabase call if needed)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setOrdersState([...orders]) // In real app, fetch from DB
    } catch (err: any) {
      toast({ title: "Error refreshing orders", description: err.message, variant: "destructive" })
    } finally {
      setLoadingOrders(false)
    }
  }

  return (
    <DashboardLayout>
      <Toaster />
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground transition-colors">Orders</h1>
            <p className="text-muted-foreground mt-1 transition-colors">Manage and track your customer orders</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Button variant="outline" onClick={handleExport} disabled={exporting}>
              <Download className="h-4 w-4 mr-2" />
              {exporting ? "Exporting..." : "Export"}
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors" onClick={fetchOrders} disabled={loadingOrders}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {loadingOrders ? "Refreshing..." : "Refresh"}
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
                  placeholder="Search orders, customers..."
                  className="pl-10 bg-background text-foreground transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 bg-background text-foreground transition-colors">
                  <SelectValue placeholder="Order Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover text-foreground transition-colors">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-full sm:w-48 bg-background text-foreground transition-colors">
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover text-foreground transition-colors">
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="bg-card text-foreground transition-colors">
          <CardHeader>
            <CardTitle>Order List</CardTitle>
            <CardDescription>
              {filteredOrders.length} of {ordersState.length} orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrders.map((order, index) => {
                const StatusIcon = getStatusIcon(order.status)
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border rounded-lg p-4 hover:bg-muted transition-colors"
                  >
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
                            {order.customer.name} • {order.customer.email}
                          </p>
                          <p className="text-xs text-muted-foreground/70 transition-colors">
                            {order.items.length} item(s) • {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold text-foreground transition-colors">{formatCurrency(order.total)}</p>
                          <p className="text-sm text-muted-foreground transition-colors">{order.paymentMethod}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover text-foreground transition-colors">
                            <DropdownMenuItem onClick={() => setDetailsOrder(order)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setStatusOrder(order); setStatusValue(order.status) }}>
                              <Package className="mr-2 h-4 w-4" />
                              Update Status
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Truck className="mr-2 h-4 w-4" />
                              Track Shipment
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setInvoiceOrder(order)}>
                              <Download className="mr-2 h-4 w-4" />
                              Download Invoice
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Order Items Preview */}
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
                  </motion.div>
                )
              })}
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2 transition-colors">No orders found</h3>
                <p className="text-muted-foreground mb-4 transition-colors">
                  {searchTerm || statusFilter !== "all" || paymentFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Orders will appear here when customers make purchases"}
                </p>
              </div>
            )}

            {/* Invoice Modal */}
            <Dialog open={!!invoiceOrder} onOpenChange={() => setInvoiceOrder(null)}>
              <DialogContent className="max-w-lg w-full">
                {invoiceOrder && (
                  <>
                    <DialogHeader>
                      <DialogTitle>Invoice for {invoiceOrder.orderNumber}</DialogTitle>
                    </DialogHeader>
                    <div className="bg-background rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{invoiceOrder.customer.name}</h3>
                          <p className="text-sm text-muted-foreground">{invoiceOrder.customer.email}</p>
                          <p className="text-sm text-muted-foreground">{invoiceOrder.customer.phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Order Date</p>
                          <p className="text-sm">{formatDate(invoiceOrder.createdAt)}</p>
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-2">Items</h4>
                        <ul className="space-y-1">
                          {invoiceOrder.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between text-sm">
                              <span>{item.quantity}x {item.name}</span>
                              <span>{formatCurrency(item.price * item.quantity)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="border-t pt-4 flex items-center justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="font-bold text-lg">{formatCurrency(invoiceOrder.total)}</span>
                      </div>
                      <div className="border-t pt-4">
                        <p className="text-xs text-muted-foreground">Payment Method: {invoiceOrder.paymentMethod}</p>
                        <p className="text-xs text-muted-foreground">Status: {invoiceOrder.paymentStatus}</p>
                        <p className="text-xs text-muted-foreground">Shipping: {invoiceOrder.shippingAddress.street}, {invoiceOrder.shippingAddress.city}, {invoiceOrder.shippingAddress.state}</p>
                      </div>
                      <Button className="w-full mt-2" onClick={() => { toast({ title: "Download PDF (demo)", description: "Invoice PDF download coming soon!" }); }}>
                        Download PDF
                      </Button>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>

            {/* Status Update Modal */}
            <Dialog open={!!statusOrder} onOpenChange={() => setStatusOrder(null)}>
              <DialogContent className="max-w-md w-full">
                {statusOrder && (
                  <>
                    <DialogHeader>
                      <DialogTitle>Update Status for {statusOrder.orderNumber}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Select value={statusValue} onValueChange={setStatusValue}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button className="w-full" onClick={handleStatusSave} disabled={!statusValue}>
                        Save Status
                      </Button>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>

            {/* Details Modal */}
            <Dialog open={!!detailsOrder} onOpenChange={() => setDetailsOrder(null)}>
              <DialogContent className="max-w-lg w-full">
                {detailsOrder && (
                  <>
                    <DialogHeader>
                      <DialogTitle>Order Details: {detailsOrder.orderNumber}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{detailsOrder.customer.name}</h3>
                          <p className="text-sm text-muted-foreground">{detailsOrder.customer.email}</p>
                          <p className="text-sm text-muted-foreground">{detailsOrder.customer.phone}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(detailsOrder.status)}>{detailsOrder.status}</Badge>
                          <Badge className={getPaymentStatusColor(detailsOrder.paymentStatus)}>{detailsOrder.paymentStatus}</Badge>
                        </div>
                      </div>
                      {/* Payment Option Edit */}
                      <div>
                        <Label htmlFor="payment-option">Payment Option</Label>
                        <Select
                          value={customerPaymentOption ?? "Card"}
                          onValueChange={(val) => {
                            setCustomerPaymentOption(val)
                            toast({ title: `Payment option updated for ${detailsOrder.customer.name}` })
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
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-2">Items</h4>
                        <ul className="space-y-1">
                          {detailsOrder.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between text-sm">
                              <span>{item.quantity}x {item.name}</span>
                              <span>{formatCurrency(item.price * item.quantity)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="border-t pt-4 flex items-center justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="font-bold text-lg">{formatCurrency(detailsOrder.total)}</span>
                      </div>
                      <div className="border-t pt-4">
                        <p className="text-xs text-muted-foreground">Payment Method: {detailsOrder.paymentMethod}</p>
                        <p className="text-xs text-muted-foreground">Shipping: {detailsOrder.shippingAddress.street}, {detailsOrder.shippingAddress.city}, {detailsOrder.shippingAddress.state}</p>
                        <p className="text-xs text-muted-foreground">Created: {formatDate(detailsOrder.createdAt)}</p>
                        <p className="text-xs text-muted-foreground">Updated: {formatDate(detailsOrder.updatedAt)}</p>
                      </div>
                      <Button
                        className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => {
                          if (!detailsOrder) return
                          // Format phone number for WhatsApp (remove spaces, dashes, etc.)
                          const phone = detailsOrder.customer.phone.replace(/[^\d+]/g, "")
                          // Format order summary
                          const message = encodeURIComponent(
                            `Hello ${detailsOrder.customer.name},%0A%0A` +
                            `Here are your order details:%0A` +
                            `Order Number: ${detailsOrder.orderNumber}%0A` +
                            `Items: ${detailsOrder.items.map(i => `${i.quantity}x ${i.name}`).join(", ")}%0A` +
                            `Total: ${formatCurrency(detailsOrder.total)}%0A` +
                            `Status: ${detailsOrder.status}%0A` +
                            `Thank you for shopping with us!`
                          )
                          window.open(`https://wa.me/${phone}?text=${message}`, "_blank")
                        }}
                      >
                        Send to WhatsApp
                      </Button>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
