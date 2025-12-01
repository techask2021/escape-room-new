import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Star } from "lucide-react"
import Image from "next/image"

interface HeroSectionProps {
  stats?: {
    totalRooms: number
    totalCities: number
    totalCountries: number
  }
}

export default function HeroSection({ stats }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-escape-red to-red-700 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Find The Best <span className="text-yellow-300">Escape Rooms</span> Near You
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                Escape Rooms Finder helps you discover amazing escape room experiences worldwide. Browse by theme or location to find the perfect adventure for your group!
              </p>
            </div>

            {/* Stats */}
            {stats && stats.totalRooms && (
              <div className="flex flex-wrap gap-6 md:gap-8">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                    <Search className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold">{(stats.totalRooms || 0).toLocaleString()}+</div>
                    <div className="text-sm text-white/80">Escape Rooms</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold">{(stats.totalCities || 0).toLocaleString()}+</div>
                    <div className="text-sm text-white/80">Cities</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                    <Star className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold">{(stats.totalCountries || 0).toLocaleString()}+</div>
                    <div className="text-sm text-white/80">Countries</div>
                  </div>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/browse">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-escape-red hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 text-base md:text-lg px-8 py-6"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Browse Escape Rooms
                </Button>
              </Link>
              <Link href="/locations">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 hover:border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 text-base md:text-lg px-8 py-6"
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  Explore Locations
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-4 pt-4 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-300 text-yellow-300" />
                <span>Real Reviews & Ratings</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Worldwide Locations</span>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative lg:block">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <Image
                src={`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-content/uploads/2025/11/hero-scaled.jpg`}
                alt="Discover Amazing Escape Room Adventures - Find the Perfect Escape Room Experience Near You"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                priority
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                  <div className="flex items-center gap-2 text-escape-red">
                    <Star className="h-5 w-5 fill-escape-red" />
                    <span className="font-bold text-lg">4.8/5</span>
                    <span className="text-sm text-gray-600">Average Rating</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="hidden xl:block absolute -top-6 -right-6 bg-white text-gray-800 rounded-xl p-4 shadow-xl transform rotate-3 hover:rotate-0 transition-transform">
              <div className="flex items-center gap-2">
                <div className="bg-escape-red text-white rounded-full p-2">
                  <Search className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-bold text-sm">Easy Search</div>
                  <div className="text-xs text-gray-600">Find rooms instantly</div>
                </div>
              </div>
            </div>

            <div className="hidden xl:block absolute -bottom-6 -left-6 bg-white text-gray-800 rounded-xl p-4 shadow-xl transform -rotate-3 hover:rotate-0 transition-transform">
              <div className="flex items-center gap-2">
                <div className="bg-escape-red text-white rounded-full p-2">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-bold text-sm">Near You</div>
                  <div className="text-xs text-gray-600">Locations worldwide</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-12 md:h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M0,0 C150,100 350,0 600,50 C850,100 1050,0 1200,50 L1200,120 L0,120 Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}
