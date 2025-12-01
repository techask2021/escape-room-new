import { Button } from "@/components/ui/button"
import EscapeRoomCard from "@/components/escape-room-card"
import Link from "next/link"
interface HomepageEscapeRoomsProps {
  rooms: Array<{
    id: string
    [key: string]: any
  }>
  totalCount: number
}

export default function HomepageEscapeRooms({ rooms, totalCount }: HomepageEscapeRoomsProps) {
  if (!rooms || rooms.length === 0) {
    return null
  }

  return (
    <section className="border-t border-slate-100 bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-escape-red">Browse the directory</span>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">Escape Rooms Finder Directory</h2>
            <p className="mt-2 text-base text-slate-600">
              Browse our complete escape room database with new venues added regularly. Use advanced filters to find escape rooms matching your preferred location, theme, difficulty, and group size.
            </p>
          </div>
          <div className="text-sm text-slate-500">
            Showing {Math.min(rooms.length, totalCount).toLocaleString()} of {totalCount.toLocaleString()} rooms
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room, index) => (
            <div key={room.id} className="rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
              <EscapeRoomCard room={room} priority={index < 3} />
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/browse">
            <Button size="lg" className="h-12 px-10">
              Browse All Escape Rooms
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}