import { Metadata } from "next"
import { Mail } from "lucide-react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import ContactForm from "@/components/contact-form"

export const revalidate = 86400 // Revalidate every 24 hours

export const metadata: Metadata = {
  title: "Contact Us | Escape Rooms Finder - Get in Touch",
  description: "Have questions about escape rooms? Want to add your venue? Contact Escape Rooms Finder and we'll be happy to help!",
  openGraph: {
    title: "Contact Us | Escape Rooms Finder",
    description: "Get in touch with Escape Rooms Finder. We'd love to hear from you!",
    url: "https://escaperoomsfinder.com/contact",
    siteName: "Escape Rooms Finder",
    images: [
      {
        url: "/images/hero.jpeg",
        width: 1200,
        height: 630,
        alt: "Contact Escape Rooms Finder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Escape Rooms Finder",
    description: "Get in touch with Escape Rooms Finder. We'd love to hear from you!",
    images: ["/images/hero.jpeg"],
  },
  alternates: {
    canonical: "https://escaperoomsfinder.com/contact",
  },
}

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "ContactPage",
              "@id": "https://escaperoomsfinder.com/contact",
              "url": "https://escaperoomsfinder.com/contact",
              "name": "Contact Us | Escape Rooms Finder - Get in Touch",
              "description": "Have questions about escape rooms? Want to add your venue? Contact Escape Rooms Finder and we'll be happy to help!",
              "primaryImageOfPage": {
                "@type": "ImageObject",
                "@id": "https://escaperoomsfinder.com/images/hero.jpeg",
                "url": "https://escaperoomsfinder.com/images/hero.jpeg",
                "width": 1200,
                "height": 630,
                "caption": "Contact Escape Rooms Finder"
              },
              "breadcrumb": "https://escaperoomsfinder.com/contact#breadcrumb",
              "isPartOf": {
                "@type": "WebSite",
                "@id": "https://escaperoomsfinder.com/#website"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "@id": "https://escaperoomsfinder.com/contact#breadcrumb",
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
                  "name": "Contact",
                  "item": "https://escaperoomsfinder.com/contact"
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
                <BreadcrumbPage>Contact</BreadcrumbPage>
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
                <Mail className="h-6 w-6 text-escape-red" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-escape-red">Get in Touch</span>
                <h1 className="mt-1 text-3xl font-semibold text-white">Contact Us</h1>
              </div>
            </div>
            <p className="text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
              Have questions about escape rooms? Want to add your venue? We&apos;d love to hear from you!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12 bg-gradient-to-br from-slate-50 via-white to-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Contact Form */}
            <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm mb-8">
              <ContactForm />
            </div>

            {/* Additional Contact Information */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 text-center">
                <div className="text-3xl mb-3">📧</div>
                <h3 className="font-semibold text-slate-900 mb-2">Email Us</h3>
                <p className="text-slate-600 text-sm">
                  contact@escaperoomsfinder.com
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 text-center">
                <div className="text-3xl mb-3">💼</div>
                <h3 className="font-semibold text-slate-900 mb-2">Business Inquiries</h3>
                <p className="text-slate-600 text-sm">
                  Partner with us to promote your venue
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 text-center">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-semibold text-slate-900 mb-2">Add Your Venue</h3>
                <p className="text-slate-600 text-sm">
                  Want to list your escape room? Let us know!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}