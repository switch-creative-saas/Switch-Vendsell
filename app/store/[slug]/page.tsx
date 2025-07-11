"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart, Heart, Share2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

// --- Theme definitions (copied from dashboard/design/page.tsx) ---
const themes = [
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Clean and modern design perfect for fashion brands",
    isPremium: false,
    colors: { primary: "#3B82F6", secondary: "#F59E0B", accent: "#10B981" },
    category: "Fashion",
  },
  {
    id: "nigerian-heritage",
    name: "Nigerian Heritage",
    description: "Celebrate Nigerian culture with traditional patterns",
    isPremium: false,
    colors: { primary: "#DC2626", secondary: "#F59E0B", accent: "#059669" },
    category: "Cultural",
  },
  {
    id: "tech-store",
    name: "Tech Store",
    description: "Perfect for electronics and gadget stores",
    isPremium: false,
    colors: { primary: "#1F2937", secondary: "#3B82F6", accent: "#6366F1" },
    category: "Technology",
  },
  {
    id: "artisan-craft",
    name: "Artisan Craft",
    description: "Showcase handmade products with warm tones",
    isPremium: true,
    colors: { primary: "#92400E", secondary: "#F59E0B", accent: "#DC2626" },
    category: "Handmade",
  },
  {
    id: "beauty-wellness",
    name: "Beauty & Wellness",
    description: "Elegant design for beauty products",
    isPremium: true,
    colors: { primary: "#EC4899", secondary: "#8B5CF6", accent: "#F59E0B" },
    category: "Beauty",
  },
  {
    id: "food-restaurant",
    name: "Food & Restaurant",
    description: "Appetizing design for food businesses",
    isPremium: true,
    colors: { primary: "#DC2626", secondary: "#F59E0B", accent: "#059669" },
    category: "Food",
  },
]

const themeStyles = {
  'modern-minimal': {
    fontFamily: 'Inter, sans-serif',
    card: 'rounded-2xl bg-white dark:bg-zinc-900 shadow-md',
    header: 'bg-white dark:bg-black text-zinc-900 dark:text-white',
    nav: 'bg-white dark:bg-black',
    accent: (colors: any) => colors.accent,
  },
  'tech-store': {
    fontFamily: 'Roboto Mono, monospace',
    card: 'rounded-lg bg-zinc-900 text-white shadow-lg',
    header: 'bg-zinc-900 text-white',
    nav: 'bg-zinc-800 text-blue-400',
    accent: (colors: any) => colors.accent,
  },
  'nigerian-heritage': {
    fontFamily: 'Merriweather, serif',
    card: 'rounded-xl bg-yellow-50 dark:bg-yellow-900/30 shadow',
    header: 'bg-gradient-to-r from-green-700 to-yellow-500 text-white',
    nav: 'bg-green-800 text-yellow-200',
    accent: (colors: any) => colors.accent,
  },
  'artisan-craft': {
    fontFamily: 'Quicksand, sans-serif',
    card: 'rounded-xl bg-orange-50 dark:bg-orange-900/30 shadow',
    header: 'bg-orange-800 text-white',
    nav: 'bg-orange-700 text-yellow-100',
    accent: (colors: any) => colors.accent,
  },
  'beauty-wellness': {
    fontFamily: 'Playfair Display, serif',
    card: 'rounded-2xl bg-pink-50 dark:bg-pink-900/30 shadow-lg',
    header: 'bg-gradient-to-r from-pink-400 to-purple-400 text-white',
    nav: 'bg-pink-300 text-purple-900',
    accent: (colors: any) => colors.accent,
  },
  'food-restaurant': {
    fontFamily: 'Nunito, sans-serif',
    card: 'rounded-xl bg-red-50 dark:bg-red-900/30 shadow',
    header: 'bg-red-700 text-white',
    nav: 'bg-yellow-600 text-white',
    accent: (colors: any) => colors.accent,
  },
} as const;

type ThemeKey = keyof typeof themeStyles;

