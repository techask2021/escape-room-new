// GraphQL Fragments for reusable field sets

export const LITE_ESCAPE_ROOM_FIELDS = `
  fragment LiteEscapeRoomFields on EscapeRoom {
    id
    databaseId
    title
    slug
    date

    featuredImage {
      node {
        sourceUrl
        altText
      }
    }

    countries {
      nodes {
        name
      }
    }

    states {
      nodes {
        name
      }
    }

    cities {
      nodes {
        name
      }
    }

    roomCategories {
      nodes {
        name
      }
    }

    escapeRoomDetails {
      status
      rating
      reviewCount
      difficulty
      price
    }
  }
`

export const ESCAPE_ROOM_FIELDS = `
  fragment EscapeRoomFields on EscapeRoom {
    id
    databaseId
    title
    content
    slug
    date

    featuredImage {
      node {
        sourceUrl
        altText
        mediaDetails {
          width
          height
        }
      }
    }

    countries {
      nodes {
        id
        name
        slug
      }
    }

    states {
      nodes {
        id
        name
        slug
      }
    }

    cities {
      nodes {
        id
        name
        slug
      }
    }

    roomCategories {
      nodes {
        id
        name
        slug
      }
    }

    escapeRoomDetails {
      status
      fullAddress
      postalCode
      latitude
      longitude
      checkUrl
      phone
      website
      orderLinks
      difficulty
      teamSize
      duration
      price
      rating
      reviewCount
      workingHours
      businessHours {
        dayOfWeek
        openTime
        closeTime
        isClosed
      }
      amenities {
        amenityName
        amenityCategory
        isAvailable
      }
    }
  }
`

// Get all escape rooms with pagination (Uses LITE fields for performance)
export const GET_ESCAPE_ROOMS = `
  ${LITE_ESCAPE_ROOM_FIELDS}

  query GetEscapeRooms($first: Int = 100, $after: String) {
    escapeRooms(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        ...LiteEscapeRoomFields
      }
    }
  }
`

// Get escape rooms by location (country, state, city)
export const GET_ESCAPE_ROOMS_BY_LOCATION = `
  ${ESCAPE_ROOM_FIELDS}

  query GetEscapeRoomsByLocation(
    $country: String
    $state: String
    $city: String
    $first: Int = 100
    $after: String
  ) {
    escapeRooms(
      first: $first
      after: $after
      where: {
        taxQuery: {
          relation: AND
          taxArray: [
            { taxonomy: COUNTRY, field: SLUG, terms: [$country] }
            { taxonomy: STATE, field: SLUG, terms: [$state] }
            { taxonomy: CITY, field: SLUG, terms: [$city] }
          ]
        }
      }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...EscapeRoomFields
      }
    }
  }
`

// Get single escape room by slug
export const GET_ESCAPE_ROOM_BY_SLUG = `
  ${ESCAPE_ROOM_FIELDS}

  query GetEscapeRoomBySlug($slug: ID!) {
    escapeRoom(id: $slug, idType: SLUG) {
      ...EscapeRoomFields
    }
  }
`

// Get single escape room by database ID
export const GET_ESCAPE_ROOM_BY_ID = `
  ${ESCAPE_ROOM_FIELDS}

  query GetEscapeRoomById($id: ID!) {
    escapeRoom(id: $id, idType: DATABASE_ID) {
      ...EscapeRoomFields
    }
  }
`

// Get all countries
export const GET_ALL_COUNTRIES = `
  query GetAllCountries {
    countries(first: 100) {
      nodes {
        id
        name
        slug
        count
      }
    }
  }
`

// Get all states
export const GET_ALL_STATES = `
  query GetAllStates {
    states(first: 100) {
      nodes {
        id
        name
        slug
        count
      }
    }
  }
`

// Get all cities
export const GET_ALL_CITIES = `
  query GetAllCities {
    cities(first: 100) {
      nodes {
        id
        name
        slug
        count
      }
    }
  }
`

// Get room categories
export const GET_ROOM_CATEGORIES = `
  query GetRoomCategories {
    roomCategories(first: 100) {
      nodes {
        id
        name
        slug
        count
      }
    }
  }
`

// Search escape rooms by title
export const SEARCH_ESCAPE_ROOMS = `
  ${ESCAPE_ROOM_FIELDS}

  query SearchEscapeRooms($search: String!, $first: Int = 20) {
    escapeRooms(first: $first, where: { search: $search }) {
      nodes {
        ...EscapeRoomFields
      }
    }
  }
`

// Get featured/top rated rooms
export const GET_FEATURED_ROOMS = `
  ${ESCAPE_ROOM_FIELDS}

  query GetFeaturedRooms($first: Int = 100) {
    escapeRooms(first: $first) {
      nodes {
        ...EscapeRoomFields
      }
    }
  }
`

// Blog Post Fields Fragment
export const BLOG_POST_FIELDS = `
  fragment BlogPostFields on Post {
    id
    databaseId
    title
    content
    excerpt
    slug
    date
    modified
    featuredImage {
      node {
        sourceUrl
        altText
        mediaDetails {
          width
          height
        }
      }
    }
    author {
      node {
        name
        avatar {
          url
        }
      }
    }
    categories {
      nodes {
        id
        name
        slug
      }
    }
    tags {
      nodes {
        id
        name
        slug
      }
    }
  }
`

// Get all blog posts with pagination
export const GET_BLOG_POSTS = `
  ${BLOG_POST_FIELDS}

  query GetBlogPosts($first: Int = 10, $after: String) {
    posts(first: $first, after: $after, where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        ...BlogPostFields
      }
    }
  }
`

// Get single blog post by slug
export const GET_BLOG_POST_BY_SLUG = `
  ${BLOG_POST_FIELDS}

  query GetBlogPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      ...BlogPostFields
    }
  }
`

// Get recent blog posts
export const GET_RECENT_BLOG_POSTS = `
  ${BLOG_POST_FIELDS}

  query GetRecentBlogPosts($first: Int = 5) {
    posts(first: $first, where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }) {
      nodes {
        ...BlogPostFields
      }
    }
  }
`

// Review Mutations and Queries
export const CREATE_REVIEW = `
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      review {
        databaseId
        title
        content
        reviewFields {
          roomId
          userName
          userEmail
          rating
          visitDate
        }
      }
    }
  }
`

export const GET_REVIEWS_BY_ROOM = `
  query GetReviewsByRoom($first: Int = 1000) {
    reviews(
      first: $first
      where: {
        orderby: { field: DATE, order: DESC }
        status: PUBLISH
      }
    ) {
      nodes {
        databaseId
        title
        content
        date
        reviewFields {
          roomId
          userName
          userEmail
          rating
          visitDate
          helpfulCount
          isVerified
        }
      }
    }
  }
`

export const UPDATE_HELPFUL_COUNT = `
  mutation UpdateHelpfulCount($id: ID!, $count: Int!) {
    updateReview(
      input: {
        id: $id
        reviewFields: {
          helpfulCount: $count
        }
      }
    ) {
      review {
        databaseId
        reviewFields {
          helpfulCount
        }
      }
    }
  }
`

// Page queries
export const GET_PAGE_BY_SLUG = `
  query GetPageBySlug($slug: ID!) {
    page(id: $slug, idType: URI) {
      title
      content
      slug
      date
      modified
    }
  }
`
