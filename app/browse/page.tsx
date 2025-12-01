import { Metadata } from 'next'
import { getDatabaseStats, getEscapeRooms, formatRoomForDisplay } from '@/lib/data-source'
import BrowsePageClient from '@/components/browse-page-client'
import { createBrowseMetadata } from '@/lib/metadata'

// Enable ISR - revalidate every 15 minutes (longer cache = faster loads)
export const revalidate = 900

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const stats = await getDatabaseStats()
  const resolvedSearchParams = await searchParams
  const currentPage = parseInt(resolvedSearchParams.page as string) || 1

  return createBrowseMetadata(
    resolvedSearchParams,
    stats.totalRooms || 1000,
    currentPage
  )
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams
  const currentPage = parseInt(resolvedSearchParams.page as string) || 1
  const roomsPerPage = 24
  const offset = (currentPage - 1) * roomsPerPage

  const filters = {
    name: resolvedSearchParams.name as string | undefined,
    city: resolvedSearchParams.city as string | undefined,
    state: resolvedSearchParams.state as string | undefined,
    country: resolvedSearchParams.country as string | undefined,
    category: resolvedSearchParams.category as string | undefined,
  }

  // Load ONLY the current page of rooms (Server-Side Pagination)
  const [roomsResult, stats] = await Promise.all([
    getEscapeRooms({
      limit: roomsPerPage,
      offset: offset,
      ...filters
    }),
    getDatabaseStats()
  ])

  const rooms = roomsResult.data?.map(formatRoomForDisplay) || []
  const totalCount = roomsResult.count || 0

  return (
    <BrowsePageClient
      rooms={rooms}
      totalCount={totalCount}
      currentPage={currentPage}
      stats={stats}
      currentFilters={filters}
    />
  )
}
