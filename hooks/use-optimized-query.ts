import { useState, useEffect, useCallback, useRef } from 'react'

interface QueryOptions<T> {
  queryFn: () => Promise<T>
  enabled?: boolean
  refetchInterval?: number
  staleTime?: number
  cacheTime?: number
  retry?: number
  retryDelay?: number
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

interface QueryResult<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
  isStale: boolean
}

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number; staleTime: number }>()

export function useOptimizedQuery<T>(
  key: string,
  options: QueryOptions<T>
): QueryResult<T> {
  const {
    queryFn,
    enabled = true,
    refetchInterval,
    staleTime = 5 * 60 * 1000, // 5 minutes
    cacheTime = 10 * 60 * 1000, // 10 minutes
    retry = 3,
    retryDelay = 1000,
    onSuccess,
    onError,
  } = options

  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [isStale, setIsStale] = useState(false)
  
  const abortControllerRef = useRef<AbortController | null>(null)
  const retryCountRef = useRef(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Check if data is stale
  const checkStale = useCallback(() => {
    const cached = cache.get(key)
    if (cached) {
      const isStaleData = Date.now() - cached.timestamp > cached.staleTime
      setIsStale(isStaleData)
    }
  }, [key])

  // Fetch data with retry logic
  const fetchData = useCallback(async (signal?: AbortSignal) => {
    if (!enabled) return

    setIsLoading(true)
    setError(null)
    retryCountRef.current = 0

    const executeQuery = async (attempt: number): Promise<void> => {
      try {
        // Check cache first
        const cached = cache.get(key)
        if (cached && Date.now() - cached.timestamp < cached.staleTime) {
          setData(cached.data)
          setIsLoading(false)
          onSuccess?.(cached.data)
          return
        }

        const result = await queryFn()
        
        if (signal?.aborted) return

        // Cache the result
        cache.set(key, {
          data: result,
          timestamp: Date.now(),
          staleTime,
        })

        setData(result)
        setIsLoading(false)
        setIsStale(false)
        onSuccess?.(result)
      } catch (err) {
        if (signal?.aborted) return

        const error = err instanceof Error ? err : new Error('Unknown error')
        
        if (attempt < retry) {
          retryCountRef.current = attempt + 1
          setTimeout(() => executeQuery(attempt + 1), retryDelay * attempt)
        } else {
          setError(error)
          setIsLoading(false)
          onError?.(error)
        }
      }
    }

    await executeQuery(0)
  }, [enabled, queryFn, key, staleTime, retry, retryDelay, onSuccess, onError])

  // Refetch function
  const refetch = useCallback(async () => {
    // Clear cache for this key
    cache.delete(key)
    await fetchData()
  }, [fetchData, key])

  // Effect for initial fetch and refetch interval
  useEffect(() => {
    if (!enabled) return

    abortControllerRef.current = new AbortController()
    
    fetchData(abortControllerRef.current.signal)

    // Set up refetch interval
    if (refetchInterval) {
      intervalRef.current = setInterval(() => {
        checkStale()
        if (isStale) {
          fetchData(abortControllerRef.current?.signal)
        }
      }, refetchInterval)
    }

    // Set up stale check interval
    const staleCheckInterval = setInterval(checkStale, 30000) // Check every 30 seconds

    return () => {
      abortControllerRef.current?.abort()
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      clearInterval(staleCheckInterval)
    }
  }, [enabled, fetchData, refetchInterval, checkStale, isStale])

  // Cleanup cache on unmount
  useEffect(() => {
    return () => {
      // Remove expired cache entries
      const now = Date.now()
      for (const [cacheKey, cacheEntry] of cache.entries()) {
        if (now - cacheEntry.timestamp > cacheTime) {
          cache.delete(cacheKey)
        }
      }
    }
  }, [cacheTime])

  return {
    data,
    isLoading,
    error,
    refetch,
    isStale,
  }
}

// Debounced hook for search inputs
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Optimized infinite scroll hook
export function useInfiniteScroll<T>(
  queryFn: (page: number) => Promise<T[]>,
  pageSize: number = 20
) {
  const [data, setData] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const newData = await queryFn(page)
      if (newData.length < pageSize) {
        setHasMore(false)
      }
      setData(prev => [...prev, ...newData])
      setPage(prev => prev + 1)
    } catch (error) {
      console.error('Error loading more data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [queryFn, page, pageSize, isLoading, hasMore])

  const reset = useCallback(() => {
    setData([])
    setPage(1)
    setHasMore(true)
    setIsLoading(false)
  }, [])

  return {
    data,
    isLoading,
    hasMore,
    loadMore,
    reset,
  }
}

// Optimized mutation hook
export function useOptimizedMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData) => void
    onError?: (error: Error) => void
    onSettled?: () => void
  }
) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<TData | null>(null)

  const mutate = useCallback(async (variables: TVariables) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await mutationFn(variables)
      setData(result)
      options?.onSuccess?.(result)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      options?.onError?.(error)
      throw error
    } finally {
      setIsLoading(false)
      options?.onSettled?.()
    }
  }, [mutationFn, options])

  return {
    mutate,
    isLoading,
    error,
    data,
  }
} 