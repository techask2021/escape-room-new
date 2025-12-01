'use client'

import { Card } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { createSEOFriendlySlug } from '@/lib/data-source'

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
    return themeImages[themeName]
  }

  // Check for partial matches (case insensitive)
  const lowerTheme = themeName.toLowerCase()
  for (const [key, value] of Object.entries(themeImages)) {
    if (lowerTheme.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerTheme)) {
      return value
    }
  }

  // Default fallback image
  return `${wpUrl}/wp-content/uploads/2025/11/adventure-escape-Rooms.png`
}

// Define theme relationships - which themes are related to each other
const getRelatedThemes = (currentTheme: string, allThemes: any[]) => {
  const themeRelationships: { [key: string]: string[] } = {
    'Horror Escape Rooms': ['Mystery Escape Rooms', 'Thriller Escape Rooms', 'Crime Escape Rooms'],
    'Mystery Escape Rooms': ['Horror Escape Rooms', 'Crime Escape Rooms', 'Adventure Escape Rooms'],
    'Adventure Escape Rooms': ['Fantasy Escape Rooms', 'Mystery Escape Rooms', 'Entertainment Escape Rooms'],
    'Fantasy Escape Rooms': ['Adventure Escape Rooms', 'Sci-Fi Escape Rooms', 'Historical Escape Rooms'],
    'Sci-Fi Escape Rooms': ['Fantasy Escape Rooms', 'Adventure Escape Rooms', 'VR Escape Rooms'],
    'Crime Escape Rooms': ['Mystery Escape Rooms', 'Horror Escape Rooms', 'Thriller Escape Rooms'],
    'Historical Escape Rooms': ['Fantasy Escape Rooms', 'Adventure Escape Rooms', 'Mystery Escape Rooms'],
    'Entertainment Escape Rooms': ['Adventure Escape Rooms', 'Mixed Escape Rooms', 'Fantasy Escape Rooms'],
    'VR Escape Rooms': ['Sci-Fi Escape Rooms', 'Adventure Escape Rooms', 'Entertainment Escape Rooms'],
    'Mixed Escape Rooms': ['Entertainment Escape Rooms', 'Adventure Escape Rooms', 'Fantasy Escape Rooms'],
    'Thriller Escape Rooms': ['Horror Escape Rooms', 'Mystery Escape Rooms', 'Crime Escape Rooms'],
  }

  // Get related theme names for current theme
  const relatedThemeNames = themeRelationships[currentTheme] || []
  
  console.log(`Getting related themes for: "${currentTheme}"`)
  console.log(`Available themes in database:`, allThemes.map(t => t.theme))
  console.log(`Related theme names for ${currentTheme}:`, relatedThemeNames)
  
  // Find matching themes from allThemes array
  let relatedThemes = relatedThemeNames
    .map(themeName => {
      const found = allThemes.find(theme => theme.theme === themeName)
      console.log(`Looking for "${themeName}":`, found ? 'FOUND' : 'NOT FOUND')
      return found
    })
    .filter(Boolean) // Remove undefined values
  
  console.log(`Found ${relatedThemes.length} related themes:`, relatedThemes.map(t => t.theme))
  
  // If we don't have enough related themes, add popular themes as fallback
  if (relatedThemes.length < 3) {
    console.log(`Need more themes. Adding fallback themes...`)
    const popularThemes = ['Adventure Escape Rooms', 'Mystery Escape Rooms', 'Fantasy Escape Rooms', 'Horror Escape Rooms', 'Sci-Fi Escape Rooms']
    const currentThemeName = currentTheme
    
    // Add popular themes that aren't already included and aren't the current theme
    for (const popularTheme of popularThemes) {
      if (relatedThemes.length >= 3) break
      if (popularTheme !== currentThemeName && !relatedThemes.some(theme => theme.theme === popularTheme)) {
        const themeData = allThemes.find(theme => theme.theme === popularTheme)
        if (themeData) {
          console.log(`Adding fallback theme: "${popularTheme}"`)
          relatedThemes.push(themeData)
        }
      }
    }
  }
  
  const finalThemes = relatedThemes.slice(0, 3)
  console.log(`Final related themes for "${currentTheme}":`, finalThemes.map(t => t.theme))
  
  return finalThemes
}

interface RelatedThemesSectionProps {
  currentTheme: string
  allThemes: any[]
}

export default function RelatedThemesSection({ currentTheme, allThemes }: RelatedThemesSectionProps) {
  const relatedThemes = getRelatedThemes(currentTheme, allThemes)

  // Debug logging
  console.log('RelatedThemesSection Debug:', {
    currentTheme,
    allThemesCount: allThemes?.length || 0,
    relatedThemesCount: relatedThemes.length,
    relatedThemes: relatedThemes.map(t => t.theme)
  })

  // Don't render if no related themes found
  if (relatedThemes.length === 0) {
    console.log('No related themes found for:', currentTheme)
    return null
  }

  return (
    <section className="w-full py-12 border-t border-slate-100" style={{ backgroundColor: '#f7fafc' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-escape-red">Explore more</span>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Related Themes You Might Like</h2>
          <p className="mt-2 text-base text-slate-600">
            Discover similar escape room experiences that match your interests
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedThemes.map((theme, index) => {
            if (!theme || !theme.theme) {
              console.error('Invalid theme data:', theme)
              return null
            }
            
            const themeSlug = createSEOFriendlySlug(theme.theme)
            const themeUrl = `/themes/${themeSlug}`
            
            return (
              <Link 
                key={`${theme.theme}-${index}`} 
                href={themeUrl} 
                className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-escape-red/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                onClick={(e) => {
                  console.log('Theme card clicked:', theme.theme, 'URL:', themeUrl)
                }}
              >
                <Card className="h-full overflow-hidden border border-slate-800 bg-slate-900 shadow-lg transition hover:border-escape-red/50 hover:shadow-xl hover:shadow-escape-red/20">
                  <div className="relative aspect-[5/3] overflow-hidden bg-slate-800">
                    <Image
                      src={getThemeImage(theme.theme)}
                      alt={`${theme.theme} - Discover ${theme.count} themed escape room experiences`}
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
                        {theme.count} rooms
                      </span>
                    </div>
                    
                    {/* Title */}
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <h3 className="text-lg font-semibold text-white group-hover:text-escape-red transition-colors">
                        {theme.theme}
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
  )
}
