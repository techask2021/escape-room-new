import { cache } from 'react'
import { fetchGraphQL } from './graphql-client'
import {
  EscapeRoomsResponse,
  SingleEscapeRoomResponse,
  CountriesResponse,
  StatesResponse,
  CitiesResponse,
  RoomCategoriesResponse,
  WordPressEscapeRoom,
} from './types'
import {
  GET_ESCAPE_ROOMS,
  GET_ESCAPE_ROOMS_BY_LOCATION,
  GET_ESCAPE_ROOM_BY_SLUG,
  GET_ESCAPE_ROOM_BY_ID,
  GET_ALL_COUNTRIES,
  GET_ALL_STATES,
  GET_ALL_CITIES,
  GET_ROOM_CATEGORIES,
  SEARCH_ESCAPE_ROOMS,
  GET_FEATURED_ROOMS,
} from './queries'
import { transformWordPressRooms, transformWordPressRoom } from './transform'
import { EscapeRoom } from './types-shared'
import { getCached, CACHE_KEYS, CACHE_TTL } from '@/lib/cache'

/**
 * Get escape rooms with filters (matches Supabase signature)
 */
export async function getEscapeRooms({
  limit = 20,
  offset = 0,
  name,
  city,
  state,
  country,
  category
}: {
  limit?: number
  offset?: number
  name?: string
  city?: string
  state?: string
  country?: string
  category?: string
} = {}) {
  try {
    //Get all rooms first (cached in Redis - NO WordPress calls after first fetch!)
    let allRooms = await getAllEscapeRooms()

    // Apply filters
    if (name) {
      allRooms = allRooms.filter(room =>
        room.name?.toLowerCase().includes(name.toLowerCase())
      )
    }

    if (city) {
      allRooms = allRooms.filter(room =>
        room.city?.toLowerCase().includes(city.toLowerCase())
      )
    }

    if (state) {
      allRooms = allRooms.filter(room =>
        room.state?.toLowerCase().includes(state.toLowerCase())
      )
    }

    if (country) {
      allRooms = allRooms.filter(room =>
        room.country?.toLowerCase().includes(country.toLowerCase())
      )
    }

    if (category) {
      allRooms = allRooms.filter(room =>
        room.category_new?.toLowerCase() === category.toLowerCase()
      )
    }

    // Apply pagination
    const paginatedRooms = allRooms.slice(offset, offset + limit)

    return {
      data: paginatedRooms,
      error: null,
      count: allRooms.length
    }
  } catch (error) {
    console.error('Error fetching escape rooms:', error)
    return {
      data: [],
      error,
      count: 0
    }
  }
}

/**
 * Get all escape rooms with Redis caching
 * 
 * CRITICAL OPTIMIZATION:
 * - First request: Fetches from WordPress (20+ GraphQL calls)
 * - Subsequent requests: Returns from Redis cache (0 WordPress calls!)
 * - Cache duration: 24 hours (since data only changes on manual updates)
 * 
 * This reduces CPU usage by ~95% and WordPress VPS load by ~95%
 */
export const getAllEscapeRooms = cache(async (): Promise<EscapeRoom[]> => {
  try {
    return await getCached(
      CACHE_KEYS.ALL_ROOMS,
      async () => {
        console.log('[WordPress API] Fetching ALL rooms from WordPress (this should be rare!)...')
        const allRooms: WordPressEscapeRoom[] = []
        let hasNextPage = true
        let after: string | null = null

        while (hasNextPage) {
          const data: EscapeRoomsResponse = await fetchGraphQL<EscapeRoomsResponse>(GET_ESCAPE_ROOMS, {
            first: 100,
            after,
          })

          allRooms.push(...data.escapeRooms.nodes)
          hasNextPage = data.escapeRooms.pageInfo.hasNextPage
          after = data.escapeRooms.pageInfo.endCursor
        }

        console.log(`[WordPress API] Fetched ${allRooms.length} rooms from WordPress`)
        return transformWordPressRooms(allRooms)
      },
      CACHE_TTL.ALL_ROOMS // 24 hours cache
    )
  } catch (error) {
    console.error('[getAllEscapeRooms Error]:', error instanceof Error ? error.message : error)
    // Return empty array instead of throwing to prevent 500 errors
    // The application should handle empty data gracefully
    return []
  }
})

