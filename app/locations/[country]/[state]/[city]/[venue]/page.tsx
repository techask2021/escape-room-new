import { getEscapeRoomByVenue, getRoomAmenities, getRoomBusinessHours, parseStateFromURL, parseCityFromURL, parseVenueFromURL, getNearbyCities, getNearbyRooms, formatVenueForURL, type EscapeRoom, getAllEscapeRoomsForSitemap } from "@/lib/data-source"
import { notFound } from "next/navigation"
import { Metadata } from "next"

import { ReviewsSection } from "@/components/reviews/reviews-section"
import { createVenueMetadata } from "@/lib/metadata"
import { SharedBreadcrumb } from "@/components/shared-breadcrumb"
import VenueHero from "@/components/venue/venue-hero"
import VenueDescription from "@/components/venue/venue-description"
import VenueFeatures from "@/components/venue/venue-features"
import VenueDetails from "@/components/venue/venue-details"
import ContactInfo from "@/components/venue/contact-info"
import BusinessHours from "@/components/venue/business-hours"
import NearbyRooms from "@/components/venue/nearby-rooms"
import NearbyCities from "@/components/venue/nearby-cities"
import { formatStateForURL, formatCityForURL as formatCityForURLFunc } from "@/lib/data-source"

// Enable ISR - revalidate every 24 hours (data only changes on manual WordPress updates)
// Reduced from 30 minutes to save CPU and reduce WordPress API calls
export const revalidate = 86400

// Helper function to convert URL country format to page route format
function getCountryRouteFromURL(urlCountry: string): string {
  const countryMapping: Record<string, string> = {
    'united-states': 'usa',
    'canada': 'canada',
    'united-kingdom': 'uk'
  }
  return countryMapping[urlCountry] || urlCountry
}

// Generate static params for popular venues (pre-generate top 50 only)
// Generate static params for popular venues
// RETURNING EMPTY ARRAY TO PREVENT BUILD ISSUES
// All venue pages will be generated on-demand (ISR)
export async function generateStaticParams() {
  return []
}




