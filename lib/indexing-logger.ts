import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';

interface IndexingLogEntry {
  timestamp: string;
  type: 'DAILY_INDEXING' | 'MANUAL_INDEXING' | 'AUTO_INDEXING';
  success: boolean;
  totalProcessed: number;
  successful: number;
  failed: number;
  quotaUsed: number;
  quotaRemaining: number;
  errors: string[];
  indexedUrls: string[];
  duration?: number;
}

class IndexingLogger {
  private logDir: string;
  private logFile: string;

  constructor() {
    this.logDir = join(process.cwd(), 'logs');
    this.logFile = join(this.logDir, 'indexing.log');
    this.ensureLogDirectory();
  }

  private ensureLogDirectory() {
    if (!existsSync(this.logDir)) {
      mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * Log indexing results
   */
  public logIndexingResult(entry: IndexingLogEntry) {
    const logLine = JSON.stringify(entry) + '\n';
    
    try {
      appendFileSync(this.logFile, logLine);
      console.log(`📝 Indexing result logged to ${this.logFile}`);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  /**
   * Log a simple message
   */
  public logMessage(message: string, type: 'INFO' | 'WARN' | 'ERROR' = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      type: 'LOG',
      level: type,
      message
    };
    
    const logLine = JSON.stringify(logEntry) + '\n';
    
    try {
      appendFileSync(this.logFile, logLine);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  /**
   * Get recent log entries
   */
  public getRecentLogs(limit: number = 50): IndexingLogEntry[] {
    try {
      if (!existsSync(this.logFile)) {
        return [];
      }

      const content = readFileSync(this.logFile, 'utf8');
      const lines = content.trim().split('\n').filter(line => line.trim());
      
      const logs = lines
        .slice(-limit)
        .map(line => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        })
        .filter(log => log && log.type !== 'LOG');

      return logs;
    } catch (error) {
      console.error('Failed to read log file:', error);
      return [];
    }
  }

  /**
   * Get daily statistics
   */
  public getDailyStats(date?: string): {
    totalIndexed: number;
    totalFailed: number;
    quotaUsed: number;
    entries: IndexingLogEntry[];
  } {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const logs = this.getRecentLogs(1000);
    
    const dailyLogs = logs.filter(log => 
      log.timestamp.startsWith(targetDate)
    );

    const stats = {
      totalIndexed: 0,
      totalFailed: 0,
      quotaUsed: 0,
      entries: dailyLogs
    };

    dailyLogs.forEach(log => {
      stats.totalIndexed += log.successful || 0;
      stats.totalFailed += log.failed || 0;
      stats.quotaUsed += log.quotaUsed || 0;
    });

    return stats;
  }
}

// Export singleton instance
export const indexingLogger = new IndexingLogger();
