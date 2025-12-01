/**
 * Data Source - WordPress Only
 *
 * This file exports all data fetching functions from WordPress.
 * All imports now come from the WordPress module.
 */

// Export all WordPress API functions
export * from './wordpress/api'

// Export WordPress utility functions
export {
  formatRoomForDisplay,
  createSEOFriendlySlug,
  formatStateForURL,
  formatCityForURL,
  formatVenueForURL,
  parseStateFromURL,
  parseCityFromURL,
  parseVenueFromURL,
  getFullStateName
} from './wordpress/utils'

// Export shared types
export type { EscapeRoom, RoomAmenity, BusinessHours } from './wordpress/types-shared'