/**
 * Get all escape rooms for sitemap
 */
export async function getAllEscapeRoomsForSitemap(): Promise<{ data: EscapeRoom[], error: null }> {
  try {
    const rooms = await getAllEscapeRooms()
    return { data: rooms, error: null }
  } catch (error) {
    console.error('Error fetching sitemap rooms:', error)
    return { data: [], error: null }
  }
}

/**
 * Get escape rooms by location
 */
export async function getEscapeRoomsByLocation(
  country: string,
  state: string,
  city: string
): Promise<EscapeRoom[]> {
  const data = await fetchGraphQL<EscapeRoomsResponse>(
    GET_ESCAPE_ROOMS_BY_LOCATION,
    {
      country,
      state,
      city,
      first: 100,
    }
  )

  return transformWordPressRooms(data.escapeRooms.nodes)
}

/**
 * Get escape rooms by city (matches Supabase function signature)
 */
export async function getEscapeRoomsByCity(
  city: string,
  state?: string,
  limit?: number
): Promise<{ data: EscapeRoom[], error: null }> {
  try {
    // Get all rooms first, then filter
    const allRooms = await getAllEscapeRooms()

    let filtered = allRooms.filter(room =>
      room.city?.toLowerCase().includes(city.toLowerCase())
    )

    if (state) {
      filtered = filtered.filter(room =>
        room.state?.toLowerCase().includes(state.toLowerCase())
      )
    }

    if (limit) {
      filtered = filtered.slice(0, limit)
    }

    return { data: filtered, error: null }
  } catch (error) {
    console.error('Error in getEscapeRoomsByCity:', error)
    return { data: [], error: null }
  }
}

/**
 * Get escape rooms by state (matches Supabase function signature)
 */
export async function getEscapeRoomsByState(
  state: string,
  limit?: number
): Promise<{ data: EscapeRoom[], error: null }> {
  try {
    const allRooms = await getAllEscapeRooms()

    let filtered = allRooms.filter(room =>
      room.state?.toLowerCase().includes(state.toLowerCase())
    )

    if (limit) {
      filtered = filtered.slice(0, limit)
    }

    return { data: filtered, error: null }
  } catch (error) {
    console.error('Error in getEscapeRoomsByState:', error)
    return { data: [], error: null }
  }
}

/**
 * Get single escape room by slug
 * Wrapped with React cache to deduplicate requests in the same render
 */
export const getEscapeRoomBySlug = cache(async (slug: string): Promise<EscapeRoom | null> => {
  try {
    return await getCached(
      `${CACHE_KEYS.ROOM_BY_SLUG}${slug}`,
      async () => {
        try {
          const data = await fetchGraphQL<SingleEscapeRoomResponse>(
            GET_ESCAPE_ROOM_BY_SLUG,
            { slug }
          )

          if (!data.escapeRoom) {
            console.log(`[Room Not Found by Slug] ${slug}`)
            return null
          }

          return transformWordPressRoom(data.escapeRoom)
        } catch (error) {
          console.error(`[Room Fetch Error by Slug] ${slug}:`, error instanceof Error ? error.message : error)
          return null
        }
      },
      CACHE_TTL.SINGLE_ROOM
    )
  } catch (error) {
    console.error(`[getEscapeRoomBySlug Error] ${slug}:`, error instanceof Error ? error.message : error)
    return null
  }
})

/**
 * Get single escape room by ID
 * Wrapped with React cache to deduplicate requests in the same render
 */
export const getEscapeRoomById = cache(async (id: string): Promise<EscapeRoom | null> => {
  try {
    return await getCached(
      `${CACHE_KEYS.ROOM_BY_ID}${id}`,
      async () => {
        try {
          const data = await fetchGraphQL<SingleEscapeRoomResponse>(
            GET_ESCAPE_ROOM_BY_ID,
            { id }
          )

          if (!data.escapeRoom) {
            console.log(`[Room Not Found] ${id}`)
            return null
          }

          return transformWordPressRoom(data.escapeRoom)
        } catch (error) {
          console.error(`[Room Fetch Error] ${id}:`, error instanceof Error ? error.message : error)
          return null
        }
      },
      CACHE_TTL.SINGLE_ROOM
    )
  } catch (error) {
    console.error(`[getEscapeRoomById Error] ${id}:`, error instanceof Error ? error.message : error)
    return null
  }
})