export default async function VenueDetailPage({
  params
}: {
  params: Promise<{ country: string; state: string; city: string; venue: string }>
}) {
  // Await params in Next.js 15
  const { country, state, city, venue } = await params

  // Parse URL-friendly parameters back to readable format
  const stateName = parseStateFromURL(state)
  const cityName = parseCityFromURL(city)
  const venueName = parseVenueFromURL(venue)
  const countryRoute = getCountryRouteFromURL(country)

  const data = await fetchVenueData({
    venueName,
    cityName,
    stateName
  })

  if (!data.room) {
    notFound()
  }

  const { room, amenities, businessHours, nearbyCities, nearbyRooms } = data

  // Helper function to format time with AM/PM
  const formatTime = (timeStr: string): string => {
    if (!timeStr || timeStr === 'Closed') return timeStr

    // If already has AM/PM, return as is
    if (timeStr.includes('AM') || timeStr.includes('PM')) {
      return timeStr
    }

    // Handle 24-hour format (HH:MM:SS or HH:MM)
    const timeMatch = timeStr.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/)
    if (timeMatch) {
      let hours = parseInt(timeMatch[1])
      const minutes = timeMatch[2]
      const period = hours >= 12 ? 'PM' : 'AM'

      if (hours === 0) hours = 12
      else if (hours > 12) hours -= 12

      return `${hours}:${minutes} ${period}`
    }

    // Handle simple hour format (e.g., "9", "12")
    const hourMatch = timeStr.match(/^(\d{1,2})$/)
    if (hourMatch) {
      let hours = parseInt(hourMatch[1])
      const period = hours >= 12 ? 'PM' : 'AM'

      if (hours === 0) hours = 12
      else if (hours > 12) hours -= 12

      return `${hours}:00 ${period}`
    }

    return timeStr
  }

  // Parse working hours from JSON field or use business_hours table
  let schedule: { day: string; hours: string }[] = []
  if (room.working_hours) {
    try {
      const workingHours = JSON.parse(room.working_hours)
      schedule = Object.entries(workingHours).map(([day, hours]) => {
        if (hours === 'Closed' || !hours) {
          return { day, hours: 'Closed' }
        }

        // Handle range format like "12-9:30PM" or "9AM-5PM"
        const rangeMatch = (hours as string).match(/^([^-]+)-(.+)$/)
        if (rangeMatch) {
          const openTime = formatTime(rangeMatch[1].trim())
          const closeTime = formatTime(rangeMatch[2].trim())
          return { day, hours: `${openTime} - ${closeTime}` }
        }

        return { day, hours: formatTime(hours as string) }
      })
    } catch (e) {
      console.error('Error parsing working hours:', e)
    }
  }

  // Fallback to business_hours table if working_hours is not available
  if (schedule.length === 0) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    schedule = dayNames.map((dayName, index) => {
      const dayHours = businessHours?.find(h => h?.day_of_week === index)
      if (!dayHours || dayHours.is_closed) {
        return { day: dayName, hours: 'Closed' }
      }

      const openTime = formatTime(dayHours.open_time || '9:00')
      const closeTime = formatTime(dayHours.close_time || '21:00')

      return {
        day: dayName,
        hours: `${openTime} - ${closeTime}`
      }
    })
  }

  // Extract features from amenities and group by category
  const amenitiesByCategory = amenities?.reduce((acc, amenity) => {
    const category = amenity?.amenity_category || 'general'
    if (!acc[category]) acc[category] = []
    if (amenity?.amenity_name && amenity.is_available) {
      acc[category].push(amenity.amenity_name)
    }
    return acc
  }, {} as Record<string, string[]>) || {}

  const allFeatures = Object.values(amenitiesByCategory).flat()

  // Google Maps URL for location - use check_url from database if available
  const mapsUrl = room.check_url ||
    (room.latitude && room.longitude
      ? `https://www.google.com/maps?q=${room.latitude},${room.longitude}`
      : `https://www.google.com/maps/search/${encodeURIComponent(room.full_address || (room.name + ' ' + room.city + ' ' + room.state))}`)

  // Get state abbreviation for schema
  const stateAbbr = await getStateAbbreviation(stateName)
  const canonicalUrl = `https://escaperoomsfinder.com/locations/${country.toLowerCase()}/${stateName.toLowerCase().replace(/\s+/g, '-')}/${cityName.toLowerCase().replace(/\s+/g, '-')}/${venueName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

  // Parse address components for structured data
  const addressParts = room.full_address?.split(',') || []
  const streetAddress = addressParts[0]?.trim() || room.full_address || ''
  const postalCode = room.postal_code || ''

  // Format opening hours for schema
  const openingHoursSpecification = schedule
    .filter(day => day.hours !== 'Closed')
    .map(day => {
      const hoursMatch = day.hours.match(/(\d{1,2}:\d{2}\s?(?:AM|PM))\s*-\s*(\d{1,2}:\d{2}\s?(?:AM|PM))/i)
      if (hoursMatch) {
        const openTime = hoursMatch[1].toUpperCase().replace(/\s/g, '')
        const closeTime = hoursMatch[2].toUpperCase().replace(/\s/g, '')
        return {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": day.day,
          "opens": openTime,
          "closes": closeTime
        }
      }
      return null
    })
    .filter(Boolean)

  // Generate comprehensive LocalBusiness structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${canonicalUrl}#localbusiness`,
        "name": room.name,
        "description": room.description || `Experience ${room.name}, an exciting escape room located in ${cityName}, ${stateName}.`,
        "url": room.website || canonicalUrl,
        "telephone": room.phone || undefined,
        "image": room.photo ? (room.photo.startsWith('http') ? room.photo : `https://escaperoomsfinder.com${room.photo}`) : undefined,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": streetAddress,
          "addressLocality": room.city,
          "addressRegion": stateAbbr || stateName,
          "postalCode": postalCode,
          "addressCountry": country === 'united-states' ? 'US' : country.toUpperCase()
        },
        "geo": (room.latitude && room.longitude) ? {
          "@type": "GeoCoordinates",
          "latitude": parseFloat(room.latitude.toString()),
          "longitude": parseFloat(room.longitude.toString())
        } : undefined,
        "priceRange": room.price ? `$${room.price}` : "$$",
        "currenciesAccepted": "USD",
        "paymentAccepted": "Cash, Credit Card",
        "aggregateRating": room.rating ? {
          "@type": "AggregateRating",
          "ratingValue": parseFloat(room.rating.toString()),
          "reviewCount": room.review_count || 1,
          "bestRating": 5,
          "worstRating": 1
        } : undefined,
        "openingHoursSpecification": openingHoursSpecification.length > 0 ? openingHoursSpecification : undefined,
        "areaServed": {
          "@type": "City",
          "name": cityName
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Escape Room Experiences",
          "itemListElement": [{
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": `${room.name} Escape Room Experience`,
              "description": room.description || `An exciting escape room adventure at ${room.name}`,
              "serviceType": "Escape Room",
              "provider": {
                "@type": "LocalBusiness",
                "name": room.name
              }
            },
            "price": room.price ? `${room.price}` : undefined,
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          }]
        },
        "sameAs": room.website ? [room.website] : undefined
      },
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        "url": canonicalUrl,
        "name": `${room.name} - Escape Room in ${cityName}, ${stateName}`,
        "description": room.description || `Experience ${room.name}, an exciting escape room located in ${cityName}, ${stateName}.`,
        "primaryImageOfPage": room.photo ? {
          "@type": "ImageObject",
          "@id": `${canonicalUrl}#primaryimage`,
          "url": room.photo.startsWith('http') ? room.photo : `https://escaperoomsfinder.com${room.photo}`,
          "contentUrl": room.photo.startsWith('http') ? room.photo : `https://escaperoomsfinder.com${room.photo}`,
          "caption": room.name
        } : undefined,
        "breadcrumb": {
          "@id": `${canonicalUrl}#breadcrumb`
        },
        "mainEntity": {
          "@id": `${canonicalUrl}#localbusiness`
        },
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://escaperoomsfinder.com/#website"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
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
            "name": country === 'united-states' ? 'United States' : country,
            "item": `https://escaperoomsfinder.com/locations/${country.toLowerCase()}`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": stateName,
            "item": `https://escaperoomsfinder.com/locations/${country.toLowerCase()}/${stateName.toLowerCase().replace(/\s+/g, '-')}`
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": cityName,
            "item": `https://escaperoomsfinder.com/locations/${country.toLowerCase()}/${stateName.toLowerCase().replace(/\s+/g, '-')}/${cityName.toLowerCase().replace(/\s+/g, '-')}`
          },
          {
            "@type": "ListItem",
            "position": 5,
            "name": venueName,
            "item": canonicalUrl
          }
        ]
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
          <SharedBreadcrumb
            items={[
              { name: "Home", href: "https://escaperoomsfinder.com/" },
              {
                name: country === 'united-states' ? 'United States' :
                  country === 'united-kingdom' ? 'United Kingdom' :
                    country === 'canada' ? 'Canada' : country,
                href: `https://escaperoomsfinder.com/locations/${country.toLowerCase()}`
              },
              {
                name: stateName,
                href: `https://escaperoomsfinder.com/locations/${country.toLowerCase()}/${stateName.toLowerCase().replace(/\s+/g, '-')}`
              },
              {
                name: cityName,
                href: `https://escaperoomsfinder.com/locations/${country.toLowerCase()}/${stateName.toLowerCase().replace(/\s+/g, '-')}/${cityName.toLowerCase().replace(/\s+/g, '-')}`
              },
              { name: venueName } // Current page, no href
            ]}
          />
        </div>
      </div>

      {/* Hero Section */}
      <VenueHero
        name={room.name}
        city={room.city || cityName}
        state={room.state || stateName}
        photo={room.photo}
        rating={room.rating?.toString()}
        reviewCount={room.review_count}
      />

      {/* Main Content with Sidebar */}
      <section className="py-12 bg-gradient-to-br from-slate-50 via-white to-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <VenueDescription
                description={room.description}
                postContent={room.post_content}
              />

              {/* Features */}
              <VenueFeatures features={allFeatures as string[]} />

              {/* Reviews Section */}
              <ReviewsSection
                roomId={room.id}
                averageRating={room.rating || 0}
                totalReviews={room.review_count || 0}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Venue Details */}
              <VenueDetails
                difficulty={room.difficulty}
                teamSize={room.team_size}
                duration={room.duration}
                price={room.price}
                orderLinks={room.order_links}
              />

              {/* Contact Information */}
              <ContactInfo
                fullAddress={room.full_address}
                latitude={room.latitude}
                longitude={room.longitude}
                venueName={room.name}
                phone={room.phone}
                website={room.website}
                mapsUrl={mapsUrl}
              />

              {/* Business Hours */}
              <BusinessHours schedule={schedule} />

              {/* Nearby Escape Rooms */}
              <NearbyRooms
                nearbyRooms={(nearbyRooms || []).filter(room => room.city && room.state) as any[]}
                currentRoomId={room.id}
                country={country}
                state={state}
                city={city}
              />

              {/* Nearby Cities */}
              <NearbyCities
                nearbyCities={nearbyCities || []}
                currentCity={room.city || cityName}
                country={country}
                state={state}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

