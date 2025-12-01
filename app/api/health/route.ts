/**
 * General Health Check
 * Endpoint to verify overall system health in production
 */
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const checks = {
      redis_url: !!process.env.UPSTASH_REDIS_REST_URL,
      redis_token: !!process.env.UPSTASH_REDIS_REST_TOKEN,
      graphql_url: !!process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL,
      wordpress_url: !!process.env.NEXT_PUBLIC_WORDPRESS_URL,
      wordpress_api_url: !!process.env.WORDPRESS_API_URL,
      recaptcha_site_key: !!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    }

    const all_configured = Object.values(checks).every(v => v)

    return NextResponse.json({
      status: all_configured ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      checks: {
        redis: checks.redis_url && checks.redis_token,
        wordpress: checks.graphql_url && checks.wordpress_url,
        recaptcha: checks.recaptcha_site_key,
      },
      environment_variables: {
        redis: {
          url: process.env.UPSTASH_REDIS_REST_URL?.substring(0, 20) + '...' || 'NOT SET',
          token_configured: !!process.env.UPSTASH_REDIS_REST_TOKEN,
        },
        wordpress: {
          graphql_url: process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL || 'NOT SET',
          wordpress_url: process.env.NEXT_PUBLIC_WORDPRESS_URL || 'NOT SET',
          api_url: process.env.WORDPRESS_API_URL?.substring(0, 30) + '...' || 'NOT SET',
        },
      },
    }, { status: all_configured ? 200 : 500 })
  } catch (error) {
    console.error('[Health Check Error]:', error)
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
