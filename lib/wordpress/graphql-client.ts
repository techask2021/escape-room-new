// WordPress GraphQL endpoint from environment variable
const WORDPRESS_GRAPHQL_URL = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL || ''

if (!WORDPRESS_GRAPHQL_URL && process.env.NODE_ENV === 'development') {
  console.warn('⚠️  NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL is not set in environment variables')
}

// Helper function for GraphQL requests with Next.js fetch caching
export async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  try {
    const response = await fetch(WORDPRESS_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      // Next.js fetch cache - revalidate every 15 minutes
      next: { revalidate: 900 },
    })

    if (!response.ok) {
      const text = await response.text().catch(() => '')
      console.error(`GraphQL non-OK response: ${response.status} ${response.statusText}`, text)
      throw new Error(`GraphQL request failed: ${response.status} ${response.statusText} - ${text}`)
    }

    const result = await response.json().catch(async (err) => {
      // If JSON parsing failed, include raw text for diagnosis
      const raw = await response.text().catch(() => '')
      console.error('Failed to parse GraphQL JSON response:', err, raw)
      throw err
    })

    if (result.errors) {
      console.error('GraphQL Errors:', result.errors)
      throw new Error(result.errors[0]?.message || 'GraphQL query failed')
    }

    return result.data as T
  } catch (error) {
    console.error('GraphQL Error:', error instanceof Error ? error.message : error)
    throw error
  }
}

// Helper to check if WordPress is configured
export function isWordPressConfigured(): boolean {
  return Boolean(WORDPRESS_GRAPHQL_URL)
}
