"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Palette,
  Eye,
  Save,
  RefreshCw,
  Monitor,
  Smartphone,
  Tablet,
  Upload,
  Check,
  Crown,
  Wand2,
  Globe,
  Settings,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/DashboardLayout"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useTheme } from "next-themes"
import { useUser } from "@/contexts/UserContext"
import { DatabaseService } from "@/lib/database"

const themes = [
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Clean and modern design perfect for fashion brands",
    preview: "/placeholder.svg?height=200&width=300",
    isPremium: false,
    colors: { primary: "#3B82F6", secondary: "#F59E0B", accent: "#10B981" },
    category: "Fashion",
  },
  {
    id: "nigerian-heritage",
    name: "Nigerian Heritage",
    description: "Celebrate Nigerian culture with traditional patterns",
    preview: "/placeholder.svg?height=200&width=300",
    isPremium: false,
    colors: { primary: "#DC2626", secondary: "#F59E0B", accent: "#059669" },
    category: "Cultural",
  },
  {
    id: "tech-store",
    name: "Tech Store",
    description: "Perfect for electronics and gadget stores",
    preview: "/placeholder.svg?height=200&width=300",
    isPremium: false,
    colors: { primary: "#1F2937", secondary: "#3B82F6", accent: "#6366F1" },
    category: "Technology",
  },
  {
    id: "artisan-craft",
    name: "Artisan Craft",
    description: "Showcase handmade products with warm tones",
    preview: "/placeholder.svg?height=200&width=300",
    isPremium: true,
    colors: { primary: "#92400E", secondary: "#F59E0B", accent: "#DC2626" },
    category: "Handmade",
  },
  {
    id: "beauty-wellness",
    name: "Beauty & Wellness",
    description: "Elegant design for beauty products",
    preview: "/placeholder.svg?height=200&width=300",
    isPremium: true,
    colors: { primary: "#EC4899", secondary: "#8B5CF6", accent: "#F59E0B" },
    category: "Beauty",
  },
  {
    id: "food-restaurant",
    name: "Food & Restaurant",
    description: "Appetizing design for food businesses",
    preview: "/placeholder.svg?height=200&width=300",
    isPremium: true,
    colors: { primary: "#DC2626", secondary: "#F59E0B", accent: "#059669" },
    category: "Food",
  },
]

const colorPresets = [
  { name: "Ocean Blue", primary: "#0EA5E9", secondary: "#F59E0B", accent: "#10B981" },
  { name: "Forest Green", primary: "#059669", secondary: "#F59E0B", accent: "#3B82F6" },
  { name: "Sunset Orange", primary: "#EA580C", secondary: "#3B82F6", accent: "#10B981" },
  { name: "Royal Purple", primary: "#7C3AED", secondary: "#F59E0B", accent: "#EC4899" },
  { name: "Nigerian Green", primary: "#059669", secondary: "#FFFFFF", accent: "#059669" },
]

