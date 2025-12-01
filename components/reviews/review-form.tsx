'use client'

import { useState } from 'react'
import { Star, Send } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

interface ReviewFormProps {
  roomId: string
  onReviewSubmitted?: () => void
}

export function ReviewForm({ roomId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    title: '',
    comment: '',
    visit_date: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      toast({
        title: 'Rating Required',
        description: 'Please select a star rating before submitting.',
        variant: 'destructive'
      })
      return
    }

    if (!formData.user_name.trim()) {
      toast({
        title: 'Name Required',
        description: 'Please enter your name.',
        variant: 'destructive'
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          room_id: roomId,
          rating,
          ...formData
        })
      })

      if (response.ok) {
        toast({
          title: 'Review Submitted',
          description: 'Thank you for your review! It will be visible shortly.'
        })
        
        // Reset form
        setRating(0)
        setFormData({
          user_name: '',
          user_email: '',
          title: '',
          comment: '',
          visit_date: ''
        })
        
        onReviewSubmitted?.()
      } else {
        throw new Error('Failed to submit review')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit review. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1
      return (
        <button
          key={i}
          type="button"
          className="focus:outline-none"
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => setRating(starValue)}
        >
          <Star
            className={`h-8 w-8 transition-colors ${
              starValue <= (hoverRating || rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 hover:text-yellow-200'
            }`}
          />
        </button>
      )
    })
  }

  return (
    <Card className="bg-white border border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Send className="h-5 w-5 text-escape-red" />
          Write a Review
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-slate-900">Your Rating *</label>
            <div className="flex items-center gap-1 mt-2">
              {renderStars()}
              {rating > 0 && (
                <span className="ml-2 text-sm text-slate-600">
                  {rating}/5 stars
                </span>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="user_name" className="block text-sm font-semibold text-slate-900">
              Your Name *
            </label>
            <div className="relative search-input-wrapper">
              <Input
                id="user_name"
                value={formData.user_name}
                onChange={(e) => setFormData(prev => ({ ...prev, user_name: e.target.value }))}
                placeholder="Enter your name"
                className="mt-1 h-12 border-2 border-slate-300 focus:border-escape-red focus:ring-2 focus:ring-escape-red/20 text-sm transition-all search-input-selection"
                onFocus={(e) => {
                  e.target.select()
                }}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                    e.preventDefault()
                    e.currentTarget.select()
                  }
                }}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="user_email" className="block text-sm font-semibold text-slate-900">
              Email (Optional)
            </label>
            <div className="relative search-input-wrapper">
              <Input
                id="user_email"
                type="email"
                value={formData.user_email}
                onChange={(e) => setFormData(prev => ({ ...prev, user_email: e.target.value }))}
                placeholder="your.email@escaperoomsfinder.com"
                className="mt-1 h-12 border-2 border-slate-300 focus:border-escape-red focus:ring-2 focus:ring-escape-red/20 text-sm transition-all search-input-selection"
                onFocus={(e) => {
                  e.target.select()
                }}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                    e.preventDefault()
                    e.currentTarget.select()
                  }
                }}
              />
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Email won&apos;t be displayed publicly
            </p>
          </div>

          {/* Visit Date */}
          <div>
            <label htmlFor="visit_date" className="block text-sm font-semibold text-slate-900">
              Visit Date (Optional)
            </label>
            <div className="relative search-input-wrapper">
              <Input
                id="visit_date"
                type="date"
                value={formData.visit_date}
                onChange={(e) => setFormData(prev => ({ ...prev, visit_date: e.target.value }))}
                className="mt-1 h-12 border-2 border-slate-300 focus:border-escape-red focus:ring-2 focus:ring-escape-red/20 text-sm transition-all search-input-selection"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-slate-900">
              Review Title (Optional)
            </label>
            <div className="relative search-input-wrapper">
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Summarize your experience"
                className="mt-1 h-12 border-2 border-slate-300 focus:border-escape-red focus:ring-2 focus:ring-escape-red/20 text-sm transition-all search-input-selection"
                maxLength={200}
              />
            </div>
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="comment" className="block text-sm font-semibold text-slate-900">
              Your Review (Optional)
            </label>
            <div className="relative search-input-wrapper">
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Share your experience with this escape room..."
                className="mt-1 min-h-[120px] border-2 border-slate-300 focus:border-escape-red focus:ring-2 focus:ring-escape-red/20 text-sm transition-all resize-none search-input-selection"
                maxLength={1000}
                onFocus={(e) => {
                  e.target.select()
                }}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                    e.preventDefault()
                    e.currentTarget.select()
                  }
                }}
              />
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {formData.comment.length}/1000 characters
            </p>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || rating === 0}
            variant="default"
            className="w-full"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}