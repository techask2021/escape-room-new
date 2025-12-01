import { Metadata } from 'next'
import { parseStateFromURL, getFullStateName, getEscapeRoomsByState, getCitiesWithCounts, getStatesWithRoomCounts, formatRoomForDisplay, formatStateForURL } from "@/lib/data-source"
import { createStateMetadata } from '@/lib/metadata'
import { Card, CardContent } from "@/components/ui/card"
import { Building2, MapPin, Key, Lock, Clock, Search, Puzzle, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import EscapeRoomCard from "@/components/escape-room-card"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"
import LocationHero from "@/components/location-hero"

// Enable ISR - revalidate every 24 hours
export const revalidate = 86400

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ country: string; state: string }> }): Promise<Metadata> {
  const { country, state } = await params
  const resolvedStateName = parseStateFromURL(state)
  const fullStateName = getFullStateName(resolvedStateName)
  const countryDisplayName = country === 'united-states' ? 'United States' : country.charAt(0).toUpperCase() + country.slice(1)

  return createStateMetadata(
    fullStateName,
    countryDisplayName
  )
}

export default async function StatePage({ params }: { params: Promise<{ country: string; state: string }> }) {
  const { country, state } = await params
  const resolvedStateName = parseStateFromURL(state)
  const fullStateName = getFullStateName(resolvedStateName)
  const countryDisplayName = country === 'united-states' ? 'United States' : country.charAt(0).toUpperCase() + country.slice(1)

  // Fetch all data in parallel on the server
  const [roomsResult, citiesResult, statesResult] = await Promise.all([
    getEscapeRoomsByState(resolvedStateName, 50),
    getCitiesWithCounts(resolvedStateName),
    getStatesWithRoomCounts()
  ])

  const roomsData = roomsResult.data || []
  const citiesData = citiesResult.data || []
  const statesData = statesResult.data || []

  // Format the data
  const formattedRooms = roomsData.map(formatRoomForDisplay)
  const featuredRooms = formattedRooms.slice(0, 6)

  const cities = citiesData.map(city => ({
    name: city.city,
    rooms: city.count,
  }))

  const popularStates = statesData
    .filter(s => s.state.toLowerCase() !== resolvedStateName.toLowerCase())
    .sort((a, b) => b.room_count - a.room_count)
    .slice(0, 4)

  const stateData = {
    name: fullStateName,
    totalRooms: roomsData.length,
    totalCities: citiesData.length,
    image: `${WORDPRESS_URL}/wp-content/uploads/2025/11/hero-pages-scaled.png`,
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="border-b border-slate-100 bg-white">
          <div className="container mx-auto px-4 py-4">
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
                  <BreadcrumbLink href={`/locations/${country}`}>
                    {countryDisplayName}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{fullStateName}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Hero Section */}
        <LocationHero
          title={`Best Escape Rooms in ${fullStateName}`}
          subtitle={fullStateName}
          description={`Discover ${stateData.totalRooms} thrilling escape room adventures across ${stateData.totalCities} ${stateData.totalCities === 1 ? 'city' : 'cities'} in ${fullStateName}. From mind-bending puzzles to immersive storylines, find your next challenge.`}
          imageUrl={stateData.image}
        />

        {/* Featured Rooms Section */}
        <section className="w-full py-16 bg-white border-t border-slate-100">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-escape-red">Featured rooms</span>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Featured Escape Rooms in {fullStateName}</h2>
              <p className="mt-2 text-base text-slate-600 max-w-2xl">
                Discover the best escape room experiences in {fullStateName} with detailed reviews and ratings.
              </p>
            </div>
            {featuredRooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredRooms.map((room, index) => (
                  <EscapeRoomCard key={room.id || index} room={room} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No escape rooms found for {fullStateName}</p>
                <p className="text-sm text-gray-500 mt-2">Check back later for new listings!</p>
              </div>
            )}
          </div>
        </section>

        {/* Cities Grid */}
        <section className="w-full py-12 bg-slate-50 border-t border-slate-100">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-escape-red">Browse by city</span>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Popular Cities in {fullStateName}</h2>
              <p className="mt-2 text-base text-slate-600 max-w-2xl">
                Explore escape rooms in different cities throughout {fullStateName}
              </p>
            </div>
            {cities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cities.map((city) => (
                  <Link
                    key={city.name}
                    href={`/locations/${country}/${state}/${city.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="group"
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-200 border-slate-200 hover:border-escape-red/40">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-escape-red/10 border border-escape-red/20 group-hover:bg-escape-red/20 transition-colors">
                              <MapPin className="h-5 w-5 text-escape-red" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900 group-hover:text-escape-red transition-colors">
                                {city.name}
                              </h3>
                              <p className="text-sm text-slate-600">
                                {city.rooms} {city.rooms === 1 ? 'room' : 'rooms'}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-escape-red group-hover:translate-x-1 transition-all" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No cities found for {fullStateName}</p>
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
                  {popularStates.map((stateItem) => (
                    <Link
                      key={stateItem.state}
                      href={`/locations/${country}/${formatStateForURL(stateItem.state)}`}
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
