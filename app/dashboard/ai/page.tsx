"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Bot,
  Wand2,
  FileText,
  ImageIcon,
  DollarSign,
  TrendingUp,
  Sparkles,
  Copy,
  Download,
  RefreshCw,
  Settings,
  Zap,
  MessageSquare,
  BarChart3,
  PenTool,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard-layout"

const aiTools = [
  {
    id: "product-description",
    name: "Product Description Generator",
    description: "Create compelling product descriptions that sell",
    icon: FileText,
    category: "Content",
    usage: 45,
    limit: 100,
    isPremium: false,
  },
  {
    id: "price-optimizer",
    name: "Smart Price Optimizer",
    description: "AI-powered pricing recommendations based on market data",
    icon: DollarSign,
    category: "Pricing",
    usage: 23,
    limit: 50,
    isPremium: false,
  },
  {
    id: "image-enhancer",
    name: "Product Image Enhancer",
    description: "Automatically enhance and optimize product photos",
    icon: ImageIcon,
    category: "Visual",
    usage: 12,
    limit: 25,
    isPremium: true,
  },
  {
    id: "seo-optimizer",
    name: "SEO Content Optimizer",
    description: "Optimize product titles and descriptions for search engines",
    icon: TrendingUp,
    category: "SEO",
    usage: 8,
    limit: 30,
    isPremium: true,
  },
  {
    id: "social-media",
    name: "Social Media Content",
    description: "Generate engaging social media posts for your products",
    icon: MessageSquare,
    category: "Marketing",
    usage: 15,
    limit: 40,
    isPremium: false,
  },
  {
    id: "analytics-insights",
    name: "Business Insights",
    description: "AI-powered analysis of your store performance",
    icon: BarChart3,
    category: "Analytics",
    usage: 5,
    limit: 20,
    isPremium: true,
  },
]

const recentGenerations = [
  {
    id: 1,
    tool: "Product Description Generator",
    input: "Ankara Dress Set",
    output:
      "Discover the perfect blend of traditional Nigerian craftsmanship and modern style with our stunning Ankara Dress Set. This premium piece features vibrant African print fabric...",
    timestamp: "2024-01-15T10:30:00Z",
    category: "Fashion",
  },
  {
    id: 2,
    tool: "Smart Price Optimizer",
    input: "Traditional Cap",
    output: "Recommended price: ₦8,500 (Market range: ₦7,000 - ₦12,000)",
    timestamp: "2024-01-14T15:45:00Z",
    category: "Accessories",
  },
  {
    id: 3,
    tool: "Social Media Content",
    input: "Gele Headwrap",
    output:
      "✨ Elevate your traditional look with our premium Gele Headwrap! Perfect for weddings, ceremonies, and special occasions. #NigerianFashion #TraditionalWear",
    timestamp: "2024-01-13T12:20:00Z",
    category: "Accessories",
  },
]

const templates = [
  {
    id: "fashion-description",
    name: "Fashion Product Description",
    description: "Perfect for clothing and fashion accessories",
    category: "Fashion",
    example: "Elegant [product] made with premium [material] featuring [unique_features]...",
  },
  {
    id: "electronics-description",
    name: "Electronics Description",
    description: "Technical products with specifications",
    category: "Electronics",
    example: "Advanced [product] with [key_specs] designed for [target_audience]...",
  },
  {
    id: "food-description",
    name: "Food & Beverage Description",
    description: "Appetizing descriptions for food products",
    category: "Food",
    example: "Delicious [product] made with fresh [ingredients] that delivers [taste_profile]...",
  },
  {
    id: "beauty-description",
    name: "Beauty Product Description",
    description: "Compelling copy for beauty and cosmetics",
    category: "Beauty",
    example: "Transform your [skin/hair] with our luxurious [product] enriched with [key_ingredients]...",
  },
]

