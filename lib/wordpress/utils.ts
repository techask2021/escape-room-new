/**
 * WordPress Utility Functions
 *
 * These utilities help format and parse data from WordPress for display
 */

import { EscapeRoom } from './types-shared'

// State abbreviation to full name mapping
const STATE_ABBREVIATIONS: Record<string, string> = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
  'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
  'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
  'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
  'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
  'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
  'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
  'DC': 'District of Columbia', 'PR': 'Puerto Rico', 'VI': 'Virgin Islands', 'GU': 'Guam',
  'AS': 'American Samoa', 'MP': 'Northern Mariana Islands'
}

// Full name to abbreviation mapping (reverse lookup)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FULL_STATE_NAMES: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_ABBREVIATIONS).map(([abbr, full]) => [full.toLowerCase(), abbr])
)

/**
 * Clean venue name by removing city/state info
 */
function cleanVenueName(venueName: string, city: string, state: string): string {
  if (!venueName) return venueName

  let cleaned = venueName

  // Remove city and state from venue name if present
  const cityRegex = new RegExp(`[\\s-]*${city}[\\s-]*`, 'gi')
  const stateRegex = new RegExp(`[\\s-]*${state}[\\s-]*`, 'gi')

  cleaned = cleaned.replace(cityRegex, ' ').replace(stateRegex, ' ')

  // Clean up extra spaces and dashes
  cleaned = cleaned.replace(/\s+/g, ' ').replace(/-+/g, '-').trim()

  return cleaned
}

/**
 * Format escape room data for display
 */
export function formatRoomForDisplay(room: EscapeRoom) {
  // Use actual rating data from database and convert string to number
  const actualRating = room.rating ? parseFloat(room.rating.toString()) : null

  // Use reviews_average as the review count (it contains number of reviews, not average)
  const reviewCount = room.reviews_average || room.review_count || 0

  // Clean venue name to avoid duplicate location info in URLs
  const cleanedVenueName = room.city && room.state ?
    cleanVenueName(room.name, room.city, room.state) :
    room.name

  return {
    id: room.id,
    name: room.name,
    location: `${room.city || 'Unknown'}, ${room.state || 'Unknown'}`,
    city: room.city || 'Unknown',
    state: room.state || 'Unknown',
    venue_name: cleanedVenueName, // Use cleaned venue name for URL generation
    rating: actualRating,
    reviews: reviewCount,
    reviews_average: reviewCount, // Add reviews_average for compatibility
    theme: room.category_new || 'Adventure',
    category_new: room.category_new || 'Adventure', // Add category_new for compatibility
    difficulty: room.difficulty || 'Beginner',
    image: room.photo || '/placeholder.svg',
    photo: room.photo || '/placeholder.svg', // Add photo for compatibility
    description: room.description || '',
    post_content: room.post_content || '', // Add post_content
    address: room.full_address || '',
    full_address: room.full_address || '', // Add full_address for compatibility
    website: room.website || '',
    phone: room.phone || '', // Add phone
    latitude: room.latitude, // Add latitude
    longitude: room.longitude, // Add longitude
    price: null, // No default price - use actual data when available
    booking_url: room.order_links || '',
    order_links: room.order_links || '', // Add order_links for compatibility
    duration: 60, // Default duration in minutes
    players: '2-6' // Default player range
  }
}

/**
 * Create SEO-friendly slug from text
 */
export function createSEOFriendlySlug(text: string): string {
  if (!text || typeof text !== 'string') {
    return ''
  }
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

/**
 * Format state name for URL
 */
export function formatStateForURL(state: string): string {
  return createSEOFriendlySlug(state)
}

/**
 * Format city name for URL
 */
export function formatCityForURL(city: string): string {
  if (!city) return ''

  // Handle special characters and apostrophes
  return city
    .toLowerCase()
    .replace(/['']/g, '') // Remove apostrophes
    .replace(/[^a-z0-9\s-]/g, '') // Remove other special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

/**
 * Format venue name for URL
 * Handles special characters like apostrophes and commas consistently
 */
export function formatVenueForURL(venueName: string): string {
  if (!venueName) return ''

  // Handle special characters and apostrophes consistently with city formatting
  return venueName
    .toLowerCase()
    .replace(/['']/g, '') // Remove apostrophes (both straight and curly)
    .replace(/,/g, '') // Remove commas
    .replace(/[^a-z0-9\s-]/g, '') // Remove other special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

/**
 * Get full state name from abbreviation or URL format
 */
export function getFullStateName(stateInput: string): string {
  const trimmed = stateInput.trim()

  // If it's an abbreviation, convert to full name
  if (STATE_ABBREVIATIONS[trimmed.toUpperCase()]) {
    return STATE_ABBREVIATIONS[trimmed.toUpperCase()]
  }

  // If it's already a full state name (check if it exists in our abbreviations mapping), return it
  const isFullStateName = Object.values(STATE_ABBREVIATIONS).some(
    fullName => fullName.toLowerCase() === trimmed.toLowerCase()
  )
  if (isFullStateName) {
    // Return with proper capitalization from our mapping
    return Object.values(STATE_ABBREVIATIONS).find(
      fullName => fullName.toLowerCase() === trimmed.toLowerCase()
    ) || trimmed
  }

  // If it's a URL-formatted state name, parse it
  const urlParsed = trimmed
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return urlParsed
}

/**
 * Parse state name from URL format
 */
export function parseStateFromURL(urlState: string): string {
  // Convert URL-friendly state name back to proper state name
  return getFullStateName(urlState)
}

/**
 * Parse city name from URL format
 */
export function parseCityFromURL(urlCity: string): string {
  if (!urlCity) return ''

  // Special cases mapping (add more as needed)
  const specialCases: Record<string, string> = {
    'coeur-dalene': "Coeur d'Alene",
    'diberville': "D'Iberville",
    'land-o-lakes': "Land O' Lakes",
    'lees-summit': "Lee's Summit",
    'ofallon': "O'Fallon",
    'st-petersburg': 'St. Petersburg',
    'st-augustine': 'St. Augustine',
    'st-louis': 'St. Louis',
    'st-cloud': 'St Cloud',
    'st-paul': 'St Paul',
    'st-charles': 'St Charles',
    'st-peters': 'St Peters',
    'st-george': 'St. George',
    'port-st-lucie': 'Port St. Lucie',
    'kailua-kona': 'Kailua-Kona'
  }

  // Check if it's a special case
  const normalizedUrl = urlCity.toLowerCase()
  if (specialCases[normalizedUrl]) {
    return specialCases[normalizedUrl]
  }

  // Handle regular cases
  return urlCity
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Parse venue name from URL format
 */
export function parseVenueFromURL(urlVenue: string): string {
  // Convert URL-friendly venue name back to proper venue name
  // Handle articles and prepositions that should remain lowercase
  const lowercaseWords = new Set(['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'])

  return urlVenue
    .split('-')
    .map((word, index) => {
      // Always capitalize the first word
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1)
      }
      // Keep articles and prepositions lowercase unless they're the first word
      if (lowercaseWords.has(word.toLowerCase())) {
        return word.toLowerCase()
      }
      // Capitalize other words
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}
