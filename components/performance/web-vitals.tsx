'use client'

import { useEffect } from 'react'
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals'

interface WebVitalsProps {
  onMetric?: (metric: any) => void
}

export default function WebVitals({ onMetric }: WebVitalsProps) {
  useEffect(() => {
    const handleMetric = (metric: any) => {
      // Log metrics for development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Web Vitals] ${metric.name}:`, metric.value)
      }
      
      // Send to analytics if callback provided
      if (onMetric) {
        onMetric(metric)
      }
      
      // Send to Google Analytics if available
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true,
        })
      }
    }

    // Measure Core Web Vitals
    onCLS(handleMetric)
    onINP(handleMetric)
    onFCP(handleMetric)
    onLCP(handleMetric)
    onTTFB(handleMetric)
  }, [onMetric])

  return null
}

// Hook for measuring custom metrics
export function usePerformanceMetrics() {
  const measureCustomMetric = (name: string, startTime: number) => {
    const duration = performance.now() - startTime
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Custom Metric] ${name}:`, duration)
    }
    
    // Send to analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'custom_metric', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(duration),
        non_interaction: true,
      })
    }
  }

  return { measureCustomMetric }
}