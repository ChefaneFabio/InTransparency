import knex from 'knex'
import { createClient } from 'redis'

const DATABASE_URL = process.env.DATABASE_URL
const REDIS_URL = process.env.REDIS_URL

// For demo purposes, don't require database initially
if (!DATABASE_URL) {
  console.log('⚠️  No DATABASE_URL provided, using mock database for demo')
}

// PostgreSQL configuration - mock for demo
export const db = DATABASE_URL ? knex({
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
}) : {
  // Mock database for demo
  select: () => ({
    where: () => ({
      first: () => Promise.resolve(null)
    })
  }),
  where: () => ({
    first: () => Promise.resolve(null)
  }),
  insert: () => Promise.resolve([]),
  update: () => Promise.resolve([])
} as any

// Redis configuration - mock for demo
export const redis = REDIS_URL ? createClient({
  url: REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 500)
  }
}) : {
  // Mock Redis for demo
  get: () => Promise.resolve(null),
  set: () => Promise.resolve('OK'),
  del: () => Promise.resolve(1),
  connect: () => Promise.resolve()
} as any

if (REDIS_URL) {
  redis.on('error', (err: any) => {
    console.error('Redis Client Error:', err)
  })

  redis.on('connect', () => {
    console.log('✅ Connected to Redis')
  })

  // Initialize Redis connection
  redis.connect().catch(console.error)
}

// Database health check
export const checkDatabaseConnection = async () => {
  if (!DATABASE_URL) {
    console.log('📝 Using mock database for demo')
    return true
  }
  
  try {
    await (db as any).raw('SELECT 1')
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