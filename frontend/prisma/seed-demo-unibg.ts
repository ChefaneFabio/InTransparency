/**
 * Seed script: Create demo data for Università degli Studi di Bergamo
 * Run: npx tsx prisma/seed-demo-unibg.ts
 */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const UNIVERSITY_NAME = 'Università degli Studi di Bergamo'
const UNIVERSITY_SHORT = 'UniBG'

const DEGREES = [
  'Computer Science', 'Engineering', 'Economics', 'Law',
  'Psychology', 'Communications', 'Data Science', 'Business Administration',
]

const SKILLS_POOL = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL',
  'Machine Learning', 'Data Analysis', 'UI/UX Design', 'Figma',
  'Java', 'C++', 'Docker', 'AWS', 'Git', 'Agile', 'Project Management',
  'Digital Marketing', 'SEO', 'Public Speaking', 'Excel', 'Power BI',
  'Financial Analysis', 'Contract Law', 'GDPR', 'Statistical Modeling',
]

const COMPANIES = [
  'Brembo', 'ABB Italy', 'Tenaris Dalmine', 'Italcementi',
  'Gewiss', 'Radici Group', 'Lovato Electric', 'Persico Group',
  'Schneider Electric', 'Siemens Italy', 'Accenture Milano',
  'Reply', 'NTT Data', 'Capgemini', 'Deloitte',
  'Amazon Italy', 'Google Zurich', 'McKinsey', 'BCG', 'Pirelli',
]

const INDUSTRIES = [
  'Technology', 'Manufacturing', 'Consulting', 'Finance',
  'Automotive', 'Energy', 'Healthcare', 'Legal', 'Marketing',
]

const PROJECT_TITLES = [
  'AI-Powered Demand Forecasting for Manufacturing',
  'Blockchain-Based Supply Chain Traceability System',
  'Mobile App for Campus Event Management',
  'Predictive Maintenance Dashboard using IoT Sensors',
  'NLP Analysis of Italian Legal Documents',
  'E-commerce Platform with Recommendation Engine',
  'Sustainable Energy Monitoring Dashboard',
  'Real-time Chat Application with WebSocket',
  'Automated Financial Report Generator',
  'Machine Learning Model for Credit Risk Assessment',
  'Augmented Reality Navigation for Campus',
  'Social Media Sentiment Analysis Tool',
  'Smart Parking System with Computer Vision',
  'Digital Twin for Industrial Processes',
  'Inventory Optimization Algorithm',
  'Patient Health Monitoring Mobile App',
  'Automated Resume Screening System',
  'Cross-platform Expense Tracker',
  'Climate Data Visualization Platform',
  'Smart Contract for University Certificates',
  'Fraud Detection in Banking Transactions',
  'Robotic Process Automation for HR',
  'Microservices Architecture for E-learning',
  'Geospatial Analysis of Urban Mobility',
  'Voice Assistant for Customer Support',
]

const FIRST_NAMES = [
  'Marco', 'Giulia', 'Alessandro', 'Francesca', 'Luca', 'Chiara',
  'Matteo', 'Sara', 'Andrea', 'Valentina', 'Lorenzo', 'Elena',
  'Federico', 'Martina', 'Davide', 'Sofia', 'Simone', 'Anna',
  'Riccardo', 'Laura', 'Nicola', 'Alice', 'Stefano', 'Beatrice',
  'Giovanni', 'Elisa', 'Pietro', 'Camilla', 'Filippo', 'Giada',
  'Roberto', 'Silvia', 'Paolo', 'Claudia', 'Giacomo', 'Federica',
  'Tommaso', 'Irene', 'Diego', 'Marta', 'Emanuele', 'Lucia',
  'Antonio', 'Veronica', 'Michele', 'Arianna', 'Daniele', 'Greta',
]

