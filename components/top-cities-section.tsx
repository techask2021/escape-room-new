import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Building2, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { formatCityForURL, formatStateForURL } from "@/lib/data-source"

// Helper function to get city image
const getCityImage = (cityName: string) => {
  const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const cityImages: { [key: string]: string } = {
    'Los Angeles': `${wpUrl}/wp-content/uploads/2025/11/Los-Angeles-scaled-1.jpg`,
    'Las Vegas': `${wpUrl}/wp-content/uploads/2025/11/Las-Vegas-scaled-1.jpg`,
    'Orlando': `${wpUrl}/wp-content/uploads/2025/11/Orlando-scaled-1.jpg`,
    'San Diego': `${wpUrl}/wp-content/uploads/2025/11/San-Diego-scaled-1.jpg`,
    'Atlanta': `${wpUrl}/wp-content/uploads/2025/11/Atlanta-scaled-1.jpg`,
    'Houston': `${wpUrl}/wp-content/uploads/2025/11/Houston-scaled-1.jpg`,
  }

  return cityImages[cityName] || `${wpUrl}/wp-content/uploads/2025/11/hero-pages-scaled.png`
}

const blurDataURL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6gAAAAABJRU5ErkJggg=="

// Real data from database query
const topCitiesData = [
  { city: "Los Angeles", state: "California", room_count: 25 },
  { city: "Las Vegas", state: "Nevada", room_count: 19 },
  { city: "Orlando", state: "Florida", room_count: 16 },
  { city: "San Diego", state: "California", room_count: 15 },
  { city: "Atlanta", state: "Georgia", room_count: 14 },
  { city: "Houston", state: "Texas", room_count: 12 }
]

export default function TopCitiesSection() {
  const topCities = topCitiesData

  return (
    <section className="border-t border-slate-200 bg-slate-950 py-16 text-white relative" style={{ backgroundImage: 'none', background: '#020617' }}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-escape-red">Top destinations</span>
          <h2 className="mt-3 text-3xl font-semibold text-white">Top Rated Cities For Escape Rooms</h2>
          <p className="mt-2 text-base text-slate-300">
            Explore major cities with the largest selection of highly-rated escape room venues. These destinations offer diverse options for every skill level and group size, making them ideal for escape room enthusiasts.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topCities.map((cityData, index) => {
            const citySlug = formatCityForURL(cityData.city)
            const stateSlug = formatStateForURL(cityData.state)
            const cityUrl = `/locations/usa/${stateSlug}/${citySlug}`

            return (
              <Link
                key={`${cityData.city}-${cityData.state}`}
                href={cityUrl}
                className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-escape-red/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <Card className="h-full overflow-hidden border border-slate-800 bg-slate-900 shadow-lg transition hover:border-escape-red/50 hover:shadow-xl hover:shadow-escape-red/20">
                  {/* City Image with Overlay - Reduced Size */}
                  <div className="relative aspect-[21/10] overflow-hidden bg-slate-800">
                    <Image
                      src={getCityImage(cityData.city)}
                      alt={`${cityData.city}, ${cityData.state} - Escape Rooms`}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index < 3}
                      placeholder="blur"
                      blurDataURL={blurDataURL}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                    {/* Ranking Badge - Unique corner style */}
                    <div className="absolute right-0 top-0">
                      <div className="bg-escape-red px-4 py-2 shadow-lg">
                        <span className="text-xs font-bold text-white">#{index + 1}</span>
                      </div>
                      <div className="absolute right-0 top-full w-0 h-0 border-l-[12px] border-l-transparent border-t-[12px] border-t-escape-red/80" />
                    </div>

                    {/* City Info Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <div className="flex items-end justify-between">
                        <div>
                          <h3 className="text-2xl font-bold text-white group-hover:text-escape-red transition-colors">
                            {cityData.city}
                          </h3>
                          <p className="mt-1 text-sm text-white/80">{cityData.state}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                            <Star className="h-3 w-3 fill-white text-white" />
                            Highly Rated
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Content - Minimalist */}
                  <div className="p-5">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-escape-red/10">
                          <Building2 className="h-5 w-5 text-escape-red" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-400">Escape Rooms</p>
                          <p className="text-xl font-bold text-white">{cityData.room_count}</p>
                        </div>
                      </div>
                    </div>

                    {/* Explore Button - Match listing cards style */}
                    <div className="mt-4">
                      <div className="inline-flex h-9 items-center justify-center rounded-md bg-escape-red px-6 text-xs font-semibold text-white transition-all hover:bg-escape-red/90 hover:shadow-md group-hover:scale-105">
                        Explore rooms
                        <svg className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/locations">
            <Button size="lg" className="h-12 px-10">
              View all locations
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
