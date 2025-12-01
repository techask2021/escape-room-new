'use client'

import { useState, useEffect } from 'react'
import { Star, MessageSquare, TrendingUp, Users, Clock, Trophy, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ReviewCard } from './review-card'
import { ReviewForm } from './review-form'

interface Review {
  id: string
  user_name: string
  rating: number
  title?: string
  comment?: string
  visit_date?: string
  helpful_count: number
  created_at: string
  is_verified: boolean
  is_manual?: boolean
}

interface ReviewsSectionProps {
  roomId: string
  initialReviews?: Review[]
  averageRating?: number
  totalReviews?: number
}

export function ReviewsSection({ 
  roomId, 
  initialReviews = [], 
  averageRating = 0, 
  totalReviews = 0 
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasInitialData] = useState(initialReviews.length > 0) // Track if we have initial data
  const [stats, setStats] = useState({
    average: averageRating,
    total: totalReviews,
    distribution: [0, 0, 0, 0, 0], // 1-star to 5-star counts
    originalRating: averageRating, // Store original rating from room data
    originalReviewCount: totalReviews, // Store original review count from room data
    manualReviewCount: 0
  })

  useEffect(() => {
    // Silently refresh reviews in background (no loading state)
    // This ensures data is fresh without showing loading indicators
    fetchReviews(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId])

  const fetchReviews = async (showLoading = false) => {
    // Only show loading state if explicitly requested (e.g., after form submission)
    // Don't show loading on initial load if we have cached data
    if (showLoading) {
      setIsLoading(true)
    }
    try {
      const response = await fetch(`/api/reviews?room_id=${roomId}`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || [])
        // Calculate stats: preserve original rating and count, add manual reviews
        const manualCount = data.stats.manualReviewCount || 0
        setStats(prevStats => ({
          ...data.stats,
          originalRating: prevStats.originalRating, // Keep original from props
          originalReviewCount: prevStats.originalReviewCount, // Keep original from props
          manualReviewCount: manualCount,
          average: prevStats.originalRating, // Always show original rating
          total: prevStats.originalReviewCount + manualCount // Original + manual
        }))
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      if (showLoading) {
        setIsLoading(false)
      }
    }
  }

  const handleReviewSubmitted = () => {
    setShowForm(false)
    fetchReviews(true) // Show loading when refreshing after submission
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('reviewUpdated'))
  }

  const handleHelpful = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST'
      })
      if (response.ok) {
        // Update the helpful count locally
        setReviews(prev => prev.map(review => 
          review.id === reviewId 
            ? { ...review, helpful_count: review.helpful_count + 1 }
            : review
        ))
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('reviewUpdated'))
      }
    } catch (error) {
      console.error('Failed to mark review as helpful:', error)
    }
  }

  const renderStars = (rating: number, size = 'h-4 w-4') => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${size} ${
          i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  const renderRatingDistribution = () => {
    const maxCount = Math.max(...stats.distribution)
    
    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((stars) => {
          const count = stats.distribution[stars - 1] || 0
          const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
          
          return (
            <div key={stars} className="flex items-center gap-2 text-sm">
              <span className="w-8 text-slate-600">{stars}★</span>
              <div className="flex-1 bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-slate-600 text-xs">{count}</span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Reviews Overview */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-3">
            <Trophy className="h-5 w-5 text-escape-red" />
            Escape Room Reviews & Ratings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-5xl font-bold text-slate-900 mb-3">
                {stats.average.toFixed(1)}
              </div>
              <div className="flex items-center justify-center gap-1 mb-3">
                {renderStars(stats.average, 'h-6 w-6')}
              </div>
              <p className="text-slate-700 font-medium">
                Based on {stats.total} adventurer review{stats.total !== 1 ? 's' : ''}
                {stats.originalReviewCount > 0 && stats.manualReviewCount > 0 && (
                  <span className="block text-sm text-slate-600 mt-2">
                    ({stats.originalReviewCount} verified + {stats.manualReviewCount} user review{stats.manualReviewCount !== 1 ? 's' : ''})
                  </span>
                )}
                {stats.originalReviewCount > 0 && stats.manualReviewCount === 0 && (
                  <span className="block text-sm text-slate-600 mt-2">
                    (Verified escape room reviews)
                  </span>
                )}
              </p>
            </div>
            
            {/* Rating Distribution */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Zap className="h-4 w-4 text-escape-red" />
                Experience Breakdown
              </h4>
              {renderRatingDistribution()}
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-escape-red text-white border-0">
                <Users className="h-3 w-3 mr-1" />
                {stats.total} Total Adventures
              </Badge>
              {stats.manualReviewCount > 0 && (
                <Badge variant="outline" className="border-escape-red/30 text-escape-red bg-escape-red/5">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  {stats.manualReviewCount} User Review{stats.manualReviewCount !== 1 ? 's' : ''}
                </Badge>
              )}
              <Badge variant="outline" className="border-slate-300 text-slate-600 bg-slate-50">
                <Clock className="h-3 w-3 mr-1" />
                Recent Activity
              </Badge>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              variant="default"
            >
              {showForm ? 'Cancel Review' : 'Share Your Adventure'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Review Form */}
      {showForm && (
        <ReviewForm 
          roomId={roomId} 
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="h-5 w-5 text-escape-red" />
            <h3 className="text-xl font-semibold text-slate-900">
              Adventurer Stories ({reviews.length})
            </h3>
          </div>
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onHelpful={handleHelpful}
              />
            ))}
          </div>
        </div>
      ) : (
        !isLoading && (
          <Card className="border-2 border-dashed border-escape-red/30 bg-slate-50">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="flex items-center justify-center mb-6">
                <Trophy className="h-12 w-12 text-escape-red" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                No Adventure Stories Yet
              </h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
                 {stats.originalReviewCount > 0 ? (
                   <>The rating above is based on {stats.originalReviewCount} verified reviews. Be the first to share your escape room adventure!</>
                 ) : (
                   <>Be the first brave adventurer to share your escape room experience and help future puzzle solvers!</>
                 )}
               </p>
              <Button
                onClick={() => setShowForm(true)}
                variant="default"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Share Your Adventure
              </Button>
            </CardContent>
          </Card>
        )
      )}
    </div>
  )
}