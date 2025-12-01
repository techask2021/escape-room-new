'use client'

import { useState, useEffect } from 'react'
import { Star, MapPin } from 'lucide-react'

interface DynamicVenueHeaderProps {
  roomId: string
  initialRating: number
  initialReviewCount: number
  roomName: string
  city: string
  state: string
}

export function DynamicVenueHeader({
  roomId,
  initialRating,
  initialReviewCount,
  roomName,
  city,
  state
}: DynamicVenueHeaderProps) {
  const [rating, setRating] = useState(initialRating)
  const [reviewCount, setReviewCount] = useState(initialReviewCount)

  useEffect(() => {
    // Fetch current review stats
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/reviews?room_id=${roomId}`)
        if (response.ok) {
          const data = await response.json()
          setRating(data.stats.average)
          setReviewCount(data.stats.total)
        }
      } catch (error) {
        console.error('Failed to fetch review stats:', error)
      }
    }

    fetchStats()

    // Listen for review updates
    const handleReviewUpdate = () => {
      fetchStats()
    }

    window.addEventListener('reviewUpdated', handleReviewUpdate)

    return () => {
      window.removeEventListener('reviewUpdated', handleReviewUpdate)
    }
  }, [roomId])

  return (
    <div className="flex-1">
      <h1 className="text-4xl font-bold mb-3 text-black">{roomName}</h1>
      
      {/* Inline Rating and Location Display */}
      <div className="flex items-center justify-between gap-4 mb-3">
        {/* Reviews/Rating on the left */}
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => {
              const displayRating = Math.floor(rating)
              return (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < displayRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-slate-300"
                  }`}
                />
              )
            })}
          </div>
          <span className="font-semibold text-lg">{rating > 0 ? rating.toFixed(1) : 'N/A'}</span>
          <span className="text-slate-600">({reviewCount} review{reviewCount !== 1 ? 's' : ''})</span>
        </div>
        
        {/* Location on the right */}
        <div className="flex items-center gap-2 text-slate-600 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2">
          <MapPin className="h-4 w-4 text-[#00d4aa]" />
          {city}, {state}
        </div>
      </div>
    </div>
  )
}