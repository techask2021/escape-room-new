/**
 * Shared utilities for generating metadata across the application
 * Eliminates duplication of generateMetadata patterns
 */

import { Metadata } from 'next';

export interface BaseMetadataOptions {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  robots?: string;
  alternates?: {
    prev?: string;
    next?: string;
  };
}

/**
 * Creates base metadata object with common patterns
 * @param options Metadata options
 * @returns Metadata object
 */
export function createBaseMetadata(options: BaseMetadataOptions): Metadata {
  const {
    title,
    description,
    keywords = [],
    canonicalUrl,
    ogImage,
    ogType = 'website',
    twitterCard = 'summary_large_image',
    robots,
    alternates
  } = options;

  return {
    title,
    description,
    keywords: keywords.join(', '),
    ...(canonicalUrl && {
      alternates: {
        canonical: canonicalUrl,
        ...alternates
      }
    }),
    openGraph: {
      title,
      description,
      type: ogType,
      ...(canonicalUrl && { url: canonicalUrl }),
      ...(ogImage && {
        images: [{
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title
        }]
      })
    },
    twitter: {
      card: twitterCard,
      title,
      description,
      ...(ogImage && { images: [ogImage] })
    },
    ...(robots && { robots })
  };
}

/**
 * Creates metadata for city pages
 * @param city City name
 * @param state State name (full name)
 * @param country Country name
 * @param roomCount Number of escape rooms
 * @param stateAbbr State abbreviation (optional, will derive from state name if not provided)
 * @returns Metadata object
 */
export function createCityMetadata(
  city: string,
  state: string,
  country: string,
  roomCount: number,
  stateAbbr?: string
): Metadata {
  // State abbreviation mapping for common US states
  const stateAbbreviations: { [key: string]: string } = {
    'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR', 'california': 'CA',
    'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE', 'florida': 'FL', 'georgia': 'GA',
    'hawaii': 'HI', 'idaho': 'ID', 'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA',
    'kansas': 'KS', 'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
    'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS', 'missouri': 'MO',
    'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
    'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH',
    'oklahoma': 'OK', 'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
    'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT', 'vermont': 'VT',
    'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV', 'wisconsin': 'WI', 'wyoming': 'WY'
  };
  
  const finalStateAbbr = stateAbbr || stateAbbreviations[state.toLowerCase()] || state;
  const title = `Best Escape Rooms in ${city}, ${finalStateAbbr} | Escape Rooms Finder`;
  const description = `Discover amazing escape rooms in ${city}, ${finalStateAbbr} Find the perfect escape room experience with reviews, ratings.`;
  
  return createBaseMetadata({
    title,
    description,
    keywords: [
      `escape rooms ${city}`,
      `${city} escape rooms`,
      `escape rooms ${state}`,
      `${city} ${state} escape rooms`,
      'escape room finder',
      'escape room reviews'
    ],
    canonicalUrl: `https://escaperoomsfinder.com/locations/${country.toLowerCase()}/${state.toLowerCase().replace(/\s+/g, '-')}/${city.toLowerCase().replace(/\s+/g, '-')}`,
    ogType: 'website'
  });
}

/**
 * Creates metadata for state pages
 * @param state State name
 * @param country Country name
 * @param cityCount Number of cities
 * @returns Metadata object
 */
export function createStateMetadata(
  state: string,
  country: string
): Metadata {
  const title = `Best Escape Rooms in ${state} | Escape Rooms Finder`;
  const description = `Explore escape rooms across multiple cities in ${state}. Find the best escape room experiences with detailed reviews and ratings.`;
  
  return createBaseMetadata({
    title,
    description,
    keywords: [
      `escape rooms ${state}`,
      `${state} escape rooms`,
      'escape room finder',
      'escape room directory',
      'escape room reviews'
    ],
    canonicalUrl: `https://escaperoomsfinder.com/locations/${country.toLowerCase()}/${state.toLowerCase().replace(/\s+/g, '-')}`,
    ogType: 'website'
  });
}

/**
 * Creates metadata for country pages
 * @param country Country name
 * @param stateCount Number of states
 * @returns Metadata object
 */
export function createCountryMetadata(
  country: string,
  stateCount: number
): Metadata {
  const title = `Escape Rooms in ${country} | Escape Rooms Finder`;
  const description = `Discover escape rooms across ${stateCount} states in ${country}. Your ultimate guide to finding the perfect escape room experience.`;
  
  return createBaseMetadata({
    title,
    description,
    keywords: [
      `escape rooms ${country}`,
      `${country} escape rooms`,
      'escape room finder',
      'escape room directory'
    ],
    canonicalUrl: `https://escaperoomsfinder.com/locations/${country.toLowerCase()}`,
    ogType: 'website'
  });
}