const LAST_NAMES = [
  'Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano',
  'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno', 'Gallo',
  'Conti', 'De Luca', 'Mancini', 'Costa', 'Giordano', 'Rizzo',
  'Lombardi', 'Moretti', 'Barbieri', 'Fontana', 'Santoro', 'Mariani',
]

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
const pickN = <T>(arr: T[], n: number): T[] => {
  const shuffled = Array.from(arr).sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
const randomDate = (daysAgo: number) => {
  const d = new Date()
  d.setDate(d.getDate() - Math.floor(Math.random() * daysAgo))
  return d
}

async function main() {
  console.log('🎓 Seeding demo data for UniBG...\n')

  const passwordHash = await bcrypt.hash('demo2024!', 10)

  // ── 1. Create university admin user ───────────────────────────
  const uniAdmin = await prisma.user.upsert({
    where: { email: 'unibg@unibg.it' },
    update: {},
    create: {
      email: 'unibg@unibg.it',
      passwordHash,
      role: 'UNIVERSITY',
      firstName: 'Career Service',
      lastName: 'UniBG',
      company: UNIVERSITY_NAME,
      university: UNIVERSITY_NAME,
      emailVerified: true,
      profilePublic: true,
      bio: 'Ufficio Career Service dell\'Università degli Studi di Bergamo. Supportiamo studenti e laureati nel percorso verso il mondo del lavoro.',
      location: 'Bergamo, Italy',
    },
  })
  console.log(`✅ University admin: ${uniAdmin.email} (${uniAdmin.id})`)

  // ── 2. Create university settings ─────────────────────────────
  await prisma.universitySettings.upsert({
    where: { userId: uniAdmin.id },
    update: {},
    create: {
      userId: uniAdmin.id,
      name: UNIVERSITY_NAME,
      shortName: UNIVERSITY_SHORT,
      city: 'Bergamo',
      region: 'Lombardia',
      country: 'IT',
      website: 'https://www.unibg.it',
      email: 'info@in-transparency.com',
      phone: '+39 035 2052111',
      description: 'Università pubblica fondata nel 1968. 7 dipartimenti, 24.000 studenti, forte legame con il tessuto industriale bergamasco.',
      institutionType: 'university',
    },
  })
  console.log('✅ University settings created')

  // ── 3. Create 45 students ─────────────────────────────────────
  const studentIds: string[] = []
  for (let i = 0; i < 45; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length]
    const lastName = LAST_NAMES[i % LAST_NAMES.length]
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@studenti.unibg.it`
    const degree = pick(DEGREES)
    const skills = pickN(SKILLS_POOL, randomInt(3, 8))
    const gradYear = String(randomInt(2024, 2027))
    const gpa = (randomInt(22, 30) + randomInt(0, 9) / 10).toFixed(1)
    const daysAgoLogin = randomInt(0, 60)

    const student = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        passwordHash,
        role: 'STUDENT',
        firstName,
        lastName,
        university: UNIVERSITY_NAME,
        degree,
        graduationYear: gradYear,
        gpa: gpa,
        gpaPublic: Math.random() > 0.3,
        skills,
        bio: `Studente di ${degree} presso UniBG. Appassionato di ${skills.slice(0, 2).join(' e ')}.`,
        location: pick(['Bergamo', 'Milano', 'Brescia', 'Lecco', 'Como']),
        emailVerified: Math.random() > 0.15,
        profilePublic: Math.random() > 0.2,
        lastLoginAt: randomDate(daysAgoLogin),
        interests: pickN(['Startup', 'Research', 'Consulting', 'Product Management', 'Data Science', 'UX Design'], randomInt(1, 3)),
      },
    })
    studentIds.push(student.id)
  }
  console.log(`✅ ${studentIds.length} students created`)

  // ── 4. Create courses ─────────────────────────────────────────
  const courseData = [
    { name: 'Algorithms and Data Structures', code: 'CS201', credits: 9, department: 'Computer Science' },
    { name: 'Machine Learning', code: 'CS401', credits: 6, department: 'Computer Science' },
    { name: 'Database Systems', code: 'CS301', credits: 9, department: 'Computer Science' },
    { name: 'Software Engineering', code: 'CS302', credits: 9, department: 'Computer Science' },
    { name: 'Web Development', code: 'CS310', credits: 6, department: 'Computer Science' },
    { name: 'Microeconomics', code: 'EC101', credits: 9, department: 'Economics' },
    { name: 'Corporate Finance', code: 'EC301', credits: 6, department: 'Economics' },
    { name: 'Business Strategy', code: 'BA201', credits: 9, department: 'Business Administration' },
    { name: 'Marketing Analytics', code: 'BA301', credits: 6, department: 'Business Administration' },
    { name: 'Civil Law', code: 'LAW101', credits: 12, department: 'Law' },
    { name: 'Digital Communications', code: 'COM201', credits: 6, department: 'Communications' },
    { name: 'Statistical Methods', code: 'DS201', credits: 9, department: 'Data Science' },
  ]

  for (const c of courseData) {
    await prisma.course.upsert({
      where: { id: `demo-${c.code}` },
      update: {},
      create: {
        id: `demo-${c.code}`,
        university: UNIVERSITY_NAME,
        courseName: c.name,
        courseCode: c.code,
        credits: c.credits,
        department: c.department,
        semester: pick(['Fall 2025', 'Spring 2026']),
        academicYear: '2025-2026',
        professorName: `Prof. ${pick(LAST_NAMES)}`,
        competencies: pickN(['Critical Thinking', 'Problem Solving', 'Teamwork', 'Communication', 'Technical Writing', 'Research'], 3),
        learningOutcomes: [`Understand ${c.name.toLowerCase()} fundamentals`, `Apply concepts to real-world problems`, `Work in teams on projects`],
      },
    })
  }
  console.log(`✅ ${courseData.length} courses created`)

  // ── 5. Create projects for students ───────────────────────────
  let projectCount = 0
  for (const studentId of studentIds) {
    const numProjects = randomInt(0, 4)
    for (let p = 0; p < numProjects; p++) {
      const title = pick(PROJECT_TITLES)
      const verified = Math.random() > 0.3
      await prisma.project.create({
        data: {
          userId: studentId,
          title,
          description: `This project explores ${title.toLowerCase()}. It was developed as part of a university course at UniBG, combining theoretical knowledge with practical implementation. The project demonstrates skills in ${pickN(SKILLS_POOL, 3).join(', ')}.`,
          skills: pickN(SKILLS_POOL, randomInt(2, 5)),
          discipline: pick(['TECHNOLOGY', 'ENGINEERING', 'BUSINESS', 'DESIGN', 'SCIENCE']),
          verificationStatus: verified ? 'VERIFIED' : pick(['PENDING', 'NEEDS_INFO']),
          verifiedBy: verified ? uniAdmin.id : null,
          verifiedAt: verified ? randomDate(90) : null,
          grade: Math.random() > 0.4 ? `${randomInt(24, 30)}/30` : null,
          isPublic: true,
          createdAt: randomDate(180),
        },
      })
      projectCount++
    }
  }
  console.log(`✅ ${projectCount} projects created`)

  // ── 6. Create recruiter companies with profile views ──────────
  const recruiterIds: string[] = []
  for (let r = 0; r < 15; r++) {
    const company = COMPANIES[r]
    const recruiter = await prisma.user.upsert({
      where: { email: `hr@${company.toLowerCase().replace(/\s+/g, '')}.demo` },
      update: {},
      create: {
        email: `hr@${company.toLowerCase().replace(/\s+/g, '')}.demo`,
        passwordHash,
        role: 'RECRUITER',
        firstName: pick(FIRST_NAMES),
        lastName: pick(LAST_NAMES),
        company,
        jobTitle: pick(['HR Manager', 'Talent Acquisition', 'Recruiter', 'Head of HR']),
        emailVerified: true,
        profilePublic: true,
      },
    })
    recruiterIds.push(recruiter.id)

    // Create profile views
    const viewedStudents = pickN(studentIds, randomInt(3, 15))
    for (const studentId of viewedStudents) {
      await prisma.profileView.create({
        data: {
          profileUserId: studentId,
          viewerId: recruiter.id,
          viewerRole: 'RECRUITER',
          viewerCompany: company,
          createdAt: randomDate(60),
        },
      })
    }

    // Create some contacts
    if (Math.random() > 0.4) {
      const contactedStudents = pickN(viewedStudents, randomInt(1, 3))
      for (const studentId of contactedStudents) {
        await prisma.contactUsage.create({
          data: {
            recruiterId: recruiter.id,
            recipientId: studentId,
            billingPeriodStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            billingPeriodEnd: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
            createdAt: randomDate(45),
          },
        })
      }
    }
  }
  console.log(`✅ ${recruiterIds.length} recruiter companies with views and contacts`)

  // ── 7. Create placements ──────────────────────────────────────
  const placedStudents = pickN(studentIds, 12)
  for (const studentId of placedStudents) {
    const company = pick(COMPANIES)
    await prisma.placement.create({
      data: {
        studentId,
        universityName: UNIVERSITY_NAME,
        companyName: company,
        jobTitle: pick(['Junior Developer', 'Data Analyst', 'Business Analyst', 'Marketing Specialist', 'Consultant', 'Software Engineer']),
        status: 'CONFIRMED',
        salaryAmount: randomInt(24000, 38000),
        salaryCurrency: 'EUR',
        startDate: randomDate(120),
        companyIndustry: pick(INDUSTRIES),
      },
    })
  }
  console.log(`✅ ${placedStudents.length} placements created`)

  // ── 8. Create alumni records ──────────────────────────────────
  const alumniStudents = pickN(studentIds, 15)
  for (const studentId of alumniStudents) {
    const employed = Math.random() > 0.2
    await prisma.alumniRecord.upsert({
      where: { userId: studentId },
      update: {},
      create: {
        userId: studentId,
        universityName: UNIVERSITY_NAME,
        graduationYear: String(randomInt(2020, 2025)),
        degree: pick(DEGREES),
        department: pick(['Computer Science', 'Economics', 'Engineering', 'Law']),
        employmentStatus: employed ? 'EMPLOYED' : pick(['SEEKING', 'FURTHER_STUDY']),
        currentCompany: employed ? pick(COMPANIES) : null,
        currentRole: employed ? pick(['Software Engineer', 'Data Analyst', 'Consultant', 'Product Manager', 'Marketing Lead']) : null,
        currentIndustry: employed ? pick(INDUSTRIES) : null,
        salary: employed ? randomInt(26000, 45000) : null,
        salaryCurrency: 'EUR',
        location: employed ? pick(['Milano', 'Bergamo', 'Roma', 'Torino', 'Zurigo', 'Londra']) : null,
      },
    })
  }
  console.log(`✅ ${alumniStudents.length} alumni records created`)

  // ── 9. Create sync logs ───────────────────────────────────────
  for (let s = 0; s < 8; s++) {
    await prisma.universitySyncLog.create({
      data: {
        universityId: uniAdmin.id,
        universityName: UNIVERSITY_NAME,
        syncType: pick(['MANUAL', 'SCHEDULED']),
        dataType: pick(['STUDENTS', 'COURSES', 'PROJECTS']),
        status: Math.random() > 0.15 ? 'SUCCESS' : 'FAILED',
        recordsProcessed: randomInt(10, 200),
        recordsCreated: randomInt(0, 20),
        recordsUpdated: randomInt(0, 50),
        recordsFailed: Math.random() > 0.8 ? randomInt(1, 5) : 0,
        triggeredBy: uniAdmin.id,
        completedAt: randomDate(30),
      },
    })
  }
  console.log('✅ 8 sync logs created')

  console.log('\n🎉 Demo seed complete!')
  console.log(`\n📧 Login: unibg@unibg.it`)
  console.log(`🔑 Password: demo2024!`)
  console.log(`\nData created:`)
  console.log(`   45 students`)
  console.log(`   ${projectCount} projects`)
  console.log(`   ${courseData.length} courses`)
  console.log(`   15 recruiter companies with profile views`)
  console.log(`   12 confirmed placements`)
  console.log(`   15 alumni records`)
  console.log(`   8 sync logs`)
}

main()
  .catch(e => { console.error('❌ Seed failed:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
