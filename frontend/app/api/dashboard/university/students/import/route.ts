import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { sendWelcomeEmail } from '@/lib/email'

// Schema for validating each row in the CSV
const studentRowSchema = z.object({
  email: z.string().email('Invalid email format'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  course: z.string().optional(),
  year: z.string().optional(),
})

interface CSVRow {
  email: string
  first_name: string
  last_name: string
  course?: string
  year?: string
}

interface ImportError {
  row: number
  email?: string
  errors: string[]
}

interface ImportResult {
  success: number
  failed: number
  skipped: number
  errors: ImportError[]
  created: Array<{ email: string; name: string }>
}

function parseCSV(csvText: string): CSVRow[] {
  const lines = csvText.trim().split('\n')
  if (lines.length < 2) {
    throw new Error('CSV must have at least a header row and one data row')
  }

  const headerLine = lines[0].toLowerCase().trim()
  const headers = headerLine.split(',').map(h => h.trim().replace(/['"]/g, ''))

  // Validate required headers
  const requiredHeaders = ['email', 'first_name', 'last_name']
  for (const required of requiredHeaders) {
    if (!headers.includes(required)) {
      throw new Error(`Missing required header: ${required}`)
    }
  }

  const rows: CSVRow[] = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const values = parseCSVLine(line)
    const row: any = {}

    headers.forEach((header, index) => {
      row[header] = values[index]?.trim().replace(/['"]/g, '') || ''
    })

    rows.push(row as CSVRow)
  }

  return rows
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)

  return result
}

function generateTempPassword(): string {
  // Generate a random 12-character password
  return crypto.randomBytes(8).toString('base64').slice(0, 12)
}

/**
 * POST /api/dashboard/university/students/import
 * Process CSV file upload to import multiple students
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'UNIVERSITY' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - University role required' }, { status: 403 })
    }

    // Get the university name from the session user
    const universityUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        university: true,
        firstName: true,
        lastName: true,
      }
    })

    const universityName = universityUser?.university ||
      `${universityUser?.firstName || ''} ${universityUser?.lastName || ''}`.trim() ||
      'Unknown University'

    // Parse form data
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Check file type
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      return NextResponse.json({ error: 'File must be a CSV' }, { status: 400 })
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
    }

    // Read and parse CSV
    const csvText = await file.text()
    let rows: CSVRow[]

    try {
      rows = parseCSV(csvText)
    } catch (error: any) {
      return NextResponse.json({ error: error.message || 'Failed to parse CSV' }, { status: 400 })
    }

    if (rows.length === 0) {
      return NextResponse.json({ error: 'No data rows found in CSV' }, { status: 400 })
    }

    // Limit rows to prevent abuse
    if (rows.length > 1000) {
      return NextResponse.json({ error: 'Maximum 1000 students per import' }, { status: 400 })
    }

    const result: ImportResult = {
      success: 0,
      failed: 0,
      skipped: 0,
      errors: [],
      created: [],
    }

    // Check for existing emails in batch
    const emails = rows.map(r => r.email.toLowerCase())
    const existingUsers = await prisma.user.findMany({
      where: {
        email: {
          in: emails
        }
      },
      select: { email: true }
    })
    const existingEmails = new Set(existingUsers.map(u => u.email.toLowerCase()))

    // Process each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const rowNumber = i + 2 // Account for 0-indexing and header row

      // Validate row
      const validation = studentRowSchema.safeParse(row)
      if (!validation.success) {
        result.failed++
        result.errors.push({
          row: rowNumber,
          email: row.email,
          errors: validation.error.errors.map(e => e.message),
        })
        continue
      }

      const validRow = validation.data

      // Check for duplicate email
      if (existingEmails.has(validRow.email.toLowerCase())) {
        result.skipped++
        result.errors.push({
          row: rowNumber,
          email: validRow.email,
          errors: ['Email already exists in the system'],
        })
        continue
      }

      // Generate password and hash
      const tempPassword = generateTempPassword()
      const passwordHash = await bcrypt.hash(tempPassword, 10)

      try {
        // Create student user
        await prisma.user.create({
          data: {
            email: validRow.email.toLowerCase(),
            passwordHash,
            role: 'STUDENT',
            firstName: validRow.first_name,
            lastName: validRow.last_name,
            university: universityName,
            degree: validRow.course || null,
            graduationYear: validRow.year || null,
            emailVerified: false,
            profilePublic: false, // Private until they complete setup
          }
        })

        result.success++
        result.created.push({
          email: validRow.email,
          name: `${validRow.first_name} ${validRow.last_name}`,
        })

        // Add to existing set to prevent duplicates within same import
        existingEmails.add(validRow.email.toLowerCase())

        // Send welcome email with temp password
        try {
          await sendWelcomeEmail(validRow.email, tempPassword, universityName)
        } catch (emailError) {
          console.error(`Failed to send welcome email to ${validRow.email}:`, emailError)
        }

      } catch (error: any) {
        result.failed++
        result.errors.push({
          row: rowNumber,
          email: validRow.email,
          errors: [error.message || 'Failed to create user'],
        })
      }
    }

    return NextResponse.json({
      success: result.success,
      failed: result.failed,
      skipped: result.skipped,
      total: rows.length,
      errors: result.errors.slice(0, 50), // Limit error details
      message: `Successfully imported ${result.success} students. ${result.skipped} skipped (duplicates). ${result.failed} failed.`,
    })

  } catch (error: any) {
    console.error('CSV import error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process import' },
      { status: 500 }
    )
  }
}
