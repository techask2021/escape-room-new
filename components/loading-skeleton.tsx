'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <div className="flex space-x-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Hero Section Skeleton */}
          <div className="text-center space-y-4">
            <Skeleton className="h-12 w-96 mx-auto" />
            <Skeleton className="h-6 w-80 mx-auto" />
            <Skeleton className="h-10 w-40 mx-auto" />
          </div>

          {/* Cards Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="h-6 w-32 bg-gray-700" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-gray-700" />
                  <Skeleton className="h-4 w-28 bg-gray-700" />
                  <Skeleton className="h-4 w-20 bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function CardLoadingSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  )
}

export function BlogLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="group hover:shadow-2xl hover:shadow-escape-red/20 transition-all duration-500 border border-gray-200/50 hover:border-escape-red/30 shadow-lg bg-gradient-to-br from-white via-gray-50/50 to-white relative overflow-hidden">
          <Skeleton className="h-48 w-full rounded-t-lg" />
          <CardHeader className="pb-3">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-1" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
