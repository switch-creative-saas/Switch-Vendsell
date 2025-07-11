"use client"

import { Suspense, lazy } from "react"
import { ResponsiveContainer, ResponsiveGrid, OptimizedCard } from "@/components/ui/responsive-container"
import { LazyLoad } from "@/components/performance/lazy-load"
import { useOptimizedQuery } from "@/hooks/use-optimized-query"
import { useUser } from "@/contexts/UserContext"
import { DatabaseService } from "@/lib/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Calendar,
  Target,
  Zap,
} from "lucide-react"
import Link from "next/link"

// Loading skeleton components
const MetricSkeleton = () => (
  <OptimizedCard className="p-6">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
      </div>
      <Skeleton className="h-12 w-12 rounded-full" />
    </div>
  </OptimizedCard>
)

const ChartSkeleton = () => (
  <OptimizedCard className="p-6">
    <div className="space-y-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-64 w-full" />
    </div>
  </OptimizedCard>
)

// Dashboard metrics component
function DashboardMetrics({ storeId }: { storeId: string }) {
  const { data: metrics, isLoading } = useOptimizedQuery(
    `dashboard-metrics-${storeId}`,
    {
      queryFn: () => DatabaseService.getDashboardMetrics(storeId),
      refetchInterval: 30000, // Refetch every 30 seconds
      staleTime: 60000, // Consider stale after 1 minute
    }
  )

  if (isLoading) {
    return (
      <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 4 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricSkeleton key={i} />
        ))}
      </ResponsiveGrid>
    )
  }

  const metricData = [
    {
      title: "Total Revenue",
      value: `$${metrics?.totalRevenue?.toFixed(2) || '0.00'}`,
      change: metrics?.revenueChange || 0,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Total Orders",
      value: metrics?.totalOrders?.toString() || '0',
      change: metrics?.ordersChange || 0,
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Total Customers",
      value: metrics?.totalCustomers?.toString() || '0',
      change: metrics?.customersChange || 0,
    icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Total Products",
      value: metrics?.totalProducts?.toString() || '0',
      change: metrics?.productsChange || 0,
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
  ]

  return (
    <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 4 }} gap="md">
      {metricData.map((metric, index) => (
        <OptimizedCard key={index} className="p-6 hover" hover>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </p>
              <p className="text-2xl font-bold">{metric.value}</p>
              <div className="flex items-center space-x-1">
                {metric.change >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={`text-sm font-medium ${
                    metric.change >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {Math.abs(metric.change)}%
                </span>
                <span className="text-sm text-muted-foreground">from last month</span>
              </div>
            </div>
            <div className={`p-3 rounded-full ${metric.bgColor}`}>
              <metric.icon className={`h-6 w-6 ${metric.color}`} />
            </div>
          </div>
        </OptimizedCard>
      ))}
    </ResponsiveGrid>
  )
}

// Quick actions component
function QuickActions({ storeSlug }: { storeSlug: string }) {
  const actions = [
    {
      title: "Add Product",
      description: "Create a new product listing",
      icon: Package,
      href: "/dashboard/products/new",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "View Store",
      description: "Preview your storefront",
      icon: Activity,
      href: `/store/${storeSlug}`,
      color: "bg-green-500 hover:bg-green-600",
      external: true,
    },
    {
      title: "Analytics",
      description: "View detailed analytics",
      icon: Target,
      href: "/dashboard/analytics",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "AI Assistant",
      description: "Get AI-powered insights",
      icon: Zap,
      href: "/dashboard/ai",
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ]

  return (
    <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 4 }} gap="md">
      {actions.map((action, index) => (
        <OptimizedCard key={index} className="p-6 hover" hover>
          <Link 
            href={action.href} 
            target={action.external ? "_blank" : undefined}
            className="block"
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${action.color} text-white`}>
                <action.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
        </OptimizedCard>
      ))}
    </ResponsiveGrid>
  )
}

// Main dashboard component
export default function DashboardPage() {
  const { user, store, loading, error, refreshStore } = useUser()

  if (loading) {
    return (
      <ResponsiveContainer>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 4 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <MetricSkeleton key={i} />
            ))}
          </ResponsiveGrid>
          <ChartSkeleton />
        </div>
      </ResponsiveContainer>
    )
  }

  if (!user || !store) {
    return (
      <ResponsiveContainer>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Store not found</h1>
          <p className="text-muted-foreground mb-6">
            Please set up your store to continue.
          </p>
          {error && (
            <div className="mb-4 text-red-600 font-medium">{error}</div>
          )}
          <Button asChild>
            <Link href="/dashboard/settings">Set Up Store</Link>
          </Button>
          <div className="mt-4">
            <Button variant="outline" onClick={refreshStore}>Retry Store Creation</Button>
          </div>
        </div>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
          <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {user.first_name || 'User'}!
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening with your store today.
              </p>
          </div>
            <Badge variant="secondary" className="text-sm">
              {store.plan} Plan
            </Badge>
          </div>
        </div>

        {/* Quick Actions */}
        <LazyLoad fallback={<div className="h-32 bg-muted rounded-lg animate-pulse" />}>
          <QuickActions storeSlug={store.slug} />
        </LazyLoad>

        {/* Metrics */}
        <LazyLoad fallback={
          <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 4 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <MetricSkeleton key={i} />
            ))}
          </ResponsiveGrid>
        }>
          <DashboardMetrics storeId={store.id} />
        </LazyLoad>

        {/* Charts and Analytics */}
        <ResponsiveGrid cols={{ sm: 1, lg: 2 }} gap="lg">
          <LazyLoad fallback={<ChartSkeleton />}>
            <Suspense fallback={<ChartSkeleton />}>
              <OptimizedCard className="p-6">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>
                    Your store's revenue performance over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Placeholder for Revenue Overview Chart */}
                  <div className="h-64 w-full bg-muted rounded-lg animate-pulse" />
                </CardContent>
              </OptimizedCard>
            </Suspense>
          </LazyLoad>

          <LazyLoad fallback={<ChartSkeleton />}>
            <Suspense fallback={<ChartSkeleton />}>
              <OptimizedCard className="p-6">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>
                    Latest orders from your customers
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  {/* Placeholder for Recent Orders Chart */}
                  <div className="h-64 w-full bg-muted rounded-lg animate-pulse" />
              </CardContent>
              </OptimizedCard>
            </Suspense>
          </LazyLoad>
        </ResponsiveGrid>

          {/* Top Products */}
        <LazyLoad fallback={<ChartSkeleton />}>
          <Suspense fallback={<ChartSkeleton />}>
            <OptimizedCard className="p-6">
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
                <CardDescription>
                  Your best-selling products this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Placeholder for Top Products Chart */}
                <div className="h-64 w-full bg-muted rounded-lg animate-pulse" />
              </CardContent>
            </OptimizedCard>
          </Suspense>
        </LazyLoad>
      </div>
    </ResponsiveContainer>
  )
}
