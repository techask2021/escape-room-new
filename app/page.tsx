import { Suspense } from "react"
import { Metadata } from "next"
import HeroSection from "@/components/hero-section"
import FeaturedRooms from "@/components/featured-rooms"
import HomepageEscapeRooms from "@/components/homepage-escape-rooms"
import HowItWorksSection from "@/components/how-it-works-section"
import ThemesSection from "@/components/themes-section"
import TopCitiesSection from "@/components/top-cities-section"
import BlogSection from "@/components/blog-section"
import NewsletterSection from "@/components/newsletter-section"
import CTASection from "@/components/cta-section"
import { getFeaturedEscapeRooms, getEscapeRooms, getDatabaseStats, formatRoomForDisplay } from "@/lib/data-source"
import { getRecentBlogPosts } from "@/lib/wordpress/api"

// Enable ISR - revalidate every 24 hours (data only changes on manual WordPress updates)
// Reduced from 15 minutes to save CPU and reduce WordPress API calls
export const revalidate = 86400

export const metadata: Metadata = {
  title: "Find The Best Escape Rooms Near You | Escape Rooms Finder",
  description: "Escape Rooms Finder helps you to discover amazing escape room experiences worldwide. Browse by theme or location. Find the perfect escape room adventure for your group with real reviews and ratings!",
  openGraph: {
    title: "Find The Best Escape Rooms Near You | Escape Rooms Finder",
    description: "Escape Rooms Finder helps you to discover amazing escape room experiences worldwide. Browse by theme, difficulty, or location. Find the perfect escape room adventure for your group with real reviews and ratings!",
    type: "website",
    url: "https://escaperoomsfinder.com"
  },
  twitter: {
    title: "Find The Best Escape Rooms Near You | Escape Rooms Finder",
    description: "Escape Rooms Finder helps you to discover amazing escape room experiences worldwide. Browse by theme, difficulty, or location. Find the perfect escape room adventure for your group with real reviews and ratings!",
    card: "summary_large_image"
  }
}

