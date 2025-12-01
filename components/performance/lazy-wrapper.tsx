'use client'

import { useState, useEffect, useRef, ReactNode } from 'react'

interface LazyWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  rootMargin?: string
  threshold?: number
  className?: string
}

export default function LazyWrapper({ 
  children, 
  fallback = null, 
  rootMargin = '50px',
  threshold = 0.1,
  className 
}: LazyWrapperProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true)
          setHasLoaded(true)
          observer.disconnect()
        }
      },
      {
        rootMargin,
        threshold,
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [rootMargin, threshold, hasLoaded])

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : fallback}
    </div>
  )
}

// Higher-order component for lazy loading
export function withLazyLoading<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: ReactNode
) {
  return function LazyComponent(props: T) {
    return (
      <LazyWrapper fallback={fallback}>
        <Component {...props} />
      </LazyWrapper>
    )
  }
}

// Hook for intersection observer
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true)
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
        ...options,
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [hasIntersected, options])

  return { ref, isVisible, hasIntersected }
}