import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Palette } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getEscapeRooms, formatRoomForDisplay, createSEOFriendlySlug, getThemesWithCounts } from "@/lib/data-source"
import { notFound } from 'next/navigation'
import ThemePageClient from "@/components/theme-page-client"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { createThemeMetadata } from "@/lib/metadata"
import RelatedThemesSection from "@/components/related-themes-section"

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

// Convert slug back to theme name
const parseThemeFromSlug = (slug: string): string => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default async function ThemePage({ params }: { params: Promise<{ theme: string }> }) {
  const { theme } = await params
  const themeSlug = theme
  const roomsPerPage = 24
  
  // Parse theme name from slug
  const parsedThemeName = parseThemeFromSlug(themeSlug)
  
  // Get all rooms to find matching themes
  const { data: allRooms } = await getEscapeRooms({ limit: 10000 })
  
  // Get all themes for related themes section
  const { data: allThemes } = await getThemesWithCounts()
  
  // Find rooms that match the theme (case-insensitive partial match)
  const matchingRooms = allRooms.filter(room => {
    if (!room.category_new) return false
    const roomTheme = room.category_new.toLowerCase()
    const searchTheme = parsedThemeName.toLowerCase()
    
    // Check for exact match or partial match
    return roomTheme.includes(searchTheme) || 
           searchTheme.includes(roomTheme) ||
           createSEOFriendlySlug(room.category_new || '') === themeSlug
  })
  
  if (matchingRooms.length === 0) {
    notFound()
  }
  
  // Get actual theme name from database
  const themeName = matchingRooms[0]?.category_new || parsedThemeName
  const totalCount = matchingRooms.length
  
  // Format all matching rooms for display
  const formattedRooms = matchingRooms.map(formatRoomForDisplay)

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": "#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://escaperoomsfinder.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Themes",
            "item": "https://escaperoomsfinder.com/themes"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": themeName,
            "item": `https://escaperoomsfinder.com/themes/${themeSlug}`
          }
        ]
      },
      {
        "@type": "CollectionPage",
        "name": `${themeName} Escape Rooms`,
        "description": `Discover ${totalCount} amazing ${themeName.toLowerCase()} across the United States. Find ratings, reviews, and book your perfect themed escape room adventure.`,
        "url": `https://escaperoomsfinder.com/themes/${themeSlug}`,
        "mainEntity": {
          "@type": "ItemList",
          "numberOfItems": totalCount,
          "itemListElement": formattedRooms.slice(0, 10).map((room, index) => ({
            "@type": "LocalBusiness",
            "position": index + 1,
            "name": room.name,
            "description": room.description || `Experience ${room.name}, an exciting ${themeName.toLowerCase()} escape room.`,
            "url": `https://escaperoomsfinder.com/locations/united-states/${room.state?.toLowerCase().replace(/\s+/g, '-')}/${room.city?.toLowerCase().replace(/\s+/g, '-')}/${room.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": room.address,
              "addressLocality": room.city,
              "addressRegion": room.state,
              "addressCountry": "US"
            },
            "geo": room.latitude && room.longitude ? {
              "@type": "GeoCoordinates",
              "latitude": room.latitude,
              "longitude": room.longitude
            } : undefined,
            "telephone": room.phone,
            "aggregateRating": room.rating ? {
              "@type": "AggregateRating",
              "ratingValue": room.rating,
              "ratingCount": room.reviews || 1,
              "bestRating": 5,
              "worstRating": 1
            } : undefined
          }))
        },
        "breadcrumb": {
          "@id": "#breadcrumb"
        }
      },
      {
        "@type": "WebPage",
        "@id": `https://escaperoomsfinder.com/themes/${themeSlug}`,
        "url": `https://escaperoomsfinder.com/themes/${themeSlug}`,
        "name": `${themeName} Escape Rooms | Find ${totalCount} Adventures`,
        "description": `Discover ${totalCount} amazing ${themeName.toLowerCase()} across the United States. Find ratings, reviews, and book your perfect themed escape room adventure.`,
        "isPartOf": {
          "@type": "WebSite",
        "name": "Escape Rooms Finder",
        "url": "https://escaperoomsfinder.com"
        },
        "breadcrumb": {
          "@id": "#breadcrumb"
        }
      }
    ]
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
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
                <BreadcrumbLink href="/themes">Themes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{themeName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section */}
      <section 
        className="relative text-white py-20 overflow-hidden border-b border-slate-200" 
        style={{
          backgroundImage: `url('${getThemeImage(themeName)}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
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
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-escape-red">
                  {themeName}
                </span>
                <h1 className="mt-1 text-3xl font-semibold text-white">
                  {themeName} Escape Rooms
                </h1>
              </div>
            </div>
            <p className="text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
              Discover {totalCount} amazing {themeName.toLowerCase()} across the United States. Find the perfect themed escape room adventure for your group.
            </p>
          </div>
        </div>
      </section>

      {/* Client Component for Interactive Features */}
      <ThemePageClient 
        rooms={formattedRooms}
        roomsPerPage={roomsPerPage}
        themeName={themeName}
      />
      
      {/* Related Themes Section */}
      <RelatedThemesSection 
        currentTheme={themeName}
        allThemes={allThemes || []}
      />
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ theme: string }> }) {
  const { theme } = await params
  const themeSlug = theme
  const themeName = parseThemeFromSlug(themeSlug)
  
  // Get room count for this theme
  const { data: allRooms } = await getEscapeRooms({ limit: 10000 })
  const matchingRooms = allRooms.filter(room => {
    if (!room.category_new) return false
    const roomTheme = room.category_new.toLowerCase()
    const searchTheme = themeName.toLowerCase()
    return roomTheme.includes(searchTheme) || 
           searchTheme.includes(roomTheme) ||
           createSEOFriendlySlug(room.category_new || '') === themeSlug
  })
  
  const roomCount = matchingRooms.length
  
  return createThemeMetadata(
    themeName,
    roomCount
  )
}

export const revalidate = 300 // 5 minutes