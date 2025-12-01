import EscapeRoomCard from "@/components/escape-room-card"
interface FeaturedRoomsProps {
  rooms: Array<{
    id: string
    [key: string]: any
  }>
}

export default function FeaturedRooms({ rooms }: FeaturedRoomsProps) {
  if (!rooms || rooms.length === 0) {
    return null
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-escape-red">Featured rooms</span>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">Featured Escapes Worth The Trip</h2>
            <p className="mt-2 text-base text-slate-600">
              Hand-picked escape room venues selected for exceptional experiences, outstanding reviews, and unforgettable adventures. These top-rated locations represent the best escape rooms available.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room, index) => (
            <div key={room.id} className="rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
              <EscapeRoomCard room={room} priority={index < 2} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