export default async function HomePage() {
  const [featuredResult, roomsResult, stats, blogPostsResult] = await Promise.all([
    getFeaturedEscapeRooms(3),
    getEscapeRooms({ limit: 6 }), // Reduced from 12 to 6 for faster loading
    getDatabaseStats(),
    getRecentBlogPosts(3)
  ])

  const featuredRooms = featuredResult.data?.map(formatRoomForDisplay) || []
  const homepageRooms = roomsResult.data?.map(formatRoomForDisplay) || []
  const totalCount = roomsResult.count || 0
  const blogPosts = blogPostsResult.data || []

  // Enhanced structured data for homepage
  const homepageStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://escaperoomsfinder.com/#website",
        "name": "Escape Rooms Finder",
        "url": "https://escaperoomsfinder.com",
        "description": "Escape Rooms Finder helps you to discover amazing escape room experiences worldwide. Browse by theme, difficulty, or location. Find the perfect escape room with real reviews and ratings.",
        "publisher": {
          "@id": "https://escaperoomsfinder.com/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://escaperoomsfinder.com/browse?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://escaperoomsfinder.com/#organization",
        "name": "Escape Rooms Finder",
        "url": "https://escaperoomsfinder.com",
        "logo": {
          "@type": "ImageObject",
          "@id": "https://escaperoomsfinder.com/#logo",
          "url": "https://escaperoomsfinder.com/logo.png",
          "contentUrl": "https://escaperoomsfinder.com/logo.png",
          "width": 512,
          "height": 512,
          "caption": "Escape Rooms Finder"
        },
        "description": "Escape Rooms Finder helps you to discover amazing escape room experiences worldwide. Browse by theme, difficulty, or location. Find the perfect escape room with real reviews and ratings.",
        "sameAs": [
          "https://facebook.com/escaperoomsfinder",
          "https://twitter.com/escaperoomsfinder"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+1-800-ESCAPE",
          "contactType": "customer service",
          "email": "support@escaperoomsfinder.com",
          "areaServed": "US"
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://escaperoomsfinder.com/#webpage",
        "url": "https://escaperoomsfinder.com",
        "name": "Find The Best Escape Rooms Near You | Escape Rooms Finder",
        "description": "Escape Rooms Finder helps you to discover amazing escape room experiences worldwide. Browse by theme or location. Find the perfect escape room adventure for your group with real reviews and ratings!",
        "isPartOf": {
          "@id": "https://escaperoomsfinder.com/#website"
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "@id": "https://escaperoomsfinder.com/images/hero.jpeg#primaryimage",
          "url": "https://escaperoomsfinder.com/images/hero.jpeg",
          "contentUrl": "https://escaperoomsfinder.com/images/hero.jpeg",
          "width": 1200,
          "height": 630,
          "caption": "Discover Amazing Escape Room Adventures"
        },
        "mainEntity": {
          "@type": "ItemList",
          "numberOfItems": totalCount,
          "itemListElement": featuredRooms.slice(0, 10).map((room, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "LocalBusiness",
              "@id": `https://escaperoomsfinder.com/locations/united-states/${room.state?.toLowerCase().replace(/\s+/g, '-')}/${room.city?.toLowerCase().replace(/\s+/g, '-')}/${room.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
              "name": room.name,
              "description": room.description || `Experience ${room.name}, an exciting escape room.`,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": room.city,
                "addressRegion": room.state,
                "addressCountry": "US"
              },
              "aggregateRating": room.rating ? {
                "@type": "AggregateRating",
                "ratingValue": room.rating,
                "ratingCount": room.reviews || 1
              } : undefined
            }
          }))
        }
      }
    ]
  }

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json">
        {JSON.stringify(homepageStructuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is an escape room?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "An escape room is an interactive adventure game where players work together to solve puzzles, find clues, and complete objectives within a set time limit (usually 60 minutes) to 'escape' from a themed room. It's perfect for team building, parties, dates, and anyone looking for a thrilling mental challenge."
              }
            },
            {
              "@type": "Question",
              "name": "How many people can play an escape room?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Most escape rooms accommodate 2-8 players, though some rooms support up to 12 participants. Smaller groups (2-4 players) work well for intimate experiences, while larger groups (6-8 players) are great for team building. Check each room's specific capacity requirements when booking."
              }
            },
            {
              "@type": "Question",
              "name": "How long does an escape room take?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "The actual game typically lasts 60 minutes, though some rooms offer 45-minute or 90-minute experiences. Plan to arrive 15 minutes early for check-in and a brief orientation. After the game, most venues allow time for photos and debriefing, so budget about 90 minutes total."
              }
            },
            {
              "@type": "Question",
              "name": "Do I need experience to play an escape room?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No experience needed! Escape rooms are designed for players of all skill levels. Many venues offer rooms with different difficulty levels, from beginner-friendly to expert challenges. Game masters are available to provide hints if you get stuck, ensuring everyone has a fun experience."
              }
            },
            {
              "@type": "Question",
              "name": "What should I bring to an escape room?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Just bring yourself, your team, and a positive attitude! Most escape rooms provide lockers for your belongings. You typically won't need phones, bags, or personal items during the game. Wear comfortable clothing that allows you to move freely, as some rooms may require bending, reaching, or light physical activity."
              }
            },
            {
              "@type": "Question",
              "name": "Are escape rooms safe?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, escape rooms are very safe! All rooms are monitored by game masters via cameras and microphones. Emergency exits are clearly marked and accessible at all times. The puzzles are mental challenges, not physical risks. Venues follow strict safety protocols and fire codes."
              }
            },
            {
              "@type": "Question",
              "name": "Can I book an escape room for a private event?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Absolutely! Many escape rooms offer private bookings for birthdays, corporate team building, bachelor/bachelorette parties, and special occasions. Some venues provide party rooms or event spaces. Contact the venue directly or check their booking options for group reservations and special packages."
              }
            },
            {
              "@type": "Question",
              "name": "What happens if we don't escape in time?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Not escaping in time is completely normal—many groups don't complete the room on their first try! The game master will reveal the remaining puzzles and explain how to finish the room. You'll still have had the full experience of solving most challenges. Many players book a rematch or try a different room!"
              }
            }
          ]
        })}
      </script>
      <HeroSection stats={stats} />
      <HowItWorksSection />
      <div className="container mx-auto px-4 py-12">
        <FeaturedRooms rooms={featuredRooms} />
      </div>
      <ThemesSection />
      <div className="container mx-auto px-4 py-12">
        <HomepageEscapeRooms rooms={homepageRooms} totalCount={totalCount} />
      </div>
      <TopCitiesSection />

      <BlogSection posts={blogPosts} />

      <NewsletterSection />

      <CTASection />
    </div>
  )
}