/**
 * Creates metadata for theme pages
 * @param theme Theme name
 * @param roomCount Number of rooms with this theme
 * @returns Metadata object
 */
export function createThemeMetadata(
  theme: string,
  roomCount: number
): Metadata {
  const title = `${theme} | Escape Rooms Finder`;
  const description = `Explore ${theme.toLowerCase()} escape rooms. Find the perfect ${theme.toLowerCase()} themed escape room experience with reviews and ratings.`;
  
  return createBaseMetadata({
    title,
    description,
    keywords: [
      `${theme.toLowerCase()} escape rooms`,
      `escape rooms ${theme.toLowerCase()}`,
      `${theme.toLowerCase()} themed escape rooms`,
      'escape room themes',
      'escape room finder'
    ],
    canonicalUrl: `https://escaperoomsfinder.com/themes/${theme.toLowerCase().replace(/\s+/g, '-')}`,
    ogType: 'website'
  });
}

/**
 * Smart function to detect if venue name already contains location information
 * @param venueName Venue name
 * @param city City name
 * @param state State name
 * @returns Object with cleaned venue name and location info
 */
function smartVenueTitleGeneration(venueName: string, city: string, state: string): {
  cleanVenueName: string;
  locationInfo: string;
  hasLocationInName: boolean;
} {
  // State abbreviation mapping for common US states
  const stateAbbreviations: { [key: string]: string } = {
    'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR', 'california': 'CA',
    'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE', 'florida': 'FL', 'georgia': 'GA',
    'hawaii': 'HI', 'idaho': 'ID', 'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA',
    'kansas': 'KS', 'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
    'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS', 'missouri': 'MO',
    'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
    'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH',
    'oklahoma': 'OK', 'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
    'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT', 'vermont': 'VT',
    'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV', 'wisconsin': 'WI', 'wyoming': 'WY'
  };

  const stateAbbr = stateAbbreviations[state.toLowerCase()] || state;
  
  // Create variations of city and state names to match against
  const cityVariations = [
    city,
    city.toLowerCase(),
    city.replace(/\s+/g, '-').toLowerCase(),
    city.replace(/\s+/g, '').toLowerCase(),
    city.replace(/\./g, '').toLowerCase(),
    city.replace(/\./g, ' ').toLowerCase().trim()
  ];
  
  const stateVariations = [
    state,
    state.toLowerCase(),
    stateAbbr,
    stateAbbr.toLowerCase(),
    state.replace(/\s+/g, '-').toLowerCase(),
    state.replace(/\s+/g, '').toLowerCase()
  ];

  // Check if venue name already contains city or state information
  const hasCityInName = cityVariations.some(variation => 
    venueName.toLowerCase().includes(variation.toLowerCase())
  );
  
  const hasStateInName = stateVariations.some(variation => 
    venueName.toLowerCase().includes(variation.toLowerCase())
  );

  const hasLocationInName = hasCityInName || hasStateInName;

  // If location is already in the name, extract the clean venue name
  let cleanVenueName = venueName;
  if (hasLocationInName) {
    // Remove location patterns from venue name
    const patterns = [
      // Remove content in parentheses that contains city or state
      new RegExp(`\\s*\\([^)]*(?:${cityVariations.join('|')}|${stateVariations.join('|')})[^)]*\\)\\s*`, 'gi'),
      // Remove city-state combinations with various separators (more comprehensive)
      new RegExp(`\\s*[-–—]\\s*(?:${cityVariations.join('|')})(?:\\s*[,]?\\s*(?:${stateVariations.join('|')}))?\\s*(?:/\\s*[^/]*)?\\s*$`, 'gi'),
      new RegExp(`\\s*[-–—]\\s*(?:${stateVariations.join('|')})(?:\\s*[,]?\\s*(?:${cityVariations.join('|')}))?\\s*(?:/\\s*[^/]*)?\\s*$`, 'gi'),
      // Remove just city or state at the end with separators
      new RegExp(`\\s*[-–—]\\s*(?:${cityVariations.join('|')})\\s*(?:/\\s*[^/]*)?\\s*$`, 'gi'),
      new RegExp(`\\s*[-–—]\\s*(?:${stateVariations.join('|')})\\s*(?:/\\s*[^/]*)?\\s*$`, 'gi'),
      // Remove " / " patterns (like "Mount Prospect, IL / Randhurst Village")
      new RegExp(`\\s*/\\s*(?:${cityVariations.join('|')}|${stateVariations.join('|')})[^/]*$`, 'gi'),
      // Remove complex patterns like "Mount Prospect, IL / Randhurst Village"
      new RegExp(`\\s*[-–—]\\s*(?:${cityVariations.join('|')})\\s*,\\s*(?:${stateVariations.join('|')})\\s*/\\s*[^/]*\\s*$`, 'gi')
    ];
    
    patterns.forEach(pattern => {
      cleanVenueName = cleanVenueName.replace(pattern, '');
    });
    
    cleanVenueName = cleanVenueName.trim();
  }

  // Determine location info for title
  let locationInfo = '';
  if (hasLocationInName) {
    // If location is in the name, use a more generic location or just the state
    locationInfo = stateAbbr;
  } else {
    // If location is not in the name, add full location
    locationInfo = `${city}, ${stateAbbr}`;
  }

  return {
    cleanVenueName,
    locationInfo,
    hasLocationInName
  };
}

