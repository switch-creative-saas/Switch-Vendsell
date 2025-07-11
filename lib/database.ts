import { supabase } from './supabase'

// Types
export interface Store {
  id: string
  name: string
  slug: string
  description?: string
  category: string
  logo_url?: string
  banner_url?: string
  theme_color?: string
  custom_domain?: string
  owner_id: string
  plan: 'free' | 'pro' | 'enterprise'
  status: 'active' | 'inactive' | 'suspended'
  settings?: any
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  store_id: string
  name: string
  description?: string
  category: string
  price: number
  compare_price?: number
  cost?: number
  sku?: string
  stock_quantity: number
  weight?: number
  tags: string[]
  images: string[]
  is_digital: boolean
  track_inventory: boolean
  allow_backorder: boolean
  requires_shipping: boolean
  taxable: boolean
  status: 'draft' | 'active' | 'out_of_stock' | 'archived'
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  store_id: string
  customer_id: string
  order_number: string
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  total_amount: number
  currency: string
  shipping_address?: any
  billing_address?: any
  items: any[]
  created_at: string
  updated_at: string
}

// Database Service
export class DatabaseService {
  // Store operations
  static async createStore(store: Omit<Store, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('stores')
      .insert(store)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getStore(id: string) {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async getStoresByOwner(ownerId: string) {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async updateStore(id: string, updates: Partial<Store>) {
    const { data, error } = await supabase
      .from('stores')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async deleteStore(id: string) {
    const { error } = await supabase
      .from('stores')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  // Product operations
  static async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getProductsByStore(storeId: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async getProduct(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async updateProduct(id: string, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  // Order operations
  static async createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getOrdersByStore(storeId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async updateOrder(id: string, updates: Partial<Order>) {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Dashboard metrics aggregation
  static async getDashboardMetrics(storeId: string) {
    // Total revenue
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('store_id', storeId)
      .eq('status', 'delivered')
    if (ordersError) throw ordersError
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0)
    // Total orders
    const totalOrders = orders.length
    // Total customers
    const { data: customers, error: customersError } = await supabase
      .from('orders')
      .select('customer_id')
      .eq('store_id', storeId)
    if (customersError) throw customersError
    const uniqueCustomers = new Set(customers.map((o) => o.customer_id)).size
    // Total products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id')
      .eq('store_id', storeId)
    if (productsError) throw productsError
    const totalProducts = products.length
    return {
      totalRevenue,
      totalOrders,
      totalCustomers: uniqueCustomers,
      totalProducts
    }
  }

  // Top products by sales
  static async getTopProducts(storeId: string, limit = 5) {
    // Get all orders for this store
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('items')
      .eq('store_id', storeId)
      .eq('status', 'delivered')
    if (ordersError) throw ordersError
    // Aggregate product sales
    const productSales: Record<string, { count: number, revenue: number }> = {}
    orders.forEach(order => {
      (order.items || []).forEach((item: any) => {
        if (!productSales[item.product_id]) {
          productSales[item.product_id] = { count: 0, revenue: 0 }
        }
        productSales[item.product_id].count += item.quantity || 1
        productSales[item.product_id].revenue += (item.price || 0) * (item.quantity || 1)
      })
    })
    // Get product details
    const productIds = Object.keys(productSales)
    if (productIds.length === 0) return []
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds)
    if (productsError) throw productsError
    // Merge sales data
    return products.map(p => ({
      ...p,
      sales: productSales[p.id].count,
      revenue: productSales[p.id].revenue
    })).sort((a, b) => b.sales - a.sales).slice(0, limit)
  }

  // Sales by location (based on shipping address state)
  static async getSalesByLocation(storeId: string) {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('shipping_address, total_amount')
      .eq('store_id', storeId)
      .eq('status', 'delivered')
    if (error) throw error
    const locationMap: Record<string, { orders: number, revenue: number }> = {}
    orders.forEach(order => {
      const state = order.shipping_address?.state || 'Unknown'
      if (!locationMap[state]) locationMap[state] = { orders: 0, revenue: 0 }
      locationMap[state].orders += 1
      locationMap[state].revenue += order.total_amount || 0
    })
    return Object.entries(locationMap).map(([state, data]) => ({
      state,
      ...data
    }))
  }

  // Payment transactions for a store
  static async getPaymentTransactions(storeId: string) {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  }
} 