"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Palette } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getThemesWithCounts, createSEOFriendlySlug } from "@/lib/data-source"

// Helper to get the appropriate image based on theme name
const getThemeImage = (themeName: string) => {
  const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL

  const themeImages: { [key: string]: string } = {
    'Adventure Escape Rooms': `${wpUrl}/wp-content/uploads/2025/11/adventure-escape-Rooms.png`,
    'Crime Escape Rooms': `${wpUrl}/wp-content/uploads/2025/11/crime-scene-escape-rooms.png`,
    'Mystery Escape Rooms': `${wpUrl}/wp-content/uploads/2025/11/crime-scene-escape-rooms.png`,
    'Entertainment Escape Rooms': `${wpUrl}/wp-content/uploads/2025/11/entertainment-escape-rooms.png`,
    'Historical Escape Rooms': `${wpUrl}/wp-content/uploads/2025/11/historical-escape-rooms.png`,
    'Horror Escape Rooms': `${wpUrl}/wp-content/uploads/2025/11/horror-escape-rooms.png`,
    'Fantasy Escape Rooms': `${wpUrl}/wp-content/uploads/2025/11/fantasy-escape-rooms.png`,
    'VR Escape Rooms': `${wpUrl}/wp-content/uploads/2025/11/vr-escape-rooms.jpeg`,
  }

  // Check for exact match first
  if (themeImages[themeName]) {
    return themeImages[themeName];
  }

  // Check for partial matches (case insensitive)
  const lowerTheme = themeName.toLowerCase();
  for (const [key, value] of Object.entries(themeImages)) {
    if (lowerTheme.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerTheme)) {
      return value;
    }
  }

  // Default fallback image
  return `${wpUrl}/wp-content/uploads/2025/11/adventure-escape-Rooms.png`;
};

interface ThemesPageClientProps {
  initialThemes: any[]
}

export default function ThemesPageClient({ initialThemes }: ThemesPageClientProps) {
  const [themes, setThemes] = useState<any[]>(initialThemes)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // If no initial themes provided, load them
    if (initialThemes.length === 0) {
      loadThemes()
    }
  }, [initialThemes])

  const loadThemes = async () => {
    setLoading(true)
    try {
      const { data, error } = await getThemesWithCounts()
      if (error) {
        console.error('Error loading themes:', error)
        setThemes([])
      } else {
        setThemes(data || [])
      }
    } catch (error) {
      console.error('Error loading themes:', error)
      setThemes([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Breadcrumb Navigation */}
        <div className="bg-[#f7fafc] border-b">
          <div className="container mx-auto px-4 py-3">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Themes</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
        
        <section
          className="relative text-white py-20 overflow-hidden"
          style={{
            backgroundImage: `url('${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-content/uploads/2025/11/themes-hero-scaled.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/80" />
          
          {/* Enhanced atmospheric elements matching homepage */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-64 h-64 bg-escape-red rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-48 h-48 bg-escape-red-600 rounded-full blur-2xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-escape-red-700 rounded-full blur-xl animate-pulse delay-500" />
          </div>
          
          {/* Mystery elements matching homepage */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/6 text-4xl animate-mystery-float">🔍</div>
            <div className="absolute top-3/4 right-1/5 text-3xl animate-mystery-float delay-1000">🗝️</div>
            <div className="absolute top-1/2 right-1/4 text-2xl animate-mystery-float delay-500">🔐</div>
            <div className="absolute bottom-1/4 left-1/4 text-3xl animate-mystery-float delay-1500">⏱️</div>
            <div className="absolute top-1/3 right-1/6 text-2xl animate-mystery-float delay-2000">🧩</div>
          </div>
          
          {/* Glowing particles effect */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-escape-red rounded-full animate-ping" />
            <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-escape-red-400 rounded-full animate-ping delay-1000" />
            <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-escape-red-600 rounded-full animate-ping delay-500" />
          </div>
          <div className="relative container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Palette className="h-8 w-8 text-escape-red" />
              </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-white via-escape-red-200 to-white bg-clip-text text-transparent">
              Explore Escape Rooms by Theme
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Loading themes...
            </p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Navigation */}
      <div className="bg-[#f7fafc] border-b">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Themes</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section */}
      <section
        className="relative text-white py-20 overflow-hidden border-b border-slate-200"
        style={{
          backgroundImage: `url('${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-content/uploads/2025/11/themes-hero-scaled.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        
        {/* Subtle decorative elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 right-20 w-64 h-64 bg-escape-red rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-escape-red/50 rounded-full blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-escape-red/20 border border-escape-red/30 backdrop-blur-sm">
                <Palette className="h-6 w-6 text-escape-red" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-escape-red">Themes</span>
                <h1 className="mt-1 text-3xl font-semibold text-white">Explore Escape Rooms by Theme</h1>
              </div>
            </div>
            <p className="text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
              From heart-pounding horror to mind-bending mysteries, find the perfect themed escape room adventure for your group.
            </p>
          </div>
        </div>
      </section>

      {/* Themes Grid */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-escape-red">Browse by theme</span>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">All Escape Room Themes</h2>
            <p className="mt-2 text-base text-slate-600 max-w-2xl">
              Discover escape rooms organized by theme. Each theme offers unique experiences and challenges.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {themes.map((themeData, index) => {
              const themeSlug = createSEOFriendlySlug(themeData.theme)
              return (
                <Link 
                  key={index} 
                  href={`/themes/${themeSlug}`}
                  className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-escape-red/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  <Card className="h-full overflow-hidden border border-slate-800 bg-slate-900 shadow-lg transition hover:border-escape-red/50 hover:shadow-xl hover:shadow-escape-red/20">
                    <div className="relative aspect-[5/3] overflow-hidden bg-slate-800">
                      <Image
                        src={getThemeImage(themeData.theme)}
                        alt={`${themeData.theme} - Discover ${themeData.count} themed escape room experiences`}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index < 3}
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6gAAAAABJRU5ErkJggg=="
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                      
                      {/* Room Count Badge */}
                      <div className="absolute right-3 top-3">
                        <span className="inline-flex items-center rounded-lg bg-escape-red px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                          {themeData.count} rooms
                        </span>
                      </div>
                      
                      {/* Title */}
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <h3 className="text-lg font-semibold text-white group-hover:text-escape-red transition-colors">
                          {themeData.theme}
                        </h3>
                      </div>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}