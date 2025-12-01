import { Metadata } from "next"
import Image from "next/image"
import { FileText } from "lucide-react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { getPageBySlug } from "@/lib/wordpress/api"
import ContentRenderer from "@/lib/content-renderer"
import { notFound } from "next/navigation"

export const revalidate = 86400 // Revalidate every 24 hours

export const metadata: Metadata = {
  title: "Terms of Service | Escape Rooms Finder - Terms and Conditions",
  description: "Read the terms of service and conditions for using Escape Rooms Finder. Understand your rights and responsibilities when using our platform.",
  openGraph: {
    title: "Terms of Service | Escape Rooms Finder",
    description: "Read the terms of service and conditions for using Escape Rooms Finder platform.",
    url: "https://escaperoomsfinder.com/terms",
    siteName: "Escape Rooms Finder",
    images: [
      {
        url: "/images/hero.jpeg",
        width: 1200,
        height: 630,
        alt: "Escape Rooms Finder Terms of Service",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | Escape Rooms Finder",
    description: "Read the terms of service and conditions for using Escape Rooms Finder platform.",
    images: ["/images/hero.jpeg"],
  },
  alternates: {
    canonical: "https://escaperoomsfinder.com/terms",
  },
}

export default async function TermsPage() {
  const { data: page, error } = await getPageBySlug('terms-of-service')

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
              "@id": "https://escaperoomsfinder.com/terms",
              "url": "https://escaperoomsfinder.com/terms",
              "name": "Terms of Service | Escape Rooms Finder - Terms and Conditions",
              "description": "Read the terms of service and conditions for using Escape Rooms Finder. Understand your rights and responsibilities when using our platform.",
              "primaryImageOfPage": {
                "@type": "ImageObject",
                "@id": "https://escaperoomsfinder.com/images/hero.jpeg",
                "url": "https://escaperoomsfinder.com/images/hero.jpeg",
                "width": 1200,
                "height": 630,
                "caption": "Escape Rooms Finder Terms of Service"
              },
              "breadcrumb": "https://escaperoomsfinder.com/terms#breadcrumb",
              "isPartOf": {
                "@type": "WebSite",
                "@id": "https://escaperoomsfinder.com/#website"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "@id": "https://escaperoomsfinder.com/terms#breadcrumb",
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
                  "name": "Terms of Service",
                  "item": "https://escaperoomsfinder.com/terms"
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
                <BreadcrumbPage>Terms of Service</BreadcrumbPage>
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
                <FileText className="h-6 w-6 text-escape-red" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-escape-red">Terms</span>
                <h1 className="mt-1 text-3xl font-semibold text-white">Terms of Service</h1>
              </div>
            </div>
            <p className="text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
              Please read these terms and conditions carefully before using our services.
            </p>
          </div>
        </div>
      </section>

      {/* Terms of Service Content */}
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
