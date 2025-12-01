"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"
import EscapeRoomCard from "@/components/escape-room-card"
import Link from "next/link"

interface EscapeRoomGridProps {
  rooms?: any[]
  loading?: boolean
  currentPage?: number
  totalCount?: number
  roomsPerPage?: number
  onPageChange?: (page: number) => void
  showPagination?: boolean
}

export default function EscapeRoomGrid({ 
  rooms = [], 
  loading = false, 
  currentPage = 1, 
  totalCount = 0, 
  roomsPerPage = 20, 
  onPageChange, 
  showPagination = false 
}: EscapeRoomGridProps) {
  const searchParams = useSearchParams()
  const themeFromUrl = searchParams.get('theme') ? decodeURIComponent(searchParams.get('theme')!) : 'all'
  const searchFromUrl = searchParams.get('search') || ''
  const locationFromUrl = searchParams.get('location') || ''
  
  // Combine search and location into a single search term
  const initialSearchTerm = [searchFromUrl, locationFromUrl].filter(Boolean).join(', ')
  
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [selectedTheme, setSelectedTheme] = useState(themeFromUrl)

  // Update selectedTheme and searchTerm when URL parameters change
  useEffect(() => {
    setSelectedTheme(themeFromUrl)
    const newSearchTerm = [searchFromUrl, locationFromUrl].filter(Boolean).join(', ')
    setSearchTerm(newSearchTerm)
  }, [themeFromUrl, searchFromUrl, locationFromUrl])

  // Use rooms directly since filtering is now handled by the backend
  const filteredRooms = rooms
  const totalPages = Math.ceil(totalCount / roomsPerPage)

  if (loading) {
    return (
      <section>
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-escape-red rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading escape rooms...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-escape-red">All listings</span>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Discover All Escape Rooms</h2>
        </div>
        <div className="text-sm text-slate-500">
          Showing {((currentPage - 1) * roomsPerPage) + 1}-{Math.min(currentPage * roomsPerPage, totalCount)} of {totalCount.toLocaleString()} rooms
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredRooms.map((room, index) => (
          <EscapeRoomCard
            key={room.id}
            room={room}
            priority={index < 3}
          />
        ))}
      </div>

      {/* Pagination or Browse More Button */}
      {showPagination ? (
        <div className="flex flex-col items-center mt-12 space-y-6">
          {/* Pagination Controls */}
          {totalCount > roomsPerPage && (
            <Pagination>
              <PaginationContent className="gap-2">
                <PaginationItem>
                  <PaginationPrevious 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) onPageChange?.(currentPage - 1)
                    }}
                    className={cn(
                      "h-10 px-4 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-escape-red hover:text-escape-red transition-all",
                      currentPage === 1 && "pointer-events-none opacity-50 cursor-not-allowed"
                    )}
                  />
                </PaginationItem>
                
                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, Math.ceil(totalCount / roomsPerPage)) }, (_, i) => {
                  const totalPages = Math.ceil(totalCount / roomsPerPage)
                  let pageNum
                  
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          onPageChange?.(pageNum)
                        }}
                        isActive={currentPage === pageNum}
                        className={cn(
                          "h-10 min-w-10 px-4 flex items-center justify-center border transition-all cursor-pointer",
                          currentPage === pageNum 
                            ? "bg-escape-red border-escape-red text-white hover:bg-escape-red-600 hover:border-escape-red-600" 
                            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-escape-red hover:text-escape-red"
                        )}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < Math.ceil(totalCount / roomsPerPage)) onPageChange?.(currentPage + 1)
                    }}
                    className={cn(
                      "h-10 px-4 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-escape-red hover:text-escape-red transition-all",
                      currentPage >= Math.ceil(totalCount / roomsPerPage) && "pointer-events-none opacity-50 cursor-not-allowed"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
          
          {/* Pagination Info */}
          <div className="text-sm text-slate-500">
            Showing {((currentPage - 1) * roomsPerPage) + 1}-{Math.min(currentPage * roomsPerPage, totalCount)} of {totalCount.toLocaleString()} rooms
          </div>
        </div>
      ) : (
        <div className="flex justify-center mt-8">
          <Link href="/browse">
            <Button 
              size="lg" 
              className="h-12 px-10"
            >
              Browse all escape rooms
            </Button>
          </Link>
        </div>
      )}
    </section>
  )
}
