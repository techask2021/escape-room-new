// WordPress GraphQL Response Types
// Based on actual data from WordPress GraphQL API

export interface WordPressImage {
  node: {
    sourceUrl: string
    altText: string | null
    mediaDetails: {
      width: number
      height: number
    }
  } | null
}

export interface TaxonomyTerm {
  id: string
  name: string
  slug: string
  count?: number
}

export interface TaxonomyNodes {
  nodes: TaxonomyTerm[]
}

export interface BusinessHour {
  dayOfWeek: string
  openTime: string
  closeTime: string
  isClosed: boolean
}

export interface Amenity {
  amenityName: string
  amenityCategory: string
  isAvailable: boolean
}

export interface EscapeRoomACF {
  status: string
  fullAddress: string
  postalCode: string
  latitude: number
  longitude: number
  checkUrl: string
  phone: string
  website: string
  orderLinks: string
  difficulty: string
  teamSize: string
  duration: string
  price: string // TEXT field - can be "$20.00+", "$35", etc.
  rating: number
  reviewCount: number
  workingHours: string
  businessHours: BusinessHour[]
  amenities: Amenity[]
}

export interface WordPressEscapeRoom {
  id: string
  databaseId: number
  title: string
  content: string
  slug: string
  date: string
  featuredImage: WordPressImage | null
  countries: TaxonomyNodes
  states: TaxonomyNodes
  cities: TaxonomyNodes
  roomCategories: TaxonomyNodes
  escapeRoomDetails: EscapeRoomACF
}

export interface PageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor: string | null
  endCursor: string | null
}

export interface EscapeRoomsResponse {
  escapeRooms: {
    nodes: WordPressEscapeRoom[]
    pageInfo: PageInfo
  }
}

export interface SingleEscapeRoomResponse {
  escapeRoom: WordPressEscapeRoom | null
}

export interface CountriesResponse {
  countries: {
    nodes: TaxonomyTerm[]
  }
}

export interface StatesResponse {
  states: {
    nodes: TaxonomyTerm[]
  }
}

export interface CitiesResponse {
  cities: {
    nodes: TaxonomyTerm[]
  }
}

export interface RoomCategoriesResponse {
  roomCategories: {
    nodes: TaxonomyTerm[]
  }
}
