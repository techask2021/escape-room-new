import { Metadata } from 'next'
import { parseStateFromURL, parseCityFromURL, formatStateForURL, getEscapeRoomsByCity, formatRoomForDisplay } from '@/lib/data-source'
import { createCityMetadata } from '@/lib/metadata'
import { Card, CardContent } from "@/components/ui/card"
import { Building2, MapPin } from "lucide-react"
import EscapeRoomCard from "@/components/escape-room-card"
import { Button } from "@/components/ui/button"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import Link from "next/link"
import LocationHero from "@/components/location-hero"

// Enable ISR - revalidate every 15 minutes
export const revalidate = 900

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL

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

interface CityPageProps {
  params: Promise<{ country: string; state: string; city: string }>
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const stateName = parseStateFromURL(resolvedParams.state)
  const cityName = parseCityFromURL(resolvedParams.city)
  const countryName = resolvedParams.country

  // Fetch room count for this city
  const { data: roomsData } = await getEscapeRoomsByCity(cityName, stateName)
  const roomCount = roomsData?.length || 0

  return createCityMetadata(
    cityName,
    stateName,
    countryName,
    roomCount
  )
}

export default async function CityPage({ params }: CityPageProps) {
  const resolvedParams = await params
  const countryName = resolvedParams.country
  const stateName = parseStateFromURL(resolvedParams.state)
  const cityName = parseCityFromURL(resolvedParams.city)
  const stateAbbr = getStateAbbreviation(stateName)

  // Fetch data on the server
  const { data: roomsData } = await getEscapeRoomsByCity(cityName, stateName)
  const rooms = roomsData?.map(formatRoomForDisplay) || []

  const cityData = {
    name: cityName,
    state: stateName,
    totalRooms: rooms.length,
    image: `${WORDPRESS_URL}/wp-content/uploads/2025/11/hero-pages-scaled.png`,
  }

  const countryDisplayName = countryName === 'usa' || countryName === 'united-states' ? 'United States' :
                             countryName === 'canada' ? 'Canada' :
                             countryName === 'united-kingdom' ? 'United Kingdom' :
                             countryName.charAt(0).toUpperCase() + countryName.slice(1)

  // Generate structured data for the city page
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
            "name": countryDisplayName,
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
              "@id": `https://escaperoomsfinder.com/locations/${countryName}/${formatStateForURL(stateName)}/${formatStateForURL(cityName)}/${room.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
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
                "ratingCount": room.reviews || 1
              } : undefined
            }
          }))
        }
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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
                    {countryDisplayName}
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
        <LocationHero
          title={`Best Escape Rooms in ${cityName}, ${stateAbbr}`}
          subtitle={cityName}
          description={`Discover ${cityData.totalRooms} thrilling escape room adventures in ${cityName}, ${stateAbbr}. From mind-bending puzzles to immersive storylines, find your next challenge.`}
          imageUrl={`${WORDPRESS_URL}/wp-content/uploads/2025/11/hero-pages-scaled.png`}
        />

        {/* All Escape Rooms Section */}
        <section className="w-full py-12 bg-slate-50 border-t border-slate-100">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-escape-red">All listings</span>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">All Escape Rooms in {cityName}</h2>
              <p className="mt-2 text-base text-slate-600 max-w-2xl">
                Browse through all available escape room adventures in {cityName}, {stateAbbr}. Each listing includes ratings, themes, difficulty levels, and booking information to help you find the perfect escape room experience.
              </p>
            </div>
            {rooms.length > 0 ? (
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
