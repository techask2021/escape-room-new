/**
 * Cache Invalidation API Route
 * 
 * Use this endpoint to clear the Redis cache after you update WordPress data.
 * 
 * Usage:
 * POST /api/cache/invalidate
 * Body: { "secret": "your-secret-key" }
 * 
 * This will clear ALL cached escape room data, forcing fresh fetches from WordPress.
 */

import { NextRequest, NextResponse } from 'next/server'
import { clearAllCache, invalidateCache, CACHE_KEYS, getCacheStats } from '@/lib/cache'

// Secret key for cache invalidation (set in environment variables)
const CACHE_INVALIDATION_SECRET = process.env.CACHE_INVALIDATION_SECRET || 'change-me-in-production'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { secret, keys } = body

        // Verify secret key
        if (secret !== CACHE_INVALIDATION_SECRET) {
            return NextResponse.json(
                { error: 'Invalid secret key' },
                { status: 401 }
            )
        }

        // If specific keys provided, invalidate only those
        if (keys && Array.isArray(keys)) {
            for (const key of keys) {
                await invalidateCache(key)
            }
            return NextResponse.json({
                success: true,
                message: `Invalidated ${keys.length} cache keys`,
                keys
            })
        }

        // Otherwise, clear all cache
        await clearAllCache()

        return NextResponse.json({
            success: true,
            message: 'All cache cleared successfully. Next request will fetch fresh data from WordPress.',
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        console.error('[Cache Invalidation Error]:', error)
        return NextResponse.json(
            { error: 'Failed to invalidate cache', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const secret = searchParams.get('secret')

        // Verify secret key
        if (secret !== CACHE_INVALIDATION_SECRET) {
            return NextResponse.json(
                { error: 'Invalid secret key' },
                { status: 401 }
            )
        }

        // Return cache statistics
        const stats = await getCacheStats()

        return NextResponse.json({
            success: true,
            stats,
            cacheKeys: Object.entries(CACHE_KEYS).map(([name, key]) => ({ name, key }))
        })
    } catch (error) {
        console.error('[Cache Stats Error]:', error)
        return NextResponse.json(
            { error: 'Failed to get cache stats', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
