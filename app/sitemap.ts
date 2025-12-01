import { MetadataRoute } from 'next'
// import { getAllBlogPosts } from '@/lib/sanity' // Removed Sanity
import { getStatesWithRoomCounts, getCitiesWithCounts, getThemesWithCounts, getAllEscapeRoomsForSitemap, formatVenueForURL, formatCityForURL, formatStateForURL, getFullStateName } from '@/lib/data-source'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://escaperoomsfinder.com'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/browse`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/themes`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/locations`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/add-listing`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  // Get dynamic data - fetch all venues from database
  const blogPosts: any[] = [] // Removed Sanity blog
  const [statesData, themesData, venuesData] = await Promise.all([
    getStatesWithRoomCounts().catch(() => ({ data: [] })),
    getThemesWithCounts().catch(() => ({ data: [] })),
    getAllEscapeRoomsForSitemap().catch(() => ({ data: [] })) // Fetches ALL 1941 venues in batches
  ])

  // Only log debug info in development to prevent build log overflow
  if (process.env.NODE_ENV === 'development') {
    console.log('[sitemap] Debug:', {
      blogPosts: blogPosts.length,
      states: statesData.data.length,
      themes: themesData.data.length,
      venues: venuesData.data.length
    })
  }

  // Blog posts
  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug.current}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // State pages - dynamically generated for each country that has data
  const statePages: MetadataRoute.Sitemap = []
  
  // Get unique countries and their states
  const countryStatesMap = new Map<string, Set<string>>()
  
  venuesData.data.forEach(venue => {
    let countryUrl = 'united-states' // default
    if (venue.country === 'USA' || venue.country === 'United States') {
      countryUrl = 'united-states'
    } else if (venue.country) {
      countryUrl = venue.country.toLowerCase().replace(/\s+/g, '-')
    }
    
    if (!countryStatesMap.has(countryUrl)) {
      countryStatesMap.set(countryUrl, new Set())
    }
    if (venue.state) {
      // Convert state abbreviations to full names for consistent URLs
      const fullStateName = getFullStateName(venue.state)
      countryStatesMap.get(countryUrl)!.add(fullStateName)
    }
  })
  
  // Create state pages for each country-state combination
  for (const [countryUrl, states] of countryStatesMap) {
    for (const state of states) {
      statePages.push({
        url: `${baseUrl}/locations/${countryUrl}/${formatStateForURL(state)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })
    }
  }

  // Theme pages
  const themePages = themesData.data.map((theme) => ({
    url: `${baseUrl}/themes/${theme.theme.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Country pages - dynamically generated from actual data
  const countryPages: MetadataRoute.Sitemap = []
  
  // Get unique countries from the venues data
  const uniqueCountries = new Set(venuesData.data.map(venue => {
    // Map database country values to URL format
    if (venue.country === 'USA' || venue.country === 'United States') {
      return 'united-states'
    }
    return venue.country?.toLowerCase().replace(/\s+/g, '-') || 'united-states'
  }))
  
  // Create country pages for each unique country that has data
  for (const country of uniqueCountries) {
    countryPages.push({
      url: `${baseUrl}/locations/${country}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })
  }

  // City pages (show ALL cities, dynamically generated from actual data)
  const cityPages: MetadataRoute.Sitemap = []
  
  // Get unique country-state-city combinations from venues data
  const cityMap = new Map<string, Set<string>>() // country-state -> cities
  
  venuesData.data.forEach(venue => {
    let countryUrl = 'united-states' // default
    if (venue.country === 'USA' || venue.country === 'United States') {
      countryUrl = 'united-states'
    } else if (venue.country) {
      countryUrl = venue.country.toLowerCase().replace(/\s+/g, '-')
    }
    
    if (venue.state && venue.city) {
      // Convert state abbreviations to full names for consistent URLs
      const fullStateName = getFullStateName(venue.state)
      const key = `${countryUrl}-${fullStateName}`
      if (!cityMap.has(key)) {
        cityMap.set(key, new Set())
      }
      cityMap.get(key)!.add(venue.city)
    }
  })
  
  // Create city pages for each unique city
  for (const [countryStateKey, cities] of cityMap) {
    const [countryUrl, state] = countryStateKey.split('-', 2)
    const stateName = countryStateKey.substring(countryUrl.length + 1) // Get the rest as state name
    
    for (const city of cities) {
      cityPages.push({
        url: `${baseUrl}/locations/${countryUrl}/${formatStateForURL(stateName)}/${formatCityForURL(city)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })
    }
  }

  // Individual venue pages
  const venuePages = venuesData.data
    .filter(venue => venue.state && venue.city && venue.name)
    .map((venue) => {
      // Map database country values to URL format
      let countryUrl = 'united-states' // default
      if (venue.country === 'USA' || venue.country === 'United States') {
        countryUrl = 'united-states'
      } else if (venue.country) {
        countryUrl = venue.country.toLowerCase().replace(/\s+/g, '-')
      }

      // Convert state abbreviations to full names for consistent URLs
      const fullStateName = getFullStateName(venue.state!)

      return {
        url: `${baseUrl}/locations/${countryUrl}/${formatStateForURL(fullStateName)}/${formatCityForURL(venue.city!)}/${formatVenueForURL(venue.name)}`,
        lastModified: new Date(venue.updated_at || venue.created_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.9, // High priority for individual venues
      }
    })

  const finalSitemap = [
    ...staticPages,
    ...blogPages,
    ...countryPages,
    ...statePages,
    ...themePages,
    ...cityPages,
    ...venuePages,
  ]

  // Only log final counts in development to prevent build log overflow
  if (process.env.NODE_ENV === 'development') {
    console.log('[sitemap] Final counts:', {
      static: staticPages.length,
      blog: blogPages.length,
      countries: countryPages.length,
      states: statePages.length,
      themes: themePages.length,
      cities: cityPages.length,
      venues: venuePages.length,
      total: finalSitemap.length
    })
  }

  return finalSitemap
}
