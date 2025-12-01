"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Building2, MapPin, Key, Lock, Clock, Search, Puzzle, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import EscapeRoomCard from "@/components/escape-room-card"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getEscapeRoomsByState, getCitiesWithCounts, getStatesWithRoomCounts, formatRoomForDisplay, formatStateForURL, formatCityForURL, parseStateFromURL, getFullStateName } from "@/lib/data-source"

// Get WordPress URL at module level for client components
const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

interface StatePageClientProps {
  country: string
  state: string
}

export default function StatePageClient({ country, state }: StatePageClientProps) {
  const [stateData, setStateData] = useState<any>(null)
  const [cities, setCities] = useState<any[]>([])
  const [rooms, setRooms] = useState<any[]>([])
  const [popularStates, setPopularStates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stateName, setStateName] = useState<string>('')
  const [countryName, setCountryName] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    async function loadStateData() {
      try {
        setLoading(true)
        setError(null)
        
        // Get the country and state name
        const resolvedStateName = parseStateFromURL(state)
        const fullStateName = getFullStateName(resolvedStateName)
        const resolvedCountryName = country
        setStateName(fullStateName)
        setCountryName(resolvedCountryName)
        
        // Load escape rooms for this state
        const { data: roomsData, error: roomsError } = await getEscapeRoomsByState(resolvedStateName, 50)
        if (roomsError) {
          throw new Error('Failed to load escape rooms')
        }
        

        
        // Load cities for this state
        const { data: citiesData, error: citiesError } = await getCitiesWithCounts(resolvedStateName)
        if (citiesError) {
          console.error('Cities error:', citiesError)
          throw new Error('Failed to load cities')
        }

        // Load popular states (top 4)
        const { data: statesData } = await getStatesWithRoomCounts()
        const topStates = statesData
          .filter(s => s.state.toLowerCase() !== resolvedStateName.toLowerCase()) // Exclude current state
          .sort((a, b) => b.room_count - a.room_count)
          .slice(0, 4)

        // Format the data
        const formattedRooms = roomsData.map(formatRoomForDisplay)
        const topCities = citiesData // Show all cities
        
        // Set state data
        setStateData({
          name: fullStateName,
          totalRooms: roomsData.length,
          totalCities: citiesData.length,
          image: `${WORDPRESS_URL}/wp-content/uploads/2025/11/hero-pages-scaled.png`,
        })
        
        setCities(topCities.map(city => ({
          name: city.city,
          rooms: city.count,
        })))

        setPopularStates(topStates)

        setRooms(formattedRooms.slice(0, 6)) // Show top 6 featured rooms
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    
    loadStateData()
  }, [country, state, mounted])

  // Generate structured data for SEO
  const generateStructuredData = () => {
    if (!stateData || !stateName || !countryName) return null

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
              "item": "https://escaperoomsfinder.com/"
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
              "name": countryName === 'united-states' ? 'United States' : countryName.charAt(0).toUpperCase() + countryName.slice(1),
              "item": `https://escaperoomsfinder.com/locations/${countryName}`
            },
            {
              "@type": "ListItem",
              "position": 4,
              "name": stateName,
              "item": `https://escaperoomsfinder.com/locations/${countryName}/${formatStateForURL(stateName)}`
            }
          ]
        },
        {
          "@type": "CollectionPage",
          "name": `Escape Rooms in ${stateName}`,
          "description": `Discover thrilling escape room adventures across multiple cities in ${stateName}. Find the best escape rooms with reviews, ratings, and booking information.`,
          "url": `https://escaperoomsfinder.com/locations/${countryName}/${formatStateForURL(stateName)}`,
          "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": stateData.totalRooms,
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
                  "addressRegion": stateName,
                  "addressCountry": countryName === 'united-states' ? 'US' : countryName.toUpperCase()
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

  if (!mounted) {
    return null
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading {stateName}</h1>
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
      {/* Structured Data */}
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
                    {countryName === 'united-states' ? 'United States' : countryName.charAt(0).toUpperCase() + countryName.slice(1)}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{stateName}</BreadcrumbPage>
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
                    {stateName}
                  </span>
                  <h1 className="mt-1 text-3xl font-semibold text-white">
                    Best Escape Rooms in {stateName}
                  </h1>
                </div>
              </div>
              <p className="text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
                {loading ? (
                  <>Loading state information...</>
                ) : (
                  <>Discover thrilling escape room adventures across multiple cities in {stateName}. From mind-bending puzzles to immersive storylines, find your next challenge.</>
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Featured Rooms Section */}
        <section className="w-full py-16 bg-white border-t border-slate-100">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-escape-red">Featured rooms</span>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Featured Escape Rooms in {stateName}</h2>
              <p className="mt-2 text-base text-slate-600 max-w-2xl">
                Discover the best escape room experiences in {stateName} with detailed reviews and ratings.
              </p>
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
              <div className="text-center py-8">
                <p className="text-gray-600">No escape rooms found for {stateName}</p>
                <p className="text-sm text-gray-500 mt-2">Check back later for new listings!</p>
              </div>
            )}
          </div>
        </section>

        {/* Cities Grid - Full Width Section */}
        <section className="w-full py-12 bg-slate-50 border-t border-slate-100">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-escape-red">Browse by city</span>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Popular Cities in {stateName}</h2>
              <p className="mt-2 text-base text-slate-600 max-w-2xl">
                Select a city below to discover escape rooms in your area.
              </p>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-escape-red rounded-full animate-spin"></div>
                  <p className="text-gray-600">Loading cities...</p>
                </div>
              </div>
            ) : cities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cities.map((city, index) => {
                  const icons = [Key, Lock, Puzzle, Search];
                  const IconComponent = icons[index % icons.length];
                  
                  // Different background colors for variety - matching state cards style
                  const backgroundColors = [
                    'bg-gradient-to-br from-red-50 via-white to-red-50/50',
                    'bg-gradient-to-br from-slate-50 via-white to-slate-50/50',
                    'bg-gradient-to-br from-escape-red/5 via-white to-escape-red/5',
                    'bg-gradient-to-br from-blue-50 via-white to-blue-50/50',
                    'bg-gradient-to-br from-purple-50 via-white to-purple-50/50',
                    'bg-gradient-to-br from-orange-50 via-white to-orange-50/50',
                  ];
                  
                  const backgroundColor = backgroundColors[index % backgroundColors.length];
                  
                  return (
                    <Link 
                      key={city.name} 
                      href={`/locations/${countryName}/${formatStateForURL(stateName)}/${formatCityForURL(city.name)}`}
                      className="group block"
                    >
                      <Card className={`h-full transition-all duration-300 border border-slate-200 ${backgroundColor} shadow-sm hover:shadow-md hover:border-escape-red/30 overflow-hidden`}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-escape-red/10 border border-escape-red/20">
                              <IconComponent className="h-5 w-5 text-escape-red" />
                            </div>
                            <Badge variant="secondary" className="text-xs font-semibold uppercase tracking-wide text-slate-500 bg-slate-100 border-slate-200">
                              City
                            </Badge>
                          </div>
                          
                          <div className="mb-6">
                            <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-escape-red transition-colors">
                              {city.name}
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-3">
                              Discover exciting escape room adventures in {city.name}
                            </p>
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                              <Building2 className="h-4 w-4 text-escape-red" />
                              <span>{city.rooms} rooms</span>
                            </div>
                          </div>
                          
                          <div className="w-full bg-escape-red hover:bg-escape-red-600 text-white h-9 px-6 rounded-md text-center transition-colors font-semibold text-xs flex items-center justify-center gap-2">
                            Explore {city.name}
                            <ArrowRight className="h-3 w-3" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No cities found for {stateName}</p>
              </div>
            )}
          </div>
        </section>

        {/* Explore More States Section */}
        {popularStates.length > 0 && (
          <section className="w-full py-16 bg-white border-t border-slate-100">
            <div className="container mx-auto px-4">
              <div className="mb-10">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-escape-red">Explore more</span>
                <h2 className="mt-3 text-3xl font-semibold text-slate-900">Explore More States</h2>
                <p className="mt-2 text-base text-slate-600 max-w-2xl">
                  Discover escape rooms in neighboring states and popular destinations
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="h-5 w-5 text-escape-red" />
                  <h3 className="text-lg font-semibold text-slate-900">Most Popular States</h3>
                </div>
                <p className="text-sm text-slate-600 mb-6">Top states for escape rooms</p>

                <div className="space-y-4">
                  {popularStates.map((stateItem, index) => (
                    <Link
                      key={stateItem.state}
                      href={`/locations/${countryName}/${formatStateForURL(stateItem.state)}`}
                      className="group block"
                    >
                      <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-gradient-to-r from-white to-slate-50 hover:border-escape-red/40 hover:from-escape-red/5 hover:to-escape-red/10 transition-all duration-200">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-escape-red/10 border border-escape-red/20 group-hover:bg-escape-red/20 transition-colors">
                            <MapPin className="h-6 w-6 text-escape-red" />
                          </div>
                          <div>
                            <h4 className="text-base font-semibold text-slate-900 group-hover:text-escape-red transition-colors">
                              {stateItem.state}
                            </h4>
                            <p className="text-sm text-slate-600">
                              {stateItem.city_count > 0 ? `${stateItem.city_count} cities` : 'Multiple cities'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-escape-red hover:bg-escape-red/90 text-white h-9 px-6"
                          >
                            {stateItem.room_count} rooms
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <Link href="/locations">
                  <Button size="lg" className="h-12 px-10 bg-escape-red hover:bg-escape-red/90">
                    View All Locations
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

      </div>
    </>
  )
}