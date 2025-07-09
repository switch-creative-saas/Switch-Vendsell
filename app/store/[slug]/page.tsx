"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

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
  // Fetch store by slug
  const { data: store, error } = await supabase
    .from('stores')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error || !store) return null

  // Fetch products for this store
  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', store.id)
  // You can add more product fields as needed

  return {
    name: store.name,
    tagline: store.settings?.tagline || store.tagline || '',
    description: store.settings?.description || store.description || '',
    selectedTheme: store.theme || 'modern-minimal',
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
      price: p.price,
      image: (p.images && p.images.length > 0) ? p.images[0] : 'https://source.unsplash.com/random/400x400',
      rating: 5,
    })) : [],
  }
}

export default function PublicStorePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params?.slug as string
  const previewThemeId = searchParams.get("theme")
  const [store, setStore] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    fetchStoreData(slug).then((data) => {
      setStore(data)
      setLoading(false)
    })
  }, [slug])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!store) return <div className="min-h-screen flex items-center justify-center">Store not found</div>

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
        <h1 className="text-4xl font-bold mb-2">{store.name}</h1>
        <p className="text-lg text-muted-foreground mb-2">{store.tagline}</p>
        <p className="text-base text-muted-foreground mb-4">{store.description}</p>
      </div>
      {/* Product Grid */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {store.products.map((product: any) => (
            <Card key={product.id} className={`h-full flex flex-col ${currentTheme.card}`}>
              <CardHeader>
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-2" />
                <CardTitle className="text-lg font-bold">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl font-semibold" style={{ color: colors.secondary }}>₦{product.price.toLocaleString()}</span>
                  <Badge variant="outline" className="text-xs">In Stock</Badge>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className={`h-4 w-4 ${star <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill={star <= Math.round(product.rating) ? 'currentColor' : 'none'} />
                  ))}
                  <span className="text-xs text-muted-foreground">{product.rating}</span>
                </div>
                <Button className="w-full mt-2" style={{ backgroundColor: currentTheme.accent(colors), color: '#fff' }}>Add to Cart</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 