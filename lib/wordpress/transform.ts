import { WordPressEscapeRoom } from './types'
import { EscapeRoom } from './types-shared'

/**
 * Transform WordPress escape room to Supabase-compatible format
 * This allows switching from Supabase to WordPress without changing your entire codebase
 */
export function transformWordPressRoom(wpRoom: WordPressEscapeRoom): EscapeRoom {
  return {
    // Basic info
    id: wpRoom.databaseId.toString(),
    name: wpRoom.title,
    website: wpRoom.escapeRoomDetails?.website || undefined,
    phone: wpRoom.escapeRoomDetails?.phone || undefined,

    // Location (from taxonomies)
    full_address: wpRoom.escapeRoomDetails?.fullAddress || undefined,
    city: wpRoom.cities.nodes[0]?.name || undefined,
    country: wpRoom.countries.nodes[0]?.name || undefined,
    postal_code: wpRoom.escapeRoomDetails?.postalCode || undefined,
    state: wpRoom.states.nodes[0]?.name || undefined,
    latitude: wpRoom.escapeRoomDetails?.latitude || undefined,
    longitude: wpRoom.escapeRoomDetails?.longitude || undefined,

    // Rating and reviews
    rating: wpRoom.escapeRoomDetails?.rating || undefined,
    reviews_average: wpRoom.escapeRoomDetails?.reviewCount || undefined,
    review_count: wpRoom.escapeRoomDetails?.reviewCount || undefined,

    // Image
    photo: wpRoom.featuredImage?.node?.sourceUrl || undefined,

    // Hours
    working_hours: wpRoom.escapeRoomDetails?.workingHours || undefined,

    // Description - strip HTML from WordPress content
    description: wpRoom.content ? stripHtml(wpRoom.content) : undefined,
    post_content: wpRoom.content || undefined,

    // Booking
    order_links: wpRoom.escapeRoomDetails?.orderLinks || undefined,
    check_url: wpRoom.escapeRoomDetails?.checkUrl || undefined,

    // Status
    status: wpRoom.escapeRoomDetails?.status || undefined,

    // Category
    category_new: wpRoom.roomCategories.nodes[0]?.name || undefined,

    // Game details
    difficulty: wpRoom.escapeRoomDetails?.difficulty || undefined,
    team_size: wpRoom.escapeRoomDetails?.teamSize || undefined,
    duration: wpRoom.escapeRoomDetails?.duration || undefined,
    price: wpRoom.escapeRoomDetails?.price || undefined,

    // Timestamps (not available in WordPress, use published date)
    created_at: wpRoom.date,
    updated_at: wpRoom.date,
  }
}

/**
 * Transform array of WordPress rooms
 */
export function transformWordPressRooms(wpRooms: WordPressEscapeRoom[]): EscapeRoom[] {
  return wpRooms.map(transformWordPressRoomLite)
}

/**
 * LITE version of transformer for list views and caching
 * Excludes heavy fields like post_content to save memory/cache size
 */
export function transformWordPressRoomLite(wpRoom: WordPressEscapeRoom): EscapeRoom {
  return {
    // Basic info
    id: wpRoom.databaseId.toString(),
    name: wpRoom.title,
    // website: wpRoom.escapeRoomDetails?.website || undefined, // Exclude from lite
    // phone: wpRoom.escapeRoomDetails?.phone || undefined, // Exclude from lite

    // Location (from taxonomies)
    // full_address: wpRoom.escapeRoomDetails?.fullAddress || undefined, // Exclude from lite
    city: wpRoom.cities.nodes[0]?.name || undefined,
    country: wpRoom.countries.nodes[0]?.name || undefined,
    // postal_code: wpRoom.escapeRoomDetails?.postalCode || undefined, // Exclude from lite
    state: wpRoom.states.nodes[0]?.name || undefined,
    // latitude: wpRoom.escapeRoomDetails?.latitude || undefined, // Exclude from lite
    // longitude: wpRoom.escapeRoomDetails?.longitude || undefined, // Exclude from lite

    // Rating and reviews
    rating: wpRoom.escapeRoomDetails?.rating || undefined,
    reviews_average: wpRoom.escapeRoomDetails?.reviewCount || undefined,
    review_count: wpRoom.escapeRoomDetails?.reviewCount || undefined,

    // Image
    photo: wpRoom.featuredImage?.node?.sourceUrl || undefined,

    // Hours - Exclude from lite
    // working_hours: wpRoom.escapeRoomDetails?.workingHours || undefined,

    // Description - Exclude full content, keep only short description if needed
    // description: wpRoom.content ? stripHtml(wpRoom.content) : undefined,
    // post_content: wpRoom.content || undefined, // HEAVY FIELD - Excluded

    // Booking - Exclude from lite
    // order_links: wpRoom.escapeRoomDetails?.orderLinks || undefined,
    // check_url: wpRoom.escapeRoomDetails?.checkUrl || undefined,

    // Status
    status: wpRoom.escapeRoomDetails?.status || undefined,

    // Category
    category_new: wpRoom.roomCategories.nodes[0]?.name || undefined,

    // Game details
    difficulty: wpRoom.escapeRoomDetails?.difficulty || undefined,
    // team_size: wpRoom.escapeRoomDetails?.teamSize || undefined, // Exclude from lite
    // duration: wpRoom.escapeRoomDetails?.duration || undefined, // Exclude from lite
    // price: wpRoom.escapeRoomDetails?.price || undefined, // Exclude from lite

    // Timestamps
    created_at: wpRoom.date,
    updated_at: wpRoom.date,
  }
}

/**
 * Strip HTML tags from content
 */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .trim()
}

/**
 * Get plain text description (no HTML)
 */
export function getPlainDescription(wpRoom: WordPressEscapeRoom): string {
  return stripHtml(wpRoom.content)
}

/**
 * Extract excerpt from WordPress content
 */
export function getExcerpt(content: string, maxLength: number = 160): string {
  const plain = stripHtml(content)
  if (plain.length <= maxLength) return plain
  return plain.substring(0, maxLength).trim() + '...'
}
