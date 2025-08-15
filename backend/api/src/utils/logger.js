const winston = require('winston')
const path = require('path')
const fs = require('fs')

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let metaStr = ''
    if (Object.keys(meta).length > 0) {
      metaStr = ` ${JSON.stringify(meta)}`
    }
    return `[${timestamp}] ${level}: ${message}${metaStr}`
  })
)

// Custom format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
)

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: { 
    service: 'intransparency-api',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Error log file
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),
    
    // Combined log file
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),
    
    // Warning log file
    new winston.transports.File({
      filename: path.join(logsDir, 'warn.log'),
      level: 'warn',
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 3,
      tailable: true
    })
  ]
})

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }))
}

// Add daily rotate file transport for production
if (process.env.NODE_ENV === 'production') {
  const DailyRotateFile = require('winston-daily-rotate-file')
  
  logger.add(new DailyRotateFile({
    filename: path.join(logsDir, 'application-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: fileFormat
  }))
}

// Export logger
module.exports = logger