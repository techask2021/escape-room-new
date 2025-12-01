"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Building2, MapPin, Star } from "lucide-react"
import EscapeRoomCard from "@/components/escape-room-card"
import { Button } from "@/components/ui/button"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getEscapeRoomsByCity, formatRoomForDisplay, formatStateForURL, parseStateFromURL, parseCityFromURL } from "@/lib/data-source"

// Get WordPress URL at module level for client components
const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

// State abbreviation mapping
const STATE_ABBREVIATIONS: Record<string, string> = {
  'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR', 'california': 'CA',
  'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE', 'florida': 'FL', 'georgia': 'GA',
  'hawaii': 'HI', 'idaho': 'ID', 'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA',
  'kansas': 'KS', 'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
  'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS', 'missouri': 'MO',
  'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV', 'new-hampshire': 'NH', 'new-jersey': 'NJ',
  'new-mexico': 'NM', 'new-york': 'NY', 'north-carolina': 'NC', 'north-dakota': 'ND', 'ohio': 'OH',
  'oklahoma': 'OK', 'oregon': 'OR', 'pennsylvania': 'PA', 'rhode-island': 'RI', 'south-carolina': 'SC',
  'south-dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT', 'vermont': 'VT',
  'virginia': 'VA', 'washington': 'WA', 'west-virginia': 'WV', 'wisconsin': 'WI', 'wyoming': 'WY'
}

// Function to get state abbreviation
function getStateAbbreviation(stateName: string): string {
  const normalized = stateName.toLowerCase().replace(/\s+/g, '-')
  return STATE_ABBREVIATIONS[normalized] || stateName.toUpperCase().substring(0, 2)
}

interface CityPageClientProps {
  params: Promise<{ country: string; state: string; city: string }>
}

