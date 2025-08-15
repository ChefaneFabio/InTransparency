import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Joi from 'joi'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../config/database'
import { authenticate, AuthRequest } from '../middleware/auth'
import { validateRequest } from '../middleware/validation'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  role: Joi.string().valid('student', 'professional', 'recruiter').default('student'),
  university: Joi.string().max(100).optional(),
  major: Joi.string().max(100).optional(),
  graduationYear: Joi.number().integer().min(2020).max(2030).optional(),
  company: Joi.string().max(100).optional(),
  position: Joi.string().max(100).optional(),
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

// Helper function to generate JWT
const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// Register
router.post('/register', validateRequest(registerSchema), async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      role,
      university,
      major,
      graduationYear,
      company,
      position,
    } = req.body

    // Check if user already exists
    const existingUser = await db('users').where({ email }).first()
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' })
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const userId = uuidv4()
    const user = {
      id: userId,
      email,
      password_hash: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      role,
      university,
      major,
      graduation_year: graduationYear,
      company,
      position,
      is_active: true,
      email_verified: false,
      created_at: new Date(),
      updated_at: new Date(),
    }

    await db('users').insert(user)

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
    }

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: userResponse,
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ error: 'Failed to create user' })
  }
})

// Login
router.post('/login', validateRequest(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body

    // Get user from database
    const user = await db('users').where({ email }).first()
    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate token
    const token = generateToken(user.id)

    // Update last login
    await db('users')
      .where({ id: user.id })
      .update({ last_login: new Date() })

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
    }

    res.json({
      message: 'Login successful',
      token,
      user: userResponse,
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await db('users')
      .select(
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
        'avatar_url as avatarUrl',
        'created_at as createdAt'
      )
      .where({ id: req.user!.id })
      .first()

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ user })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Failed to get user' })
  }
})

// Logout (client-side token removal)
router.post('/logout', authenticate, async (req: AuthRequest, res) => {
  // In a more sophisticated setup, you might maintain a blacklist of tokens
  // For now, we'll just send a success response as the client will remove the token
  res.json({ message: 'Logout successful' })
})

// Refresh token
router.post('/refresh', authenticate, async (req: AuthRequest, res) => {
  try {
    const newToken = generateToken(req.user!.id)
    res.json({ token: newToken })
  } catch (error) {
    console.error('Token refresh error:', error)
    res.status(500).json({ error: 'Failed to refresh token' })
  }
})

export default router