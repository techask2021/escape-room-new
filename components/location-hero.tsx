"use client"

import { MapPin } from 'lucide-react'
import Image from 'next/image'

interface LocationHeroProps {
  title: string
  subtitle: string
  description: string
  imageUrl: string
  icon?: React.ReactNode
}

export default function LocationHero({
  title,
  subtitle,
  description,
  imageUrl,
  icon
}: LocationHeroProps) {
  return (
    <section className="relative text-white py-20 overflow-hidden border-b border-slate-200">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt={`${title} - ${subtitle}`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={85}
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Subtle decorative elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-escape-red rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-escape-red/50 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-escape-red/20 border border-escape-red/30 backdrop-blur-sm">
              {icon || <MapPin className="h-6 w-6 text-escape-red" />}
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-escape-red">
                {subtitle}
              </span>
              <h1 className="mt-1 text-3xl font-semibold text-white">
                {title}
              </h1>
            </div>
          </div>
          <p className="text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </section>
  )
}