export default function CityPageClient({ params }: CityPageClientProps) {
  const [cityData, setCityData] = useState<any>(null)
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stateName, setStateName] = useState<string>('')
  const [stateAbbr, setStateAbbr] = useState<string>('')
  const [cityName, setCityName] = useState<string>('')
  const [countryName, setCountryName] = useState<string>('')

  useEffect(() => {
    async function loadCityData() {
      try {
        setLoading(true)
        setError(null)
        
        // Get the names from async params
        const resolvedParams = await params
        const resolvedCountryName = resolvedParams.country
        const resolvedStateName = parseStateFromURL(resolvedParams.state)
        const resolvedCityName = parseCityFromURL(resolvedParams.city)
        const resolvedStateAbbr = await getStateAbbreviation(resolvedStateName)
        
        setCountryName(resolvedCountryName)
        setStateName(resolvedStateName)
        setStateAbbr(resolvedStateAbbr)
        setCityName(resolvedCityName)
        
        // Load escape rooms for this city and state
        const { data: roomsData, error: roomsError } = await getEscapeRoomsByCity(resolvedCityName, resolvedStateName)
        if (roomsError) {
          throw new Error('Failed to load escape rooms')
        }
        
        // Format the data
        const formattedRooms = roomsData.map(formatRoomForDisplay)
        
        // Set city data
        setCityData({
          name: resolvedCityName,
          state: resolvedStateName,
          totalRooms: roomsData.length,
          image: `${WORDPRESS_URL}/wp-content/uploads/2025/11/hero-pages-scaled.png`,
        })
        
        setRooms(formattedRooms)
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    
    loadCityData()
  }, [params])

  // Generate structured data for the city page
  const generateStructuredData = () => {
    if (!cityData || !rooms.length) return null

    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://escaperoomsfinder.com"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Locations",
              "item": "https://escaperoomsfinder.com/locations"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": countryName === 'usa' ? 'United States' : 
                      countryName === 'united-states' ? 'United States' :
                      countryName === 'canada' ? 'Canada' : 
                      countryName === 'united-kingdom' ? 'United Kingdom' :
                      countryName.charAt(0).toUpperCase() + countryName.slice(1),
              "item": `https://escaperoomsfinder.com/locations/${countryName}`
            },
            {
              "@type": "ListItem",
              "position": 4,
              "name": stateName,
              "item": `https://escaperoomsfinder.com/locations/${countryName}/${formatStateForURL(stateName)}`
            },
            {
              "@type": "ListItem",
              "position": 5,
              "name": `${cityName}, ${stateAbbr}`,
              "item": `https://escaperoomsfinder.com/locations/${countryName}/${formatStateForURL(stateName)}/${formatStateForURL(cityName)}`
            }
          ]
        },
        {
          "@type": "CollectionPage",
          "name": `Best Escape Rooms in ${cityName}, ${stateAbbr}`,
          "description": `Explore ${cityData.totalRooms} thrilling escape room adventures in ${cityName}, ${stateAbbr}. Find the best escape rooms with reviews, ratings, and booking information.`,
          "url": `https://escaperoomsfinder.com/locations/${countryName}/${formatStateForURL(stateName)}/${formatStateForURL(cityName)}`,
          "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": cityData.totalRooms,
            "itemListElement": rooms.map((room, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "LocalBusiness",
                "@id": `https://escaperoomsfinder.com/escape-room/${room.slug}`,
                "name": room.name,
                "description": room.description,
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": room.city,
                  "addressRegion": stateAbbr,
                  "addressCountry": countryName === 'usa' ? 'US' : countryName.toUpperCase()
                },
                "aggregateRating": room.rating ? {
                  "@type": "AggregateRating",
                  "ratingValue": room.rating,
                  "ratingCount": room.reviewCount || 1
                } : undefined
              }
            }))
          }
        }
      ]
    }

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading {cityName}, {stateAbbr}</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      {generateStructuredData()}
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
                  <BreadcrumbLink href="/locations">Locations</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/locations/${countryName}`}>
                    {countryName === 'usa' ? 'United States' : 
                     countryName === 'united-states' ? 'United States' :
                     countryName === 'canada' ? 'Canada' : 
                     countryName === 'united-kingdom' ? 'United Kingdom' :
                     countryName.charAt(0).toUpperCase() + countryName.slice(1)}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/locations/${countryName}/${formatStateForURL(stateName)}`}>
                    {stateName}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{cityName}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Hero Section */}
        <section
          className="relative text-white py-20 overflow-hidden border-b border-slate-200"
          style={{
            backgroundImage: `url('${WORDPRESS_URL}/wp-content/uploads/2025/11/hero-pages-scaled.png')`,
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
                  <MapPin className="h-6 w-6 text-escape-red" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-escape-red">
                    {cityName}
                  </span>
                  <h1 className="mt-1 text-3xl font-semibold text-white">
                    Best Escape Rooms in {cityName}, {stateAbbr}
                  </h1>
                </div>
              </div>
              <p className="text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
                {loading ? (
                  <>Loading city information...</>
                ) : (
                  <>Discover {cityData?.totalRooms || 0} thrilling escape room adventures in {cityName}, {stateAbbr}. From mind-bending puzzles to immersive storylines, find your next challenge.</>
                )}
              </p>
            </div>
          </div>
        </section>

        {/* All Escape Rooms Section - Full Width with Gray Background */}
        <section className="w-full py-12 bg-slate-50 border-t border-slate-100">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-escape-red">All listings</span>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">All Escape Rooms in {cityName}</h2>
              {!loading && (
                <p className="mt-2 text-base text-slate-600 max-w-2xl">
                  Browse through all available escape room adventures in {cityName}, {stateAbbr}. Each listing includes ratings, themes, difficulty levels, and booking information to help you find the perfect escape room experience.
                </p>
              )}
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-escape-red rounded-full animate-spin"></div>
                  <p className="text-gray-600">Loading escape rooms...</p>
                </div>
              </div>
            ) : rooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <EscapeRoomCard key={room.id} room={room} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No escape rooms found</h3>
                <p className="text-gray-600 mb-4">We couldn&apos;t find any escape rooms in {cityName}, {stateAbbr}</p>
                <Link href={`/locations/${countryName}/${formatStateForURL(stateName)}`}>
                  <Button variant="outline">
                    Explore other cities in {stateName}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

      </div>
    </>
  )
}