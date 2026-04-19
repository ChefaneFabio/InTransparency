// Global test setup
// Loads .env so tests can see DATABASE_URL, etc.
import { config } from 'dotenv'
config({ path: '.env' })

// Extend assertion timeout for DB-backed integration tests
jest.setTimeout(30000)
