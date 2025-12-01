'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import EscapeRoomCard from '@/components/escape-room-card'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { cn } from '@/lib/utils'

interface ThemePageClientProps {
  rooms: any[]
  roomsPerPage: number
  themeName: string
}

export default function ThemePageClient({ rooms, roomsPerPage, themeName }: ThemePageClientProps) {
  const [currentPage, setCurrentPage] = useState(1)
  
  const totalPages = Math.ceil(rooms.length / roomsPerPage)
  const startIndex = (currentPage - 1) * roomsPerPage
  const endIndex = startIndex + roomsPerPage
  const paginatedRooms = rooms.slice(startIndex, endIndex)

  return (
    <section className="py-12 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-escape-red">All listings</span>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">All {themeName} Escape Rooms</h2>
          <p className="mt-2 text-base text-slate-600 max-w-2xl">
            Browse through all available {themeName.toLowerCase()} escape room adventures. Each listing includes ratings, themes, difficulty levels, and booking information.
          </p>
        </div>

        {rooms.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedRooms.map((room, index) => (
                <EscapeRoomCard key={index} room={room} priority={index < 3} />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center mt-12 space-y-6">
                <Pagination>
                  <PaginationContent className="gap-2">
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage > 1) setCurrentPage(currentPage - 1)
                        }}
                        className={cn(
                          "h-10 px-4 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-escape-red hover:text-escape-red transition-all",
                          currentPage === 1 && "pointer-events-none opacity-50 cursor-not-allowed"
                        )}
                      />
                    </PaginationItem>
                    
                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                              setCurrentPage(pageNum)
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
                          if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                        }}
                        className={cn(
                          "h-10 px-4 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-escape-red hover:text-escape-red transition-all",
                          currentPage >= totalPages && "pointer-events-none opacity-50 cursor-not-allowed"
                        )}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
                
                {/* Pagination Info */}
                <div className="text-sm text-slate-500">
                  Showing {startIndex + 1}-{Math.min(endIndex, rooms.length)} of {rooms.length.toLocaleString()} rooms
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold mb-4 text-slate-900">No rooms found</h3>
            <p className="text-slate-600 mb-8">We couldn&apos;t find any escape rooms for this theme.</p>
            <Link href="/themes">
              <Button className="h-12 px-10">
                Browse All Themes
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}