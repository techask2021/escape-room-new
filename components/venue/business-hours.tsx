import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface BusinessHoursProps {
  schedule: { day: string; hours: string }[]
}

export default function BusinessHours({ schedule }: BusinessHoursProps) {
  if (schedule.length === 0) return null

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  return (
    <Card className="bg-white border border-slate-200 shadow-sm sticky top-4">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Clock className="h-5 w-5 text-escape-red" />
          Business Hours
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-2">
          {schedule.map((item, index) => {
            const isToday = item.day === today
            return (
              <div
                key={index}
                className={`flex justify-between items-center p-2 rounded-lg transition-colors ${
                  isToday
                    ? 'bg-escape-red/10 border border-escape-red/20'
                    : 'hover:bg-slate-50'
                }`}
              >
                <span className={`text-sm font-medium ${isToday ? 'text-escape-red' : 'text-slate-700'}`}>
                  {item.day}
                </span>
                <span className={`text-xs ${isToday ? 'text-escape-red font-semibold' : 'text-slate-600'}`}>
                  {item.hours}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
