import knex from 'knex'
import { createClient } from 'redis'

const DATABASE_URL = process.env.DATABASE_URL
const REDIS_URL = process.env.REDIS_URL

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}

// PostgreSQL configuration
export const db = knex({
  client: 'pg',
  connection: DATABASE_URL + '?ssl=require',
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 60000,
    idleTimeoutMillis: 600000,
  },
  migrations: {
    directory: './migrations',
    extension: 'ts'
  },
  seeds: {
    directory: './seeds',
    extension: 'ts'
  }
})

// Redis configuration
export const redis = createClient({
  url: REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 500)
  }
})

redis.on('error', (err) => {
  console.error('Redis Client Error:', err)
})

redis.on('connect', () => {
  console.log('✅ Connected to Redis')
})

// Initialize Redis connection
redis.connect().catch(console.error)

// Database health check
export const checkDatabaseConnection = async () => {
  try {
    await db.raw('SELECT 1')
    console.log('✅ Connected to PostgreSQL')
    return true
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error)
    return false
  }
}

// Initialize database connection
checkDatabaseConnection()

export default db