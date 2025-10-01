const express = require('express')
const jwt = require('jsonwebtoken')
const config = require('../config/environment')
const router = express.Router()

// Cookie configuration
const cookieOptions = {
  httpOnly: true,
  secure: config.isProduction(), // Only send over HTTPS in production
  sameSite: config.isProduction() ? 'strict' : 'lax',
  maxAge: 60 * 60 * 1000, // 1 hour for access token
  path: '/'
}

const refreshCookieOptions = {
  ...cookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days for refresh token
}

// Set secure cookies
router.post('/set-cookie', async (req, res) => {
  try {
    const { accessToken, refreshToken, expiresAt } = req.body

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        error: 'Access token is required'
      })
    }

    // Verify the access token before setting cookie
    try {
      jwt.verify(accessToken, config.getConfig().jwtSecret)
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Invalid access token'
      })
    }

    // Set access token cookie
    res.cookie('access_token', accessToken, cookieOptions)

    // Set refresh token cookie if provided
    if (refreshToken) {
      res.cookie('refresh_token', refreshToken, refreshCookieOptions)
    }

    res.json({
      success: true,
      message: 'Cookies set successfully'
    })
  } catch (error) {
    if (config.isDevelopment()) {
      console.error('Set cookie error:', error)
    }
    res.status(500).json({
      success: false,
      error: 'Failed to set cookies'
    })
  }
})

// Get auth data from cookies
router.get('/get-cookie', async (req, res) => {
  try {
    const accessToken = req.cookies.access_token
    const refreshToken = req.cookies.refresh_token

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        error: 'No access token found'
      })
    }

    // Verify access token
    try {
      const decoded = jwt.verify(accessToken, config.getConfig().jwtSecret)

      res.json({
        success: true,
        accessToken,
        refreshToken,
        expiresAt: decoded.exp * 1000 // Convert to milliseconds
      })
    } catch (error) {
      // Token expired or invalid
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      })
    }
  } catch (error) {
    if (config.isDevelopment()) {
      console.error('Get cookie error:', error)
    }
    res.status(500).json({
      success: false,
      error: 'Failed to get cookies'
    })
  }
})

// Clear cookies
router.post('/clear-cookie', async (req, res) => {
  try {
    // Clear access token cookie
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: config.isProduction(),
      sameSite: config.isProduction() ? 'strict' : 'lax',
      path: '/'
    })

    // Clear refresh token cookie
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: config.isProduction(),
      sameSite: config.isProduction() ? 'strict' : 'lax',
      path: '/'
    })

    res.json({
      success: true,
      message: 'Cookies cleared successfully'
    })
  } catch (error) {
    if (config.isDevelopment()) {
      console.error('Clear cookie error:', error)
    }
    res.status(500).json({
      success: false,
      error: 'Failed to clear cookies'
    })
  }
})

// Refresh token using cookie
router.post('/refresh-from-cookie', async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'No refresh token found'
      })
    }

    // Verify refresh token
    try {
      const decoded = jwt.verify(refreshToken, config.getConfig().jwtSecret)

      if (decoded.type !== 'refresh') {
        return res.status(401).json({
          success: false,
          error: 'Invalid token type'
        })
      }

      // Generate new tokens
      const newAccessToken = jwt.sign(
        { userId: decoded.userId, role: decoded.role },
        config.getConfig().jwtSecret,
        { expiresIn: config.getConfig().jwtExpiry }
      )

      const newRefreshToken = jwt.sign(
        { userId: decoded.userId, type: 'refresh', role: decoded.role },
        config.getConfig().jwtSecret,
        { expiresIn: config.getConfig().refreshTokenExpiry }
      )

      // Set new cookies
      res.cookie('access_token', newAccessToken, cookieOptions)
      res.cookie('refresh_token', newRefreshToken, refreshCookieOptions)

      res.json({
        success: true,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        message: 'Tokens refreshed successfully'
      })
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired refresh token'
      })
    }
  } catch (error) {
    if (config.isDevelopment()) {
      console.error('Refresh from cookie error:', error)
    }
    res.status(500).json({
      success: false,
      error: 'Failed to refresh token'
    })
  }
})

module.exports = router