"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthService, AuthUser } from '@/lib/auth'
import { DatabaseService, Store } from '@/lib/database'

interface UserContextType {
  user: AuthUser | null
  store: Store | null
  loading: boolean
  error: string | null
  refreshUser: () => Promise<void>
  refreshStore: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshUser = async () => {
    setLoading(true)
    setError(null)
    try {
      const currentUser = await AuthService.getCurrentUser()
      setUser(currentUser)
      
      if (currentUser) {
        // Get or create primary store for the user
        try {
          const primaryStore = await AuthService.getPrimaryStore(currentUser.id)
          setStore(primaryStore)
        } catch (err: any) {
          setStore(null)
          setError(err?.message || 'Failed to fetch or create store.')
        }
      } else {
        setStore(null)
      }
    } catch (error: any) {
      console.error('Error refreshing user:', error)
      setUser(null)
      setStore(null)
      setError(error?.message || 'Failed to refresh user.')
    } finally {
      setLoading(false)
    }
  }

  const refreshStore = async () => {
    if (user) {
      setLoading(true)
      setError(null)
      try {
        const primaryStore = await AuthService.getPrimaryStore(user.id)
        setStore(primaryStore)
      } catch (error: any) {
        setStore(null)
        setError(error?.message || 'Failed to fetch or create store.')
      } finally {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    refreshUser().finally(() => setLoading(false))
  }, [])

  const value = {
    user,
    store,
    loading,
    error,
    refreshUser,
    refreshStore
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
} 