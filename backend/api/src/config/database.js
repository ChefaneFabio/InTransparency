const knex = require('knex')
const Redis = require('ioredis')

const DATABASE_URL = process.env.DATABASE_URL || process.env.DB_CONNECTION_STRING
const REDIS_URL = process.env.REDIS_URL

if (!DATABASE_URL) {
  console.warn('Warning: DATABASE_URL not found, using fallback configuration')
}

// PostgreSQL configuration
const dbConfig = DATABASE_URL ? {
  client: 'pg',
  connection: DATABASE_URL,
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 60000,
    idleTimeoutMillis: 600000,
  },
  migrations: {
    directory: './src/db/migrations'
  },
  seeds: {
    directory: './src/db/seeds'
  }
} : {
  // Fallback for development
  client: 'sqlite3',
  connection: {
    filename: './dev.sqlite3'
  },
  useNullAsDefault: true,
  migrations: {
    directory: './src/db/migrations'
  },
  seeds: {
    directory: './src/db/seeds'
  }
}

const db = knex(dbConfig)

// Redis configuration
let redis = null
if (REDIS_URL) {
  redis = new Redis(REDIS_URL, {
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    reconnectOnError: (err) => {
      const targetError = 'READONLY'
      return err.message.includes(targetError)
    }
  })

  redis.on('error', (err) => {
    console.error('Redis Client Error:', err.message)
  })

  redis.on('connect', () => {
    console.log('✅ Connected to Redis')
  })

  redis.on('ready', () => {
    console.log('✅ Redis is ready')
  })

  redis.on('close', () => {
    console.log('❌ Redis connection closed')
  })
} else {
  console.warn('Warning: Redis URL not provided, Redis features will be disabled')
}

// Database health check
const checkDatabaseConnection = async () => {
  try {
    await db.raw('SELECT 1')
    console.log('✅ Connected to database')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    return false
  }
}

// Redis health check
const checkRedisConnection = async () => {
  if (!redis) return false
  
  try {
    await redis.ping()
    console.log('✅ Redis connection healthy')
    return true
  } catch (error) {
    console.error('❌ Redis connection failed:', error.message)
    return false
  }
}

// Initialize connections
const initializeConnections = async () => {
  console.log('🔌 Initializing database connections...')
  
  const dbHealthy = await checkDatabaseConnection()
  const redisHealthy = redis ? await checkRedisConnection() : false
  
  if (!dbHealthy) {
    console.error('❌ Database connection failed - some features may not work')
  }
  
  if (redis && !redisHealthy) {
    console.warn('⚠️ Redis connection failed - caching features will be disabled')
  }
  
  return { database: dbHealthy, redis: redisHealthy }
}

// Graceful shutdown
const closeConnections = async () => {
  console.log('🔌 Closing database connections...')
  
  try {
    if (redis) {
      await redis.quit()
      console.log('✅ Redis connection closed')
    }
    
    await db.destroy()
    console.log('✅ Database connection closed')
  } catch (error) {
    console.error('❌ Error closing connections:', error.message)
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, closing connections...')
  await closeConnections()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, closing connections...')
  await closeConnections()
  process.exit(0)
})

// Initialize on module load
initializeConnections().catch(console.error)

module.exports = db
module.exports.redis = redis
module.exports.checkDatabaseConnection = checkDatabaseConnection
module.exports.checkRedisConnection = checkRedisConnection
module.exports.initializeConnections = initializeConnections
module.exports.closeConnections = closeConnections