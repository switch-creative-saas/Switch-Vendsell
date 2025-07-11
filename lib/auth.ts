import { supabase } from './supabase'
import { DatabaseService } from './database'

export interface AuthUser {
  id: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export class AuthService {
  // Get current user session
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) return null
      
      return {
        id: user.id,
        email: user.email!,
        first_name: user.user_metadata?.first_name,
        last_name: user.user_metadata?.last_name,
        phone: user.phone,
        avatar_url: user.user_metadata?.avatar_url,
        created_at: user.created_at,
        updated_at: user.updated_at || user.created_at
      }
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  // Sign up with email and password and create user profile + default store
  static async signUp(email: string, password: string, userData: {
    first_name: string
    last_name: string
    phone?: string
  }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    
    if (error) throw error

    // If signup successful, create user profile and default store
    if (data.user) {
      try {
        // Create user profile in users table
        await this.upsertUserProfile({
          id: data.user.id,
          email: data.user.email!,
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone
        })

        // Create default store for the user
        const storeName = `${userData.first_name}'s Store`
        const storeSlug = `${userData.first_name.toLowerCase()}-${userData.last_name.toLowerCase()}-${Date.now()}`
        
        await DatabaseService.createStore({
          name: storeName,
          slug: storeSlug,
          description: `Welcome to ${storeName}! Start adding your products to begin selling online.`,
          category: 'General',
          owner_id: data.user.id,
          plan: 'free',
          status: 'active',
          settings: {
            theme: 'modern-minimal',
            customColors: {
              primary: '#3B82F6',
              secondary: '#F59E0B',
              accent: '#10B981'
            },
            showPrices: true,
            showStock: true,
            enableWishlist: true,
            enableReviews: true,
            socialProof: true,
            whatsappIntegration: true
          }
        })
      } catch (profileError) {
        console.error('Error creating user profile or store:', profileError)
        // Don't throw here as the user is already created in auth
      }
    }
    
    return data
  }

  // Sign in with email and password
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  }

  // Sign out
  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // Reset password
  static async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`
    })
    
    if (error) throw error
  }

  // Update password
  static async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    
    if (error) throw error
  }

  // Update user profile
  static async updateProfile(updates: {
    first_name?: string
    last_name?: string
    phone?: string
    avatar_url?: string
  }) {
    const { error } = await supabase.auth.updateUser({
      data: updates
    })
    
    if (error) throw error
  }

  // Get user profile from users table
  static async getUserProfile(userId: string): Promise<AuthUser | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) {
        console.error('Error getting user profile:', error)
        return null
      }
      return data
    } catch (error) {
      console.error('Error getting user profile:', error)
      return null
    }
  }

  // Create or update user profile in users table
  static async upsertUserProfile(userData: {
    id: string
    email: string
    first_name: string
    last_name: string
    phone?: string
    avatar_url?: string
  }) {
    const { data, error } = await supabase
      .from('users')
      .upsert(userData, { onConflict: 'id' })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Check if user has access to store
  static async hasStoreAccess(userId: string, storeId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('id')
        .eq('id', storeId)
        .eq('owner_id', userId)
        .single()
      
      if (error) {
        console.error('Error checking store access:', error)
        return false
      }
      return !!data
    } catch (error) {
      console.error('Error checking store access:', error)
      return false
    }
  }

  // Get user's stores
  static async getUserStores(userId: string) {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  // Get user's primary store (first store or create one if none exists)
  static async getPrimaryStore(userId: string) {
    const stores = await this.getUserStores(userId)
    
    if (stores && stores.length > 0) {
      return stores[0]
    }
    
    // If no store exists, create a default one
    const user = await this.getUserProfile(userId)
    if (!user) throw new Error('User not found')
    
    const storeName = `${user.first_name}'s Store`
    const storeSlug = `${user.first_name?.toLowerCase()}-${user.last_name?.toLowerCase()}-${Date.now()}`
    
    return await DatabaseService.createStore({
      name: storeName,
      slug: storeSlug,
      description: `Welcome to ${storeName}! Start adding your products to begin selling online.`,
      category: 'General',
      owner_id: userId,
      plan: 'free',
      status: 'active',
      settings: {
        theme: 'modern-minimal',
        customColors: {
          primary: '#3B82F6',
          secondary: '#F59E0B',
          accent: '#10B981'
        },
        showPrices: true,
        showStock: true,
        enableWishlist: true,
        enableReviews: true,
        socialProof: true,
        whatsappIntegration: true
      }
    })
  }
}

// Middleware helper for protecting routes
export function requireAuth(handler: Function) {
  return async (req: any, res: any) => {
    try {
      const user = await AuthService.getCurrentUser()
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      return handler(req, res, user)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
} 