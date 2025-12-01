/**
 * Upstash Redis Client for Caching
 * 
 * CRITICAL: Redis is MANDATORY for production.
 * We always cache with Redis to reduce CPU usage by 90%.
 * This prevents repeated WordPress API calls that spike CPU.
 * 
 * Without Redis:
 * - 20-25 WordPress API calls per page = 80-90% CPU usage
 * - Vercel hits CPU limits and times out
 * 
 * With Redis:
 * - Cache HIT = instant response, 0 API calls, <5% CPU
 * - Cache MISS (rare) = 1 fetch, cached for 24 hours
 */

import { Redis } from '@upstash/redis'

// Initialize Redis client - with graceful degradation
let redis: Redis | null = null

try {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
        console.error('[CRITICAL] Missing Redis environment variables:')
        console.error('  UPSTASH_REDIS_REST_URL:', process.env.UPSTASH_REDIS_REST_URL ? '✓ SET' : '✗ MISSING')
        console.error('  UPSTASH_REDIS_REST_TOKEN:', process.env.UPSTASH_REDIS_REST_TOKEN ? '✓ SET' : '✗ MISSING')
        console.error('[WARNING] Caching is disabled without Redis. CPU usage will be HIGH.')
        redis = null
    } else {
        redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        })
        console.log('[Redis] Initialized successfully')
    }
} catch (error) {
    console.error('[Redis Init Error]:', error instanceof Error ? error.message : error)
    redis = null
}

// Cache key prefixes
export const CACHE_KEYS = {
    ALL_ROOMS: 'escape-rooms:all',
    ROOM_BY_ID: 'escape-rooms:id:',
    ROOM_BY_SLUG: 'escape-rooms:slug:',
    ROOMS_BY_STATE: 'escape-rooms:state:',
    ROOMS_BY_CITY: 'escape-rooms:city:',
    FEATURED_ROOMS: 'escape-rooms:featured',
    STATES_WITH_COUNTS: 'escape-rooms:states-counts',
    CITIES_WITH_COUNTS: 'escape-rooms:cities-counts:',
    THEMES_WITH_COUNTS: 'escape-rooms:themes-counts',
    DATABASE_STATS: 'escape-rooms:stats',
    COUNTRY_STATS: 'escape-rooms:country-stats',
    BLOG_POSTS: 'blog:posts:',
    BLOG_POST: 'blog:post:',
} as const

// Cache TTL (Time To Live) in seconds
// Since data only changes when you manually update, we use long cache times
export const CACHE_TTL = {
    ALL_ROOMS: 86400, // 24 hours - main data cache
    SINGLE_ROOM: 86400, // 24 hours
    FILTERED_ROOMS: 43200, // 12 hours
    STATS: 43200, // 12 hours
    BLOG: 3600, // 1 hour
    SHORT: 1800, // 30 minutes
} as const

/**
 * Get data from cache or fetch from source
 * 
 * Always uses Redis cache to prevent CPU spikes.
 * Without this cache, every request = 20+ WordPress API calls.
 */
