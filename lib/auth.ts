import { supabase } from './supabase'

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

  // Sign up with email and password
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