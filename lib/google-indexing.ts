import { google } from 'googleapis';
import { readFileSync } from 'fs';
import { join } from 'path';

// Types for indexing operations
export interface IndexingRequest {
  url: string;
  type: 'URL_UPDATED' | 'URL_DELETED';
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface IndexingResponse {
  success: boolean;
  message: string;
  quotaUsed?: number;
  quotaRemaining?: number;
}

export interface QuotaInfo {
  used: number;
  remaining: number;
  resetTime: Date;
}

class GoogleIndexingService {
  private indexing: any;
  private quotaUsed: number = 0;
  private dailyLimit: number = 200;
  private quotaResetTime: Date;
  private serviceAccountKey: any;

  constructor() {
    this.quotaResetTime = this.getNextMidnight();
    this.initializeService().catch(error => {
      console.error('Failed to initialize Google Indexing Service:', error);
    });
  }

  private async initializeService() {
    try {
      // Check if Google Indexing is enabled
      if (process.env.GOOGLE_INDEXING_ENABLED === 'false') {
        throw new Error('Google Indexing API is disabled');
      }

      // Load service account key from the JSON file
      const keyPath = join(process.cwd(), 'escape-room-474603-5f36b3239a25.json');
      this.serviceAccountKey = JSON.parse(readFileSync(keyPath, 'utf8'));

      // Create JWT auth client
      const auth = new google.auth.JWT({
        email: this.serviceAccountKey.client_email,
        key: this.serviceAccountKey.private_key,
        scopes: ['https://www.googleapis.com/auth/indexing']
      });

      // Authorize the client
      await auth.authorize();

      // Initialize the indexing API
      this.indexing = google.indexing({ version: 'v3', auth });
      
      // Only log in development to reduce build log size
      if (process.env.NODE_ENV !== 'production') {
        console.log('✅ Google Indexing API initialized successfully');
      }
    } catch (error) {
      console.error('Failed to initialize Google Indexing API:', error);
      throw new Error('Google Indexing API initialization failed');
    }
  }

  private async ensureInitialized() {
    if (!this.indexing) {
      await this.initializeService();
    }
  }

  private getNextMidnight(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  }

  private resetQuotaIfNeeded(): void {
    const now = new Date();
    if (now >= this.quotaResetTime) {
      this.quotaUsed = 0;
      this.quotaResetTime = this.getNextMidnight();
      console.log('Google Indexing API quota reset for new day');
    }
  }

  private canMakeRequest(): boolean {
    this.resetQuotaIfNeeded();
    return this.quotaUsed < this.dailyLimit;
  }

  public getQuotaInfo(): QuotaInfo {
    this.resetQuotaIfNeeded();
    return {
      used: this.quotaUsed,
      remaining: this.dailyLimit - this.quotaUsed,
      resetTime: this.quotaResetTime
    };
  }

  public async indexUrl(request: IndexingRequest): Promise<IndexingResponse> {
    try {
      // Ensure service is initialized
      await this.ensureInitialized();

      if (!this.canMakeRequest()) {
        return {
          success: false,
          message: `Daily quota limit of ${this.dailyLimit} requests reached. Try again after ${this.quotaResetTime.toISOString()}`,
          quotaUsed: this.quotaUsed,
          quotaRemaining: 0
        };
      }

      // Validate URL
      if (!this.isValidUrl(request.url)) {
        return {
          success: false,
          message: 'Invalid URL format',
          quotaUsed: this.quotaUsed,
          quotaRemaining: this.dailyLimit - this.quotaUsed
        };
      }

      // Make the indexing request
      const response = await this.indexing.urlNotifications.publish({
        requestBody: {
          url: request.url,
          type: request.type
        }
      });

      this.quotaUsed++;
      
      console.log(`Successfully indexed URL: ${request.url} (${request.type})`);
      console.log(`Quota used: ${this.quotaUsed}/${this.dailyLimit}`);

      return {
        success: true,
        message: `Successfully ${request.type === 'URL_UPDATED' ? 'updated' : 'deleted'} URL in Google index`,
        quotaUsed: this.quotaUsed,
        quotaRemaining: this.dailyLimit - this.quotaUsed
      };

    } catch (error: any) {
      console.error('Google Indexing API error:', error);
      
      // Don't increment quota on error
      return {
        success: false,
        message: `Indexing failed: ${error.message || 'Unknown error'}`,
        quotaUsed: this.quotaUsed,
        quotaRemaining: this.dailyLimit - this.quotaUsed
      };
    }
  }

  public async batchIndexUrls(requests: IndexingRequest[]): Promise<IndexingResponse[]> {
    const results: IndexingResponse[] = [];
    
    // Process requests in batches to respect quota
    for (const request of requests) {
      if (!this.canMakeRequest()) {
        results.push({
          success: false,
          message: `Daily quota limit reached. Skipping remaining ${requests.length - results.length} requests`,
          quotaUsed: this.quotaUsed,
          quotaRemaining: 0
        });
        break;
      }

      const result = await this.indexUrl(request);
      results.push(result);
      
      // Add small delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  }

  private isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'https:' && urlObj.hostname.includes('escaperoomsfinder.com');
    } catch {
      return false;
    }
  }

  // Priority-based indexing for different types of content
  public getIndexingPriority(url: string): 'HIGH' | 'MEDIUM' | 'LOW' {
    // High priority: Individual venue pages, new blog posts
    if (url.includes('/locations/') && url.split('/').length > 5) {
      return 'HIGH';
    }
    
    // Medium priority: City/state pages, theme pages, blog posts
    if (url.includes('/locations/') || url.includes('/themes/') || url.includes('/blog/')) {
      return 'MEDIUM';
    }
    
    // Low priority: Static pages, browse pages
    return 'LOW';
  }

  // Smart indexing strategy - only index high and medium priority URLs
  public shouldIndex(url: string): boolean {
    const priority = this.getIndexingPriority(url);
    const quotaInfo = this.getQuotaInfo();
    
    // Always index high priority
    if (priority === 'HIGH') {
      return true;
    }
    
    // Index medium priority if we have enough quota (reserve 50 for high priority)
    if (priority === 'MEDIUM' && quotaInfo.remaining > 50) {
      return true;
    }
    
    // Only index low priority if we have plenty of quota
    if (priority === 'LOW' && quotaInfo.remaining > 100) {
      return true;
    }
    
    return false;
  }
}

// Export singleton instance
export const googleIndexingService = new GoogleIndexingService();
