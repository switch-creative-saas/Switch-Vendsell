"use client"

import { useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { CheckCircle, CreditCard, Download, Star } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: 0,
    features: ["Up to 10 products", "Basic analytics", "Community support"],
    badge: "Current Plan",
    popular: false,
  },
  {
    name: "Pro",
    price: 5000,
    features: ["Unlimited products", "Advanced analytics", "Priority support", "Custom domain"],
    badge: "Most Popular",
    popular: true,
  },
  {
    name: "Business",
    price: 15000,
    features: ["All Pro features", "Team accounts", "API access", "Dedicated support"],
    badge: "Best Value",
    popular: false,
  },
]

const billingHistory = [
  { id: "INV-001", date: "2024-04-01", amount: 5000, status: "Paid" },
  { id: "INV-002", date: "2024-03-01", amount: 5000, status: "Paid" },
  { id: "INV-003", date: "2024-02-01", amount: 5000, status: "Paid" },
]

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState("Free")
  const { toast } = useToast()

  const handleUpgrade = (plan: string) => {
    toast({ title: `Upgrade to ${plan}`, description: "This is a demo action.", variant: "default" })
  }
  const handleAddCard = () => {
    toast({ title: "Add Payment Method", description: "This is a demo action.", variant: "default" })
  }
  const handleDownload = (id: string) => {
    toast({ title: `Download Invoice ${id}`, description: "This is a demo action.", variant: "default" })
  }

  return (
    <DashboardLayout>
      <Toaster />
      <div className="space-y-8 max-w-4xl mx-auto p-3 sm:p-6">
        {/* Current Plan */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your current subscription and usage</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold">Free</h3>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Current Plan</Badge>
              <p className="text-muted-foreground mt-2">You are on the Free plan. Upgrade to unlock more features!</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90" onClick={() => handleUpgrade("Pro")}>Upgrade to Pro</Button>
          </CardContent>
        </Card>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.name} className={`relative transition-all ${plan.popular ? "ring-2 ring-primary" : ""}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {plan.popular && <Star className="h-5 w-5 text-yellow-400" />}
                    {plan.name}
                  </CardTitle>
                  <Badge className="bg-muted text-foreground">{plan.badge}</Badge>
                </div>
                <div className="mt-2 text-3xl font-bold">
                  {plan.price === 0 ? "Free" : `₦${plan.price.toLocaleString()}/mo`}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="mb-4 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.name === selectedPlan ? "outline" : "default"}
                  disabled={plan.name === selectedPlan}
                  onClick={() => handleUpgrade(plan.name)}
                >
                  {plan.name === selectedPlan ? "Current Plan" : `Upgrade to ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Manage your card for subscription payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-primary" />
                <span className="font-medium">•••• •••• •••• 1234</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Primary</Badge>
              </div>
              <Button variant="outline" onClick={handleAddCard}>Add Card</Button>
            </div>
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>Your past invoices and payments</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>₦{item.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">{item.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleDownload(item.id)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 