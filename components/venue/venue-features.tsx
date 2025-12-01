import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"

interface VenueFeaturesProps {
  features: string[]
}

export default function VenueFeatures({ features }: VenueFeaturesProps) {
  if (!features || features.length === 0) return null

  return (
    <Card className="bg-white border border-slate-200 shadow-sm">
      <CardContent className="p-6 lg:p-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
          <div className="w-2 h-2 bg-escape-red rounded-full"></div>
          Features & Amenities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-escape-red/30 hover:bg-escape-red/5 transition-all duration-200"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-escape-red/20 border border-escape-red/30 flex-shrink-0 mt-0.5">
                <Check className="h-3 w-3 text-escape-red" />
              </div>
              <span className="text-sm text-slate-700 font-medium">{String(feature)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
