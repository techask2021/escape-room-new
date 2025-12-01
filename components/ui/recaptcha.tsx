'use client'

import { useEffect, useRef, useState } from 'react'

interface ReCaptchaProps {
  onVerify: (token: string) => void
  onExpire?: () => void
  onError?: () => void
  theme?: 'light' | 'dark'
  size?: 'normal' | 'compact'
  className?: string
}

export default function ReCaptcha({
  onVerify,
  onExpire,
  onError,
  theme = 'light',
  size = 'normal',
  className = ''
}: ReCaptchaProps) {
  const recaptchaRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [widgetId, setWidgetId] = useState<number | null>(null)

  useEffect(() => {
    const loadRecaptcha = () => {
      if (typeof window !== 'undefined' && (window as any).grecaptcha?.render) {
        setIsLoaded(true)
        return
      }

      const script = document.createElement('script')
      script.src = `https://www.google.com/recaptcha/api.js?render=explicit`
      script.async = true
      script.defer = true
      script.onload = () => {
        setIsLoaded(true)
      }
      script.onerror = () => {
        console.error('Failed to load reCAPTCHA')
        onError?.()
      }
      document.head.appendChild(script)
    }

    loadRecaptcha()

    return () => {
      // Cleanup
      if (widgetId !== null && window.grecaptcha) {
        try {
          window.grecaptcha.reset(widgetId)
        } catch (error) {
          console.error('Error resetting reCAPTCHA:', error)
        }
      }
    }
  }, [widgetId, onError])

  useEffect(() => {
    if (isLoaded && recaptchaRef.current && widgetId === null) {
      try {
        const id = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6Ld9r90rAAAAAFtjV404YJvXhO9IX8Rslcbd6NiJ',
          theme,
          size,
          callback: (token: string) => {
            onVerify(token)
          },
          'expired-callback': () => {
            onExpire?.()
          },
          'error-callback': () => {
            onError?.()
          }
        })
        setWidgetId(id)
      } catch (error) {
        console.error('Error rendering reCAPTCHA:', error)
        onError?.()
      }
    }
  }, [isLoaded, theme, size, onVerify, onExpire, onError, widgetId])

  const reset = () => {
    if (widgetId !== null && window.grecaptcha) {
      try {
        window.grecaptcha.reset(widgetId)
      } catch (error) {
        console.error('Error resetting reCAPTCHA:', error)
      }
    }
  }

  return (
    <div className={`recaptcha-container ${className}`}>
      <div ref={recaptchaRef} className="recaptcha-widget" />
    </div>
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    grecaptcha: {
      render: (container: HTMLElement, options: any) => number
      reset: (widgetId: number) => void
      getResponse: (widgetId: number) => string
    }
  }
}
