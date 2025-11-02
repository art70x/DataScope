import type { Metadata } from 'next'
import {ReactNode} from 'react'
import { Geist } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  preload: true,
  display: 'swap',
  subsets: ['latin'],
  fallback: ['Roboto', 'Segoe UI'],
})

export const metadata: Metadata = {
  title: 'DataScope - Upload & Explore CSV & JSON Files',
  description:
    'DataScope is a powerful data exploration tool. Upload CSV or JSON files, search with advanced filters, sort data, and export to PDF, JSON, or CSV. Perfect for data analysis and visualization.',
  keywords: [
    'data explorer',
    'CSV viewer',
    'JSON viewer',
    'data analysis',
    'file upload',
    'data visualization',
    'table viewer',
    'data export',
    'PDF export',
    'CSV export',
    'JSON export',
    'data search',
    'data filter',
    'data sort',
  ],
  authors: [
    {
      name: 'art70x',
      url: 'https://x.com/art70x',
    },
  ],
  creator: 'art70x',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://datascope.vercel.app',
    siteName: 'DataScope',
    title: 'DataScope - Upload & Explore CSV & JSON Files',
    description:
      'Powerful data exploration tool for CSV and JSON files. Search, filter, sort, and export your data with ease.',
    images: [
      {
        url: 'https://datascope.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DataScope - Data Exploration Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DataScope - Upload & Explore CSV & JSON Files',
    description:
      'Powerful data exploration tool for CSV and JSON files. Search, filter, sort, and export your data with ease.',
    creator: '@art70x',
    images: ['https://datascope.vercel.app/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: 'https://datascope.vercel.app',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="language" content="English" />
        <meta name="theme-color" content="#18181b" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="##e4e4e7" media="(prefers-color-scheme: dark)" />
      </head>
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <a
          className="sr-only hover:underline focus-visible:not-sr-only focus-visible:absolute focus-visible:top-0 focus-visible:left-0 focus-visible:bg-accent focus-visible:px-4 focus-visible:py-3 focus-visible:text-accent-foreground"
          href="#main"
        >
          Skip to content
        </a>
        <Toaster />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
