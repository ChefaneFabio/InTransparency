const winston = require('winston')
const morgan = require('morgan')

// Create Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'intransparency-api' },
  transports: [
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // Write all logs with level 'info' and below to combined.log
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
})

// If not in production, log to console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }))
}

// Create request logger middleware using Morgan
const requestLogger = morgan(
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms',
  {
    stream: {
      write: (message) => {
        logger.info(message.trim())
      }
    }
  }
)

// Custom request logger with more details
const detailedRequestLogger = (req, res, next) => {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      contentLength: res.get('Content-Length'),
      timestamp: new Date().toISOString()
    }
    
    // Add user info if authenticated
    if (req.user) {
      logData.userId = req.user.id
      logData.userRole = req.user.role
    }
    
    // Log different levels based on status code
    if (res.statusCode >= 500) {
      logger.error('HTTP Request', logData)
    } else if (res.statusCode >= 400) {
      logger.warn('HTTP Request', logData)
    } else {
      logger.info('HTTP Request', logData)
    }
  })
  
  next()
}

// Database query logger
const dbLogger = {
  query: (query, params) => {
    logger.debug('Database Query', {
      query: query.replace(/\s+/g, ' ').trim(),
      params: params ? JSON.stringify(params) : undefined,
      timestamp: new Date().toISOString()
    })
  },
  
  error: (error, query, params) => {
    logger.error('Database Error', {
      error: error.message,
      query: query ? query.replace(/\s+/g, ' ').trim() : undefined,
      params: params ? JSON.stringify(params) : undefined,
      timestamp: new Date().toISOString()
    })
  }
}

// Performance logger
const performanceLogger = {
  start: (operation) => {
    return {
      operation,
      startTime: process.hrtime.bigint()
    }
  },
  
  end: (timer, metadata = {}) => {
    const endTime = process.hrtime.bigint()
    const duration = Number(endTime - timer.startTime) / 1000000 // Convert to milliseconds
    
    logger.info('Performance Metric', {
      operation: timer.operation,
      duration: `${duration.toFixed(2)}ms`,
      ...metadata,
      timestamp: new Date().toISOString()
    })
    
    return duration
  }
}

// Security event logger
const securityLogger = {
  authFailure: (req, reason) => {
    logger.warn('Authentication Failure', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl,
      reason,
      timestamp: new Date().toISOString()
    })
  },
  
  authSuccess: (req, userId) => {
    logger.info('Authentication Success', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId,
      timestamp: new Date().toISOString()
    })
  },
  
  rateLimitExceeded: (req, limit) => {
    logger.warn('Rate Limit Exceeded', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl,
      limit,
      timestamp: new Date().toISOString()
    })
  },
  
  suspiciousActivity: (req, activity) => {
    logger.error('Suspicious Activity', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl,
      activity,
      timestamp: new Date().toISOString()
    })
  }
}

// Application event logger
const appLogger = {
  startup: (port, environment) => {
    logger.info('Application Started', {
      port,
      environment,
      nodeVersion: process.version,
      timestamp: new Date().toISOString()
    })
  },
  
  shutdown: (reason) => {
    logger.info('Application Shutdown', {
      reason,
      timestamp: new Date().toISOString()
    })
  },
  
  error: (error, context = {}) => {
    logger.error('Application Error', {
      error: error.message,
      stack: error.stack,
      ...context,
      timestamp: new Date().toISOString()
    })
  }
}

// Export logger and utilities
module.exports = {
  logger,
  requestLogger,
  detailedRequestLogger,
  dbLogger,
  performanceLogger,
  securityLogger,
  appLogger
}