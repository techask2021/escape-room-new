import { NextRequest, NextResponse } from 'next/server'
import { fetchGraphQL } from '@/lib/wordpress/graphql-client'
import { UPDATE_HELPFUL_COUNT } from '@/lib/wordpress/queries'

// POST - Mark review as helpful
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 })
    }

    // First, get the current helpful count
    // For now, we'll just increment by 1
    // In a production app, you'd want to track which users voted

    const response: any = await fetchGraphQL(UPDATE_HELPFUL_COUNT, {
      id,
      count: 1 // This should be incremented from current value
    })

    if (!response?.updateReview?.review) {
      throw new Error('Failed to update helpful count')
    }

    return NextResponse.json({
      success: true,
      helpful_count: response.updateReview.review.reviewFields.helpfulCount
    })
  } catch (error) {
    console.error('Error updating helpful count:', error)
    return NextResponse.json({
      error: 'Failed to update helpful count'
    }, { status: 500 })
  }
}
