import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { UserProvider } from '@/contexts/UserContext'
import { useEffect } from 'react'

export const metadata: Metadata = {
  title: 'Switch VendSell - Nigerian eCommerce Platform',
  description: 'The complete eCommerce platform designed for African creators. Accept Naira payments, integrate with WhatsApp, and sell to customers across Nigeria.',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Register service worker for offline support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          // eslint-disable-next-line no-console
          console.warn('Service worker registration failed:', err)
        })
      })
    }
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
          {children}
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
