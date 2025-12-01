import { Star, ThumbsUp, Calendar, User, Shield, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'

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

interface ReviewCardProps {
  review: Review
  onHelpful?: (reviewId: string) => void
}

export function ReviewCard({ review, onHelpful }: ReviewCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 transition-colors ${
          i < rating ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm' : 'text-slate-600'
        }`}
      />
    ))
  }

  const handleHelpful = async () => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/reviews/${review.id}/helpful`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        toast({
          title: 'Thank you!',
          description: 'Your feedback has been recorded.',
        })
        onHelpful?.(review.id)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit helpful feedback')
      }
    } catch (error) {
      console.error('Error submitting helpful feedback:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit feedback. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="relative border border-slate-800/20 bg-gradient-to-br from-slate-900/95 to-slate-800/95 hover:from-slate-900 hover:to-slate-800 hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 group overflow-hidden">
      {/* Atmospheric background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/5 via-transparent to-orange-900/5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-red-500/5 to-transparent rounded-full blur-xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-radial from-orange-500/5 to-transparent rounded-full blur-lg" />
      
      <CardHeader className="relative bg-slate-900/50 border-b border-red-500/20 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-600/20 to-orange-600/20 rounded-full border border-red-500/30 group-hover:border-red-400/50 transition-colors">
              <User className="h-6 w-6 text-red-400 group-hover:text-red-300 transition-colors" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white group-hover:text-red-100 transition-colors">{review.user_name}</h4>
                {review.is_verified && (
                  <Badge className="text-xs bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/30">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified Escape
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  {renderStars(review.rating)}
                </div>
                <span className="text-sm text-red-300 font-medium">
                  {review.rating}/5 stars
                </span>
              </div>
            </div>
          </div>
          <div className="text-right text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-red-400" />
              <span className="text-slate-300">{formatDate(review.created_at)}</span>
            </div>
            {review.visit_date && (
              <div className="mt-1 text-xs flex items-center gap-1">
                <Clock className="h-3 w-3 text-orange-400" />
                <span>Escaped: {formatDate(review.visit_date)}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative pt-4">
        {review.title && (
          <h5 className="font-bold text-white mb-3 group-hover:text-red-100 transition-colors">{review.title}</h5>
        )}
        {review.comment && (
          <p className="text-slate-300 leading-relaxed mb-4 group-hover:text-slate-200 transition-colors">{review.comment}</p>
        )}
        <div className="flex items-center justify-start">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHelpful}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-red-300 hover:bg-red-900/20 border border-transparent hover:border-red-500/30 transition-all"
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            {isSubmitting ? 'Submitting...' : `Helpful (${review.helpful_count})`}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}