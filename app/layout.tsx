import type React from "react"
import { Suspense } from "react"
import type { Metadata } from "next"
import { Geist as GeistSans, Geist_Mono as GeistMono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/components/providers/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { QueryProvider } from "@/lib/providers/QueryProvider"
import { ErrorBoundary } from "@/components/common/ErrorBoundary"
import { FullPageLoader } from "@/components/common/LoadingStates"

const geistSans = GeistSans({ subsets: ["latin"] })
const geistMono = GeistMono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Velithra - Enterprise Platform",
  description: "Crystalline circuit architecture for modern enterprises",
  generator: 'v0.app',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Velithra'
  }
}

// Separate viewport export as required by Next.js 16
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a1628' }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} bg-background text-foreground`}>
        <ErrorBoundary>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <Suspense fallback={<FullPageLoader message="Initializing Velithra..." />}>
                <AuthProvider>
                  {children}
                  <Toaster position="top-right" richColors />
                </AuthProvider>
              </Suspense>
            </ThemeProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
