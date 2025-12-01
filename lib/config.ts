// Google Indexing API Configuration
export const GOOGLE_INDEXING_CONFIG = {
  // Daily quota limit for Google Indexing API
  DAILY_QUOTA_LIMIT: 200,
  
  // Priority thresholds for smart indexing
  PRIORITY_THRESHOLDS: {
    HIGH_PRIORITY_RESERVE: 50,    // Reserve 50 requests for high priority URLs
    MEDIUM_PRIORITY_RESERVE: 100, // Reserve 100 requests for medium priority URLs
  },
  
  // Base URL for the site
  BASE_URL: 'https://escaperoomsfinder.com',
  
  // Service account key file path
  SERVICE_ACCOUNT_KEY_PATH: 'escape-room-474603-5f36b3239a25.json',
  
  // Request delay between batch operations (in milliseconds)
  BATCH_REQUEST_DELAY: 100,
  
  // Maximum batch size for URL indexing
  MAX_BATCH_SIZE: 50,
} as const;

// URL patterns for priority classification
export const URL_PRIORITY_PATTERNS = {
  HIGH: [
    '/locations/', // Individual venue pages
  ],
  MEDIUM: [
    '/locations/', // City/state pages
    '/themes/',    // Theme pages
    '/blog/',      // Blog posts
  ],
  LOW: [
    '/browse',     // Browse pages
    '/contact',    // Static pages
    '/privacy',    // Static pages
    '/terms',      // Static pages
  ],
} as const;

// Environment variables validation
export function validateGoogleIndexingConfig(): boolean {
  const requiredEnvVars: string[] = [
    // Add any required environment variables here
    // For example: 'GOOGLE_INDEXING_ENABLED'
  ];

  const missingVars: string[] = requiredEnvVars.filter((varName: string) => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`Missing environment variables: ${missingVars.join(', ')}`);
  }

  return missingVars.length === 0;
}

// Check if Google Indexing API is enabled
export function isGoogleIndexingEnabled(): boolean {
  return process.env.GOOGLE_INDEXING_ENABLED !== 'false';
}