/**
 * Creates metadata for venue pages
 * @param venueName Venue name
 * @param city City name
 * @param state State name
 * @param description Venue description
 * @param rating Venue rating
 * @returns Metadata object
 */
export function createVenueMetadata(
  venueName: string,
  city: string,
  state: string,
  description: string,
  country: string = 'united-states',
  rating?: number,
  stateAbbr?: string
): Metadata {
  // State abbreviation mapping for common US states
  const stateAbbreviations: { [key: string]: string } = {
    'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR', 'california': 'CA',
    'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE', 'florida': 'FL', 'georgia': 'GA',
    'hawaii': 'HI', 'idaho': 'ID', 'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA',
    'kansas': 'KS', 'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
    'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS', 'missouri': 'MO',
    'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
    'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH',
    'oklahoma': 'OK', 'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
    'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT', 'vermont': 'VT',
    'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV', 'wisconsin': 'WI', 'wyoming': 'WY'
  };

  // Use provided stateAbbr or derive from state name
  const abbr = stateAbbr || stateAbbreviations[state.toLowerCase()] || state;
  
  // Use smart title generation to avoid duplication
  const { cleanVenueName, locationInfo, hasLocationInName } = smartVenueTitleGeneration(venueName, city, state);
  
  // Create SEO-optimized title
  const title = hasLocationInName 
    ? `${cleanVenueName} - ${locationInfo} | Escape Rooms Finder`
    : `${cleanVenueName} - ${city}, ${abbr} | Escape Rooms Finder`;
  
  // Create smart meta description that avoids duplication
  let metaDescription = description;
  if (hasLocationInName && description.toLowerCase().includes(city.toLowerCase())) {
    // If description already mentions the city, don't add it again
    metaDescription = description;
  } else if (!hasLocationInName) {
    // If location is not in the name, add location context to description
    metaDescription = `Experience ${cleanVenueName} in ${city}, ${abbr}. ${description}`;
  }
  
  // Truncate if too long
  metaDescription = metaDescription.length > 160 
    ? metaDescription.substring(0, 157) + '...'
    : metaDescription;
  
  return createBaseMetadata({
    title,
    description: metaDescription,
    keywords: [
      cleanVenueName,
      `${cleanVenueName} ${city}`,
      `escape rooms ${city}`,
      `${city} escape rooms`,
      'escape room reviews'
    ],
    canonicalUrl: `https://escaperoomsfinder.com/locations/${country.toLowerCase()}/${state.toLowerCase().replace(/\s+/g, '-')}/${city.toLowerCase().replace(/\s+/g, '-')}/${cleanVenueName.toLowerCase().replace(/\s+/g, '-')}`,
    ogType: 'article'
  });
}

/**
 * Creates metadata for blog posts
 * @param title Post title
 * @param description Post description
 * @param slug Post slug
 * @param publishedTime Publication date
 * @param modifiedTime Modification date
 * @returns Metadata object
 */