// --- Real fetch function using Supabase ---
const fetchStoreData = async (slug: string) => {
  try {
    // Fetch store by slug
    const { data: store, error } = await supabase
      .from('stores')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error || !store) {
      console.error('Error fetching store:', error)
      return null
    }

    // Fetch products for this store
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('*')
      .eq('store_id', store.id)
      .eq('status', 'active')
    
    if (prodError) {
      console.error('Error fetching products:', prodError)
    }

    return {
      name: store.name,
      tagline: store.settings?.tagline || store.description || '',
      description: store.settings?.description || store.description || '',
      selectedTheme: store.settings?.theme || store.theme || 'modern-minimal',
      customColors: store.settings?.customColors || (store.theme_color ? { primary: store.theme_color, secondary: '#F59E0B', accent: '#10B981' } : undefined),
      logo: store.settings?.logo || store.logo_url || '',
      banner: store.settings?.banner || store.banner_url || '',
      showPrices: store.settings?.showPrices ?? true,
      showStock: store.settings?.showStock ?? true,
      enableWishlist: store.settings?.enableWishlist ?? true,
      enableReviews: store.settings?.enableReviews ?? true,
      socialProof: store.settings?.socialProof ?? true,
      whatsappIntegration: store.settings?.whatsappIntegration ?? true,
      products: products && products.length > 0 ? products.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        compare_price: p.compare_price,
        stock_quantity: p.stock_quantity,
        image: (p.images && p.images.length > 0) ? p.images[0] : 'https://source.unsplash.com/random/400x400',
        rating: 5,
      })) : [],
    }
  } catch (error) {
    console.error('Error in fetchStoreData:', error)
    return null
  }
}

export default function PublicStorePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params?.slug as string
  const previewThemeId = searchParams.get("theme")
  const [store, setStore] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      setError("Store slug is required")
      setLoading(false)
      return
    }
    
    setLoading(true)
    setError(null)
    
    fetchStoreData(slug).then((data) => {
      if (data) {
        setStore(data)
      } else {
        setError("Store not found")
      }
      setLoading(false)
    }).catch((err) => {
      console.error('Error loading store:', err)
      setError("Failed to load store")
      setLoading(false)
    })
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading store...</p>
        </div>
      </div>
    )
  }

  if (error || !store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Store Not Found</h1>
          <p className="text-muted-foreground mb-4">
            {error || "The store you're looking for doesn't exist or has been removed."}
          </p>
          <a href="/" className="text-blue-500 hover:underline">
            Return to Switch VendSell
          </a>
        </div>
      </div>
    )
  }

  // Get theme and styles
  const themeIdToUse = previewThemeId || store.selectedTheme
  const theme = themes.find((t) => t.id === themeIdToUse) || themes[0]
  const themeKey = (theme.id in themeStyles ? theme.id : 'modern-minimal') as ThemeKey
  const currentTheme = themeStyles[themeKey]
  const colors = store.customColors || theme.colors

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: currentTheme.fontFamily }}>
      {/* Store Header */}
      <div className={`w-full py-10 mb-8 text-center ${currentTheme.header}`}
        style={{ background: currentTheme.header.includes('gradient') ? undefined : colors.primary }}>
        {store.logo && (
          <img src={store.logo} alt={store.name} className="w-20 h-20 mx-auto mb-4 rounded-lg" />
        )}
        <h1 className="text-4xl font-bold mb-2">{store.name}</h1>
        {store.tagline && <p className="text-lg text-muted-foreground mb-2">{store.tagline}</p>}
        {store.description && <p className="text-base text-muted-foreground mb-4 max-w-2xl mx-auto">{store.description}</p>}
      </div>

      {/* Product Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        {store.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {store.products.map((product: any) => (
              <Card key={product.id} className={`h-full flex flex-col ${currentTheme.card} hover:shadow-lg transition-shadow`}>
                <CardHeader className="p-0">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-48 object-cover rounded-t-lg" 
                  />
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between p-4">
                  <div>
                    <CardTitle className="text-lg font-bold mb-2">{product.name}</CardTitle>
                    {product.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-semibold" style={{ color: colors.secondary }}>
                          ₦{product.price.toLocaleString()}
                        </span>
                        {product.compare_price && product.compare_price > product.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₦{product.compare_price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {store.showStock && (
                        <Badge variant={product.stock_quantity > 0 ? "default" : "destructive"} className="text-xs">
                          {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">(5.0)</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button className="flex-1" style={{ backgroundColor: colors.primary }}>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      {store.enableWishlist && (
                        <Button variant="outline" size="sm">
                          <Heart className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Products Yet</h2>
            <p className="text-muted-foreground mb-4">
              This store hasn't added any products yet. Check back soon!
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-muted py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            Powered by <a href="/" className="text-blue-500 hover:underline">Switch VendSell</a>
          </p>
        </div>
      </footer>
    </div>
  )
} 