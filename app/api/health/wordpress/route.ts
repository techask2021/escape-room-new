/**
 * Test WordPress Connection
 * Endpoint to verify WordPress GraphQL is accessible in production
 */
import { NextResponse } from 'next/server'
import { fetchGraphQL } from '@/lib/wordpress/graphql-client'

export async function GET() {
  try {
    // Check if WordPress URL is configured
    const graphqlUrl = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL
    const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL

    if (!graphqlUrl || !wordpressUrl) {
      return NextResponse.json({
        status: 'error',
        message: 'WordPress URLs not configured',
        details: {
          graphql_url_configured: !!graphqlUrl,
          wordpress_url_configured: !!wordpressUrl,
        },
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    // Test GraphQL connection
    const query = `
      query {
        __typename
      }
    `

    const result = await fetchGraphQL(query) as any

    return NextResponse.json({
      status: 'success',
      message: 'WordPress GraphQL connection successful',
      details: {
        graphql_url: graphqlUrl,
        query_type: result?.__typename || 'Query',
      },
      timestamp: new Date().toISOString()
    }, { status: 200 })
  } catch (error) {
    console.error('[WordPress Health Check Error]:', error)
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : String(error),
      error_type: error instanceof Error ? error.constructor.name : typeof error,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
