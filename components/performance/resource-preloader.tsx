'use client'

import { useEffect } from 'react'
import Head from 'next/head'

interface ResourcePreloaderProps {
  criticalImages?: string[]
  criticalFonts?: string[]
  criticalStyles?: string[]
  preconnectDomains?: string[]
}

export default function ResourcePreloader({
  criticalImages = [],
  criticalFonts = [],
  criticalStyles = [],
  preconnectDomains = []
}: ResourcePreloaderProps) {
  useEffect(() => {
    // Preload critical images
    criticalImages.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    })

    // Preload critical fonts
    criticalFonts.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'font'
      link.type = 'font/woff2'
      link.crossOrigin = 'anonymous'
      link.href = src
      document.head.appendChild(link)
    })

    // Preload critical CSS
    criticalStyles.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'style'
      link.href = src
      document.head.appendChild(link)
    })
  }, [criticalImages, criticalFonts, criticalStyles])

  return (
    <Head>
      {/* Preconnect to external domains */}
      {preconnectDomains.map(domain => (
        <link key={domain} rel="preconnect" href={domain} />
      ))}
      
      {/* DNS prefetch for performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      
      {/* Preload critical resources */}
      {criticalImages.map(src => (
        <link 
          key={src} 
          rel="preload" 
          as={src.endsWith('.ico') ? 'image' : 'image'} 
          href={src}
          type={src.endsWith('.ico') ? 'image/x-icon' : undefined}
        />
      ))}
      
      {criticalFonts.map(src => (
        <link 
          key={src} 
          rel="preload" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
          href={src} 
        />
      ))}
      
      {criticalStyles.map(src => (
        <link key={src} rel="preload" as="style" href={src} />
      ))}
    </Head>
  )
}

// Hook for managing resource hints
export function useResourceHints() {
  useEffect(() => {
    // Prefetch next page resources on hover
    const prefetchOnHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href]') as HTMLAnchorElement
      
      if (link && link.hostname === window.location.hostname) {
        const prefetchLink = document.createElement('link')
        prefetchLink.rel = 'prefetch'
        prefetchLink.href = link.href
        document.head.appendChild(prefetchLink)
      }
    }

    // Add hover listeners for prefetching
    document.addEventListener('mouseover', prefetchOnHover)
    
    return () => {
      document.removeEventListener('mouseover', prefetchOnHover)
    }
  }, [])
}

// Component for critical CSS inlining
export function CriticalCSS({ css }: { css: string }) {
  return (
    <Head>
      <style dangerouslySetInnerHTML={{ __html: css }} />
    </Head>
  )
}

// Component for optimizing LCP (Largest Contentful Paint)
export function LCPOptimizer({ 
  heroImageSrc, 
  heroImageAlt = "Hero image",
  priority = true 
}: { 
  heroImageSrc: string
  heroImageAlt?: string
  priority?: boolean 
}) {
  return (
    <Head>
      {/* Preload the hero image for better LCP */}
      <link 
        rel="preload" 
        as="image" 
        href={heroImageSrc}
        fetchPriority={priority ? "high" : "auto"}
      />
      
      {/* Optimize for Core Web Vitals */}
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      
      {/* Prevent layout shift */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Prevent layout shift for images */
          img[loading="lazy"] {
            min-height: 200px;
            background: #f3f4f6;
          }
          
          /* Optimize font loading */
          @font-face {
            font-family: 'Inter';
            font-display: swap;
          }
          
          /* Prevent CLS for dynamic content */
          .dynamic-content {
            min-height: 100px;
          }
        `
      }} />
    </Head>
  )
}