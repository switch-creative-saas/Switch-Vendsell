"use client"

import { useUser } from "@/contexts/UserContext"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Settings,
  Plus,
  Eye,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Smartphone,
  Globe,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DashboardLayout from "@/components/DashboardLayout"
import { DatabaseService } from "@/lib/database"

const paymentMethods = [
  { name: "Debit/Credit Cards", icon: CreditCard, enabled: true, description: "Visa, Mastercard, Verve" },
  { name: "Bank Transfer", icon: Globe, enabled: true, description: "Direct bank transfers" },
  { name: "USSD", icon: Smartphone, enabled: true, description: "*737# and other USSD codes" },
  { name: "Mobile Money", icon: Smartphone, enabled: false, description: "MTN, Airtel, 9mobile wallets" },
  { name: "QR Code", icon: Shield, enabled: true, description: "Scan to pay functionality" },
]

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount)
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "successful":
      return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
    case "pending":
      return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300"
    case "failed":
      return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300"
    default:
      return "bg-muted text-foreground/80"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "successful":
      return CheckCircle
    case "pending":
      return Clock
    case "failed":
      return XCircle
    default:
      return AlertTriangle
  }
}

const getSetupStatusColor = (status: string) => {
  switch (status) {
    case "connected":
      return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
    case "pending":
      return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300"
    case "not_connected":
      return "bg-muted text-foreground/80"
    default:
      return "bg-muted text-foreground/80"
  }
}

