import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
// import { SWRProvider } from "@/components/swr-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BackToTop from "@/components/back-to-top"
import WebVitals from "@/components/performance/web-vitals"
import ResourcePreloader from "@/components/performance/resource-preloader"
import { LCPOptimizer } from "@/components/performance/resource-preloader"
import { Toaster } from "@/components/ui/toaster"
import GoogleAnalytics from "@/components/analytics/google-analytics"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
})

export const metadata: Metadata = {
  metadataBase: new URL('https://escaperoomsfinder.com'),
  title: "Find The Best Escape Rooms Near You | Escape Rooms Finder",
  description: "Escape Rooms Finder helps you to discover amazing escape room experiences worldwide. Browse by theme or location. Find the perfect escape room adventure for your group with real reviews and ratings!",
  keywords: "escape rooms, escape room finder, escape games, puzzle rooms, team building, horror escape rooms, mystery escape rooms, adventure escape rooms, fantasy escape rooms, escape room booking, escape room reviews",

  openGraph: {
    title: "Find The Best Escape Rooms Near You | Escape Rooms Finder",
    description: "Escape Rooms Finder helps you to discover amazing escape room experiences worldwide. Browse by theme or location. Find the perfect escape room adventure for your group with real reviews and ratings!",
    type: "website",
    locale: "en_US",
    siteName: "Escape Rooms Finder",
    url: "/"
  },
  twitter: {
    card: "summary_large_image",
    title: "Find The Best Escape Rooms Near You | Escape Rooms Finder",
    description: "Escape Rooms Finder helps you to discover amazing escape room experiences worldwide. Browse by theme or location. Find the perfect escape room adventure for your group with real reviews and ratings!",
    site: "@escaperoomsfinder",
    creator: "@escaperoomsfinder"
  },
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large'
    }
  },
  generator: 'v0.app'
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS to prevent FOUC */
            html {
              margin: 0;
              padding: 0;
              background-color: #f8fafc;
              min-height: 100vh;
            }

            body {
              margin: 0;
              padding: 0;
              background-color: #f8fafc;
              min-height: 100vh;
              opacity: 1 !important;
              visibility: visible !important;
              display: block !important;
            }

            /* Ensure all content is visible during hydration */
            #__next,
            main,
            [id="main-content"] {
              opacity: 1 !important;
              visibility: visible !important;
              display: block !important;
            }

            /* Ensure smooth rendering */
            * {
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }

            /* Prevent any flash */
            body > * {
              opacity: 1 !important;
              visibility: visible !important;
            }
          `
        }} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <ResourcePreloader 
          criticalImages={[
            '/images/hero.jpeg'
          ]}
          preconnectDomains={[
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com'
          ]}
        />
        <LCPOptimizer 
          heroImageSrc="/images/hero.jpeg"
          heroImageAlt="Discover Amazing Escape Room Adventures - Find the Perfect Escape Room Experience Near You"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Remove browser extension attributes that cause hydration mismatches
              if (typeof window !== 'undefined') {
                const body = document.body;
                if (body) {
                  body.removeAttribute('data-new-gr-c-s-check-loaded');
                  body.removeAttribute('data-gr-ext-installed');
                }
              }
            `
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Escape Rooms Finder',
              url: 'https://escaperoomsfinder.com',
              logo: 'https://escaperoomsfinder.com/logo.png',
              description: 'Escape Rooms Finder helps you to discover amazing escape room experiences worldwide. Browse by theme or location. Find the perfect escape room adventure for your group with real reviews and ratings!',
              sameAs: [
                'https://facebook.com/escaperoomsfinder',
                'https://twitter.com/escaperoomsfinder',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+1-800-ESCAPE',
                contactType: 'customer service',
                email: 'support@escaperoomsfinder.com',
                areaServed: 'US'
              }
            })
          }}
        />
      </head>
      <body 
        className={`${inter.className} ${inter.variable}`} 
        suppressHydrationWarning={true}
        data-suppress-hydration-warning="true"
      >
        {/* Skip Links for Accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-escape-red text-white px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>
        <a 
          href="#navigation" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-32 bg-escape-red text-white px-4 py-2 rounded-md z-50"
        >
          Skip to navigation
        </a>
        
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
          suppressHydrationWarning
        >
          {/* <SWRProvider> */}
            <Header />
            <main id="main-content">{children}</main>
            <Footer />
            <BackToTop />
            <WebVitals />
            <Toaster />
            {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
              <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
            )}
          {/* </SWRProvider> */}
        </ThemeProvider>
      </body>
    </html>
  )
}
