const express = require('express')
const database = require('../database/Database')
const { authenticate } = require('../middleware/auth')
const router = express.Router()

// Register new user
router.post('/register', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      university,
      company,
      department,
      graduationYear,
      major
    } = req.body

    // Create user
    const user = await database.createUser({
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      email: email?.trim().toLowerCase(),
      password,
      role,
      university,
      company,
      department,
      graduationYear: graduationYear ? parseInt(graduationYear) : null,
      major: major?.trim()
    })

    // Generate token
    const token = user.generateToken()

    // Return user data (password excluded by toJSON)
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: user.toJSON(),
        token
      }
    })
  } catch (error) {
    console.error('Registration error:', error.message)
    
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
})

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      })
    }

    // Find user by email
    const user = await database.findUserByEmail(email.trim().toLowerCase())
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      })
    }

    // Verify password
    const isValidPassword = await user.verifyPassword(password)
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      })
    }

    // Generate token
    const token = user.generateToken()

    // Update last login
    await database.updateUser(user.id, { 
      lastLoginAt: new Date() 
    })

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token
      }
    })
  } catch (error) {
    console.error('Login error:', error.message)
    
    res.status(500).json({
      success: false,
      error: 'Login failed'
    })
  }
})

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = req.user
    
    // Get user stats
    const stats = await database.getUserStats(user.id)
    
    res.json({
      success: true,
      data: {
        user: user.toJSON(),
        stats
      }
    })
  } catch (error) {
    console.error('Get user error:', error.message)
    
    res.status(500).json({
      success: false,
      error: 'Failed to get user information'
    })
  }
})

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.userId
    const updates = req.body

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updates.id
    delete updates.email
    delete updates.password
    delete updates.role
    delete updates.createdAt

    const updatedUser = await database.updateUser(userId, updates)
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser.toJSON()
      }
    })
  } catch (error) {
    console.error('Update profile error:', error.message)
    
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
})

// Logout (client-side token removal, but we can blacklist tokens if needed)
router.post('/logout', authenticate, async (req, res) => {
  try {
    // In a real implementation, you might want to blacklist the token
    // For now, we'll just send a success response
    
    res.json({
      success: true,
      message: 'Logout successful'
    })
  } catch (error) {
    console.error('Logout error:', error.message)
    
    res.status(500).json({
      success: false,
      error: 'Logout failed'
    })
  }
})

// Verify email (placeholder - would require email service integration)
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body
    
    // In a real implementation, you would verify the email token
    // For now, return success
    
    res.json({
      success: true,
      message: 'Email verified successfully'
    })
  } catch (error) {
    console.error('Email verification error:', error.message)
    
    res.status(400).json({
      success: false,
      error: 'Email verification failed'
    })
  }
})

// Request password reset (placeholder)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      })
    }

    // In a real implementation, you would send a password reset email
    // For now, return success
    
    res.json({
      success: true,
      message: 'Password reset instructions sent to your email'
    })
  } catch (error) {
    console.error('Password reset error:', error.message)
    
    res.status(500).json({
      success: false,
      error: 'Password reset failed'
    })
  }
})

module.exports = router