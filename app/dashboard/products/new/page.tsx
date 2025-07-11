"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useUser } from "@/contexts/UserContext"
import { DatabaseService } from "@/lib/database"
import { Bot, DollarSign, X, Upload, Plus } from "lucide-react"

export default function NewProductPage() {
  const { store } = useUser()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    comparePrice: "",
    cost: "",
    sku: "",
    stock: "",
    weight: "",
    tags: "",
    isDigital: false,
    trackInventory: true,
    allowBackorder: false,
    requiresShipping: true,
    taxable: true,
    status: "draft",
  })

  const [images, setImages] = useState<string[]>([])
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)
  const [isGeneratingPrice, setIsGeneratingPrice] = useState(false)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      // In a real app, you'd upload these to a storage service
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setImages((prev) => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const generateDescription = async () => {
    if (!formData.name || !formData.category) {
      toast({
        title: "Missing information",
        description: "Please enter product name and category first",
        variant: "destructive"
      })
      return
    }

    setIsGeneratingDescription(true)
    // Simulate AI description generation
    setTimeout(() => {
      const sampleDescription = `Discover the perfect ${formData.name.toLowerCase()} that combines traditional Nigerian craftsmanship with modern style. This premium ${formData.category.toLowerCase()} piece is carefully crafted using high-quality materials and attention to detail. Perfect for special occasions or everyday wear, this item showcases the rich cultural heritage of Nigeria while meeting contemporary fashion standards. Available in multiple sizes and colors to suit your personal style.`

      handleInputChange("description", sampleDescription)
      setIsGeneratingDescription(false)
      toast({
        title: "Description generated",
        description: "AI has created a compelling product description for you."
      })
    }, 2000)
  }

  const generatePrice = async () => {
    if (!formData.category) {
      toast({
        title: "Missing category",
        description: "Please select a category first",
        variant: "destructive"
      })
      return
    }

    setIsGeneratingPrice(true)
    // Simulate AI price suggestion
    setTimeout(() => {
      const basePrices: { [key: string]: number } = {
        "Fashion & Clothing": 25000,
        "Electronics & Gadgets": 45000,
        "Beauty & Cosmetics": 15000,
        "Jewelry & Accessories": 20000,
        "Home & Garden": 30000,
        "Books & Education": 5000,
        "Sports & Fitness": 35000,
        "Arts & Crafts": 12000,
        "Food & Beverages": 8000,
        Other: 20000,
      }

      const basePrice = basePrices[formData.category] || 20000
      const variation = Math.random() * 0.4 - 0.2 // ±20% variation
      const suggestedPrice = Math.round(basePrice * (1 + variation))

      handleInputChange("price", suggestedPrice.toString())
      handleInputChange("comparePrice", Math.round(suggestedPrice * 1.2).toString())
      setIsGeneratingPrice(false)
      toast({
        title: "Price generated",
        description: "AI has suggested optimal pricing for your product."
      })
    }, 1500)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!store) {
      toast({
        title: "Error",
        description: "Store not found. Please try again.",
        variant: "destructive"
      })
      return
    }

    if (!formData.name || !formData.category || !formData.price) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    setSaving(true)

    try {
      const productData = {
        store_id: store.id,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        compare_price: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
        sku: formData.sku,
        stock_quantity: parseInt(formData.stock) || 0,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        images: images,
        is_digital: formData.isDigital,
        track_inventory: formData.trackInventory,
        allow_backorder: formData.allowBackorder,
        requires_shipping: formData.requiresShipping,
        taxable: formData.taxable,
        status: formData.status as 'draft' | 'active' | 'out_of_stock' | 'archived'
      }

      await DatabaseService.createProduct(productData)
      
      toast({
        title: "Product created",
        description: "Your product has been successfully created."
      })
      
      router.push("/dashboard/products")
    } catch (error) {
      console.error('Error creating product:', error)
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
            <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground">
            Create a new product for your store.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Essential details about your product
              </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter product name"
                      required
                    />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
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
                  </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                      <Label htmlFor="description">Description</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generateDescription}
                        disabled={isGeneratingDescription}
                      >
                    <Bot className="mr-2 h-4 w-4" />
                    {isGeneratingDescription ? "Generating..." : "Generate with AI"}
                      </Button>
                    </div>
                    <Textarea
                      id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe your product..."
                      rows={4}
                    />
                  </div>

              <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => handleInputChange("tags", e.target.value)}
                  placeholder="Enter tags separated by commas"
                />
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>
                Set your product pricing and costs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="price">Price (₦) *</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generatePrice}
                      disabled={isGeneratingPrice}
                    >
                      <DollarSign className="mr-2 h-4 w-4" />
                      {isGeneratingPrice ? "Generating..." : "AI Suggest"}
                    </Button>
                  </div>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="0.00"
                        required
                      />
                    </div>
                <div className="space-y-2">
                  <Label htmlFor="comparePrice">Compare Price (₦)</Label>
                      <Input
                        id="comparePrice"
                        type="number"
                        value={formData.comparePrice}
                        onChange={(e) => handleInputChange("comparePrice", e.target.value)}
                    placeholder="0.00"
                      />
                    </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost (₦)</Label>
                      <Input
                        id="cost"
                        type="number"
                        value={formData.cost}
                        onChange={(e) => handleInputChange("cost", e.target.value)}
                    placeholder="0.00"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Inventory */}
              <Card>
                <CardHeader>
                  <CardTitle>Inventory</CardTitle>
              <CardDescription>
                Manage stock levels and inventory tracking
              </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => handleInputChange("sku", e.target.value)}
                    placeholder="Stock Keeping Unit"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Track Inventory</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically track stock levels
                    </p>
                  </div>
                    <Switch
                      checked={formData.trackInventory}
                      onCheckedChange={(checked) => handleInputChange("trackInventory", checked)}
                    />
                  </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Backorders</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow customers to order when out of stock
                    </p>
                    </div>
                    <Switch
                      checked={formData.allowBackorder}
                      onCheckedChange={(checked) => handleInputChange("allowBackorder", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Digital Product</Label>
                    <p className="text-sm text-muted-foreground">
                      This product is digital (no shipping required)
                    </p>
                  </div>
                    <Switch
                      checked={formData.isDigital}
                      onCheckedChange={(checked) => handleInputChange("isDigital", checked)}
                    />
                  </div>

                  {!formData.isDigital && (
                      <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Requires Shipping</Label>
                      <p className="text-sm text-muted-foreground">
                        This product needs to be shipped
                      </p>
                    </div>
                        <Switch
                          checked={formData.requiresShipping}
                          onCheckedChange={(checked) => handleInputChange("requiresShipping", checked)}
                        />
                      </div>
                )}
                        </div>
                </CardContent>
              </Card>

          {/* Images */}
              <Card>
                <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>
                Upload images of your product
              </CardDescription>
                </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <label className="aspect-square bg-muted rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors">
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Upload Image</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
              <CardDescription>
                Set the product status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
                </CardContent>
              </Card>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/products")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
      <Toaster />
    </DashboardLayout>
  )
}
