import { getThemesWithCounts } from "@/lib/data-source"
import ThemesPageClient from './themes-page-client'

// Server component for structured data and initial data fetching
export default async function ThemesPage() {
  let themes: any[] = []
  
  try {
    const { data, error } = await getThemesWithCounts()
    if (error) {
      console.error('Error loading themes:', error)
      themes = []
    } else {
      themes = data || []
    }
  } catch (error) {
    console.error('Error loading themes:', error)
    themes = []
  }

  const totalRooms = themes.reduce((sum, theme) => sum + (theme.count || 0), 0)

  // Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://escaperoomsfinder.com/themes#webpage",
        "url": "https://escaperoomsfinder.com/themes",
        "name": "Escape Room Themes | Escape Rooms Finder",
        "description": `Explore ${themes.length} different escape room themes with ${totalRooms}+ rooms nationwide. From horror and mystery to adventure and sci-fi, find the perfect themed escape room experience.`,
        "isPartOf": {
          "@id": "https://escaperoomsfinder.com#website"
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "@id": "https://escaperoomsfinder.com/images/adventure escape rooms.jpeg#primaryimage",
          "url": "https://escaperoomsfinder.com/images/adventure escape rooms.jpeg",
          "contentUrl": "https://escaperoomsfinder.com/images/adventure escape rooms.jpeg",
          "width": 1200,
          "height": 630,
          "caption": "Escape Room Themes - Adventure, Horror, Mystery & More"
        },
        "breadcrumb": {
          "@id": "https://escaperoomsfinder.com/themes#breadcrumb"
        },
        "mainEntity": {
          "@type": "ItemList",
          "numberOfItems": themes.length,
          "itemListElement": themes.map((theme, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "Thing",
              "@id": `https://escaperoomsfinder.com/themes/${theme.theme.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`,
              "name": theme.theme,
              "description": `${theme.count} ${theme.theme.toLowerCase()} available nationwide`,
              "url": `https://escaperoomsfinder.com/themes/${theme.theme.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`,
              "image": "https://escaperoomsfinder.com/images/adventure escape rooms.jpeg"
            }
          }))
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://escaperoomsfinder.com/themes#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "item": {
              "@type": "WebPage",
              "@id": "https://escaperoomsfinder.com",
              "url": "https://escaperoomsfinder.com",
              "name": "Escape Rooms Finder"
            }
          },
          {
            "@type": "ListItem",
            "position": 2,
            "item": {
              "@type": "CollectionPage",
              "@id": "https://escaperoomsfinder.com/themes",
              "url": "https://escaperoomsfinder.com/themes",
              "name": "Themes"
            }
          }
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://escaperoomsfinder.com#website",
        "url": "https://escaperoomsfinder.com",
        "name": "Escape Rooms Finder",
        "description": "Find and discover the best escape rooms near you. Browse by location, theme, and difficulty level.",
        "publisher": {
          "@id": "https://escaperoomsfinder.com#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://escaperoomsfinder.com/browse?search={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <ThemesPageClient initialThemes={themes} />
    </>
  )
}