export async function getCached<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = CACHE_TTL.ALL_ROOMS
): Promise<T> {
    // If Redis is not available, skip caching and go straight to fetcher
    if (!redis) {
        console.log(`[Cache SKIP] ${key} - Redis unavailable, fetching from source directly`)
        return fetcher()
    }

    try {
        // Try to get from cache first
        const cached = await redis.get<T>(key)

        // Check for cache hit (but not for null/undefined - those aren't cached)
        if (cached !== null && cached !== undefined) {
            console.log(`[Cache HIT] ${key}`)
            return cached
        }

        console.log(`[Cache MISS] ${key} - Fetching from source...`)

        // Cache miss - fetch from source
        const data = await fetcher()

        // Store in cache for future requests (non-blocking)
        // Wrap in try-catch to prevent cache write failures from breaking the request
        if (data !== null && data !== undefined) {
            redis.set(key, data, { ex: ttl }).catch(setCacheError => {
                // Log but don't fail the request if cache write fails
                console.warn(`[Cache WRITE ERROR] ${key}:`, setCacheError instanceof Error ? setCacheError.message : setCacheError)
            })
        } else {
            console.log(`[Cache SKIP] ${key} - Data is null/undefined, not caching`)
        }

        return data
    } catch (error: any) {
        // CRITICAL: Handle "Dynamic server usage" error during Next.js static build
        // This error happens because Redis uses 'no-store' cache mode
        // During build, we MUST fetch from WordPress to pre-populate the cache
        const errorMessage = error instanceof Error ? error.message : String(error)
        
        if (errorMessage.includes('Dynamic server usage')) {
            console.log(`[Cache BUILD FALLBACK] ${key} - Static build detected, fetching from WordPress...`)
            try {
                const data = await fetcher()
                // Store this data so next time it's cached
                if (data !== null && data !== undefined) {
                    redis.set(key, data, { ex: ttl }).catch(() => {
                        // Silently fail if we can't write to cache during build
                    })
                }
                return data
            } catch (fetchError) {
                console.error(`[BUILD FETCHER ERROR] ${key}:`, fetchError instanceof Error ? fetchError.message : fetchError)
                throw fetchError
            }
        }

        // For Redis connection errors, fall back to fetcher
        const isRedisError = 
            errorMessage.includes('ECONNREFUSED') ||
            errorMessage.includes('ENOTFOUND') ||
            errorMessage.includes('ETIMEDOUT') ||
            errorMessage.includes('Connection refused') ||
            errorMessage.includes('socket hang up')

        if (isRedisError) {
            console.warn(`[Cache CONNECTION ERROR] ${key} - Redis unavailable (${errorMessage}), falling back to fetcher`)
            try {
                return await fetcher()
            } catch (fetchError) {
                console.error(`[Fallback fetcher ERROR] ${key}:`, fetchError instanceof Error ? fetchError.message : fetchError)
                throw fetchError
            }
        }

        // For other errors, log and try fetcher
        console.error(`[Cache ERROR] ${key}:`, errorMessage)
        try {
            return await fetcher()
        } catch (fetchError) {
            console.error(`[Final ERROR] ${key}:`, fetchError instanceof Error ? fetchError.message : fetchError)
            throw fetchError
        }
    }
}

/**
 * Invalidate (delete) a specific cache key
 */
export async function invalidateCache(key: string): Promise<void> {
    if (!redis) {
        console.warn(`[Cache INVALIDATE SKIP] ${key} - Redis not available`)
        return
    }

    try {
        await redis.del(key)
        console.log(`[Cache INVALIDATED] ${key}`)
    } catch (error) {
        console.error(`[Cache INVALIDATION ERROR] ${key}:`, error)
    }
}

/**
 * Invalidate multiple cache keys by pattern
 */
export async function invalidateCachePattern(pattern: string): Promise<void> {
    if (!redis) {
        console.warn(`[Cache INVALIDATE SKIP] Pattern ${pattern} - Redis not available`)
        return
    }

    try {
        // Get all keys matching pattern
        const keys = await redis.keys(pattern)

        if (keys.length > 0) {
            await redis.del(...keys)
            console.log(`[Cache INVALIDATED] ${keys.length} keys matching ${pattern}`)
        }
    } catch (error) {
        console.error(`[Cache PATTERN INVALIDATION ERROR] ${pattern}:`, error)
    }
}

/**
 * Clear ALL cache (use when you update WordPress data)
 */
export async function clearAllCache(): Promise<void> {
    if (!redis) {
        console.warn('[Cache CLEAR SKIP] Redis not available')
        return
    }

    try {
        await invalidateCachePattern('escape-rooms:*')
        await invalidateCachePattern('blog:*')
        console.log('[Cache CLEARED] All cache invalidated')
    } catch (error) {
        console.error('[Cache CLEAR ERROR]:', error)
    }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
    totalKeys: number
    roomKeys: number
    blogKeys: number
}> {
    if (!redis) {
        console.warn('[Cache STATS] Redis not available')
        return { totalKeys: 0, roomKeys: 0, blogKeys: 0 }
    }

    try {
        const allKeys = await redis.keys('*')
        const roomKeys = await redis.keys('escape-rooms:*')
        const blogKeys = await redis.keys('blog:*')

        return {
            totalKeys: allKeys.length,
            roomKeys: roomKeys.length,
            blogKeys: blogKeys.length,
        }
    } catch (error) {
        console.error('[Cache STATS ERROR]:', error)
        return { totalKeys: 0, roomKeys: 0, blogKeys: 0 }
    }
}

export default redis
