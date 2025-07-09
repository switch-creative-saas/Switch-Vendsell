"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Upload, X, Bot, Wand2, Save, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/dashboard-layout"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const categories = [
  "Fashion & Clothing",
  "Electronics & Gadgets",
  "Food & Beverages",
  "Beauty & Cosmetics",
  "Home & Garden",
  "Books & Education",
  "Sports & Fitness",
  "Arts & Crafts",
  "Automotive",
  "Health & Wellness",
  "Jewelry & Accessories",
  "Baby & Kids",
  "Other",
]

export default function NewProductPage() {
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
      alert("Please enter product name and category first")
      return
    }

    setIsGeneratingDescription(true)
    // Simulate AI description generation
    setTimeout(() => {
      const sampleDescription = `Discover the perfect ${formData.name.toLowerCase()} that combines traditional Nigerian craftsmanship with modern style. This premium ${formData.category.toLowerCase()} piece is carefully crafted using high-quality materials and attention to detail. Perfect for special occasions or everyday wear, this item showcases the rich cultural heritage of Nigeria while meeting contemporary fashion standards. Available in multiple sizes and colors to suit your personal style.`

      handleInputChange("description", sampleDescription)
      setIsGeneratingDescription(false)
    }, 2000)
  }

  const generatePrice = async () => {
    if (!formData.category) {
      alert("Please select a category first")
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
    }, 1500)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      // Insert product into 'products' table
      // TODO: Replace with Appwrite logic
      toast({ title: "Product created!", variant: "default" })
      router.push("/dashboard/products")
    } catch (err: any) {
      toast({ title: "Error creating product", description: err.message, variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/products">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Add New Product</h1>
              <p className="text-muted-foreground mt-1">Create a new product for your store</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button form="product-form" type="submit" className="bg-blue-500 hover:bg-blue-600" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </div>

        <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Essential details about your product</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Ankara Dress Set"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="description">Description</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generateDescription}
                        disabled={isGeneratingDescription}
                      >
                        {isGeneratingDescription ? (
                          <>
                            <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Bot className="h-4 w-4 mr-2" />
                            AI Generate
                          </>
                        )}
                      </Button>
                    </div>
                    <Textarea
                      id="description"
                      placeholder="Describe your product..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      placeholder="e.g. ankara, dress, fashion (comma separated)"
                      value={formData.tags}
                      onChange={(e) => handleInputChange("tags", e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Separate tags with commas to help customers find your product
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Product Images */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                  <CardDescription>Upload high-quality images of your product</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Image Upload */}
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB each</p>
                      </label>
                    </div>

                    {/* Image Preview */}
                    {images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`Product ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            {index === 0 && <Badge className="absolute bottom-1 left-1 text-xs">Main</Badge>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Pricing</CardTitle>
                      <CardDescription>Set your product pricing</CardDescription>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generatePrice}
                      disabled={isGeneratingPrice}
                    >
                      {isGeneratingPrice ? (
                        <>
                          <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                          Suggesting...
                        </>
                      ) : (
                        <>
                          <Bot className="h-4 w-4 mr-2" />
                          AI Suggest Price
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price">Price (₦) *</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="25000"
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="comparePrice">Compare at Price (₦)</Label>
                      <Input
                        id="comparePrice"
                        type="number"
                        placeholder="30000"
                        value={formData.comparePrice}
                        onChange={(e) => handleInputChange("comparePrice", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Show customers the original price</p>
                    </div>
                    <div>
                      <Label htmlFor="cost">Cost per item (₦)</Label>
                      <Input
                        id="cost"
                        type="number"
                        placeholder="15000"
                        value={formData.cost}
                        onChange={(e) => handleInputChange("cost", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">For profit calculations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Product Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Inventory */}
              <Card>
                <CardHeader>
                  <CardTitle>Inventory</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      placeholder="PROD-001"
                      value={formData.sku}
                      onChange={(e) => handleInputChange("sku", e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="trackInventory">Track inventory</Label>
                    <Switch
                      id="trackInventory"
                      checked={formData.trackInventory}
                      onCheckedChange={(checked) => handleInputChange("trackInventory", checked)}
                    />
                  </div>

                  {formData.trackInventory && (
                    <div>
                      <Label htmlFor="stock">Stock Quantity</Label>
                      <Input
                        id="stock"
                        type="number"
                        placeholder="100"
                        value={formData.stock}
                        onChange={(e) => handleInputChange("stock", e.target.value)}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Label htmlFor="allowBackorder">Allow backorders</Label>
                    <Switch
                      id="allowBackorder"
                      checked={formData.allowBackorder}
                      onCheckedChange={(checked) => handleInputChange("allowBackorder", checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isDigital">Digital product</Label>
                    <Switch
                      id="isDigital"
                      checked={formData.isDigital}
                      onCheckedChange={(checked) => handleInputChange("isDigital", checked)}
                    />
                  </div>

                  {!formData.isDigital && (
                    <>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="requiresShipping">Requires shipping</Label>
                        <Switch
                          id="requiresShipping"
                          checked={formData.requiresShipping}
                          onCheckedChange={(checked) => handleInputChange("requiresShipping", checked)}
                        />
                      </div>

                      {formData.requiresShipping && (
                        <div>
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input
                            id="weight"
                            type="number"
                            step="0.1"
                            placeholder="0.5"
                            value={formData.weight}
                            onChange={(e) => handleInputChange("weight", e.target.value)}
                          />
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Tax */}
              <Card>
                <CardHeader>
                  <CardTitle>Tax</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="taxable">Taxable product</Label>
                    <Switch
                      id="taxable"
                      checked={formData.taxable}
                      onCheckedChange={(checked) => handleInputChange("taxable", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
