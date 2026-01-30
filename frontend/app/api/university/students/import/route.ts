import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import crypto from 'crypto'

// CSV parsing helper
function parseCSV(csvString: string): Record<string, string>[] {
  const lines = csvString.trim().split('\n')
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  const rows: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    const row: Record<string, string> = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    rows.push(row)
  }

  return rows
}

// Validate student row
function validateStudentRow(row: Record<string, string>, index: number): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!row.email || !row.email.includes('@')) {
    errors.push(`Row ${index + 1}: Invalid or missing email`)
  }

  if (!row.firstname && !row.first_name && !row.name) {
    errors.push(`Row ${index + 1}: Missing first name`)
  }

  if (!row.lastname && !row.last_name && !row.surname) {
    errors.push(`Row ${index + 1}: Missing last name`)
  }

  return { valid: errors.length === 0, errors }
}

// POST /api/university/students/import - Import students from CSV
export async function POST(request: NextRequest) {
  try {
    // Get university from API key or session
    const apiKey = request.headers.get('x-api-key')
    const universityId = request.headers.get('x-university-id')

    let university

    if (apiKey) {
      university = await prisma.university.findUnique({
        where: { apiKey }
      })
    } else if (universityId) {
      // For session-based auth (dashboard)
      university = await prisma.university.findUnique({
        where: { id: universityId }
      })
    }

    if (!university) {
      return NextResponse.json(
        { error: 'University not authenticated' },
        { status: 401 }
      )
    }

    if (university.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'University not approved for imports' },
        { status: 403 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { csv, sendInvites = true } = body

    if (!csv) {
      return NextResponse.json(
        { error: 'CSV data required' },
        { status: 400 }
      )
    }

    // Parse CSV
    const rows = parseCSV(csv)

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'No valid data rows found in CSV' },
        { status: 400 }
      )
    }

    // Check student limit
    const currentCount = await prisma.universityStudent.count({
      where: { universityId: university.id }
    })

    if (currentCount + rows.length > university.maxStudents) {
      return NextResponse.json(
        { error: `Import would exceed maximum student limit (${university.maxStudents})` },
        { status: 400 }
      )
    }

    // Process rows
    const results = {
      total: rows.length,
      imported: 0,
      skipped: 0,
      errors: [] as string[]
    }

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]

      // Validate
      const validation = validateStudentRow(row, i)
      if (!validation.valid) {
        results.errors.push(...validation.errors)
        results.skipped++
        continue
      }

      // Normalize field names
      const email = row.email
      const firstName = row.firstname || row.first_name || row.name?.split(' ')[0] || ''
      const lastName = row.lastname || row.last_name || row.surname || row.name?.split(' ').slice(1).join(' ') || ''
      const studentId = row.studentid || row.student_id || row.id || email.split('@')[0]
      const program = row.program || row.course || row.major || null
      const department = row.department || row.dept || null
      const year = row.year ? parseInt(row.year) : null
      const expectedGraduation = row.graduation || row.expected_graduation || null

      try {
        // Check if student already exists
        const existing = await prisma.universityStudent.findFirst({
          where: {
            universityId: university.id,
            OR: [
              { email },
              { studentId }
            ]
          }
        })

        if (existing) {
          // Update existing student
          await prisma.universityStudent.update({
            where: { id: existing.id },
            data: {
              firstName,
              lastName,
              program,
              department,
              year,
              expectedGraduation,
              updatedAt: new Date()
            }
          })
          results.imported++
        } else {
          // Create new student
          const inviteToken = crypto.randomBytes(16).toString('hex')

          await prisma.universityStudent.create({
            data: {
              universityId: university.id,
              studentId,
              email,
              firstName,
              lastName,
              program,
              department,
              year,
              expectedGraduation,
              inviteToken,
              status: 'IMPORTED'
            }
          })
          results.imported++

          // TODO: Send invite email if sendInvites is true
          // if (sendInvites) {
          //   await sendStudentInviteEmail(email, inviteToken, university.name, firstName)
          // }
        }

      } catch (error: any) {
        if (error.code === 'P2002') {
          results.errors.push(`Row ${i + 1}: Duplicate student (${email})`)
        } else {
          results.errors.push(`Row ${i + 1}: ${error.message}`)
        }
        results.skipped++
      }
    }

    // Update university student count
    const newCount = await prisma.universityStudent.count({
      where: { universityId: university.id }
    })

    await prisma.university.update({
      where: { id: university.id },
      data: { studentCount: newCount }
    })

    console.log(`Import complete for ${university.name}: ${results.imported} imported, ${results.skipped} skipped`)

    return NextResponse.json({
      success: true,
      message: `Imported ${results.imported} students`,
      results
    })

  } catch (error) {
    console.error('Error importing students:', error)
    return NextResponse.json(
      { error: 'Failed to import students' },
      { status: 500 }
    )
  }
}

// GET /api/university/students/import - Get import template
export async function GET() {
  const template = {
    format: 'csv',
    headers: ['studentId', 'email', 'firstName', 'lastName', 'program', 'department', 'year', 'expectedGraduation'],
    example: 'STU001,mario.rossi@university.edu,Mario,Rossi,Computer Science,Engineering,3,2025',
    notes: [
      'email is required and must be a valid email address',
      'firstName and lastName are required',
      'studentId is optional (will use email prefix if not provided)',
      'program, department, year, expectedGraduation are optional',
      'Alternative header names accepted: first_name, last_name, student_id, graduation'
    ],
    sampleCSV: `studentId,email,firstName,lastName,program,department,year,expectedGraduation
STU001,mario.rossi@university.edu,Mario,Rossi,Computer Science,Engineering,3,2025
STU002,giulia.bianchi@university.edu,Giulia,Bianchi,Business Administration,Business,2,2026
STU003,luca.ferrari@university.edu,Luca,Ferrari,Data Science,Engineering,1,2027`
  }

  return NextResponse.json(template)
}
