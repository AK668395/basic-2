import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'StyleSage AI - Intelligent Outfit Analysis',
    template: '%s | StyleSage AI',
  },
  description: 'Get AI-powered outfit ratings and style suggestions based on real-time fashion trends from Instagram, Pinterest, X, and Threads.',
  keywords: ['fashion', 'outfit', 'style', 'AI', 'trends', 'Instagram', 'Pinterest'],
  authors: [{ name: 'StyleSage AI' }],
  creator: 'StyleSage AI',
  publisher: 'StyleSage AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://stylesage-ai.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://stylesage-ai.com',
    title: 'StyleSage AI - Intelligent Outfit Analysis',
    description: 'Get AI-powered outfit ratings and style suggestions based on real-time fashion trends.',
    siteName: 'StyleSage AI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'StyleSage AI - Outfit Analysis Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StyleSage AI - Intelligent Outfit Analysis',
    description: 'Get AI-powered outfit ratings and style suggestions based on real-time fashion trends.',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'StyleSage AI',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            {/* Background gradient overlay */}
            <div className="fixed inset-0 -z-10">
              <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,48,44,0.1)_0%,_transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(74,144,226,0.1)_0%,_transparent_50%)]" />
            </div>

            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}