export default function PaymentsPage() {
  const { store } = useUser()
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!store) return
    setLoading(true)
    DatabaseService.getPaymentTransactions(store.id)
      .then(setTransactions)
      .finally(() => setLoading(false))
  }, [store])
  if (loading) return <div>Loading payments...</div>
  if (!transactions.length) return <div>No payment transactions yet. When you receive payments, they will show here.</div>

  const totalVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0)
  const totalTransactions = transactions.length
  const successfulTransactions = transactions.filter((t) => t.status === "successful").length
  const successRate = (successfulTransactions / transactions.length) * 100

  const stats = [
    {
      title: "Monthly Volume",
      value: formatCurrency(totalVolume),
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Total Transactions",
      value: totalTransactions.toString(),
      change: "+8.2%",
      trend: "up",
      icon: CreditCard,
    },
    {
      title: "Success Rate",
      value: `${successRate.toFixed(1)}%`,
      change: "+2.1%",
      trend: "up",
      icon: CheckCircle,
    },
    {
      title: "Average Fee",
      value: "1.45%",
      change: "-0.1%",
      trend: "down",
      icon: TrendingDown,
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground transition-colors">Payments</h1>
            <p className="text-muted-foreground mt-1 transition-colors">Manage payment gateways and track transactions</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Add Gateway
            </Button>
          </div>
        </div>

        <Tabs value="overview" onValueChange={() => {}}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="gateways">Gateways</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
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
                          <p className="text-sm font-medium text-foreground">{stat.title}</p>
                          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                          <div className="flex items-center mt-1">
                            {stat.trend === "up" ? (
                              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                            )}
                            <span className={`text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                              {stat.change}
                            </span>
                          </div>
                        </div>
                        <div className="p-3 bg-card rounded-full">
                          <stat.icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Active Gateways */}
            <Card>
              <CardHeader>
                <CardTitle>Active Payment Gateways</CardTitle>
                <CardDescription>Your connected payment providers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* This section will need to be updated to fetch and display real gateways */}
                  <div className="border rounded-lg p-4 flex flex-col justify-between h-full">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2 sm:gap-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-8 bg-card rounded flex items-center justify-center">
                          <span className="text-xs font-medium">Paystack</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">Paystack</h3>
                          <p className="text-sm text-muted-foreground">Fee: 1.5% + ₦100</p>
                        </div>
                      </div>
                      <Badge className={getSetupStatusColor("connected")}>Connected</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Monthly Volume</p>
                        <p className="font-semibold">{formatCurrency(1250000)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Transactions</p>
                        <p className="font-semibold">234</p>
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 flex flex-col justify-between h-full">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2 sm:gap-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-8 bg-card rounded flex items-center justify-center">
                          <span className="text-xs font-medium">Bank Transfers</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">Bank Transfers</h3>
                          <p className="text-sm text-muted-foreground">Fee: 1.4% + ₦100</p>
                        </div>
                      </div>
                      <Badge className={getSetupStatusColor("connected")}>Connected</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Monthly Volume</p>
                        <p className="font-semibold">{formatCurrency(890000)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Transactions</p>
                        <p className="font-semibold">156</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Latest payment activities</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.slice(0, 5).map((transaction) => {
                    const StatusIcon = getStatusIcon(transaction.status)
                    return (
                      <div key={transaction.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg gap-2 sm:gap-0">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <StatusIcon className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{transaction.customer}</p>
                            <p className="text-sm text-gray-600">
                              {transaction.gateway} • {transaction.method}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(transaction.amount)}</p>
                          <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gateways Tab */}
          <TabsContent value="gateways" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* This section will need to be updated to fetch and display real gateways */}
              <Card className="border-blue-200">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-medium">Paystack</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">Paystack</h3>
                          <Badge className={getSetupStatusColor("connected")}>Connected</Badge>
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Active</Badge>
                        </div>
                        <p className="text-gray-600 mb-3">Nigeria's leading payment gateway with card, bank transfer, and USSD support</p>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                          <span>Fee: 1.5% + ₦100</span>
                          <span>•</span>
                          <span>Features: Cards, Bank Transfer, USSD, QR Code, Mobile Money</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                          <div>
                            <p className="text-sm text-gray-600">Monthly Volume</p>
                            <p className="font-semibold">{formatCurrency(1250000)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Transactions</p>
                            <p className="font-semibold">234</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col items-center gap-2 sm:gap-2 mt-4 sm:mt-0">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      <Switch checked />
                    </div>
                  </div>
                </Card>
                <Card className="border-blue-200">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-medium">Bank Transfers</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">Bank Transfers</h3>
                            <Badge className={getSetupStatusColor("connected")}>Connected</Badge>
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Active</Badge>
                          </div>
                          <p className="text-gray-600 mb-3">Accept direct bank transfers from customers across Nigeria</p>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                            <span>Fee: 1.4% + ₦100</span>
                            <span>•</span>
                            <span>Features: Bank Transfer</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                            <div>
                              <p className="text-sm text-gray-600">Monthly Volume</p>
                              <p className="font-semibold">{formatCurrency(890000)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Transactions</p>
                              <p className="font-semibold">156</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-col items-center gap-2 sm:gap-2 mt-4 sm:mt-0">
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                        <Switch checked />
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              {/* Transactions Tab */}
              <TabsContent value="transactions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                      <div>
                        <CardTitle>All Transactions</CardTitle>
                        <CardDescription>Complete transaction history</CardDescription>
                      </div>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2 mt-2 sm:mt-0">
                        <Select defaultValue="all">
                          <SelectTrigger className="w-full sm:w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="successful">Successful</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refresh
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {transactions.map((transaction) => {
                        const StatusIcon = getStatusIcon(transaction.status)
                        return (
                          <div key={transaction.id} className="border rounded-lg p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                              <div className="flex items-center space-x-4">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                  <StatusIcon className="h-5 w-5 text-gray-600" />
                                </div>
                                <div>
                                  <div className="flex flex-wrap items-center space-x-2 mb-1">
                                    <span className="font-semibold text-gray-900">{transaction.reference}</span>
                                    <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    {transaction.customer} • {transaction.gateway} • {transaction.method}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(transaction.timestamp).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right mt-2 sm:mt-0">
                                <p className="font-semibold text-gray-900">{formatCurrency(transaction.amount)}</p>
                                {transaction.status === "successful" && (
                                  <>
                                    <p className="text-sm text-gray-600">Fee: {formatCurrency(transaction.fee)}</p>
                                    <p className="text-sm font-medium text-green-600">
                                      Net: {formatCurrency(transaction.netAmount)}
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Enable or disable payment methods for your customers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <div key={method.name} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <method.icon className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{method.name}</p>
                              <p className="text-sm text-gray-600">{method.description}</p>
                            </div>
                          </div>
                          <Switch checked={method.enabled} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Settings</CardTitle>
                    <CardDescription>Configure payment behavior and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Auto-capture payments</Label>
                          <p className="text-sm text-gray-600">Automatically capture authorized payments</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Send payment receipts</Label>
                          <p className="text-sm text-gray-600">Email receipts to customers automatically</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Retry failed payments</Label>
                          <p className="text-sm text-gray-600">Automatically retry failed payment attempts</p>
                        </div>
                        <Switch />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="webhook-url">Webhook URL</Label>
                        <Input id="webhook-url" placeholder="https://yourstore.com/webhooks/payments" className="mt-1" />
                        <p className="text-sm text-gray-500 mt-1">URL to receive payment notifications</p>
                      </div>

                      <div>
                        <Label htmlFor="return-url">Return URL</Label>
                        <Input id="return-url" placeholder="https://yourstore.com/payment/success" className="mt-1" />
                        <p className="text-sm text-gray-500 mt-1">Where customers return after payment</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </DashboardLayout>
      )
    }
