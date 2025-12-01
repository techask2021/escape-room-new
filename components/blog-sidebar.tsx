'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatVenueForURL, formatCityForURL, formatStateForURL, getFullStateName, EscapeRoom } from '@/lib/data-source';

interface BlogSidebarProps {
  nearbyEscapeRooms: {
    id: string;
    name: string;
    location: string;
    rating: number;
    difficulty: string;
    duration: string;
    players: string;
    image: string;
    city?: string;
    state?: string;
    venue_name?: string;
  }[];
}

export default function BlogSidebar({ nearbyEscapeRooms }: BlogSidebarProps) {
  return (
    <div className="space-y-8">

      {/* Nearby Escape Rooms */}
      <Card className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="pb-3 border-b border-slate-200 bg-escape-red/5">
          <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-escape-red" />
            Nearby Escape Rooms
          </CardTitle>
          <p className="text-xs text-slate-600 mt-2">Discover thrilling adventures near you</p>
        </CardHeader>
        <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
          {nearbyEscapeRooms.length > 0 ? (
            nearbyEscapeRooms.map((room) => {
              // Generate proper venue URL
              const getVenueUrl = () => {
                const countrySlug = 'united-states'
                // Convert state abbreviations to full names for consistent URLs
                const fullStateName = getFullStateName(room.state || '')
                const stateSlug = formatStateForURL(fullStateName)
                const citySlug = formatCityForURL(room.city || '')
                const venueSlug = formatVenueForURL(room.name || '')
                return `/locations/${countrySlug}/${stateSlug}/${citySlug}/${venueSlug}`
              }
              
              return (
              <Link key={room.id} href={getVenueUrl()} className="block group">
                <div className="p-3 rounded-lg border border-slate-200 hover:border-escape-red/30 hover:bg-slate-50 transition-all duration-200">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="relative overflow-hidden rounded-md">
                        <Image
                          src={room.image}
                          alt={`${room.name} Escape Room in ${room.city}, ${room.state}`}
                          width={64}
                          height={48}
                          className="w-16 h-12 rounded-md object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-slate-900 group-hover:text-escape-red mb-1 transition-colors line-clamp-2">
                        {room.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mb-2">
                        <MapPin className="w-3 h-3 text-escape-red" />
                        <span className="text-xs text-slate-600">{room.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-current" />
                          <span className="text-xs font-semibold text-amber-700">{room.rating}</span>
                        </div>
                        <Badge className="text-xs bg-escape-red/10 text-escape-red border-escape-red/20">
                          {room.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )})
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-escape-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <p className="text-gray-500 text-sm">No nearby escape rooms found.</p>
              <p className="text-gray-400 text-xs mt-1">Check back later for new locations!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Newsletter Signup */}
      <Card className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="pb-3 border-b border-slate-200 bg-escape-red/5">
          <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <span className="text-escape-red">📧</span>
            Stay Updated
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-4">
          <p className="text-xs text-slate-600 mb-4 leading-relaxed">
            Get the latest escape room tips, reviews, and exclusive content delivered to your inbox.
          </p>
          <Button 
            variant="default" 
            className="w-full bg-escape-red hover:bg-escape-red-600 text-white font-semibold h-10 text-sm"
          >
            Subscribe Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}