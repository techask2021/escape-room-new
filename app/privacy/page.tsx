import { Metadata } from "next"
import Image from "next/image"
import { Shield } from "lucide-react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { getPageBySlug } from "@/lib/wordpress/api"
import ContentRenderer from "@/lib/content-renderer"
import { notFound } from "next/navigation"

export const revalidate = 86400 // Revalidate every 24 hours

export const metadata: Metadata = {
  title: "Privacy Policy | Escape Rooms Finder - Your Privacy Matters",
  description: "Learn how Escape Rooms Finder protects your privacy and handles your personal information. Read our comprehensive privacy policy.",
  openGraph: {
    title: "Privacy Policy | Escape Rooms Finder",
    description: "Learn how Escape Rooms Finder protects your privacy and handles your personal information.",
    url: "https://escaperoomsfinder.com/privacy",
    siteName: "Escape Rooms Finder",
    images: [
      {
        url: "/images/hero.jpeg",
        width: 1200,
        height: 630,
        alt: "Escape Rooms Finder Privacy Policy",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Escape Rooms Finder",
    description: "Learn how Escape Rooms Finder protects your privacy and handles your personal information.",
    images: ["/images/hero.jpeg"],
  },
  alternates: {
    canonical: "https://escaperoomsfinder.com/privacy",
  },
}

export default async function PrivacyPage() {
  const { data: page, error } = await getPageBySlug('privacy-policy')

  if (error || !page) {
    notFound()
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "@id": "https://escaperoomsfinder.com/privacy",
              "url": "https://escaperoomsfinder.com/privacy",
              "name": "Privacy Policy | Escape Rooms Finder - Your Privacy Matters",
              "description": "Learn how Escape Rooms Finder protects your privacy and handles your personal information. Read our comprehensive privacy policy.",
              "primaryImageOfPage": {
                "@type": "ImageObject",
                "@id": "https://escaperoomsfinder.com/images/hero.jpeg",
                "url": "https://escaperoomsfinder.com/images/hero.jpeg",
                "width": 1200,
                "height": 630,
                "caption": "Escape Rooms Finder Privacy Policy"
              },
              "breadcrumb": "https://escaperoomsfinder.com/privacy#breadcrumb",
              "isPartOf": {
                "@type": "WebSite",
                "@id": "https://escaperoomsfinder.com/#website"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "@id": "https://escaperoomsfinder.com/privacy#breadcrumb",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://escaperoomsfinder.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Privacy Policy",
                  "item": "https://escaperoomsfinder.com/privacy"
                }
              ]
            }
          ])
        }}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-[#f7fafc] border-b">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Privacy Policy</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-escape-red to-red-700 text-white py-20 overflow-hidden border-b border-slate-200">
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
                <Shield className="h-6 w-6 text-escape-red" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-escape-red">Privacy</span>
                <h1 className="mt-1 text-3xl font-semibold text-white">Privacy Policy</h1>
              </div>
            </div>
            <p className="text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
              Your privacy is important to us. Learn how we protect and handle your personal information.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-12 bg-gradient-to-br from-slate-50 via-white to-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10 pb-6 border-b border-slate-200">
              <p className="text-slate-600 mb-4 text-sm">
                <strong>Last updated:</strong> {new Date(page.modified).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* WordPress Content */}
            <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
              <ContentRenderer content={page.content} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}