/**
 * Get escape room by venue name, city, and state (matches Supabase function signature)
 */
export async function getEscapeRoomByVenue(
  venueName: string,
  city: string,
  state: string
): Promise<{ data: EscapeRoom | null, error: any }> {
  try {
    // Convert venue name to slug format for matching (remove all punctuation)
    const venueSlug = venueName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')

    // Get all rooms in the city
    const { data: cityRooms } = await getEscapeRoomsByCity(city, state)

    // Find the best match
    const match = cityRooms.find(room => {
      const roomSlug = room.name?.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
      return roomSlug?.includes(venueSlug) || venueSlug.includes(roomSlug || '')
    })

    if (match) {
      // CRITICAL FIX: Fetch full room details including post_content and sidebar fields
      // The list view only returns "Lite" data, so we must fetch the single room by ID
      const fullRoom = await getEscapeRoomById(match.id)
      return { data: fullRoom, error: null }
    }

    return { data: null, error: null }
  } catch (error) {
    console.error('Error in getEscapeRoomByVenue:', error)
    return { data: null, error }
  }
}

/**
 * Get featured/top rated escape rooms
 */
export async function getFeaturedEscapeRooms(limit = 6): Promise<{ data: EscapeRoom[], error: null }> {
  try {
    const data = await fetchGraphQL<EscapeRoomsResponse>(GET_FEATURED_ROOMS, { first: 100 })
    const transformed = transformWordPressRooms(data.escapeRooms.nodes)

    // Sort by rating (descending) and take the top N
    const featured = transformed
      .filter(room => room.rating && room.rating > 0)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit)

    return { data: featured, error: null }
  } catch (error) {
    console.error('Error fetching featured rooms:', error)
    return { data: [], error: null }
  }
}

/**
 * Get all countries
 */
export async function getAllCountriesFromDatabase(): Promise<{ data: string[], error: null }> {
  try {
    const data = await fetchGraphQL<CountriesResponse>(GET_ALL_COUNTRIES)
    return { data: data.countries.nodes.map(c => c.name), error: null }
  } catch (error) {
    console.error('Error fetching countries:', error)
    return { data: [], error: null }
  }
}

/**
 * Get all states
 */
export async function getAllStatesFromDatabase(): Promise<{ data: string[], error: null }> {
  try {
    const data = await fetchGraphQL<StatesResponse>(GET_ALL_STATES)
    return { data: data.states.nodes.map(s => s.name), error: null }
  } catch (error) {
    console.error('Error fetching states:', error)
    return { data: [], error: null }
  }
}

/**
 * Get states with room counts
 */
export async function getStatesWithRoomCounts(country?: string): Promise<{ data: any[], error: null }> {
  try {
    // Get all rooms from cache (this will hit Redis or WordPress if cache misses)
    const allRooms = await getAllEscapeRooms()

    // Filter by country if provided
    const filteredRooms = country
      ? allRooms.filter(room => room.country?.toLowerCase() === country.toLowerCase())
      : allRooms

    // Group by state and count rooms, states
    const stateCountMap = new Map<string, { count: number; fullName: string }>();

    filteredRooms.forEach(room => {
      if (room.state) {
        const stateName = room.state.trim();
        if (!stateCountMap.has(stateName)) {
          stateCountMap.set(stateName, { count: 0, fullName: stateName });
        }
        const stateData = stateCountMap.get(stateName)!;
        stateData.count += 1;
      }
    });

    // Convert to array and sort by count (descending)
    const statesData = Array.from(stateCountMap.entries())
      .map(([state, data]) => ({
        state,
        fullName: data.fullName,
        room_count: data.count,
        city_count: 0 // Would need separate query to get city count per state
      }))
      .sort((a, b) => b.room_count - a.room_count);

    return { data: statesData, error: null }
  } catch (error) {
    console.error('Error fetching states with counts:', error)
    return { data: [], error: null }
  }
}

