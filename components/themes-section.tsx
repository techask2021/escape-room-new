import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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

const blurDataURL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6gAAAAABJRU5ErkJggg=="

export default async function ThemesSection() {
  const { data: themes, error } = await getThemesWithCounts()

  if (error) {
    console.error('Error loading themes:', error)
    return null
  }

  // Placeholder data for when themes are empty
  const placeholderThemes = [
    { theme: "Adventure Escape Rooms", count: 0 },
    { theme: "Mixed Escape Rooms", count: 0 },
    { theme: "Mystery Escape Rooms", count: 0 },
    { theme: "Horror Escape Rooms", count: 0 },
    { theme: "Fantasy Escape Rooms", count: 0 },
    { theme: "Entertainment Escape Rooms", count: 0 },
    { theme: "VR Escape Rooms", count: 0 },
    { theme: "Historical Escape Rooms", count: 0 },
  ]

  const displayThemes = (themes && themes.length > 0 ? themes : placeholderThemes).slice(0, 6)

  return (
    <section className="border-t border-slate-200 bg-slate-950 py-16 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-escape-red">Browse by theme</span>
          <h2 className="mt-3 text-3xl font-semibold text-white">Explore Escape Rooms By Theme</h2>
          <p className="mt-2 text-base text-slate-300">
            Explore diverse escape room themes from thrilling horror adventures to challenging mystery puzzles and exciting sci-fi quests. Filter by theme to discover your ideal escape room experience.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayThemes.map((themeData, index) => (
            <Link
              key={themeData.theme || index}
              href={`/themes/${createSEOFriendlySlug(themeData.theme || 'unknown')}`}
              className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-escape-red/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <Card className="h-full overflow-hidden border border-slate-800 bg-slate-900 shadow-lg transition hover:border-escape-red/50 hover:shadow-xl hover:shadow-escape-red/20">
                <div className="relative aspect-[5/3] overflow-hidden bg-slate-800">
                  <Image
                    src={getThemeImage(themeData.theme || '')}
                    alt={`${themeData.theme} - Discover ${themeData.count} themed escape room experiences`}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index < 3}
                    placeholder="blur"
                    blurDataURL={blurDataURL}
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
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/themes">
            <Button size="lg" className="h-12 px-10">
              View all themes
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