export default function AIToolsPage() {
  const [activeTab, setActiveTab] = useState("tools")
  const [selectedTool, setSelectedTool] = useState("product-description")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [inputData, setInputData] = useState({
    productName: "",
    category: "",
    features: "",
    targetAudience: "",
    tone: "professional",
    language: "english",
  })

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      const sampleContent = `Discover the perfect ${inputData.productName.toLowerCase()} that combines traditional Nigerian craftsmanship with modern style. This premium ${inputData.category.toLowerCase()} piece is carefully crafted using high-quality materials and attention to detail.

Key Features:
• ${inputData.features || "Premium quality materials"}
• Authentic Nigerian design elements
• Perfect for special occasions
• Available in multiple sizes and colors

Perfect for ${inputData.targetAudience || "fashion-conscious individuals"} who appreciate quality and style. This ${inputData.productName.toLowerCase()} showcases the rich cultural heritage of Nigeria while meeting contemporary fashion standards.

Order now and experience the perfect blend of tradition and modernity!`

      setGeneratedContent(sampleContent)
      setIsGenerating(false)
    }, 2000)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
  }

  const selectedToolData = aiTools.find((tool) => tool.id === selectedTool)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Tools</h1>
            <p className="text-muted-foreground mt-1">Supercharge your store with artificial intelligence</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tools">AI Tools</TabsTrigger>
            <TabsTrigger value="generator">Content Generator</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          {/* AI Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiTools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <tool.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{tool.name}</CardTitle>
                            <Badge variant="outline" className="mt-1">
                              {tool.category}
                            </Badge>
                          </div>
                        </div>
                        {tool.isPremium && (
                          <Badge className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900">Premium</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{tool.description}</p>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Usage this month</span>
                          <span className="font-medium">
                            {tool.usage}/{tool.limit}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(tool.usage / tool.limit) * 100}%` }}
                          />
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => {
                            setSelectedTool(tool.id)
                            setActiveTab("generator")
                          }}
                          disabled={tool.isPremium && tool.usage >= tool.limit}
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Use Tool
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Usage Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Usage Overview</CardTitle>
                <CardDescription>Your AI tool usage this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {aiTools.reduce((sum, tool) => sum + tool.usage, 0)}
                    </div>
                    <p className="text-muted-foreground">Total Generations</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-300 mb-2">
                      {aiTools.filter((tool) => !tool.isPremium).length}
                    </div>
                    <p className="text-muted-foreground">Free Tools Available</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-300 mb-2">
                      {aiTools.filter((tool) => tool.isPremium).length}
                    </div>
                    <p className="text-muted-foreground">Premium Tools</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Generator Tab */}
          <TabsContent value="generator" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bot className="h-5 w-5" />
                    <span>{selectedToolData?.name}</span>
                  </CardTitle>
                  <CardDescription>{selectedToolData?.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="tool-select">Select AI Tool</Label>
                    <Select value={selectedTool} onValueChange={setSelectedTool}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {aiTools.map((tool) => (
                          <SelectItem key={tool.id} value={tool.id}>
                            {tool.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="product-name">Product Name *</Label>
                    <Input
                      id="product-name"
                      placeholder="e.g. Ankara Dress Set"
                      value={inputData.productName}
                      onChange={(e) => setInputData((prev) => ({ ...prev, productName: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={inputData.category}
                      onValueChange={(value) => setInputData((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fashion">Fashion & Clothing</SelectItem>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Beauty">Beauty & Cosmetics</SelectItem>
                        <SelectItem value="Food">Food & Beverages</SelectItem>
                        <SelectItem value="Home">Home & Garden</SelectItem>
                        <SelectItem value="Accessories">Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="features">Key Features</Label>
                    <Textarea
                      id="features"
                      placeholder="List the main features and benefits..."
                      value={inputData.features}
                      onChange={(e) => setInputData((prev) => ({ ...prev, features: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="target-audience">Target Audience</Label>
                    <Input
                      id="target-audience"
                      placeholder="e.g. Fashion-conscious women aged 25-40"
                      value={inputData.targetAudience}
                      onChange={(e) => setInputData((prev) => ({ ...prev, targetAudience: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tone">Tone</Label>
                      <Select
                        value={inputData.tone}
                        onValueChange={(value) => setInputData((prev) => ({ ...prev, tone: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="luxury">Luxury</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="persuasive">Persuasive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={inputData.language}
                        onValueChange={(value) => setInputData((prev) => ({ ...prev, language: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="pidgin">Nigerian Pidgin</SelectItem>
                          <SelectItem value="hausa">Hausa</SelectItem>
                          <SelectItem value="yoruba">Yoruba</SelectItem>
                          <SelectItem value="igbo">Igbo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={!inputData.productName || isGenerating}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Output */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Generated Content</CardTitle>
                    {generatedContent && (
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={handleCopy}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {generatedContent ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <pre className="whitespace-pre-wrap text-sm text-gray-900">{generatedContent}</pre>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>✨ Generated with AI</span>
                        <span>•</span>
                        <span>{generatedContent.length} characters</span>
                        <span>•</span>
                        <span>{generatedContent.split(" ").length} words</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Generate</h3>
                      <p className="text-gray-600">
                        Fill in the details and click generate to create AI-powered content
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Generations</CardTitle>
                <CardDescription>Your AI-generated content history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentGenerations.map((generation) => (
                    <div key={generation.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{generation.tool}</h3>
                          <p className="text-sm text-gray-600">Input: {generation.input}</p>
                          <p className="text-xs text-gray-500">{new Date(generation.timestamp).toLocaleString()}</p>
                        </div>
                        <Badge variant="outline">{generation.category}</Badge>
                      </div>
                      <div className="p-3 bg-gray-50 rounded text-sm text-gray-700">
                        {generation.output.length > 150
                          ? `${generation.output.substring(0, 150)}...`
                          : generation.output}
                      </div>
                      <div className="flex items-center space-x-2 mt-3">
                        <Button variant="outline" size="sm">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Regenerate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Templates</CardTitle>
                <CardDescription>Pre-built templates for different product categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{template.name}</h3>
                          <p className="text-sm text-gray-600">{template.description}</p>
                        </div>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                      <div className="p-3 bg-gray-50 rounded text-sm text-gray-700 mb-3">{template.example}</div>
                      <Button size="sm" variant="outline" className="w-full">
                        <PenTool className="h-3 w-3 mr-2" />
                        Use Template
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
