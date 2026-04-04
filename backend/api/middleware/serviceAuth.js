/**
 * Service-to-service authentication middleware.
 * Validates requests from the Vercel frontend proxy using a shared secret.
 * Reads user identity from forwarded headers.
 */

const serviceAuth = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const serviceKey = process.env.BACKEND_SERVICE_KEY

  if (!serviceKey) {
    console.error('BACKEND_SERVICE_KEY is not configured')
    return res.status(500).json({ error: 'Server misconfigured' })
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing service authorization' })
  }

  const token = authHeader.slice(7)
  if (token !== serviceKey) {
    return res.status(403).json({ error: 'Invalid service key' })
  }

  // Read forwarded user identity
  req.userId = req.headers['x-user-id'] || null
  req.userRole = req.headers['x-user-role'] || null

  if (!req.userId) {
    return res.status(401).json({ error: 'Missing user identity' })
  }

  next()
}

module.exports = { serviceAuth }
