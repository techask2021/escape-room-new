"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin, Star, Clock3, UsersRound } from "lucide-react"

import { formatVenueForURL, formatCityForURL, formatStateForURL, getFullStateName } from "@/lib/data-source"

interface EscapeRoomCardProps {
  room: {
    id: string
    name?: string
    venue_name?: string
    image?: string
    theme?: string
    difficulty?: string
    rating?: number | string | null
    reviews?: number | string | null
    reviews_average?: number | string | null
    city?: string | null
    state?: string | null
    country?: string | null
    description?: string | null
    players?: string | null
    duration?: number | null
  }
  priority?: boolean
}

const blurDataURL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6gAAAAABJRU5ErkJggg=="

const passthroughLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
  return `${src}?w=${width}&q=${quality ?? 75}`
}

export default function EscapeRoomCard({ room, priority = false }: EscapeRoomCardProps) {
  const imageSrc = room.image || "/placeholder.svg"
  const isGoogleImage = imageSrc.includes("googleusercontent")

  // Get rating - handle both rating and reviews_average fields
  const ratingValue = 
    typeof room.rating === "number" ? room.rating : 
    room.rating ? parseFloat(String(room.rating)) : 
    null
  
  // Get review count - check multiple possible field names
  const reviewsCount =
    typeof room.reviews === "number" ? room.reviews :
    room.reviews ? parseInt(String(room.reviews), 10) :
    typeof room.reviews_average === "number" ? room.reviews_average :
    room.reviews_average ? parseInt(String(room.reviews_average), 10) :
    null
  
  // Always show rating section (even if no rating, show placeholder)
  const displayRating = ratingValue ?? 0
  const displayReviews = reviewsCount ?? 0

  const hasState = room.state && room.state !== "Unknown"
  const hasCity = room.city && room.city !== "Unknown"

  // Convert state abbreviations to full names for consistent URLs
  const fullStateName = hasState ? getFullStateName(room.state!) : ""
  const stateSlug = hasState ? formatStateForURL(fullStateName) : ""
  const citySlug = hasCity ? formatCityForURL(room.city!) : ""
  const venueSlug = formatVenueForURL(room.venue_name || room.name || "")

  const countrySlug = room.country
    ? room.country.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-")
    : "united-states"

  const hasValidLocation = stateSlug && citySlug && venueSlug
  const href = hasValidLocation ? `/locations/${countrySlug}/${stateSlug}/${citySlug}/${venueSlug}` : "/browse"

  // Render star rating visually - Smaller and cleaner
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${
              i < fullStars
                ? "fill-escape-red text-escape-red"
                : i === fullStars && hasHalfStar
                ? "fill-escape-red/50 text-escape-red/50"
                : "fill-slate-200 text-slate-200"
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <Link href={href} className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-escape-red/50 focus-visible:ring-offset-2">
      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-escape-red/40 hover:shadow-lg">
        {/* Image - Reduced Size */}
        <div className="relative aspect-[21/10] overflow-hidden bg-slate-100">
          <Image
            src={imageSrc}
            alt={room.name || "Escape room"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            placeholder="blur"
            blurDataURL={blurDataURL}
            className="object-cover transition duration-700 group-hover:scale-110"
            onError={(event) => {
              const target = event.target as HTMLImageElement
              if (!target.src.endsWith("/placeholder.svg")) {
                target.src = "/placeholder.svg"
                target.srcset = "/placeholder.svg"
              }
            }}
            unoptimized={isGoogleImage}
            loader={isGoogleImage ? passthroughLoader : undefined}
          />
          
          {/* Rating Badge - Always Visible */}
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-white/95 px-2 py-1.5 shadow-lg backdrop-blur-sm border border-slate-200/50">
            <Star className={`h-3.5 w-3.5 ${displayRating > 0 ? 'fill-escape-red text-escape-red' : 'fill-slate-300 text-slate-300'}`} />
            <span className={`text-xs font-bold ${displayRating > 0 ? 'text-slate-900' : 'text-slate-400'}`}>
              {displayRating > 0 ? displayRating.toFixed(1) : 'N/A'}
            </span>
            {displayReviews > 0 && (
              <span className="text-[10px] text-slate-500 font-medium">({displayReviews})</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-2.5 p-4">
          {/* Title & Location */}
          <div className="space-y-1">
            <h3 className="text-base font-semibold leading-tight text-slate-900 group-hover:text-escape-red transition-colors line-clamp-2">
              {room.name}
            </h3>
            {(hasCity || hasState) && (
              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="h-3.5 w-3.5 text-escape-red" />
                <span className="line-clamp-1">
                  {hasCity ? room.city : ""}
                  {hasState ? `${hasCity ? ", " : ""}${room.state}` : ""}
                </span>
              </p>
            )}
          </div>

          {/* Rating with Stars - Always Visible */}
          <div className="flex items-center gap-2 py-1">
            {displayRating > 0 ? renderStars(displayRating) : (
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-slate-200 text-slate-200" />
                ))}
              </div>
            )}
            <span className={`text-xs font-bold ${displayRating > 0 ? 'text-slate-900' : 'text-slate-400'}`}>
              {displayRating > 0 ? displayRating.toFixed(1) : 'No rating yet'}
            </span>
            {displayReviews > 0 && (
              <span className="text-xs text-slate-500">({displayReviews})</span>
            )}
          </div>

          {/* Theme & Difficulty Tags - Compact */}
          {(room.theme || room.difficulty) && (
            <div className="flex flex-wrap gap-1.5">
              {room.theme && (
                <span className="inline-flex items-center rounded-md bg-escape-red/10 px-2 py-0.5 text-[11px] font-medium text-escape-red border border-escape-red/20">
                  {room.theme}
                </span>
              )}
              {room.difficulty && (
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 border border-slate-200">
                  {room.difficulty}
                </span>
              )}
            </div>
          )}

          {/* Players & Duration - Compact */}
          {(room.players || room.duration) && (
            <div className="flex items-center gap-3 text-xs text-slate-600">
              {room.players && (
                <span className="flex items-center gap-1">
                  <UsersRound className="h-3.5 w-3.5 text-escape-red" />
                  <span>{room.players}</span>
                </span>
              )}
              {room.duration && (
                <span className="flex items-center gap-1">
                  <Clock3 className="h-3.5 w-3.5 text-escape-red" />
                  <span>{room.duration} mins</span>
                </span>
              )}
            </div>
          )}

          {/* View Details Button - Compact & Elegant */}
          <div className="mt-auto pt-2">
            <div className="inline-flex h-9 items-center justify-center rounded-md bg-escape-red px-6 text-xs font-semibold text-white transition-all hover:bg-escape-red/90 hover:shadow-md group-hover:scale-105">
              View details
              <svg className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
