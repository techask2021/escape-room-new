import { NextRequest, NextResponse } from 'next/server'
import { fetchGraphQL } from '@/lib/wordpress/graphql-client'
import { CREATE_REVIEW, GET_REVIEWS_BY_ROOM } from '@/lib/wordpress/queries'

// GET - Fetch reviews for a room
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const roomId = searchParams.get('room_id')

    if (!roomId) {
      return NextResponse.json({ error: 'Room ID is required' }, { status: 400 })
    }

    const response: any = await fetchGraphQL(GET_REVIEWS_BY_ROOM, { first: 1000 })

    // Filter reviews by roomId after fetching
    const allReviews = response?.reviews?.nodes || []
    const filteredReviews = allReviews.filter((review: any) =>
      review.reviewFields?.roomId === roomId
    )

    const reviews = filteredReviews.map((review: any) => ({
      id: review.databaseId.toString(),
      user_name: review.reviewFields?.userName || 'Anonymous',
      rating: review.reviewFields?.rating || 0,
      title: review.title || '',
      comment: review.content || '',
      visit_date: review.reviewFields?.visitDate || '',
      helpful_count: review.reviewFields?.helpfulCount || 0,
      created_at: review.date,
      is_verified: review.reviewFields?.isVerified || false,
      is_manual: true
    }))

    // Calculate stats
    const manualReviewCount = reviews.length
    const totalRating = reviews.reduce((sum: number, r: any) => sum + r.rating, 0)
    const averageRating = manualReviewCount > 0 ? totalRating / manualReviewCount : 0

    // Rating distribution
    const distribution = [0, 0, 0, 0, 0]
    reviews.forEach((review: any) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating - 1]++
      }
    })

    return NextResponse.json({
      reviews,
      stats: {
        average: averageRating,
        total: manualReviewCount,
        distribution,
        originalRating: 0, // This will be populated from the escape room data
        originalReviewCount: 0, // This will be populated from the escape room data
        manualReviewCount
      }
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

// POST - Create a new review using WordPress REST API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { room_id, user_name, user_email, rating, title, comment, visit_date } = body

    // Validation
    if (!room_id || !user_name || !rating) {
      return NextResponse.json({
        error: 'Missing required fields: room_id, user_name, and rating are required'
      }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    // Create review using WordPress REST API
    const wpUrl = process.env.WORDPRESS_API_URL
    if (!wpUrl) {
      throw new Error('WORDPRESS_API_URL environment variable is required')
    }
    const restApiUrl = `${wpUrl}wp/v2/review`

    // Create Basic Auth header
    const username = process.env.WORDPRESS_USERNAME
    const appPassword = process.env.WORDPRESS_APP_PASSWORD
    if (!username || !appPassword) {
      throw new Error('WordPress credentials are required')
    }
    const auth = Buffer.from(`${username}:${appPassword}`).toString('base64')

    const reviewData = {
      title: title || `${rating} Star Review`,
      content: comment || '',
      status: 'publish',
      // ACF fields use 'acf' key in REST API
      acf: {
        room_id: room_id,
        user_name: user_name,
        user_email: user_email || '',
        rating: rating,
        visit_date: visit_date || new Date().toISOString().split('T')[0],
        helpful_count: 0,
        is_verified: false
      }
    }

    const response = await fetch(restApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify(reviewData)
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('WordPress REST API Error:', errorData)
      throw new Error('Failed to create review in WordPress')
    }

    const createdReview = await response.json()

    return NextResponse.json({
      success: true,
      review: {
        id: createdReview.id.toString(),
        user_name: user_name,
        rating: rating,
        title: title || '',
        comment: comment || '',
        visit_date: visit_date || new Date().toISOString().split('T')[0],
        helpful_count: 0,
        created_at: new Date().toISOString(),
        is_verified: false,
        is_manual: true
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json({
      error: 'Failed to create review. Please try again.'
    }, { status: 500 })
  }
}
