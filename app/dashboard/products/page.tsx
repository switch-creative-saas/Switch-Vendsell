"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Package } from "lucide-react"
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
import { DatabaseService, Product } from "@/lib/database"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ProductsPage() {
  const { store } = useUser()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const router = useRouter()

  useEffect(() => {
    if (store) {
      loadProducts()
    }
  }, [store])

  const loadProducts = async () => {
    if (!store) return

    try {
      setLoading(true)
      const productsData = await DatabaseService.getProductsByStore(store.id)
      setProducts(productsData)
    } catch (error) {
      console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await DatabaseService.deleteProduct(productId)
      await loadProducts() // Reload products
    } catch (error) {
      console.error('Error deleting product:', error)
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
      case "active":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
      case "draft":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300"
      case "out_of_stock":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300"
      case "archived":
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300"
      default:
        return "bg-muted text-foreground/80"
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
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
              Manage your product catalog and inventory.
            </p>
          </div>
          <Link href="/dashboard/products/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Search and filter your products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Fashion & Clothing">Fashion & Clothing</SelectItem>
                  <SelectItem value="Electronics & Gadgets">Electronics & Gadgets</SelectItem>
                  <SelectItem value="Beauty & Cosmetics">Beauty & Cosmetics</SelectItem>
                  <SelectItem value="Jewelry & Accessories">Jewelry & Accessories</SelectItem>
                  <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                  <SelectItem value="Books & Education">Books & Education</SelectItem>
                  <SelectItem value="Sports & Fitness">Sports & Fitness</SelectItem>
                  <SelectItem value="Arts & Crafts">Arts & Crafts</SelectItem>
                  <SelectItem value="Food & Beverages">Food & Beverages</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden">
                  <div className="aspect-square bg-muted relative">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/store/${store?.slug}/product/${product.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/products/${product.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
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
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                        <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description || "No description available"}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-lg font-bold">{formatCurrency(product.price)}</p>
                          {product.compare_price && product.compare_price > product.price && (
                            <p className="text-sm text-muted-foreground line-through">
                              {formatCurrency(product.compare_price)}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Stock</p>
                          <p className="text-sm font-medium">{product.stock_quantity}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          SKU: {product.sku || "N/A"}
                        </p>
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
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                  ? "Try adjusting your filters or search terms."
                  : "Get started by adding your first product to your store."}
              </p>
              {!searchTerm && statusFilter === "all" && categoryFilter === "all" && (
                <Link href="/dashboard/products/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Product
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        {filteredProducts.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Showing {filteredProducts.length} of {products.length} products</span>
                <span>Total Value: {formatCurrency(filteredProducts.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0))}</span>
              </div>
          </CardContent>
        </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
