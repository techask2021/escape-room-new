'use client'

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { MapPin } from 'lucide-react'

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

interface VenueMapProps {
  latitude: number
  longitude: number
  venueName: string
  address: string
  className?: string
}

function VenueMapComponent({ latitude, longitude, venueName, address, className = '' }: VenueMapProps) {
  const mapRef = useRef<any>(null)

  useEffect(() => {
    // Dynamically load Leaflet CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
    link.crossOrigin = ''
    document.head.appendChild(link)
    
    // Fix for default markers in react-leaflet
    import('leaflet').then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      })
    })

    // Cleanup function to remove the CSS link when component unmounts
    return () => {
      const existingLink = document.querySelector('link[href*="leaflet.css"]')
      if (existingLink) {
        document.head.removeChild(existingLink)
      }
    }
  }, [])

  // Fallback component for when coordinates are not available
  if (!latitude || !longitude) {
    return (
      <div className={`w-full h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300 ${className}`}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }} />
        </div>
        
        {/* Main content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-6">
          {/* Location pin with pulse animation */}
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" style={{ width: '24px', height: '24px', top: '12px', left: '12px' }} />
            <MapPin className="h-12 w-12 text-red-500 relative z-10 drop-shadow-lg" fill="currentColor" />
          </div>
          
          {/* Location info */}
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">{venueName}</h3>
            <p className="text-sm text-gray-600 max-w-xs leading-relaxed">{address}</p>
            <p className="text-xs text-gray-500">Map coordinates not available</p>
          </div>
        </div>
        
        {/* Corner decorations */}
        <div className="absolute top-2 right-2 w-3 h-3 bg-blue-400 rounded-full opacity-60" />
        <div className="absolute bottom-2 left-2 w-2 h-2 bg-indigo-400 rounded-full opacity-60" />
      </div>
    )
  }

  return (
    <div className={`w-full h-64 rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]}>
          <Popup>
            <div className="text-center p-2">
              <h3 className="font-semibold text-gray-800 mb-1">{venueName}</h3>
              <p className="text-sm text-gray-600">{address}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

// Export with dynamic import to prevent SSR issues
const VenueMap = dynamic(() => Promise.resolve(VenueMapComponent), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center">
      <div className="text-center space-y-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-sm text-gray-600">Loading map...</p>
      </div>
    </div>
  )
})

export default VenueMap