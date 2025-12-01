import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Clock, Target, DollarSign, Calendar } from "lucide-react"
import Link from "next/link"

interface VenueDetailsProps {
  difficulty?: string
  teamSize?: string
  duration?: string
  price?: string
  orderLinks?: string
}

export default function VenueDetails({
  difficulty,
  teamSize,
  duration,
  price,
  orderLinks
}: VenueDetailsProps) {
  return (
    <Card className="bg-white border border-slate-200 shadow-sm sticky top-4">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-lg font-semibold text-slate-900">Quick Details</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {/* Difficulty */}
        {difficulty && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-escape-red/30 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-escape-red/10 border border-escape-red/20">
              <Target className="h-5 w-5 text-escape-red" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Difficulty</p>
              <p className="text-sm text-slate-900 font-semibold">{difficulty}</p>
            </div>
          </div>
        )}

        {/* Team Size */}
        {teamSize && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-escape-red/30 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-escape-red/10 border border-escape-red/20">
              <Users className="h-5 w-5 text-escape-red" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Team Size</p>
              <p className="text-sm text-slate-900 font-semibold">{teamSize}</p>
            </div>
          </div>
        )}

        {/* Duration */}
        {duration && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-escape-red/30 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-escape-red/10 border border-escape-red/20">
              <Clock className="h-5 w-5 text-escape-red" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Duration</p>
              <p className="text-sm text-slate-900 font-semibold">{duration}</p>
            </div>
          </div>
        )}

        {/* Price */}
        {price && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-escape-red/30 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-escape-red/10 border border-escape-red/20">
              <DollarSign className="h-5 w-5 text-escape-red" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Price</p>
              <p className="text-sm text-slate-900 font-semibold">${price}</p>
            </div>
          </div>
        )}

        {/* Booking Button */}
        {orderLinks && (
          <div className="pt-2">
            <Link
              href={orderLinks}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button className="w-full" variant="default">
                <Calendar className="h-4 w-4 mr-2" />
                Book Your Adventure
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
