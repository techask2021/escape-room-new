"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { formatVenueForURL, formatCityForURL } from "@/lib/data-source"

interface NearbyRoom {
  id: string
  name: string
  city: string
  state: string
  photo?: string
  rating?: string
}

interface NearbyRoomsProps {
  nearbyRooms: NearbyRoom[]
  currentRoomId: string
  country: string
  state: string
  city: string
}

export default function NearbyRooms({
  nearbyRooms,
  currentRoomId,
  country,
  state,
  city
}: NearbyRoomsProps) {
  if (!nearbyRooms || nearbyRooms.length === 0) return null

  const filteredRooms = nearbyRooms.filter(room => room.id !== currentRoomId).slice(0, 5)

  if (filteredRooms.length === 0) return null

  const passthroughLoader = ({ src }: { src: string }) => src

  return (
    <Card className="bg-white border border-slate-200 shadow-sm sticky top-4">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-escape-red" />
          Nearby Escape Rooms
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          {filteredRooms.map((room, index) => {
            const roomSlug = formatVenueForURL(room.name)
            const citySlug = formatCityForURL(room.city)
            return (
              <Link
                key={`${room.id}-${index}`}
                href={`/locations/${country}/${state}/${citySlug}/${roomSlug}`}
                className="group block p-3 rounded-lg border border-slate-100 hover:border-escape-red/40 hover:bg-escape-red/5 transition-all duration-200"
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 group-hover:border-escape-red/30 transition-colors">
                      <Image
                        loader={passthroughLoader as any}
                        src={room.photo || '/placeholder.jpg'}
                        alt={room.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        unoptimized={room.photo?.includes('googleusercontent.com')}
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-slate-900 mb-1 truncate group-hover:text-escape-red transition-colors">
                      {room.name}
                    </div>
                    <div className="text-xs text-slate-600 flex items-center gap-1 mb-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      {room.city}, {room.state}
                    </div>
                    {room.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-slate-600 font-medium">{parseFloat(room.rating).toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}