export function createBlogPostMetadata(
  title: string,
  description: string,
  slug: string,
  publishedTime: string,
  modifiedTime?: string
): Metadata {
  return {
    ...createBaseMetadata({
      title: `${title} | Escape Rooms Finder`,
      description,
      keywords: [
        'escape rooms',
        'escape room tips',
        'escape room guide',
        'escape room blog'
      ],
      canonicalUrl: `https://escaperoomsfinder.com/blog/${slug}`,
      ogType: 'article'
    }),
    openGraph: {
      ...createBaseMetadata({
        title,
        description,
        canonicalUrl: `https://escaperoomsfinder.com/blog/${slug}`,
        ogType: 'article'
      }).openGraph,
      type: 'article',
      publishedTime,
      ...(modifiedTime && { modifiedTime })
    }
  };
}

/**
 * Creates metadata for browse/search pages
 * @param searchParams Search parameters
 * @param totalResults Total number of results
 * @param currentPage Current page number
 * @returns Metadata object
 */
export function createBrowseMetadata(
  searchParams: { [key: string]: string | string[] | undefined },
  totalResults: number,
  currentPage: number = 1
): Metadata {
  const { search, theme, city, state, page } = searchParams;
  
  let title = 'Browse Escape Rooms';
  let description = `Discover ${totalResults} amazing escape rooms.`;
  
  // Build title based on search parameters
  const titleParts: string[] = [];
  if (search) titleParts.push(`"${search}"`);
  if (theme) titleParts.push(`${theme} Theme`);
  if (city && state) titleParts.push(`in ${city}, ${state}`);
  else if (state) titleParts.push(`in ${state}`);
  
  if (titleParts.length > 0) {
    title = `${titleParts.join(' ')} Escape Rooms`;
    description = `Find ${totalResults} escape rooms ${titleParts.join(' ').toLowerCase()}. Compare reviews, ratings, and book your perfect escape room experience.`;
  }
  
  if (currentPage > 1) {
    title += ` - Page ${currentPage}`;
  }
  
  title += ' | Escape Rooms Finder';
  
  // Build canonical URL with sorted parameters to avoid duplicates
  const params = new URLSearchParams();

  // Sort parameters alphabetically to ensure consistent canonical URLs
  // regardless of parameter order in the URL
  const sortedEntries = Object.entries(searchParams)
    .filter(([key, value]) => value && key !== 'page')
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

  sortedEntries.forEach(([key, value]) => {
    const stringValue = Array.isArray(value) ? value[0] : value;
    if (stringValue) {
      params.append(key, stringValue);
    }
  });

  let canonicalUrl = 'https://escaperoomsfinder.com/browse';
  if (params.toString()) {
    canonicalUrl += `?${params.toString()}`;
  }
  
  const metadata = createBaseMetadata({
    title,
    description,
    keywords: [
      'escape rooms',
      'escape room finder',
      'escape room search',
      'browse escape rooms'
    ],
    canonicalUrl,
    robots: currentPage > 1 ? 'noindex, follow' : undefined
  });
  
  // Add pagination meta tags
  if (currentPage > 1 || totalResults > 20) {
    const alternates: { prev?: string; next?: string } = {};
    
    if (currentPage > 1) {
      const prevParams = new URLSearchParams(params);
      if (currentPage > 2) {
        prevParams.set('page', (currentPage - 1).toString());
      }
      alternates.prev = `https://escaperoomsfinder.com/browse${prevParams.toString() ? `?${prevParams.toString()}` : ''}`;
    }
    
    if (totalResults > currentPage * 20) {
      const nextParams = new URLSearchParams(params);
      nextParams.set('page', (currentPage + 1).toString());
      alternates.next = `https://escaperoomsfinder.com/browse?${nextParams.toString()}`;
    }
    
    metadata.alternates = {
      ...metadata.alternates,
      ...alternates
    };
  }
  
  return metadata;
}

// Create metadata for add listing page
export function createAddListingMetadata(): Metadata {
  return createBaseMetadata({
    title: 'Add Your Escape Room Listing | Escape Rooms Finder - List Your Business for Free',
    description: 'List your escape room business on Escape Rooms Finder for free. Reach thousands of escape room enthusiasts and grow your customer base with our comprehensive directory platform.',
    keywords: [
      'add escape room listing',
      'list escape room business',
      'escape room directory',
      'free business listing',
      'escape room marketing',
      'promote escape room',
      'escape room advertising',
      'business directory',
      'escape room owners',
      'list my escape room'
    ],
    canonicalUrl: 'https://escaperoomsfinder.com/add-listing',
    ogImage: 'https://escaperoomsfinder.com/images/add-listing-og.jpg',
    ogType: 'website',
    twitterCard: 'summary_large_image'
  });
}