async function fetchVenueData({
  venueName,
  cityName,
  stateName
}: {
  venueName: string
  cityName: string
  stateName: string
}) {
  const { data: room, error } = await getEscapeRoomByVenue(venueName, cityName, stateName)

  if (error || !room) {
    return {
      room: null,
      amenities: [],
      businessHours: [],
      nearbyCities: [],
      nearbyRooms: []
    }
  }

  const [amenities, businessHours, nearbyCitiesResult, nearbyRoomsResult] = await Promise.all([
    getRoomAmenities(room.id),
    getRoomBusinessHours(room.id),
    getNearbyCities(stateName),
    getNearbyRooms(room.id, cityName, stateName)
  ])

  return {
    room,
    amenities,
    businessHours,
    nearbyCities: nearbyCitiesResult?.data || [],
    nearbyRooms: nearbyRoomsResult?.data || []
  }
}

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

// Generate metadata for SEO
export async function generateMetadata({
  params
}: {
  params: Promise<{ country: string; state: string; city: string; venue: string }>
}): Promise<Metadata> {
  const { country, state, city, venue } = await params

  const stateName = parseStateFromURL(state)
  const cityName = parseCityFromURL(city)
  const venueName = parseVenueFromURL(venue)

  const { data: room } = await getEscapeRoomByVenue(venueName, cityName, stateName)

  if (!room) {
    return {
      title: 'Escape Room Not Found | Escape Rooms Finder',
      description: 'The requested escape room could not be found. Browse other escape rooms in your area.',
      robots: {
        index: false,
        follow: true
      }
    }
  }

  // Get state abbreviation from database
  const stateAbbr = await getStateAbbreviation(stateName)

  const description = room.description || `Experience ${room.name}, an exciting escape room located in ${cityName}, ${stateName}.`
  const rating = room.rating

  return createVenueMetadata(
    room.name,
    cityName,
    stateName,
    description,
    country,
    rating,
    stateAbbr
  )
}