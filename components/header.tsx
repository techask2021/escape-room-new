"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState, useEffect } from "react"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }

      setIsScrolled(currentScrollY > 0)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobileMenuOpen, isMounted])

  if (!isMounted) {
    return (
      <header
        id="navigation"
        className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/escape-room-finder.png"
                alt="Escape Rooms Finder Logo"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-escape-red leading-tight">ESCAPE ROOMS</span>
                <span className="text-sm font-semibold text-slate-700 leading-tight">FINDER</span>
              </div>
            </Link>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header
      id="navigation"
      className={`sticky top-0 z-50 bg-white border-b border-slate-200 transition-shadow ${
        isScrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/images/escape-room-finder.png"
                alt="Escape Rooms Finder Logo"
                width={40}
                height={40}
                className="h-10 w-10 object-contain transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-escape-red leading-tight">ESCAPE ROOMS</span>
                <span className="text-sm font-semibold text-slate-700 leading-tight">FINDER</span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              <Link href="/" className="text-sm font-medium text-slate-700 hover:text-escape-red transition-colors">
                Home
              </Link>
              <Link href="/browse" className="text-sm font-medium text-slate-700 hover:text-escape-red transition-colors">
                Browse Rooms
              </Link>
              <Link href="/locations" className="text-sm font-medium text-slate-700 hover:text-escape-red transition-colors">
                Locations
              </Link>
              <Link href="/themes" className="text-sm font-medium text-slate-700 hover:text-escape-red transition-colors">
                Themes
              </Link>
              <Link href="/contact" className="text-sm font-medium text-slate-700 hover:text-escape-red transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/contact" className="hidden md:block">
              <Button size="sm" className="h-12 px-10">
                Contact Us
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-slate-700 hover:text-escape-red p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white">
            <nav className="flex flex-col gap-1 py-4">
              <Link href="/" className="text-sm font-medium text-slate-700 hover:text-escape-red transition-colors px-2 py-2">
                Home
              </Link>
              <Link href="/browse" className="text-sm font-medium text-slate-700 hover:text-escape-red transition-colors px-2 py-2">
                Browse Rooms
              </Link>
              <Link href="/locations" className="text-sm font-medium text-slate-700 hover:text-escape-red transition-colors px-2 py-2">
                Locations
              </Link>
              <Link href="/themes" className="text-sm font-medium text-slate-700 hover:text-escape-red transition-colors px-2 py-2">
                Themes
              </Link>
              <Link href="/contact" className="text-sm font-medium text-slate-700 hover:text-escape-red transition-colors px-2 py-2">
                Contact
              </Link>
              <div className="pt-2 border-t border-slate-200 mt-2">
                <Link href="/contact">
                  <Button size="sm" className="w-full h-12 px-10">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
