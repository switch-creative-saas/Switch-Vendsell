import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { UserProvider } from '@/contexts/UserContext'

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