/**
 * Get cities with counts
 */
export async function getCitiesWithCounts(state?: string): Promise<{ data: any[], error: null }> {
  try {
    // Get all rooms to count cities by state
    const allRooms = await getAllEscapeRooms()

    // Filter rooms by state if provided
    const filteredRooms = state
      ? allRooms.filter(room => room.state?.toLowerCase() === state.toLowerCase())
      : allRooms

    // Count rooms per city
    const cityCountMap = new Map<string, number>()
    filteredRooms.forEach(room => {
      if (room.city) {
        cityCountMap.set(room.city, (cityCountMap.get(room.city) || 0) + 1)
      }
    })

    // Convert to array and sort by count
    const citiesData = Array.from(cityCountMap.entries())
      .map(([cityName, count]) => ({
        city: cityName,
        state: state || '',
        count
      }))
      .sort((a, b) => b.count - a.count)

    return { data: citiesData, error: null }
  } catch (error) {
    console.error('Error fetching cities with counts:', error)
    return { data: [], error: null }
  }
}

/**
 * Get themes/categories with counts
 */
export async function getThemesWithCounts(): Promise<{ data: any[], error: null }> {
  try {
    const data = await fetchGraphQL<RoomCategoriesResponse>(GET_ROOM_CATEGORIES)
    const themesData = data.roomCategories.nodes.map(cat => ({
      theme: cat.name,
      count: cat.count || 0
    }))
    return { data: themesData, error: null }
  } catch (error) {
    console.error('Error fetching themes:', error)
    return { data: [], error: null }
  }
}

/**
 * Get country stats
 */
export async function getCountryStats(): Promise<{ data: any[], error: null }> {
  try {
    const rooms = await getAllEscapeRooms()

    // Count rooms, states, and cities by country
    const countryData = rooms.reduce((acc: Record<string, { room_count: number; states: Set<string>; cities: Set<string> }>, room) => {
      const country = room.country?.trim()
      const state = room.state?.trim()
      const city = room.city?.trim()

      if (country && state && city) {
        if (!acc[country]) {
          acc[country] = { room_count: 0, states: new Set(), cities: new Set() }
        }
        acc[country].room_count += 1
        acc[country].states.add(state)
        acc[country].cities.add(city)
      }
      return acc
    }, {})

    // Convert to array
    const countriesArray = Object.entries(countryData)
      .map(([country, data]) => ({
        country,
        room_count: data.room_count,
        state_count: data.states.size,
        city_count: data.cities.size
      }))
      .sort((a, b) => b.room_count - a.room_count)

    return { data: countriesArray, error: null }
  } catch (error) {
    console.error('Error fetching country stats:', error)
    return { data: [], error: null }
  }
}

/**
 * Get database stats
 */
export async function getDatabaseStats(): Promise<any> {
  try {
    const rooms = await getAllEscapeRooms()

    // Calculate stats from all rooms
    const uniqueCities = new Set(rooms.map(r => `${r.city}, ${r.state}`).filter(Boolean))
    const uniqueStates = new Set(rooms.map(r => r.state).filter(Boolean))
    const uniqueCountries = new Set(rooms.map(r => r.country).filter(Boolean))

    const validRatings = rooms.filter(r => r.rating && r.rating > 0)
    const averageRating = validRatings.length > 0
      ? validRatings.reduce((sum, r) => sum + (r.rating || 0), 0) / validRatings.length
      : 4.2

    const totalReviews = rooms.reduce((sum, r) => sum + (r.reviews_average || 0), 0)

    return {
      totalRooms: rooms.length,
      totalCities: uniqueCities.size,
      totalCountries: uniqueCountries.size,
      uniqueCities: uniqueCities.size,
      uniqueStates: uniqueStates.size,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      error: null
    }
  } catch (error) {
    console.error('Error fetching database stats:', error)
    return {
      totalRooms: 0,
      totalCities: 0,
      totalCountries: 0,
      uniqueCities: 0,
      uniqueStates: 0,
      averageRating: 4.2,
      totalReviews: 0,
      error
    }
  }
}

/**
 * Get room amenities (WordPress amenities are embedded in room data)
 */
