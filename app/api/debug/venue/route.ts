import { NextResponse } from 'next/server'
import { getEscapeRoomByVenue } from '@/lib/wordpress/api'
import redis from '@/lib/cache'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const params = url.searchParams

    const country = params.get('country') || ''
    const state = params.get('state') || ''
    const city = params.get('city') || ''
    const venue = params.get('venue') || ''

    if (!venue || !city || !state) {
      return NextResponse.json({ ok: false, message: 'Missing required query params: country,state,city,venue' }, { status: 400 })
    }

    // Diagnostics
    const diagnostics: any = {
      env: {
        wordpress_graphql: !!process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL,
        wordpress_url: !!process.env.NEXT_PUBLIC_WORDPRESS_URL,
        wordpress_api: !!process.env.WORDPRESS_API_URL,
        redis_configured: !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN,
      },
      redis: {
        available: false,
        sampleKey: null,
      },
    }

    // Check Redis availability quickly
    try {
      if (redis) {
        diagnostics.redis.available = true
        // try a harmless read
        try {
          const sample = await redis.get('__escaperooms_health__')
          diagnostics.redis.sampleKey = sample ?? null
        } catch (e) {
          diagnostics.redis.sampleError = String(e)
        }
      }
    } catch (e) {
      diagnostics.redis.available = false
      diagnostics.redis.error = String(e)
    }

    // Run the same lookup used by the venue page
    try {
      const result = await getEscapeRoomByVenue(venue, city, state)

      return NextResponse.json({ ok: true, diagnostics, result })
    } catch (err: any) {
      return NextResponse.json({ ok: false, diagnostics, error: err instanceof Error ? err.message : String(err), stack: err?.stack }, { status: 500 })
    }
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
