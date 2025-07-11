"use client"

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ResponsiveContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  center?: boolean
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full',
}

const paddingClasses = {
  none: '',
  sm: 'px-4 py-2',
  md: 'px-6 py-4',
  lg: 'px-8 py-6',
}

export function ResponsiveContainer({
  children,
  className,
  maxWidth = 'xl',
  padding = 'md',
  center = true,
}: ResponsiveContainerProps) {
  return (
    <div
      className={cn(
        'w-full',
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        center && 'mx-auto',
        className
      )}
    >
      {children}
    </div>
  )
}

// Optimized grid component for responsive layouts
interface ResponsiveGridProps {
  children: ReactNode
  className?: string
  cols?: {
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: 'sm' | 'md' | 'lg' | 'xl'
}

const gapClasses = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
}

export function ResponsiveGrid({
  children,
  className,
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 'md',
}: ResponsiveGridProps) {
  const gridCols = [
    cols.sm && `grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
  ].filter(Boolean)

  return (
    <div
      className={cn(
        'grid',
        gridCols,
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  )
}

// Performance optimized card component
interface OptimizedCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  loading?: boolean
  onClick?: () => void
}

export function OptimizedCard({
  children,
  className,
  hover = false,
  loading = false,
  onClick,
}: OptimizedCardProps) {
  return (
    <div
      className={cn(
        'bg-card border border-border rounded-lg shadow-sm',
        hover && 'transition-all duration-200 hover:shadow-md hover:scale-[1.02]',
        loading && 'animate-pulse',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

// Responsive text component
interface ResponsiveTextProps {
  children: ReactNode
  className?: string
  size?: {
    sm?: string
    md?: string
    lg?: string
    xl?: string
  }
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
}

export function ResponsiveText({
  children,
  className,
  size = { sm: 'text-sm', md: 'text-base', lg: 'text-lg', xl: 'text-xl' },
  weight = 'normal',
}: ResponsiveTextProps) {
  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }

  const sizeClasses = [
    size.sm,
    size.md && `md:${size.md}`,
    size.lg && `lg:${size.lg}`,
    size.xl && `xl:${size.xl}`,
  ].filter(Boolean)

  return (
    <div
      className={cn(
        sizeClasses,
        weightClasses[weight],
        className
      )}
    >
      {children}
    </div>
  )
} 