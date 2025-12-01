"use client"

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Building2 } from "lucide-react"
import SearchFilters from "@/components/search-filters"
import EscapeRoomGrid from "@/components/escape-room-grid"
import { SharedBreadcrumb, createBrowseBreadcrumbs } from "@/components/shared-breadcrumb"
import LocationHero from "@/components/location-hero"

export default function BrowsePageClient({
  rooms,
  totalCount,
  currentPage,
  stats,
  currentFilters
}: {
  rooms: any[]
  totalCount: number
  currentPage: number
  stats: any
  currentFilters: {
    name?: string
    city?: string
    state?: string
    country?: string
    category?: string
  }
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Local state for filter inputs
  const [filters, setFilters] = useState({
    name: currentFilters.name || '',
    city: currentFilters.city || '',
    state: currentFilters.state || '',
    country: currentFilters.country || '',
    category: currentFilters.category || ''
  })

  // Sync filters with URL params when they change externally (e.g. back button)
  useEffect(() => {
    setFilters({
      name: searchParams.get('name') || '',
      city: searchParams.get('city') || '',
      state: searchParams.get('state') || '',
      country: searchParams.get('country') || '',
      category: searchParams.get('category') || ''
    })
  }, [searchParams])

  const roomsPerPage = 24

  // Function to update URL with current filters and page
  const updateURL = (newPage: number, newFilters: typeof filters) => {
    const params = new URLSearchParams()

    // Add filters to URL
    if (newFilters.name) params.set('name', newFilters.name)
    if (newFilters.city) params.set('city', newFilters.city)
    if (newFilters.state) params.set('state', newFilters.state)
    if (newFilters.country) params.set('country', newFilters.country)
    if (newFilters.category) params.set('category', newFilters.category)

    // Add page to URL (only if not page 1)
    if (newPage > 1) params.set('page', newPage.toString())

    // Update URL and trigger server re-render
    const newURL = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.push(newURL, { scroll: false })
  }

  // Function to handle filter changes
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    updateURL(1, newFilters)
  }

  // Function to handle page changes
  const handlePageChange = (page: number) => {
    updateURL(page, filters)
  }

  // Default stats to prevent null errors
  const safeStats = stats || {
    totalRooms: 0,
    uniqueCities: 0,
    uniqueStates: 0,
    totalThemes: 0,
    averageRating: 4.2
  }

  return (
    <>
      <div className="min-h-screen bg-background">

        {/* Breadcrumb Navigation */}
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto px-4 py-3">
            <SharedBreadcrumb items={createBrowseBreadcrumbs()} />
          </div>
        </div>

        {/* Hero Section - With Background Image */}
        <LocationHero
          title="All Escape Rooms"
          subtitle="Browse"
          description={`Discover over ${safeStats.totalRooms.toLocaleString()} thrilling escape room adventures across ${safeStats.uniqueCities} cities worldwide. Filter by location and theme to find your perfect challenge.`}
          imageUrl={`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-content/uploads/2025/11/hero-pages-scaled.png`}
          icon={<Building2 className="h-6 w-6 text-escape-red" />}
        />

        <div className="container mx-auto px-4 py-12">
          <SearchFilters
            currentFilters={filters}
            onFiltersChange={handleFilterChange}
          />

          <EscapeRoomGrid
            rooms={rooms}
            loading={false}
            currentPage={currentPage}
            totalCount={totalCount}
            roomsPerPage={roomsPerPage}
            onPageChange={handlePageChange}
            showPagination={true}
          />
        </div>
      </div>
    </>
  )
}