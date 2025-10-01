/**
 * Logger utility for frontend application
 * Handles console statements based on environment
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LoggerConfig {
  isDevelopment: boolean
  enableInProduction: boolean
  logLevel: LogLevel
}

class Logger {
  private config: LoggerConfig

  constructor() {
    this.config = {
      isDevelopment: process.env.NODE_ENV === 'development',
      enableInProduction: process.env.NEXT_PUBLIC_ENABLE_LOGS === 'true',
      logLevel: (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) || 'info'
    }
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.config.isDevelopment) {
      return true
    }

    if (!this.config.enableInProduction) {
      return false
    }

    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error']
    const currentLevelIndex = levels.indexOf(this.config.logLevel)
    const requestedLevelIndex = levels.indexOf(level)

    return requestedLevelIndex >= currentLevelIndex
  }

  debug(...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug('[DEBUG]', ...args)
    }
  }

  info(...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info('[INFO]', ...args)
    }
  }

  warn(...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn('[WARN]', ...args)
    }
  }

  error(...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error('[ERROR]', ...args)
    }
  }

  // Special method for tracking analytics events
  track(event: string, properties?: Record<string, any>): void {
    if (this.config.isDevelopment) {
      this.debug('Analytics Event:', event, properties)
    }

    // Here you would integrate with your analytics service
    // Example: analytics.track(event, properties)
  }

  // Method to measure performance
  time(label: string): void {
    if (this.shouldLog('debug')) {
      console.time(label)
    }
  }

  timeEnd(label: string): void {
    if (this.shouldLog('debug')) {
      console.timeEnd(label)
    }
  }

  // Method to create a table for debugging
  table(data: any): void {
    if (this.shouldLog('debug')) {
      console.table(data)
    }
  }

  // Group related logs
  group(label: string): void {
    if (this.shouldLog('debug')) {
      console.group(label)
    }
  }

  groupEnd(): void {
    if (this.shouldLog('debug')) {
      console.groupEnd()
    }
  }
}

// Export singleton instance
export const logger = new Logger()

// Export default for convenience
export default logger