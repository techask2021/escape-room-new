"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowUp } from 'lucide-react'

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true })
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  if (!isVisible) {
    return null
  }

  return (
    <Button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 h-12 w-12 rounded-full bg-escape-red hover:bg-escape-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group"
      size="icon"
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5 group-hover:animate-bounce" />
    </Button>
  )
}
