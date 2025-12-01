import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Globe, Navigation, ExternalLink } from "lucide-react"
import Link from "next/link"
import VenueMap from "./venue-map"

interface ContactInfoProps {
  fullAddress?: string
  latitude?: number
  longitude?: number
  venueName: string
  phone?: string
  website?: string
  mapsUrl: string
}

export default function ContactInfo({
  fullAddress,
  latitude,
  longitude,
  venueName,
  phone,
  website,
  mapsUrl
}: ContactInfoProps) {
  return (
    <Card className="bg-white border border-slate-200 shadow-sm sticky top-4">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-lg font-semibold text-slate-900">Contact & Location</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {fullAddress && (
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-escape-red/10 border border-escape-red/20 flex-shrink-0">
                <MapPin className="h-5 w-5 text-escape-red" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Address</p>
                <p className="text-sm text-slate-700">{fullAddress}</p>
              </div>
            </div>

            {/* Interactive Map */}
            <div className="rounded-lg overflow-hidden border border-slate-200">
              <VenueMap
                latitude={latitude || 0}
                longitude={longitude || 0}
                venueName={venueName}
                address={fullAddress || ''}
              />
            </div>

            {/* External Maps Link */}
            <Link
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button className="w-full" variant="default">
                <Navigation className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
            </Link>
          </div>
        )}

        {phone && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-escape-red/30 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-escape-red/10 border border-escape-red/20">
              <Phone className="h-5 w-5 text-escape-red" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Phone</p>
              <Link
                href={`tel:${phone}`}
                className="text-sm text-escape-red hover:text-escape-red-700 font-medium transition-colors"
              >
                {phone}
              </Link>
            </div>
          </div>
        )}

        {website && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-escape-red/30 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-escape-red/10 border border-escape-red/20">
              <Globe className="h-5 w-5 text-escape-red" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Website</p>
              <Link
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-escape-red hover:text-escape-red-700 font-medium inline-flex items-center gap-1 transition-colors"
              >
                Visit Website
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
