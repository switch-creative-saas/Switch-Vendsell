"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Package,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import Link from "next/link"
import { DatabaseService } from "@/lib/database"
import { AuthService } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  description?: string
  category: string
  price: number
  stock_quantity: number
  status: string
  images: string[]
  created_at: string
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const user = await AuthService.getCurrentUser()
        if (!user) {
          toast({ title: "Authentication required", description: "Please sign in to view products", variant: "destructive" })
          return
        }

        // Get user's stores first
        const stores = await AuthService.getUserStores(user.id)
        if (stores.length === 0) {
          setProducts([])
          return
        }

        // Get products from all stores
        let allProducts: Product[] = []
        for (const store of stores) {
          const storeProducts = await DatabaseService.getProductsByStore(store.id)
          allProducts = [...allProducts, ...storeProducts]
        }

        setProducts(allProducts)
      } catch (err: any) {
        console.error('Error fetching products:', err)
        toast({ title: "Error fetching products", description: err.message, variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [toast])

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const stats = [
    {
      title: "Total Products",
      value: products.length.toString(),
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Active Products",
      value: products.filter((p) => p.status === "active").length.toString(),
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Out of Stock",
      value: products.filter((p) => p.stock_quantity === 0).length.toString(),
      icon: AlertCircle,
      color: "text-red-600",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      case "out_of_stock":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "archived":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      await DatabaseService.deleteProduct(productId)
      setProducts(products.filter(p => p.id !== productId))
      toast({ title: "Product deleted", description: "Product has been successfully deleted", variant: "default" })
    } catch (error: any) {
      toast({ title: "Error deleting product", description: error.message, variant: "destructive" })
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading products...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">
              Manage your product catalog across all stores
            </p>
          </div>
          <Link href="/dashboard/products/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="footwear">Footwear</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {products.length === 0 ? "No products yet" : "No products found"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {products.length === 0 
                  ? "Create your first product to start selling" 
                  : "Try adjusting your search or filter criteria"
                }
              </p>
              {products.length === 0 && (
                <Link href="/dashboard/products/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Product
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {product.description || "No description"}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{product.category}</Badge>
                          <Badge className={getStatusColor(product.status)}>
                            {product.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-lg font-bold">₦{product.price.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          Stock: {product.stock_quantity}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
