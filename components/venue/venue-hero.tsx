"use client"

import { Star, MapPin, Award } from "lucide-react"
import Image from "next/image"

interface VenueHeroProps {
  name: string
  city: string
  state: string
  photo?: string
  rating?: string
  reviewCount?: number
}

export default function VenueHero({
  name,
  city,
  state,
  photo,
  rating,
  reviewCount
}: VenueHeroProps) {
  return (
    <section className="relative text-white py-20 overflow-hidden border-b border-slate-200">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={photo || '/images/hero.jpeg'}
          alt={`${name} - Escape Room in ${city}, ${state}`}
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
              <Award className="h-6 w-6 text-escape-red" />
            </div>
            <div className="text-left">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-escape-red">Escape Room</span>
              <h1 className="mt-1 text-3xl font-semibold text-white">{name}</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-escape-red" />
              <span>{city}, {state}</span>
            </div>
            {rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(parseFloat(rating))
                          ? 'text-yellow-400 fill-current'
                          : 'text-slate-400'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-white font-medium">{parseFloat(rating).toFixed(1)}</span>
                {reviewCount && (
                  <span className="text-slate-400">({reviewCount} reviews)</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
