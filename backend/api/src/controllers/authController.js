const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const { db } = require('../config/database')
const { validateInput } = require('../utils/validation')
const { sendEmail } = require('../services/emailService')

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// Register new user
const register = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      role = 'student',
      university,
      major,
      graduationYear,
      company,
      position,
    } = req.body

    // Validate input
    const validation = validateInput({
      email,
      password,
      firstName,
      lastName,
      role,
    }, {
      email: 'required|email',
      password: 'required|min:8',
      firstName: 'required|min:2|max:50',
      lastName: 'required|min:2|max:50',
      role: 'required|in:student,professional,recruiter,professor,admin',
    })

    if (!validation.valid) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors
      })
    }

    // Check if user already exists
    const existingUser = await db('users').where({ email }).first()
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' })
    }

    // Hash password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Create user
    const userId = uuidv4()
    const emailVerificationToken = uuidv4()
    
    const userData = {
      id: userId,
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      role,
      university,
      major,
      graduation_year: graduationYear,
      company,
      position,
      email_verification_token: emailVerificationToken,
      is_active: true,
      email_verified: false,
      created_at: new Date(),
      updated_at: new Date(),
    }

    await db('users').insert(userData)

    // Send verification email
    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to InTransparency - Verify Your Email',
        template: 'welcome',
        data: {
          firstName,
          verificationLink: `${process.env.FRONTEND_URL}/auth/verify-email?token=${emailVerificationToken}`
        }
      })
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      // Don't fail registration if email fails
    }

    // Generate token
    const token = generateToken(userId)

    // Return user data (without password)
    const userResponse = {
      id: userId,
      email,
      firstName,
      lastName,
      role,
      university,
      major,
      graduationYear,
      company,
      position,
      emailVerified: false,
    }

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: userResponse,
    })

    // Log registration
    console.log(`New user registered: ${email} (${role})`)

  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ error: 'Failed to create user' })
  }
}

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    const validation = validateInput({ email, password }, {
      email: 'required|email',
      password: 'required',
    })

    if (!validation.valid) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors
      })
    }

    // Get user from database
    const user = await db('users')
      .select('*')
      .where({ email })
      .first()

    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Update last login
    await db('users')
      .where({ id: user.id })
      .update({ 
        last_login: new Date(),
        updated_at: new Date()
      })

    // Generate token
    const token = generateToken(user.id)

    // Return user data (without password)
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      university: user.university,
      major: user.major,
      graduationYear: user.graduation_year,
      company: user.company,
      position: user.position,
      avatarUrl: user.avatar_url,
      emailVerified: user.email_verified,
      skills: JSON.parse(user.skills || '[]'),
      interests: JSON.parse(user.interests || '[]'),
      location: user.location,
      createdAt: user.created_at,
    }

    res.json({
      message: 'Login successful',
      token,
      user: userResponse,
    })

    // Log login
    console.log(`User logged in: ${email}`)

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
}

// Get current user
const getMe = async (req, res) => {
  try {
    const userId = req.user.id

    const user = await db('users')
      .select([
        'id',
        'email',
        'first_name as firstName',
        'last_name as lastName',
        'role',
        'university',
        'major',
        'graduation_year as graduationYear',
        'company',
        'position',
        'bio',
        'avatar_url as avatarUrl',
        'skills',
        'interests',
        'location',
        'linkedin_url as linkedinUrl',
        'github_url as githubUrl',
        'portfolio_url as portfolioUrl',
        'email_verified as emailVerified',
        'created_at as createdAt',
        'updated_at as updatedAt'
      ])
      .where({ id: userId })
      .first()

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Parse JSON fields
    user.skills = JSON.parse(user.skills || '[]')
    user.interests = JSON.parse(user.interests || '[]')

    res.json({ user })

  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Failed to get user' })
  }
}

// Logout user
const logout = async (req, res) => {
  try {
    // In a more sophisticated setup, you might maintain a blacklist of tokens
    // For now, we'll just send a success response as the client will remove the token
    res.json({ message: 'Logout successful' })

    // Log logout
    console.log(`User logged out: ${req.user.email}`)

  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({ error: 'Logout failed' })
  }
}

// Refresh token
const refreshToken = async (req, res) => {
  try {
    const userId = req.user.id

    // Verify user is still active
    const user = await db('users')
      .select('is_active')
      .where({ id: userId })
      .first()

    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'User not found or inactive' })
    }

    const newToken = generateToken(userId)
    res.json({ token: newToken })

  } catch (error) {
    console.error('Token refresh error:', error)
    res.status(500).json({ error: 'Failed to refresh token' })
  }
}

// Verify email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' })
    }

    // Find user with verification token
    const user = await db('users')
      .where({ email_verification_token: token })
      .first()

    if (!user) {
      return res.status(400).json({ error: 'Invalid verification token' })
    }

    // Update user as verified
    await db('users')
      .where({ id: user.id })
      .update({
        email_verified: true,
        email_verified_at: new Date(),
        email_verification_token: null,
        updated_at: new Date()
      })

    res.json({ message: 'Email verified successfully' })

    // Log verification
    console.log(`Email verified for user: ${user.email}`)

  } catch (error) {
    console.error('Email verification error:', error)
    res.status(500).json({ error: 'Email verification failed' })
  }
}

// Request password reset
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    const user = await db('users').where({ email }).first()

    if (!user) {
      // Don't reveal if email exists
      return res.json({ message: 'Password reset email sent if account exists' })
    }

    // Generate reset token
    const resetToken = uuidv4()
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await db('users')
      .where({ id: user.id })
      .update({
        password_reset_token: resetToken,
        password_reset_expires: resetExpires,
        updated_at: new Date()
      })

    // Send reset email
    try {
      await sendEmail({
        to: email,
        subject: 'InTransparency - Password Reset Request',
        template: 'password-reset',
        data: {
          firstName: user.first_name,
          resetLink: `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`
        }
      })
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError)
      return res.status(500).json({ error: 'Failed to send reset email' })
    }

    res.json({ message: 'Password reset email sent if account exists' })

  } catch (error) {
    console.error('Password reset request error:', error)
    res.status(500).json({ error: 'Failed to request password reset' })
  }
}

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' })
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }

    // Find user with valid reset token
    const user = await db('users')
      .where({ password_reset_token: token })
      .where('password_reset_expires', '>', new Date())
      .first()

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' })
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 12)

    // Update password and clear reset token
    await db('users')
      .where({ id: user.id })
      .update({
        password_hash: passwordHash,
        password_reset_token: null,
        password_reset_expires: null,
        updated_at: new Date()
      })

    res.json({ message: 'Password reset successfully' })

    // Log password reset
    console.log(`Password reset for user: ${user.email}`)

  } catch (error) {
    console.error('Password reset error:', error)
    res.status(500).json({ error: 'Failed to reset password' })
  }
}

// Change password (authenticated)
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const userId = req.user.id

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' })
    }

    // Get user
    const user = await db('users').where({ id: userId }).first()

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash)
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' })
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12)

    // Update password
    await db('users')
      .where({ id: userId })
      .update({
        password_hash: passwordHash,
        updated_at: new Date()
      })

    res.json({ message: 'Password changed successfully' })

    // Log password change
    console.log(`Password changed for user: ${user.email}`)

  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ error: 'Failed to change password' })
  }
}

module.exports = {
  register,
  login,
  getMe,
  logout,
  refreshToken,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  changePassword,
}