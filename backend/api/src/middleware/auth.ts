import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
const db = require('../config/database')

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }
    
    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      
      // Get user from database
      const user = await db('users')
        .select('id', 'email', 'role', 'is_active')
        .where({ id: decoded.userId })
        .first()
      
      if (!user || !user.is_active) {
        return res.status(401).json({ error: 'Invalid or inactive user' })
      }
      
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role
      }
      
      next()
    } catch (jwtError) {
      return res.status(401).json({ error: 'Invalid token' })
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return res.status(500).json({ error: 'Authentication failed' })
  }
}

// Legacy alias
export const authenticate = authMiddleware

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }
    
    next()
  }
}

export const optional = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next() // Continue without authentication
  }
  
  try {
    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    const user = await db('users')
      .select('id', 'email', 'role', 'is_active')
      .where({ id: decoded.userId })
      .first()
    
    if (user && user.is_active) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role
      }
    }
  } catch (error) {
    // Ignore authentication errors for optional auth
  }
  
  next()
}