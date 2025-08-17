const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class User {
  constructor({
    id = null,
    firstName,
    lastName,
    email,
    password,
    role,
    university = null,
    company = null,
    department = null,
    graduationYear = null,
    major = null,
    gpa = null,
    isEmailVerified = false,
    profileComplete = false,
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.password = password
    this.role = role
    this.university = university
    this.company = company
    this.department = department
    this.graduationYear = graduationYear
    this.major = major
    this.gpa = gpa
    this.isEmailVerified = isEmailVerified
    this.profileComplete = profileComplete
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  // Hash password before saving
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10)
    }
  }

  // Verify password
  async verifyPassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
  }

  // Generate JWT token
  generateToken() {
    return jwt.sign(
      { 
        userId: this.id, 
        email: this.email, 
        role: this.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )
  }

  // Convert to JSON (excluding password)
  toJSON() {
    const obj = { ...this }
    delete obj.password
    return obj
  }

  // Validate user data
  validate() {
    const errors = []

    if (!this.firstName || this.firstName.trim().length < 2) {
      errors.push('First name must be at least 2 characters')
    }

    if (!this.lastName || this.lastName.trim().length < 2) {
      errors.push('Last name must be at least 2 characters')
    }

    if (!this.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      errors.push('Valid email is required')
    }

    if (!this.password || this.password.length < 8) {
      errors.push('Password must be at least 8 characters')
    }

    if (!this.role || !['student', 'recruiter', 'university'].includes(this.role)) {
      errors.push('Valid role is required')
    }

    if (this.role === 'student' && !this.university) {
      errors.push('University is required for students')
    }

    if (this.role === 'recruiter' && !this.company) {
      errors.push('Company is required for recruiters')
    }

    if (this.role === 'university' && !this.department) {
      errors.push('Department is required for university staff')
    }

    return errors
  }
}

module.exports = User