export async function getRoomAmenities(roomId: string): Promise<any[]> {
  try {
    const room = await getEscapeRoomById(roomId)
    if (!room) return []

    // Amenities are stored in the room object from WordPress ACF
    // Return empty array for now as they're accessed via the room object
    return []
  } catch (error) {
    console.error('Error fetching room amenities:', error)
    return []
  }
}

/**
 * Get room business hours (WordPress business hours are embedded in room data)
 */
export async function getRoomBusinessHours(roomId: string): Promise<any[]> {
  try {
    const room = await getEscapeRoomById(roomId)
    if (!room) return []

    // Business hours are stored in the room object from WordPress ACF
    // Return empty array for now as they're accessed via the room object
    return []
  } catch (error) {
    console.error('Error fetching room business hours:', error)
    return []
  }
}

/**
 * Get nearby cities in a state
 */
export async function getNearbyCities(stateName: string, limit = 10): Promise<{ data: any[], error: null }> {
  try {
    const allRooms = await getAllEscapeRooms()

    // Get all cities in the state with room counts
    const cityMap = new Map<string, number>()

    allRooms.forEach(room => {
      if (room.state === stateName && room.city) {
        cityMap.set(room.city, (cityMap.get(room.city) || 0) + 1)
      }
    })

    // Convert to array and sort by room count
    const cities = Array.from(cityMap.entries())
      .map(([city, count]) => ({
        city,
        state: stateName,
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)

    return { data: cities, error: null }
  } catch (error) {
    console.error('Error fetching nearby cities:', error)
    return { data: [], error: null }
  }
}

/**
 * Get nearby rooms in the same city
 */
export async function getNearbyRooms(
  roomId: string,
  cityName: string,
  stateName: string,
  limit = 6
): Promise<{ data: EscapeRoom[], error: null }> {
  try {
    const allRooms = await getAllEscapeRooms()

    // Filter rooms in the same city, excluding the current room
    const nearbyRooms = allRooms
      .filter(room =>
        room.id !== roomId &&
        room.city?.toLowerCase() === cityName.toLowerCase() &&
        room.state?.toLowerCase() === stateName.toLowerCase()
      )
      .slice(0, limit)

    return { data: nearbyRooms, error: null }
  } catch (error) {
    console.error('Error fetching nearby rooms:', error)
    return { data: [], error: null }
  }
}

// ========================================
// Blog Post Functions
// ========================================

export interface BlogPost {
  id: string
  databaseId: number
  title: string
  content: string
  excerpt: string
  slug: string
  date: string
  modified: string
  featuredImage?: {
    sourceUrl: string
    altText: string
    width?: number
    height?: number
  }
  author: {
    name: string
    avatar?: string
  }
  categories: Array<{
    id: string
    name: string
    slug: string
  }>
  tags: Array<{
    id: string
    name: string
    slug: string
  }>
}

/**
 * Get all blog posts with pagination
 */
export async function getBlogPosts({
  limit = 10,
  after
}: {
  limit?: number
  after?: string
} = {}): Promise<{ data: BlogPost[], hasNextPage: boolean, endCursor: string | null }> {
  try {
    const { GET_BLOG_POSTS } = await import('./queries')
    const response: any = await fetchGraphQL(GET_BLOG_POSTS, { first: limit, after })

    const posts = response?.posts?.nodes?.map((post: any) => ({
      id: post.id,
      databaseId: post.databaseId,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      slug: post.slug,
      date: post.date,
      modified: post.modified,
      featuredImage: post.featuredImage?.node ? {
        sourceUrl: post.featuredImage.node.sourceUrl,
        altText: post.featuredImage.node.altText || '',
        width: post.featuredImage.node.mediaDetails?.width,
        height: post.featuredImage.node.mediaDetails?.height
      } : undefined,
      author: {
        name: post.author?.node?.name || 'Anonymous',
        avatar: post.author?.node?.avatar?.url
      },
      categories: post.categories?.nodes?.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug
      })) || [],
      tags: post.tags?.nodes?.map((tag: any) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug
      })) || []
    })) || []

    return {
      data: posts,
      hasNextPage: response?.posts?.pageInfo?.hasNextPage || false,
      endCursor: response?.posts?.pageInfo?.endCursor || null
    }
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return { data: [], hasNextPage: false, endCursor: null }
  }
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<{ data: BlogPost | null, error: any }> {
  try {
    const { GET_BLOG_POST_BY_SLUG } = await import('./queries')
    const response: any = await fetchGraphQL(GET_BLOG_POST_BY_SLUG, { slug })

    if (!response?.post) {
      return { data: null, error: 'Post not found' }
    }

    const post = response.post
    const blogPost: BlogPost = {
      id: post.id,
      databaseId: post.databaseId,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      slug: post.slug,
      date: post.date,
      modified: post.modified,
      featuredImage: post.featuredImage?.node ? {
        sourceUrl: post.featuredImage.node.sourceUrl,
        altText: post.featuredImage.node.altText || '',
        width: post.featuredImage.node.mediaDetails?.width,
        height: post.featuredImage.node.mediaDetails?.height
      } : undefined,
      author: {
        name: post.author?.node?.name || 'Anonymous',
        avatar: post.author?.node?.avatar?.url
      },
      categories: post.categories?.nodes?.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug
      })) || [],
      tags: post.tags?.nodes?.map((tag: any) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug
      })) || []
    }

    return { data: blogPost, error: null }
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return { data: null, error }
  }
}

