'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, CheckCircle2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive"
      })
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to subscribe')
      }

      toast({
        title: "Successfully Subscribed! 🎉",
        description: "Thank you for subscribing to our newsletter!",
      })

      setEmail('')

    } catch (error) {
      console.error('Newsletter subscription error:', error)
      toast({
        title: "Subscription Failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="border-t border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-16 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-escape-red rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-escape-red/50 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-sm p-10 lg:p-12 shadow-xl">
            {/* Small CTA Heading */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Stay Updated With The Latest Escape Room News</h3>
              <p className="text-sm text-slate-400">Stay informed about new escape room openings, special promotions, booking discounts, and insider tips from the escape room community</p>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative group">
                <div className="flex flex-col sm:flex-row gap-3 items-stretch max-w-3xl mx-auto">
                  <div className="relative flex-1 search-input-wrapper">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="h-16 w-full border-2 border-slate-700 bg-slate-800/90 text-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-escape-red focus-visible:ring-offset-2 focus-visible:border-escape-red focus-visible:bg-slate-800 transition-all pr-14 text-lg search-input-selection"
                      disabled={isSubmitting}
                      required
                      onFocus={(e) => {
                        e.target.select()
                      }}
                      onKeyDown={(e) => {
                        if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                          e.preventDefault()
                          e.currentTarget.select()
                        }
                      }}
                    />
                    <Mail className="absolute right-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 pointer-events-none" />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="h-16 px-10 sm:px-12 whitespace-nowrap bg-gradient-to-r from-escape-red to-escape-red/90 hover:from-escape-red/90 hover:to-escape-red text-white font-bold text-lg shadow-xl shadow-escape-red/30 hover:shadow-2xl hover:shadow-escape-red/40 transition-all hover:scale-105 border-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <span>{isSubmitting ? 'Subscribing...' : 'Subscribe'}</span>
                    {!isSubmitting && (
                      <svg className="ml-2.5 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    )}
                  </Button>
                </div>
                {/* Enhanced glow effect on form */}
                <div className="absolute -inset-1 bg-gradient-to-r from-escape-red/30 via-escape-red/20 to-escape-red/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>

              {/* Trust Badges - Centered and Enhanced */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-300 bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 max-w-2xl mx-auto">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-escape-red/20 border-2 border-escape-red/30">
                    <CheckCircle2 className="h-3.5 w-3.5 text-escape-red" />
                  </div>
                  <span className="font-semibold">25,000+ subscribers</span>
                </div>
                <div className="hidden sm:block h-5 w-px bg-slate-600" aria-hidden="true" />
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-escape-red/20 border-2 border-escape-red/30">
                    <svg className="h-3.5 w-3.5 text-escape-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <span>No spam, unsubscribe anytime</span>
                </div>
                <div className="hidden sm:block h-5 w-px bg-slate-600" aria-hidden="true" />
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-escape-red/20 border-2 border-escape-red/30">
                    <svg className="h-3.5 w-3.5 text-escape-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="font-semibold text-escape-red/90">Free forever</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
