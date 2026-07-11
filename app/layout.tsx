import { Analytics } from '@vercel/analytics/next'
import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata, Viewport } from 'next'
import './globals.css'

// Validate environment only in production runtime
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
  if (!process.env.DATABASE_URL) {
    console.warn('[startup] DATABASE_URL not configured. Database operations will fail.');
  }
  if (!process.env.CLERK_SECRET_KEY || !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    console.warn('[startup] Clerk keys are not configured. Authentication will fail.');
  }
}

export const metadata: Metadata = {
  title: 'Monsoon Preparedness & Citizen Assistance',
  description: 'An AI-native platform for monsoon preparedness and citizen assistance',
  generator: 'v0.app',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://monsoon-preparedness.vercel.app',
    siteName: 'Monsoon Preparedness',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0E6E68' },
    { media: '(prefers-color-scheme: dark)', color: '#0E6E68' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-white">
      <body className="antialiased">
        <ClerkProvider
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          signInFallbackRedirectUrl="/"
          signUpFallbackRedirectUrl="/"
        >
          {children}
        </ClerkProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
