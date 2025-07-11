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
} 