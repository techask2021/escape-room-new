"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import Link from "next/link"
import { formatCityForURL } from "@/lib/data-source"

interface NearbyCity {
  city: string
  state: string
}

interface NearbyCitiesProps {
  nearbyCities: NearbyCity[]
  currentCity: string
  country: string
  state: string
}

export default function NearbyCities({
  nearbyCities,
  currentCity,
  country,
  state
}: NearbyCitiesProps) {
  if (!nearbyCities || nearbyCities.length === 0) return null

  const filteredCities = nearbyCities
    .filter(city => city?.city && currentCity && city.city.toLowerCase() !== currentCity.toLowerCase())
    .slice(0, 5)

  if (filteredCities.length === 0) return null

  return (
    <Card className="bg-white border border-slate-200 shadow-sm sticky top-4">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-escape-red" />
          Nearby Cities
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-2">
          {filteredCities.map((city, index) => {
            const citySlug = formatCityForURL(city.city)
            return (
              <Link
                key={`${city.city}-${city.state}-${index}`}
                href={`/locations/${country}/${state}/${citySlug}`}
                className="group block p-3 rounded-lg border border-slate-100 hover:border-escape-red/40 hover:bg-escape-red/5 transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400 group-hover:text-escape-red transition-colors" />
                  <span className="font-medium text-sm text-slate-900 group-hover:text-escape-red transition-colors">
                    {city.city}, {city.state}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}