export default function StoreDesignPage() {
  const { store, refreshStore } = useUser()
  const [selectedTheme, setSelectedTheme] = useState("modern-minimal")
  const [previewDevice, setPreviewDevice] = useState("desktop")
  const [customColors, setCustomColors] = useState({
    primary: "#3B82F6",
    secondary: "#F59E0B",
    accent: "#10B981",
  })
  const [storeSettings, setStoreSettings] = useState({
    storeName: "Adunni Fashions",
    tagline: "Premium Nigerian Fashion & Traditional Wear",
    description:
      "Discover authentic Nigerian fashion with modern style. From traditional Ankara dresses to contemporary designs.",
    logo: "",
    banner: "",
    showPrices: true,
    showStock: true,
    enableWishlist: true,
    enableReviews: true,
    socialProof: true,
    whatsappIntegration: true,
    
  })
  const [activeTab, setActiveTab] = useState("themes")
  const [previewTheme, setPreviewTheme] = useState<null | typeof themes[0]>(null)
  const { theme, setTheme } = useTheme()
  const [previewSection, setPreviewSection] = useState<'home' | 'product'>('home')
  const [storeSlug, setStoreSlug] = useState<string | null>(null)
  const [storeId, setStoreId] = useState<string | null>(null)

  // Fetch current user's store on mount
  useEffect(() => {
    if (!store) return
    setStoreSlug(store.slug)
    setStoreId(store.id)
    if (store.settings) {
      setStoreSettings({
        ...store.settings,
        storeName: store.settings.storeName || store.name,
        tagline: store.settings.tagline || '',
        description: store.settings.description || store.description || '',
        logo: store.settings.logo || store.logo_url || '',
        banner: store.settings.banner || store.banner_url || '',
        showPrices: store.settings.showPrices ?? true,
        showStock: store.settings.showStock ?? true,
        enableWishlist: store.settings.enableWishlist ?? true,
        enableReviews: store.settings.enableReviews ?? true,
        socialProof: store.settings.socialProof ?? true,
        whatsappIntegration: store.settings.whatsappIntegration ?? true,
      })
      if (store.settings.customColors) setCustomColors(store.settings.customColors)
    }
    if (store.theme) setSelectedTheme(store.theme)
    if (store.theme_color) setCustomColors((prev) => ({ ...prev, primary: store.theme_color }))
  }, [store])

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId)
    const theme = themes.find((t) => t.id === themeId)
    if (theme) {
      setCustomColors(theme.colors)
    }
  }

  const handleColorPreset = (preset: (typeof colorPresets)[0]) => {
    setCustomColors({
      primary: preset.primary,
      secondary: preset.secondary,
      accent: preset.accent,
    })
  }

  const handleSettingChange = (key: string, value: string | boolean) => {
    setStoreSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = async () => {
    if (!storeId) {
      alert('No store found for this user.')
      return
    }
    const updates: any = {
      theme: selectedTheme,
      theme_color: customColors.primary,
      settings: {
        ...storeSettings,
        customColors,
      },
    }
    try {
      await DatabaseService.updateStore(storeId, updates)
      alert('Design saved!')
      refreshStore()
    } catch (e: any) {
      alert('Failed to save design: ' + (e.message || e))
    }
  }

  const selectedThemeData = themes.find((t) => t.id === selectedTheme)

  // Helper: theme-specific styles
  const themeStyles = {
    'modern-minimal': {
      fontFamily: 'Inter, sans-serif',
      card: 'rounded-2xl bg-white dark:bg-zinc-900 shadow-md',
      accent: customColors.accent,
    },
    'tech-store': {
      fontFamily: 'Roboto Mono, monospace',
      card: 'rounded-lg bg-zinc-900 text-white shadow-lg',
      accent: customColors.accent,
    },
    'nigerian-heritage': {
      fontFamily: 'Merriweather, serif',
      card: 'rounded-xl bg-yellow-50 dark:bg-yellow-900/30 shadow',
      accent: customColors.accent,
    },
    'artisan-craft': {
      fontFamily: 'Quicksand, sans-serif',
      card: 'rounded-xl bg-orange-50 dark:bg-orange-900/30 shadow',
      accent: customColors.accent,
    },
    'beauty-wellness': {
      fontFamily: 'Playfair Display, serif',
      card: 'rounded-2xl bg-pink-50 dark:bg-pink-900/30 shadow-lg',
      accent: customColors.accent,
    },
    'food-restaurant': {
      fontFamily: 'Nunito, sans-serif',
      card: 'rounded-xl bg-red-50 dark:bg-red-900/30 shadow',
      accent: customColors.accent,
    },
  } as const;
  type ThemeKey = keyof typeof themeStyles;
  const safeTheme = (Object.keys(themeStyles) as ThemeKey[]).includes(selectedTheme as ThemeKey)
    ? (selectedTheme as ThemeKey)
    : 'modern-minimal';
  const currentTheme = themeStyles[safeTheme];

  // Add random color generator for AI Color Suggestions
  const handleAIGenerateColors = () => {
    function randomColor() {
      return "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, "0");
    }
    setCustomColors({
      primary: randomColor(),
      secondary: randomColor(),
      accent: randomColor(),
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Store Design</h1>
            <p className="text-muted-foreground mt-1">Customize your store's look and feel</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Link href="/store/preview" target="_blank">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview Store
              </Button>
            </Link>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Design Controls */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="themes">Themes</TabsTrigger>
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
              </TabsList>

              {/* Themes Tab */}
              <TabsContent value="themes" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Palette className="h-5 w-5" />
                      <span>Choose Your Theme</span>
                    </CardTitle>
                    <CardDescription>Select a pre-designed theme that matches your brand</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {themes.map((theme) => (
                        <motion.div
                          key={theme.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          tabIndex={0}
                          className={`relative border-2 rounded-2xl p-0 cursor-pointer transition-all focus:ring-2 focus:ring-primary focus:outline-none group hover:shadow-2xl hover:border-primary bg-white dark:bg-zinc-900 overflow-hidden ${
                            selectedTheme === theme.id ? "border-primary" : "border-border hover:border-primary"
                          }`}
                          onClick={() => {
                            handleThemeSelect(theme.id);
                            setCustomColors(theme.colors);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") handleThemeSelect(theme.id)
                          }}
                          style={{ boxShadow: selectedTheme === theme.id ? '0 4px 24px 0 rgba(59,130,246,0.10)' : undefined }}
                        >
                          {/* Shopify-style store preview */}
                          <div className="w-full">
                            {/* Store Header */}
                            <div className="flex items-center justify-between px-4 py-2" style={{ background: theme.colors.primary }}>
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded bg-white flex items-center justify-center font-bold text-lg text-blue-500 shadow">S</div>
                                <span className="font-bold text-white text-sm">{theme.name}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-white text-xs">Home</span>
                                <span className="text-white text-xs">Shop</span>
                                <span className="text-white text-xs">About</span>
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                              </div>
                            </div>
                            {/* Hero/Banner */}
                            <div className="h-16 flex items-center justify-center text-white font-bold text-xs" style={{ background: theme.colors.secondary }}>
                              <span>Big Sale! Up to 50% Off</span>
                            </div>
                            {/* Product Grid */}
                            <div className="grid grid-cols-2 gap-2 p-3 bg-white dark:bg-zinc-900">
                              {[1,2,3,4].map((i) => (
                                <div key={i} className="rounded-lg border bg-gray-50 dark:bg-zinc-800 flex flex-col items-center p-2 shadow-sm">
                                  <div className="w-16 h-16 rounded bg-gray-200 dark:bg-zinc-700 mb-2 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-300 dark:text-zinc-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
                                  </div>
                                  <div className="h-3 w-16 bg-gray-200 dark:bg-zinc-600 rounded mb-1" />
                                  <div className="h-2 w-10 bg-gray-300 dark:bg-zinc-700 rounded mb-1" />
                                  <div className="h-4 w-12 bg-blue-100 dark:bg-blue-900 rounded text-blue-600 dark:text-blue-200 text-xs flex items-center justify-center font-semibold mt-1">₦25,000</div>
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* Theme Info & Actions */}
                          <div className="p-4 border-t bg-white dark:bg-zinc-900">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">{theme.category}</Badge>
                                {theme.isPremium && (
                                  <Badge className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 hover:bg-purple-100">Premium</Badge>
                                )}
                              </div>
                              <div className="flex space-x-1">
                                <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: theme.colors.primary }} />
                                <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: theme.colors.secondary }} />
                                <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: theme.colors.accent }} />
                              </div>
                            </div>
                            <h3 className="font-semibold text-foreground mb-1 mt-1 text-sm">{theme.name}</h3>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{theme.description}</p>
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPreviewTheme(theme)
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Preview Mockup
                              </Button>
                              {storeSlug && (
                                <a
                                  href={`/store/${storeSlug}?theme=${theme.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full"
                                >
                                  <Button size="sm" variant="secondary" className="w-full">
                                    <Globe className="h-4 w-4 mr-2" />
                                    Preview Live Store
                                  </Button>
                                </a>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    {/* Theme Preview Modal */}
                    <Dialog open={!!previewTheme} onOpenChange={() => setPreviewTheme(null)}>
                      <DialogContent className="max-w-lg w-full">
                        {previewTheme && (
                          <>
                            <DialogHeader>
                              <DialogTitle className="flex items-center space-x-2">
                                <Monitor className="h-5 w-5" />
                                <span>{previewTheme.name}</span>
                                {previewTheme.isPremium && (
                                  <Badge className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 hover:bg-purple-100 ml-2">
                                    <Crown className="h-3 w-3 mr-1" />
                                    Premium
                                  </Badge>
                                )}
                              </DialogTitle>
                              <DialogDescription>{previewTheme.description}</DialogDescription>
                            </DialogHeader>
                            <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                              <Monitor className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <div className="flex items-center space-x-2 mb-4">
                              <span className="text-sm text-muted-foreground">Colors:</span>
                              <div className="flex space-x-1">
                                <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: previewTheme.colors.primary }} />
                                <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: previewTheme.colors.secondary }} />
                                <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: previewTheme.colors.accent }} />
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="w-full"
                              onClick={() => {
                                setSelectedTheme(previewTheme.id)
                                setCustomColors(previewTheme.colors)
                                setPreviewTheme(null)
                              }}
                            >
                              Apply This Theme
                            </Button>
                          </>
                        )}
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Colors Tab */}
              <TabsContent value="colors" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Color Customization</CardTitle>
                    <CardDescription>Customize your brand colors</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Color Presets */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">Color Presets</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {colorPresets.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => handleColorPreset(preset)}
                            className="p-3 border rounded-lg hover:border-border transition-colors text-left"
                          >
                            <div className="flex space-x-2 mb-2">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.primary }} />
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.secondary }} />
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.accent }} />
                            </div>
                            <p className="text-sm font-medium">{preset.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Colors */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Custom Colors</Label>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="primary-color">Primary Color</Label>
                          <div className="flex items-center space-x-2 mt-1">
                            <input
                              type="color"
                              id="primary-color"
                              value={customColors.primary}
                              onChange={(e) => setCustomColors((prev) => ({ ...prev, primary: e.target.value }))}
                              className="w-12 h-10 border rounded cursor-pointer"
                            />
                            <Input
                              value={customColors.primary}
                              onChange={(e) => setCustomColors((prev) => ({ ...prev, primary: e.target.value }))}
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="secondary-color">Secondary Color</Label>
                          <div className="flex items-center space-x-2 mt-1">
                            <input
                              type="color"
                              id="secondary-color"
                              value={customColors.secondary}
                              onChange={(e) => setCustomColors((prev) => ({ ...prev, secondary: e.target.value }))}
                              className="w-12 h-10 border rounded cursor-pointer"
                            />
                            <Input
                              value={customColors.secondary}
                              onChange={(e) => setCustomColors((prev) => ({ ...prev, secondary: e.target.value }))}
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="accent-color">Accent Color</Label>
                          <div className="flex items-center space-x-2 mt-1">
                            <input
                              type="color"
                              id="accent-color"
                              value={customColors.accent}
                              onChange={(e) => setCustomColors((prev) => ({ ...prev, accent: e.target.value }))}
                              className="w-12 h-10 border rounded cursor-pointer"
                            />
                            <Input
                              value={customColors.accent}
                              onChange={(e) => setCustomColors((prev) => ({ ...prev, accent: e.target.value }))}
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Color Suggestion */}
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Wand2 className="h-5 w-5 text-primary" />
                        <span className="font-medium text-foreground">AI Color Suggestions</span>
                      </div>
                      <p className="text-sm text-primary mb-3">
                        Get AI-powered color recommendations based on your store category and products.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-border text-foreground"
                        onClick={handleAIGenerateColors}
                      >
                        Generate Color Palette
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Store Content</CardTitle>
                    <CardDescription>Customize your store's text and images</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="store-name">Store Name</Label>
                      <Input
                        id="store-name"
                        value={storeSettings.storeName}
                        onChange={(e) => handleSettingChange("storeName", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="tagline">Tagline</Label>
                      <Input
                        id="tagline"
                        placeholder="A catchy tagline for your store"
                        value={storeSettings.tagline}
                        onChange={(e) => handleSettingChange("tagline", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Store Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe what your store offers..."
                        rows={3}
                        value={storeSettings.description}
                        onChange={(e) => handleSettingChange("description", e.target.value)}
                      />
                    </div>

                    {/* Logo Upload */}
                    <div>
                      <Label>Store Logo</Label>
                      <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload your logo</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">PNG, JPG up to 2MB</p>
                      </div>
                    </div>

                    {/* Banner Upload */}
                    <div>
                      <Label>Store Banner</Label>
                      <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload your banner</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">Recommended: 1200x400px</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Features Tab */}
              <TabsContent value="features" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Store Features</CardTitle>
                    <CardDescription>Enable or disable store functionality</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="show-prices">Show Prices</Label>
                          <p className="text-sm text-muted-foreground">Display product prices on your store</p>
                        </div>
                        <Switch
                          id="show-prices"
                          checked={storeSettings.showPrices}
                          onCheckedChange={(checked) => handleSettingChange("showPrices", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="show-stock">Show Stock Levels</Label>
                          <p className="text-sm text-muted-foreground">Display inventory levels to customers</p>
                        </div>
                        <Switch
                          id="show-stock"
                          checked={storeSettings.showStock}
                          onCheckedChange={(checked) => handleSettingChange("showStock", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="enable-wishlist">Wishlist</Label>
                          <p className="text-sm text-muted-foreground">Allow customers to save favorite products</p>
                        </div>
                        <Switch
                          id="enable-wishlist"
                          checked={storeSettings.enableWishlist}
                          onCheckedChange={(checked) => handleSettingChange("enableWishlist", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="enable-reviews">Product Reviews</Label>
                          <p className="text-sm text-muted-foreground">Let customers leave product reviews</p>
                        </div>
                        <Switch
                          id="enable-reviews"
                          checked={storeSettings.enableReviews}
                          onCheckedChange={(checked) => handleSettingChange("enableReviews", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="social-proof">Social Proof</Label>
                          <p className="text-sm text-muted-foreground">Show recent purchases and customer count</p>
                        </div>
                        <Switch
                          id="social-proof"
                          checked={storeSettings.socialProof}
                          onCheckedChange={(checked) => handleSettingChange("socialProof", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="whatsapp-integration">WhatsApp Integration</Label>
                          <p className="text-sm text-muted-foreground">Enable WhatsApp chat button</p>
                        </div>
                        <Switch
                          id="whatsapp-integration"
                          checked={storeSettings.whatsappIntegration}
                          onCheckedChange={(checked) => handleSettingChange("whatsappIntegration", checked)}
                        />
                      </div>
                    </div>

                    {/* Nigerian-specific features */}
                    <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">🇳🇬</span>
                        <span className="font-medium text-green-800 dark:text-green-300">Nigerian Features</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-green-700 dark:text-green-300">Naira Currency Display</span>
                          <Badge className="bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-300 hover:bg-green-100">Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-green-700 dark:text-green-300">Nigerian States Shipping</span>
                          <Badge className="bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-300 hover:bg-green-100">Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-green-700 dark:text-green-300">Local Payment Gateways</span>
                          <Badge className="bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-300 hover:bg-green-100">Enabled</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="h-5 w-5" />
                    <span>Live Preview</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={previewDevice === "desktop" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPreviewDevice("desktop")}
                    >
                      <Monitor className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={previewDevice === "tablet" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPreviewDevice("tablet")}
                    >
                      <Tablet className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={previewDevice === "mobile" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPreviewDevice("mobile")}
                    >
                      <Smartphone className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      aria-label="Toggle light/dark preview"
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      className="ml-2"
                    >
                      {theme === "dark" ? (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71" /><circle cx="12" cy="12" r="5" /></svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
                      )}
                    </Button>
                  </div>
                </div>
                {/* Section Toggle */}
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant={previewSection === 'home' ? 'default' : 'outline'} onClick={() => setPreviewSection('home')}>Home</Button>
                  <Button size="sm" variant={previewSection === 'product' ? 'default' : 'outline'} onClick={() => setPreviewSection('product')}>Product</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className={`border rounded-2xl overflow-hidden shadow-lg bg-background transition-all relative mx-auto ${
                    previewDevice === "mobile"
                      ? "max-w-xs"
                      : previewDevice === "tablet"
                      ? "max-w-md"
                      : "w-full max-w-2xl"
                  }`}
                  style={{ minHeight: previewDevice === "mobile" ? 600 : previewDevice === "tablet" ? 500 : 400, fontFamily: currentTheme.fontFamily }}
                >
                  {/* THEME-SPECIFIC PREVIEW */}
                  {previewSection === 'home' ? (
                    <div className="flex flex-col h-full">
                      {/* Shopify-style Header */}
                      <div
                        className="w-full flex items-center justify-between px-6 py-3"
                        style={{ background: customColors.primary, borderBottom: `2px solid ${customColors.primary}`, fontFamily: currentTheme.fontFamily }}
                      >
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded bg-white/20 flex items-center justify-center font-bold text-lg" style={{ color: '#fff' }}>
                            {storeSettings.logo ? (
                              <img src={storeSettings.logo} alt="Logo" className="object-cover w-full h-full rounded" />
                            ) : (
                              <span>{storeSettings.storeName?.[0] || 'S'}</span>
                            )}
                          </div>
                          <span className="font-bold text-lg text-white">{storeSettings.storeName}</span>
                        </div>
                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                          <span className="cursor-pointer hover:underline transition-colors text-white">Home</span>
                          <span className="cursor-pointer hover:underline transition-colors text-white">Shop</span>
                          <span className="cursor-pointer hover:underline transition-colors text-white">About</span>
                          <span className="cursor-pointer hover:underline transition-colors text-white">Contact</span>
                        </nav>
                        {/* Icons */}
                        <div className="flex items-center gap-4">
                          {/* Search Icon */}
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                          {/* Cart Icon */}
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                          {/* User Icon */}
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4" /><path d="M5.5 21a7.5 7.5 0 0 1 13 0" /></svg>
                        </div>
                      </div>
                      {/* Banner/Hero Section */}
                      <div
                        className="h-28 sm:h-36 w-full flex items-center justify-center relative"
                        style={{ background: customColors.primary, fontFamily: currentTheme.fontFamily }}
                      >
                        {storeSettings.banner ? (
                          <img
                            src={storeSettings.banner}
                            alt="Store Banner"
                            className="object-cover w-full h-full absolute inset-0"
                          />
                        ) : (
                          <span className="text-white text-lg font-bold z-10">Store Banner</span>
                        )}
                        <div className="absolute inset-0 bg-black/20" />
                      </div>
                      {/* Logo & Name (keep for mobile below banner) */}
                      <div className="flex md:hidden items-center space-x-3 px-4 -mt-8 z-10">
                        <div className="w-16 h-16 rounded-full border-4 border-background bg-white flex items-center justify-center overflow-hidden shadow-lg">
                          {storeSettings.logo ? (
                            <img src={storeSettings.logo} alt="Logo" className="object-cover w-full h-full" />
                          ) : (
                            <span className="text-2xl font-bold" style={{ color: currentTheme.accent }}>A</span>
                          )}
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-foreground leading-tight">{storeSettings.storeName}</h2>
                          <p className="text-xs text-muted-foreground">{storeSettings.tagline}</p>
                        </div>
                      </div>
                      {/* Navigation for mobile (below banner) */}
                      <nav className="md:hidden flex items-center justify-center gap-6 py-3 border-b border-border text-sm font-medium" style={{ background: customColors.primary, color: '#fff' }}>
                        <span className="cursor-pointer hover:text-primary transition-colors">Home</span>
                        <span className="cursor-pointer hover:text-primary transition-colors">Shop</span>
                        <span className="cursor-pointer hover:text-primary transition-colors">About</span>
                        <span className="cursor-pointer hover:text-primary transition-colors">Contact</span>
                      </nav>
                      {/* Product Grid */}
                      <div className="flex-1 overflow-y-auto p-4 bg-background">
                        <div className="grid grid-cols-2 gap-3">
                          {[1, 2, 3, 4].map((item) => (
                            <div key={item} className={`p-3 flex flex-col items-center ${currentTheme.card}`}>
                              <div className="aspect-square bg-muted rounded mb-2 w-full flex items-center justify-center">
                                <img src={`https://source.unsplash.com/seed/${selectedTheme + item}/200x200`} alt="Product" className="object-cover w-full h-full rounded" />
                              </div>
                              <p className="text-sm font-medium text-foreground">Product {item}</p>
                              <div className="flex items-center gap-1 mb-1">
                                {[1,2,3,4,5].map((star) => <Star key={star} className={`h-3 w-3 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill={star <= 4 ? 'currentColor' : 'none'} />)}
                                <span className="text-xs text-muted-foreground">4.0</span>
                              </div>
                              {storeSettings.showPrices && (
                                <p className="text-sm font-semibold" style={{ color: customColors.secondary }}>
                                  ₦25,000
                                </p>
                              )}
                              {storeSettings.showStock && <p className="text-xs text-muted-foreground">In Stock</p>}
                              {storeSettings.enableWishlist && (
                                <Button size="icon" variant="ghost" className="mt-1">
                                  <svg className="h-4 w-4 text-pink-500" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* WhatsApp Button */}
                      {storeSettings.whatsappIntegration && (
                        <div className="p-4 border-t bg-background">
                          <Button size="sm" className="w-full" style={{ backgroundColor: "#25D366", color: "white" }}>
                            Chat on WhatsApp
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Product Page Preview
                    <div className="flex flex-col h-full">
                      {/* Header/Banner */}
                      <div
                        className={`h-20 w-full flex items-center justify-center relative`}
                        style={{
                          background: customColors.primary,
                          fontFamily: currentTheme.fontFamily,
                        }}
                      >
                        <span className="text-white text-lg font-bold z-10">Product Banner</span>
                        <div className="absolute inset-0 bg-black/20" />
                      </div>
                      {/* Logo & Name */}
                      <div className="flex items-center space-x-3 px-4 -mt-8 z-10">
                        <div className="w-16 h-16 rounded-full border-4 border-background bg-white flex items-center justify-center overflow-hidden shadow-lg">
                          {storeSettings.logo ? (
                            <img src={storeSettings.logo} alt="Logo" className="object-cover w-full h-full" />
                          ) : (
                            <span className="text-2xl font-bold" style={{ color: currentTheme.accent }}>A</span>
                          )}
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-foreground leading-tight">{storeSettings.storeName}</h2>
                          <p className="text-xs text-muted-foreground">{storeSettings.tagline}</p>
                        </div>
                      </div>
                      {/* Product Card */}
                      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background">
                        <div className={`w-full max-w-xs p-6 ${currentTheme.card} flex flex-col items-center`}>
                          <div className="aspect-square bg-muted rounded mb-4 w-full flex items-center justify-center">
                            <img src={`https://source.unsplash.com/seed/${selectedTheme}-main/300x300`} alt="Product" className="object-cover w-full h-full rounded" />
                          </div>
                          <h3 className="text-lg font-bold mb-1 text-foreground">Featured Product</h3>
                          <div className="flex items-center gap-1 mb-2">
                            {[1,2,3,4,5].map((star) => <Star key={star} className={`h-4 w-4 ${star <= 5 ? 'text-yellow-400' : 'text-gray-300'}`} fill={star <= 5 ? 'currentColor' : 'none'} />)}
                            <span className="text-xs text-muted-foreground">5.0</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">This is a beautiful product that matches your store's vibe. It has all the features and quality you expect.</p>
                          {storeSettings.showPrices && (
                            <p className="text-lg font-semibold mb-2" style={{ color: customColors.secondary }}>
                              ₦25,000
                            </p>
                          )}
                          <Button size="sm" className="w-full mb-2" style={{ backgroundColor: currentTheme.accent, color: '#fff' }}>
                            Add to Cart
                          </Button>
                          {storeSettings.enableWishlist && (
                            <Button size="icon" variant="ghost" className="mt-1">
                              <svg className="h-5 w-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Current Theme Info */}
            {selectedThemeData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Current Theme</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{selectedThemeData.name}</span>
                      {selectedThemeData.isPremium && (
                        <Badge className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 hover:bg-purple-100">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedThemeData.description}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Colors:</span>
                      <div className="flex space-x-1">
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: customColors.primary }}
                        />
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: customColors.secondary }}
                        />
                        <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: customColors.accent }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/store/preview" target="_blank">
                  <Button variant="outline" className="w-full justify-start">
                    <Globe className="h-4 w-4 mr-2" />
                    View Live Store
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset to Default
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Theme
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
