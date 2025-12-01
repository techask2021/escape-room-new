'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import ReCaptcha from "@/components/ui/recaptcha"
import { toast } from "@/hooks/use-toast"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const [recaptchaError, setRecaptchaError] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRecaptchaVerify = (token: string) => {
    setRecaptchaToken(token)
    setRecaptchaError(false)
  }

  const handleRecaptchaExpire = () => {
    setRecaptchaToken(null)
    setRecaptchaError(true)
  }

  const handleRecaptchaError = () => {
    setRecaptchaToken(null)
    setRecaptchaError(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!recaptchaToken) {
      setRecaptchaError(true)
      toast({
        title: "reCAPTCHA Required",
        description: "Please complete the reCAPTCHA verification.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      // First verify reCAPTCHA
      const recaptchaResponse = await fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: recaptchaToken }),
      })

      const recaptchaResult = await recaptchaResponse.json()

      if (!recaptchaResult.success) {
        throw new Error('reCAPTCHA verification failed')
      }

      // Submit the contact form
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to send message')
      }

      toast({
        title: "Message Sent!",
        description: "Thank you for your message. We'll get back to you soon.",
      })

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
      setRecaptchaToken(null)
      setRecaptchaError(false)

    } catch (error) {
      console.error('Error submitting form:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-900">Name</label>
          <div className="relative search-input-wrapper">
            <Input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name"
              className="h-12 border-2 border-slate-300 focus:border-escape-red focus:ring-2 focus:ring-escape-red/20 text-sm transition-all search-input-selection"
              onFocus={(e) => {
                e.target.select()
              }}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                  e.preventDefault()
                  e.currentTarget.select()
                }
              }}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-900">Email</label>
          <div className="relative search-input-wrapper">
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              className="h-12 border-2 border-slate-300 focus:border-escape-red focus:ring-2 focus:ring-escape-red/20 text-sm transition-all search-input-selection"
              onFocus={(e) => {
                e.target.select()
              }}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                  e.preventDefault()
                  e.currentTarget.select()
                }
              }}
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-900">Subject</label>
        <div className="relative search-input-wrapper">
          <Input
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="How can we help?"
            className="h-12 border-2 border-slate-300 focus:border-escape-red focus:ring-2 focus:ring-escape-red/20 text-sm transition-all search-input-selection"
            onFocus={(e) => {
              e.target.select()
            }}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                e.preventDefault()
                e.currentTarget.select()
              }
            }}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-900">Message</label>
        <div className="relative search-input-wrapper">
          <Textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Describe your question or issue..."
            rows={6}
            className="border-2 border-slate-300 focus:border-escape-red focus:ring-2 focus:ring-escape-red/20 text-sm transition-all resize-none search-input-selection"
            onFocus={(e) => {
              e.target.select()
            }}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                e.preventDefault()
                e.currentTarget.select()
              }
            }}
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-center">
          <ReCaptcha
            onVerify={handleRecaptchaVerify}
            onExpire={handleRecaptchaExpire}
            onError={handleRecaptchaError}
            theme="light"
            size="normal"
            className="recaptcha-container"
          />
        </div>
        {recaptchaError && (
          <p className="text-sm text-red-500 text-center">
            Please complete the reCAPTCHA verification
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !recaptchaToken}
        className="w-full h-12 bg-escape-red hover:bg-escape-red-600 text-white font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  )
}
