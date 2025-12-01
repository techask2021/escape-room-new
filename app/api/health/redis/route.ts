/**
 * Test Redis Connection
 * Endpoint to verify Upstash Redis is working in production
 */
import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

export async function GET() {
  try {
    // Check if env vars exist
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN

    if (!url || !token) {
      return NextResponse.json({
        status: 'error',
        message: 'Redis credentials not configured',
        details: {
          url_configured: !!url,
          token_configured: !!token,
        },
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    // Test connection
    const redis = new Redis({
      url,
      token,
    })

    const pong = await redis.ping()

    // Try to get a test key
    const testKey = 'health-check:' + Date.now()
    await redis.set(testKey, { status: 'ok', time: new Date().toISOString() }, { ex: 60 })
    const retrieved = await redis.get(testKey) as any

    return NextResponse.json({
      status: 'success',
      message: 'Redis connection successful',
      details: {
        ping: pong,
        write_success: true,
        read_success: !!retrieved,
        data_match: retrieved?.status === 'ok',
      },
      timestamp: new Date().toISOString()
    }, { status: 200 })
  } catch (error) {
    console.error('[Redis Health Check Error]:', error)
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : String(error),
      error_type: error instanceof Error ? error.constructor.name : typeof error,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
