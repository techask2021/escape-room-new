import Link from "next/link"
import Image from "next/image"
import { MapPin, Star, Heart, Zap } from "lucide-react"

// Facebook Icon Component
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 474.294 474.294" fill="currentColor">
    <circle cx="237.111" cy="236.966" r="236.966" fill="#3A5A98"/>
    <path d="M404.742,69.754c92.541,92.541,92.545,242.586-0.004,335.134c-92.545,92.541-242.593,92.541-335.134,0L404.742,69.754z" fill="#345387"/>
    <path d="M472.543,263.656L301.129,92.238l-88.998,88.998l5.302,5.302l-50.671,50.667l41.474,41.474l-5.455,5.452l44.901,44.901l-51.764,51.764l88.429,88.429C384.065,449.045,461.037,366.255,472.543,263.656z" fill="#2E4D72"/>
    <path d="M195.682,148.937c0,7.27,0,39.741,0,39.741h-29.115v48.598h29.115v144.402h59.808V237.276h40.134c0,0,3.76-23.307,5.579-48.781c-5.224,0-45.485,0-45.485,0s0-28.276,0-33.231c0-4.962,6.518-11.641,12.965-11.641c6.436,0,20.015,0,32.587,0c0-6.623,0-29.481,0-50.592c-16.786,0-35.883,0-44.306,0C194.201,93.028,195.682,141.671,195.682,148.937z" fill="#FFFFFF"/>
  </svg>
)

// Pinterest Icon Component
const PinterestIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 48 48" fill="currentColor">
    <circle cx="24" cy="24" r="20" fill="#BD081C"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M24.8523 12C18.3024 12 15 16.6959 15 20.6118C15 22.9826 15.8978 25.0924 17.8231 25.8777C18.1389 26.0067 18.4216 25.8822 18.5131 25.5327C18.5769 25.2905 18.7276 24.6799 18.7944 24.4257C18.8866 24.0799 18.8506 23.9592 18.5956 23.6577C18.0406 23.0029 17.6858 22.1553 17.6858 20.9546C17.6858 17.4699 20.2929 14.3513 24.4736 14.3513C28.1757 14.3513 30.2098 16.6141 30.2098 19.6345C30.2098 23.6096 28.4502 26.9645 25.8394 26.9645C24.3971 26.9645 23.3178 25.7712 23.6636 24.3087C24.0776 22.5626 24.8808 20.6771 24.8808 19.417C24.8808 18.289 24.2748 17.3477 23.0215 17.3477C21.547 17.3477 20.3627 18.8725 20.3627 20.9156C20.3627 22.2169 20.8022 23.0974 20.8022 23.0974C20.8022 23.0974 19.2931 29.4899 19.0291 30.6097C18.5026 32.8395 18.9504 35.5726 18.9879 35.8486C19.0104 36.0121 19.2204 36.0511 19.3156 35.9266C19.4514 35.7496 21.2072 33.5812 21.8042 31.4152C21.973 30.8024 22.774 27.6261 22.774 27.6261C23.2525 28.5396 24.6528 29.3444 26.1416 29.3444C30.5735 29.3444 33.5796 25.304 33.5796 19.8955C33.5796 15.8079 30.1168 12 24.8523 12Z" fill="white"/>
  </svg>
)

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/escape-room-finder.png"
                alt="Escape Rooms Finder Logo"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-escape-red leading-tight">ESCAPE ROOMS</span>
                <span className="text-sm font-semibold text-slate-300 leading-tight">FINDER</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Discover the best escape rooms worldwide. Your ultimate directory for thrilling adventures.
            </p>
            <div className="flex gap-3">
              <Link 
                href="https://facebook.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-slate-800 hover:bg-escape-red transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-5 w-5 text-slate-300" />
              </Link>
              <Link 
                href="https://pinterest.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-slate-800 hover:bg-escape-red transition-colors"
                aria-label="Pinterest"
              >
                <PinterestIcon className="h-5 w-5 text-slate-300" />
              </Link>
            </div>
          </div>

          {/* Popular Cities */}
          <div>
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-escape-red" />
              Popular Cities
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/locations/usa/california/los-angeles" className="text-slate-400 hover:text-escape-red transition-colors">
                  Los Angeles
                </Link>
              </li>
              <li>
                <Link href="/locations/usa/new-york/new-york" className="text-slate-400 hover:text-escape-red transition-colors">
                  New York
                </Link>
              </li>
              <li>
                <Link href="/locations/usa/illinois/chicago" className="text-slate-400 hover:text-escape-red transition-colors">
                  Chicago
                </Link>
              </li>
              <li>
                <Link href="/locations/usa/florida/miami" className="text-slate-400 hover:text-escape-red transition-colors">
                  Miami
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-escape-red" />
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/browse" className="text-slate-400 hover:text-escape-red transition-colors">
                  Browse Rooms
                </Link>
              </li>
              <li>
                <Link href="/locations" className="text-slate-400 hover:text-escape-red transition-colors">
                  Locations
                </Link>
              </li>
              <li>
                <Link href="/themes" className="text-slate-400 hover:text-escape-red transition-colors">
                  Themes
                </Link>
              </li>
              <li>
                <Link href="/add-listing" className="text-slate-400 hover:text-escape-red transition-colors">
                  Add Your Room
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-400 hover:text-escape-red transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Star className="h-4 w-4 text-escape-red" />
              Categories
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/themes/horror-escape-rooms" className="text-slate-400 hover:text-escape-red transition-colors">
                  Horror
                </Link>
              </li>
              <li>
                <Link href="/themes/mystery-escape-rooms" className="text-slate-400 hover:text-escape-red transition-colors">
                  Mystery
                </Link>
              </li>
              <li>
                <Link href="/themes/adventure-escape-rooms" className="text-slate-400 hover:text-escape-red transition-colors">
                  Adventure
                </Link>
              </li>
              <li>
                <Link href="/themes/sci-fi-escape-rooms" className="text-slate-400 hover:text-escape-red transition-colors">
                  Sci-Fi
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Heart className="h-4 w-4 text-escape-red" />
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-escape-red transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-escape-red transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-escape-red transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-8">
          <p className="text-sm text-slate-500 text-center">
            © 2025 Escape Rooms Finder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
