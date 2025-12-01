'use client'

import { useEffect, useState } from 'react'

export default function GlobalLoading() {
  const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    // Hide loading after initial page load
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (!showLoading) return null

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Simple spinner */}
        <div className="w-12 h-12 border-4 border-gray-200 border-t-escape-red rounded-full animate-spin"></div>
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    </div>
  )
}
