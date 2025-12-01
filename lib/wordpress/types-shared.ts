/**
 * Shared TypeScript types for Escape Room data
 *
 * These types are compatible with both WordPress and Supabase schemas
 */

export interface EscapeRoom {
  id: string
  name: string
  website?: string
  phone?: string
  full_address?: string
  city?: string
  country?: string
  postal_code?: string
  state?: string
  latitude?: number
  longitude?: number
  rating?: number
  reviews_average?: number
  review_count?: number
  photo?: string
  working_hours?: string
  description?: string
  order_links?: string
  check_url?: string
  status?: string
  post_content?: string
  category_new?: string
  difficulty?: string
  team_size?: string
  duration?: string
  price?: string
  created_at?: string
  updated_at?: string
}

export interface RoomAmenity {
  id: string
  room_id: string
  amenity_name: string
  amenity_category?: string
  amenity_value?: string
  is_available?: boolean
  created_at?: string
}

export interface BusinessHours {
  id: string
  room_id: string
  day_of_week: number
  day_name: string
  open_time?: string
  close_time?: string
  is_closed?: boolean
  special_hours?: string
  created_at?: string
}
