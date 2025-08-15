const express = require('express')
const authController = require('../controllers/authController')
const { authMiddleware } = require('../middleware/auth')
const { rateLimitMiddleware } = require('../middleware/rateLimit')

const router = express.Router()

// Apply rate limiting to auth routes
const authRateLimit = rateLimitMiddleware({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later'
  }
})

const passwordResetRateLimit = rateLimitMiddleware({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    error: 'Too many password reset attempts, please try again later'
  }
})

// Public routes
router.post('/register', authRateLimit, authController.register)
router.post('/login', authRateLimit, authController.login)
router.post('/verify-email', authController.verifyEmail)
router.post('/forgot-password', passwordResetRateLimit, authController.requestPasswordReset)
router.post('/reset-password', authController.resetPassword)

// Protected routes (require authentication)
router.get('/me', authMiddleware, authController.getMe)
router.post('/logout', authMiddleware, authController.logout)
router.post('/refresh-token', authMiddleware, authController.refreshToken)
router.put('/change-password', authMiddleware, authController.changePassword)

// Social auth routes (OAuth)
router.get('/google', (req, res) => {
  // Redirect to Google OAuth
  const googleAuthUrl = `https://accounts.google.com/oauth/authorize?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&` +
    `scope=email profile&` +
    `response_type=code&` +
    `state=${req.query.state || ''}`
  
  res.redirect(googleAuthUrl)
})

router.get('/google/callback', async (req, res) => {
  try {
    const { code, state } = req.query

    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=google_auth_failed`)
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      }),
    })

    const tokens = await tokenResponse.json()

    if (!tokens.access_token) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=google_auth_failed`)
    }

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    const googleUser = await userResponse.json()

    if (!googleUser.email) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=google_auth_failed`)
    }

    // Check if user exists
    const db = require('../config/database')
    let user = await db('users').where({ email: googleUser.email }).first()

    if (!user) {
      // Create new user
      const { v4: uuidv4 } = require('uuid')
      const userId = uuidv4()

      const userData = {
        id: userId,
        email: googleUser.email,
        first_name: googleUser.given_name || googleUser.name?.split(' ')[0] || '',
        last_name: googleUser.family_name || googleUser.name?.split(' ').slice(1).join(' ') || '',
        avatar_url: googleUser.picture,
        role: 'student', // Default role
        email_verified: true,
        google_id: googleUser.id,
        auth_provider: 'google',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      }

      await db('users').insert(userData)
      user = userData
    } else {
      // Update existing user with Google info if not already set
      const updateData = {
        updated_at: new Date(),
        last_login: new Date(),
      }

      if (!user.google_id) {
        updateData.google_id = googleUser.id
        updateData.auth_provider = 'google'
      }

      if (!user.avatar_url && googleUser.picture) {
        updateData.avatar_url = googleUser.picture
      }

      if (!user.email_verified) {
        updateData.email_verified = true
        updateData.email_verified_at = new Date()
      }

      await db('users').where({ id: user.id }).update(updateData)
    }

    // Generate JWT token
    const jwt = require('jsonwebtoken')
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    // Redirect to frontend with token
    const redirectUrl = state 
      ? `${process.env.FRONTEND_URL}${decodeURIComponent(state)}?token=${token}`
      : `${process.env.FRONTEND_URL}/dashboard?token=${token}`

    res.redirect(redirectUrl)

  } catch (error) {
    console.error('Google OAuth callback error:', error)
    res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=google_auth_failed`)
  }
})

router.get('/github', (req, res) => {
  // Redirect to GitHub OAuth
  const githubAuthUrl = `https://github.com/login/oauth/authorize?` +
    `client_id=${process.env.GITHUB_CLIENT_ID}&` +
    `redirect_uri=${process.env.GITHUB_REDIRECT_URI}&` +
    `scope=user:email&` +
    `state=${req.query.state || ''}`
  
  res.redirect(githubAuthUrl)
})

router.get('/github/callback', async (req, res) => {
  try {
    const { code, state } = req.query

    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=github_auth_failed`)
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    })

    const tokens = await tokenResponse.json()

    if (!tokens.access_token) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=github_auth_failed`)
    }

    // Get user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        'User-Agent': 'InTransparency-App',
      },
    })

    const githubUser = await userResponse.json()

    // Get user emails from GitHub
    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        'User-Agent': 'InTransparency-App',
      },
    })

    const emails = await emailResponse.json()
    const primaryEmail = emails.find(email => email.primary)?.email || githubUser.email

    if (!primaryEmail) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=github_auth_failed`)
    }

    // Check if user exists
    const db = require('../config/database')
    let user = await db('users').where({ email: primaryEmail }).first()

    if (!user) {
      // Create new user
      const { v4: uuidv4 } = require('uuid')
      const userId = uuidv4()

      const userData = {
        id: userId,
        email: primaryEmail,
        first_name: githubUser.name?.split(' ')[0] || githubUser.login || '',
        last_name: githubUser.name?.split(' ').slice(1).join(' ') || '',
        avatar_url: githubUser.avatar_url,
        github_url: githubUser.html_url,
        role: 'student', // Default role
        email_verified: true,
        github_id: githubUser.id.toString(),
        auth_provider: 'github',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      }

      await db('users').insert(userData)
      user = userData
    } else {
      // Update existing user with GitHub info if not already set
      const updateData = {
        updated_at: new Date(),
        last_login: new Date(),
      }

      if (!user.github_id) {
        updateData.github_id = githubUser.id.toString()
        updateData.auth_provider = 'github'
      }

      if (!user.avatar_url && githubUser.avatar_url) {
        updateData.avatar_url = githubUser.avatar_url
      }

      if (!user.github_url && githubUser.html_url) {
        updateData.github_url = githubUser.html_url
      }

      if (!user.email_verified) {
        updateData.email_verified = true
        updateData.email_verified_at = new Date()
      }

      await db('users').where({ id: user.id }).update(updateData)
    }

    // Generate JWT token
    const jwt = require('jsonwebtoken')
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    // Redirect to frontend with token
    const redirectUrl = state 
      ? `${process.env.FRONTEND_URL}${decodeURIComponent(state)}?token=${token}`
      : `${process.env.FRONTEND_URL}/dashboard?token=${token}`

    res.redirect(redirectUrl)

  } catch (error) {
    console.error('GitHub OAuth callback error:', error)
    res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=github_auth_failed`)
  }
})

module.exports = router