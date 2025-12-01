'use client'

import Script from 'next/script'

interface GoogleAnalyticsProps {
  measurementId: string
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>
    </>
  )
}

// Hook for tracking custom events
export function useAnalytics() {
  const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    if (typeof window !== 'undefined' && (window as { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      })
    }
  }

  const trackPageView = (url: string, title: string) => {
    if (typeof window !== 'undefined' && (window as { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_title: title,
        page_location: url,
      })
    }
  }

  return { trackEvent, trackPageView }
}
