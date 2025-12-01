import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Building2, Globe } from "lucide-react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import Link from "next/link"
import Image from "next/image"
import { getCountryStats } from '@/lib/data-source'
import { Metadata } from 'next'

// Enable ISR - revalidate every 24 hours
export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Escape Rooms By Country | Find Escape Room Adventures Worldwide',
  description: 'Discover escape rooms around the world. Browse by country to find the best escape room experiences with detailed reviews and ratings.',
  openGraph: {
    title: 'Escape Rooms By Country | Find Escape Room Adventures Worldwide',
    description: 'Discover escape rooms around the world. Browse by country to find the best escape room experiences with detailed reviews and ratings.',
    type: 'website',
    url: 'https://escaperoomsfinder.com/locations',
  },
  alternates: {
    canonical: 'https://escaperoomsfinder.com/locations'
  }
}

// Define available countries with their metadata
const COUNTRIES = [
  {
    code: 'united-states',
    name: 'United States',
    description: 'Discover thousands of escape rooms across all 50 states',
    image: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-content/uploads/2025/11/united-states-scaled.jpg`,
    available: true
  },
  {
    code: 'canada',
    name: 'Canada',
    description: 'Explore escape rooms from coast to coast in Canada',
    image: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-content/uploads/2025/11/canada-scaled-1-scaled.jpg`,
    available: false // Will be available soon
  },
  {
    code: 'united-kingdom',
    name: 'United Kingdom',
    description: 'Find amazing escape room experiences across the UK',
    image: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-content/uploads/2025/11/united-kingdom.jpg`,
    available: false // Will be available soon
  }
];

export default async function LocationsPage() {
  // Fetch country statistics
  const { data: countryStats, error } = await getCountryStats()

  // Find USA stats with better matching
  const usaStats = countryStats?.find(country => {
    const countryName = country.country?.toLowerCase().trim()
    return countryName === 'usa' ||
      countryName === 'united states' ||
      countryName === 'us' ||
      countryName === 'america'
  })

  // Log for debugging
  if (!usaStats && countryStats) {
    console.log('Available countries:', countryStats.map(c => c.country))
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
                <BreadcrumbPage>Escape Rooms By Country</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative text-white py-20 overflow-hidden border-b border-slate-200">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-content/uploads/2025/11/locations-hero-scaled.png`}
            alt="Escape Rooms Worldwide - Discover Amazing Adventures"
            fill
            priority
            className="object-cover"
            sizes="100vw"
            quality={85}
          />
        </div>

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
                <Globe className="h-6 w-6 text-escape-red" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-escape-red">Locations</span>
                <h1 className="mt-1 text-3xl font-semibold text-white">Escape Rooms Worldwide</h1>
              </div>
            </div>
            <p className="text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
              Discover amazing escape rooms around the globe. Choose your country to start exploring unique escape room experiences worldwide.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-escape-red">Browse by country</span>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Choose Your Country</h2>
          <p className="mt-2 text-base text-slate-600 max-w-2xl">
            Select a country below to discover escape rooms in your region. More countries are being added regularly!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {COUNTRIES.map((country) => (
            <Card
              key={country.code}
              className={`overflow-hidden transition-all duration-300 border border-slate-200 bg-white shadow-sm ${country.available
                ? 'hover:shadow-md hover:border-escape-red/30'
                : 'opacity-75'
                }`}
            >
              <div className="relative h-48">
                <Image
                  src={country.image}
                  alt={`Escape Rooms in ${country.name} - Discover amazing escape room experiences`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  {...(country.code === 'united-states' ? { priority: true } : { loading: 'lazy' })}
                />
                <div className="absolute top-3 right-3">
                  <Badge className={`text-xs font-semibold ${country.available
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-500 text-white'
                    }`}>
                    {country.available ? 'Available' : 'Coming Soon'}
                  </Badge>
                </div>
              </div>

              <CardHeader className="p-5 pb-3">
                <CardTitle className="flex items-center gap-2 text-slate-900 text-xl font-semibold">
                  <Globe className={`h-5 w-5 ${country.available ? 'text-escape-red' : 'text-slate-400'}`} />
                  {country.name}
                </CardTitle>
                <p className="text-sm text-slate-600 mt-2">
                  {country.description}
                </p>
              </CardHeader>

              <CardContent className="px-5 pb-5">
                {country.available ? (
                  <Link href={`/locations/${country.code}`}>
                    <div className="w-full bg-escape-red hover:bg-escape-red-600 text-white h-10 px-6 rounded-md text-center transition-colors font-semibold text-sm flex items-center justify-center">
                      Explore {country.name}
                    </div>
                  </Link>
                ) : (
                  <div className="w-full bg-slate-200 text-slate-600 h-10 px-6 rounded-md text-center font-semibold text-sm cursor-not-allowed flex items-center justify-center">
                    Coming Q2 2025
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>


      </div>
    </div>
  )
}
