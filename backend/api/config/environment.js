const crypto = require('crypto')

// Environment configuration and validation
class EnvironmentConfig {
  constructor() {
    this.requiredVars = [
      'JWT_SECRET',
      'NODE_ENV'
    ]

    this.optionalVars = [
      'PORT',
      'DATABASE_URL',
      'CORS_ORIGIN',
      'JWT_EXPIRY',
      'REFRESH_TOKEN_EXPIRY'
    ]

    this.validateRequired()
    this.setDefaults()
    this.validateValues()
  }

  validateRequired() {
    const missing = []

    for (const varName of this.requiredVars) {
      if (!process.env[varName]) {
        missing.push(varName)
      }
    }

    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
    }
  }

  setDefaults() {
    // Set default values for optional variables
    process.env.PORT = process.env.PORT || '5000'
    process.env.NODE_ENV = process.env.NODE_ENV || 'development'
    process.env.JWT_EXPIRY = process.env.JWT_EXPIRY || '1h'
    process.env.REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d'

    // Set CORS origin based on environment
    if (!process.env.CORS_ORIGIN) {
      if (process.env.NODE_ENV === 'production') {
        process.env.CORS_ORIGIN = process.env.FRONTEND_URL || 'https://intransparency.onrender.com'
      } else {
        process.env.CORS_ORIGIN = 'http://localhost:3000,http://localhost:3001'
      }
    }
  }

  validateValues() {
    // Validate JWT_SECRET strength
    if (process.env.JWT_SECRET.length < 32) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET must be at least 32 characters in production')
      }
      console.warn('⚠️  WARNING: JWT_SECRET should be at least 32 characters for security')
    }

    // Check if JWT_SECRET is a common weak value
    const weakSecrets = ['secret', 'password', '12345678', 'your-secret-key', 'change-me']
    if (weakSecrets.some(weak => process.env.JWT_SECRET.toLowerCase().includes(weak))) {
      throw new Error('JWT_SECRET contains weak or common values. Please use a strong, random secret.')
    }

    // Validate NODE_ENV
    const validEnvironments = ['development', 'test', 'staging', 'production']
    if (!validEnvironments.includes(process.env.NODE_ENV)) {
      throw new Error(`NODE_ENV must be one of: ${validEnvironments.join(', ')}`)
    }

    // Validate PORT
    const port = parseInt(process.env.PORT)
    if (isNaN(port) || port < 1 || port > 65535) {
      throw new Error('PORT must be a valid port number between 1 and 65535')
    }
  }

  generateSecureSecret() {
    // Helper method to generate a secure JWT secret
    return crypto.randomBytes(64).toString('hex')
  }

  getCorsOrigins() {
    // Parse CORS origins from environment variable
    const origins = process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    return origins.filter(origin => origin.length > 0)
  }

  isDevelopment() {
    return process.env.NODE_ENV === 'development'
  }

  isProduction() {
    return process.env.NODE_ENV === 'production'
  }

  isTest() {
    return process.env.NODE_ENV === 'test'
  }

  getConfig() {
    return {
      port: parseInt(process.env.PORT),
      nodeEnv: process.env.NODE_ENV,
      jwtSecret: process.env.JWT_SECRET,
      jwtExpiry: process.env.JWT_EXPIRY,
      refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY,
      corsOrigins: this.getCorsOrigins(),
      databaseUrl: process.env.DATABASE_URL,
      isDevelopment: this.isDevelopment(),
      isProduction: this.isProduction(),
      isTest: this.isTest()
    }
  }
}

// Create and export singleton instance
const config = new EnvironmentConfig()

module.exports = config