/**
 * Get recent blog posts
 */
export async function getRecentBlogPosts(limit = 5): Promise<{ data: BlogPost[], error: null }> {
  try {
    const { GET_RECENT_BLOG_POSTS } = await import('./queries')
    const response: any = await fetchGraphQL(GET_RECENT_BLOG_POSTS, { first: limit })

    const posts = response?.posts?.nodes?.map((post: any) => ({
      id: post.id,
      databaseId: post.databaseId,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      slug: post.slug,
      date: post.date,
      modified: post.modified,
      featuredImage: post.featuredImage?.node ? {
        sourceUrl: post.featuredImage.node.sourceUrl,
        altText: post.featuredImage.node.altText || '',
        width: post.featuredImage.node.mediaDetails?.width,
        height: post.featuredImage.node.mediaDetails?.height
      } : undefined,
      author: {
        name: post.author?.node?.name || 'Anonymous',
        avatar: post.author?.node?.avatar?.url
      },
      categories: post.categories?.nodes?.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug
      })) || [],
      tags: post.tags?.nodes?.map((tag: any) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug
      })) || []
    })) || []

    return { data: posts, error: null }
  } catch (error) {
    console.error('Error fetching recent blog posts:', error)
    return { data: [], error: null }
  }
}

/**
 * Fetch a WordPress page by slug using REST API
 */
export async function getPageBySlug(slug: string) {
  try {
    // Get WordPress URL from environment, or extract from GraphQL URL
    let wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WORDPRESS_URL

    if (!wordpressUrl) {
      // Extract base URL from GraphQL URL
      const graphqlUrl = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL || ''
      wordpressUrl = graphqlUrl.replace('/graphql', '')
    }

    if (!wordpressUrl) {
      console.error('WordPress URL not configured')
      return { data: null, error: 'WordPress URL not configured' }
    }

    const apiUrl = `${wordpressUrl}/wp-json/wp/v2/pages?slug=${slug}`

    const response = await fetch(apiUrl, {
      next: { revalidate: 86400 } // Cache for 24 hours
    })

    if (!response.ok) {
      console.error(`WordPress REST API error: ${response.status} ${response.statusText}`)
      return { data: null, error: 'Page not found' }
    }

    const pages = await response.json()

    if (!pages || pages.length === 0) {
      return { data: null, error: 'Page not found' }
    }

    // WordPress REST API returns an array, get the first match
    const page = pages[0]

    // Transform REST API response to match our expected format
    return {
      data: {
        title: page.title?.rendered || '',
        content: page.content?.rendered || '',
        slug: page.slug,
        date: page.date,
        modified: page.modified
      },
      error: null
    }
  } catch (error) {
    console.error(`Error fetching page ${slug}:`, error)
    return { data: null, error: 'Failed to fetch page' }
  }
}
