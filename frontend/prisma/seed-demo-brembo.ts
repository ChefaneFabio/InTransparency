/**
 * Seed: Brembo S.p.A. company demo
 * Run: npx tsx prisma/seed-demo-brembo.ts
 *
 * Creates a fully populated recruiter account with:
 * - 5 job postings (active + filled)
 * - Applications across multiple months and statuses
 * - Pipeline with candidates at every stage
 * - Message conversations with realistic threads
 * - Profile views across UniBG + Cattolica students
 * - Decision packs for shortlisted candidates
 */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const prisma = new PrismaClient()
const slug = () => crypto.randomBytes(8).toString('hex')
const pick = <T>(a: T[]): T => a[Math.floor(Math.random() * a.length)]
const pickN = <T>(a: T[], n: number): T[] => Array.from(a).sort(() => Math.random() - 0.5).slice(0, n)
const ri = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
const rd = (daysAgo: number) => {
  const d = new Date()
  d.setDate(d.getDate() - Math.floor(Math.random() * daysAgo))
  return d
}
const monthsAgo = (n: number) => {
  const d = new Date()
  d.setMonth(d.getMonth() - n)
  d.setDate(ri(1, 28))
  return d
}

async function main() {
  console.log('Seeding Brembo demo account...\n')
  const pw = await bcrypt.hash('demo2024!', 10)

  // ── Recruiter ──
  const recruiter = await prisma.user.upsert({
    where: { email: 'demo@brembo.it' },
    update: {},
    create: {
      email: 'demo@brembo.it',
      passwordHash: pw,
      role: 'RECRUITER',
      firstName: 'Laura',
      lastName: 'Marchetti',
      company: 'Brembo S.p.A.',
      jobTitle: 'Head of Talent Acquisition',
      emailVerified: true,
      profilePublic: true,
      bio: 'Leading talent acquisition at Brembo. We hire 200+ graduates per year across engineering, data, and business roles from Italian and European universities.',
      location: 'Stezzano (BG), Italy',
    },
  })
  console.log(`Recruiter: ${recruiter.email}`)

  await prisma.recruiterSettings.upsert({
    where: { userId: recruiter.id },
    update: {},
    create: {
      userId: recruiter.id,
      companyName: 'Brembo S.p.A.',
      companyWebsite: 'https://www.brembo.com',
      companyIndustry: 'manufacturing',
      companySize: '10000+',
      companyLocation: 'Stezzano (BG), Italy',
      companyDescription: 'Brembo is a global leader in braking systems for automotive, motorcycle, and industrial applications. Founded in 1961 in Bergamo, we design and manufacture disc brakes, calipers, and related components for the world\'s leading vehicle manufacturers.',
    },
  })

  // ── Get students from both universities ──
  const students = await prisma.user.findMany({
    where: {
      role: 'STUDENT',
      profilePublic: true,
      OR: [
        { university: 'Università degli Studi di Bergamo' },
        { university: 'Università Cattolica del Sacro Cuore' },
      ],
    },
    select: { id: true, email: true, firstName: true, lastName: true, university: true, skills: true },
    take: 50,
  })

  if (students.length === 0) {
    console.log('No students found. Run seed-demo-unibg.ts and seed Cattolica first.')
    return
  }
  console.log(`Found ${students.length} students across universities`)

  // ── 5 Job postings ──
  const jobDefs = [
    {
      title: 'Junior Mechanical Engineer - R&D Braking Systems',
      type: 'FULL_TIME' as const, loc: 'Stezzano (BG), Italy', wl: 'ON_SITE' as const,
      desc: 'Design and validate next-generation braking components for premium automotive OEMs. You will use CAD/CAE tools daily, run FEM simulations, participate in prototype testing on our dynamometer rigs, and collaborate with manufacturing engineering to ensure producibility. This role offers direct exposure to Formula 1 and MotoGP technology transfer projects.',
      reqs: 'Solid understanding of mechanical design, material science (cast iron, carbon-ceramic composites), and thermal analysis. Familiarity with DFMEA methodology.',
      skills: ['SolidWorks', 'ANSYS', 'MATLAB', 'FEM Analysis', 'CAD', 'Mechanical Design'],
      pref: ['Python', 'GD&T', 'Six Sigma'],
      edu: "Master's in Mechanical or Materials Engineering", exp: '0-2 years',
      salMin: 30000, salMax: 36000, period: 'yearly',
    },
    {
      title: 'Data Analyst - Manufacturing Intelligence',
      type: 'FULL_TIME' as const, loc: 'Stezzano (BG), Italy', wl: 'HYBRID' as const,
      desc: 'Join our Industry 4.0 team to turn production data into actionable insights. You will build real-time dashboards for plant managers, develop predictive models for quality control, and automate reporting pipelines across our 24 manufacturing sites worldwide.',
      reqs: 'Strong SQL and Python skills. Experience with BI tools. Statistical thinking and ability to communicate findings to non-technical stakeholders.',
      skills: ['Python', 'SQL', 'Power BI', 'Data Analysis', 'Statistical Modeling'],
      pref: ['Machine Learning', 'Tableau', 'Apache Spark', 'Azure'],
      edu: "Bachelor's or Master's in Data Science, Statistics, or Engineering", exp: '0-1 years',
      salMin: 28000, salMax: 33000, period: 'yearly',
    },
    {
      title: 'Digital Marketing Specialist - Employer Branding',
      type: 'FULL_TIME' as const, loc: 'Milano, Italy', wl: 'HYBRID' as const,
      desc: 'Own Brembo\'s employer brand across digital channels. Create content that attracts top engineering and business talent from Italian and European universities. Manage our LinkedIn, Instagram, and TikTok employer pages. Plan and execute university recruitment events and career fairs.',
      reqs: 'Portfolio of content marketing work. Understanding of paid social, SEO, and analytics. Native Italian, fluent English.',
      skills: ['Digital Marketing', 'Content Writing', 'Social Media Management', 'Adobe Creative Suite', 'SEO'],
      pref: ['Video Editing', 'Google Analytics', 'Employer Branding'],
      edu: "Bachelor's in Communications, Marketing, or Digital Media", exp: '1-2 years',
      salMin: 27000, salMax: 32000, period: 'yearly',
    },
    {
      title: 'Business Analyst Intern - Strategy & M&A',
      type: 'INTERNSHIP' as const, loc: 'Stezzano (BG), Italy', wl: 'ON_SITE' as const,
      desc: 'Support the corporate strategy team on market analysis, competitor benchmarking, and M&A due diligence projects. You will build financial models, prepare board presentations, and gain direct exposure to C-suite decision-making in a Fortune 500 automotive supplier.',
      reqs: 'Strong Excel and PowerPoint skills. Analytical mindset. Interest in automotive industry and corporate finance.',
      skills: ['Excel', 'Financial Analysis', 'PowerPoint', 'Research', 'Data Analysis'],
      pref: ['Bloomberg Terminal', 'Valuation', 'M&A'],
      edu: 'Enrolled in Economics, Finance, or Business Administration', exp: 'No experience required',
      salMin: 800, salMax: 1000, period: 'monthly',
    },
    {
      title: 'Software Engineer - Embedded Systems (Filled)',
      type: 'FULL_TIME' as const, loc: 'Stezzano (BG), Italy', wl: 'ON_SITE' as const,
      desc: 'Develop embedded firmware for next-generation brake-by-wire systems. Work with real-time operating systems, CAN/FlexRay protocols, and safety-critical software development following ISO 26262.',
      reqs: 'C/C++ proficiency. Understanding of embedded systems architecture and RTOS. Awareness of functional safety standards.',
      skills: ['C++', 'C', 'Embedded Systems', 'RTOS', 'CAN Bus'],
      pref: ['ISO 26262', 'AUTOSAR', 'Git'],
      edu: "Master's in Computer Engineering or Embedded Systems", exp: '0-2 years',
      salMin: 32000, salMax: 38000, period: 'yearly',
    },
  ]

  const jobIds: string[] = []
  for (let j = 0; j < jobDefs.length; j++) {
    const def = jobDefs[j]
    const isLast = j === jobDefs.length - 1
    const job = await prisma.job.create({
      data: {
        recruiterId: recruiter.id,
        companyName: 'Brembo S.p.A.',
        companyIndustry: 'Automotive / Manufacturing',
        companySize: '10000+',
        slug: slug(),
        title: def.title,
        description: def.desc,
        requirements: def.reqs,
        jobType: def.type,
        workLocation: def.wl,
        location: def.loc,
        requiredSkills: def.skills,
        preferredSkills: def.pref,
        education: def.edu,
        experience: def.exp,
        salaryMin: def.salMin,
        salaryMax: def.salMax,
        salaryCurrency: 'EUR',
        salaryPeriod: def.period,
        showSalary: true,
        status: isLast ? 'FILLED' : 'ACTIVE',
        isPublic: true,
        expiresAt: new Date(2026, 8, 30),
        createdAt: monthsAgo(isLast ? 4 : ri(0, 2)),
      },
    })
    jobIds.push(job.id)
  }
  console.log(`${jobIds.length} job postings`)

  // ── Applications spread across months and statuses ──
  const appStatuses = ['PENDING', 'PENDING', 'REVIEWED', 'REVIEWED', 'SHORTLISTED', 'INTERVIEW', 'INTERVIEW', 'OFFER', 'ACCEPTED', 'REJECTED', 'REJECTED']
  let appCount = 0
  for (const jobId of jobIds) {
    const applicants = pickN(students, ri(8, 18))
    for (const s of applicants) {
      try {
        const status = pick(appStatuses)
        const createdMonthsAgo = ri(0, 5)
        await prisma.application.create({
          data: {
            jobId,
            applicantId: s.id,
            status,
            createdAt: monthsAgo(createdMonthsAgo),
          },
        })
        appCount++
      } catch { /* duplicate, skip */ }
    }
  }
  console.log(`${appCount} applications (spread across 6 months, varied statuses)`)

  // ── Profile views across both universities ──
  const viewedStudents = pickN(students, 35)
  let viewCount = 0
  for (const s of viewedStudents) {
    const numViews = ri(1, 4)
    for (let v = 0; v < numViews; v++) {
      await prisma.profileView.create({
        data: {
          profileUserId: s.id,
          viewerId: recruiter.id,
          viewerRole: 'RECRUITER',
          viewerCompany: 'Brembo S.p.A.',
          createdAt: rd(ri(1, 90)),
        },
      })
      viewCount++
    }
  }
  console.log(`${viewCount} profile views across ${viewedStudents.length} students`)

  // ── Pipeline candidates at every stage ──
  const pipelineMap = [
    ...pickN(viewedStudents, 3).map(s => ({ id: s.id, folder: 'hired', note: 'Excellent performance in technical interview. Strong SolidWorks skills confirmed. Offer accepted.', rating: 5 })),
    ...pickN(viewedStudents, 3).map(s => ({ id: s.id, folder: 'offered', note: 'Final round passed. Salary negotiation in progress.', rating: 4 })),
    ...pickN(viewedStudents, 4).map(s => ({ id: s.id, folder: 'interviewing', note: pick(['Technical interview scheduled for next week.', 'Completed first round. Moving to case study.', 'Panel interview with engineering team pending.']), rating: ri(3, 5) })),
    ...pickN(viewedStudents, 5).map(s => ({ id: s.id, folder: 'contacted', note: pick(['Initial outreach sent. Awaiting response.', 'Replied positively. Scheduling call.', 'Interested but evaluating other offers.', null]), rating: ri(3, 4) })),
    ...pickN(viewedStudents, 6).map(s => ({ id: s.id, folder: 'discovered', note: null, rating: ri(2, 4) })),
  ]

  const seenCandidates = new Set<string>()
  let pipeCount = 0
  for (const c of pipelineMap) {
    if (seenCandidates.has(c.id)) continue
    seenCandidates.add(c.id)
    await prisma.savedCandidate.upsert({
      where: { recruiterId_candidateId: { recruiterId: recruiter.id, candidateId: c.id } },
      update: { folder: c.folder, notes: c.note, rating: c.rating },
      create: {
        recruiterId: recruiter.id,
        candidateId: c.id,
        folder: c.folder,
        notes: c.note,
        rating: c.rating,
        tags: pickN(['engineering', 'data', 'marketing', 'high-priority', 'bergamo', 'milano', 'bilingual', 'available-now', 'strong-portfolio'], ri(1, 3)),
      },
    })
    pipeCount++
  }
  console.log(`${pipeCount} pipeline candidates (across all 5 stages)`)

  // ── Talent unlocks ──
  const unlockedStudents = pipelineMap.filter(c => c.folder !== 'discovered').slice(0, 12)
  const seenUnlocks = new Set<string>()
  let unlockCount = 0
  for (const c of unlockedStudents) {
    if (seenUnlocks.has(c.id)) continue
    seenUnlocks.add(c.id)
    await prisma.contactUsage.create({
      data: {
        recruiterId: recruiter.id,
        recipientId: c.id,
        billingPeriodStart: new Date(2026, 3, 1),
        billingPeriodEnd: new Date(2026, 3, 30),
        createdAt: rd(30),
      },
    })
    unlockCount++
  }
  console.log(`${unlockCount} talent unlocks`)

  // ── Message conversations ──
  const msgStudents = pipelineMap
    .filter(c => ['interviewing', 'offered', 'hired'].includes(c.folder))
    .slice(0, 5)
  const seenMsg = new Set<string>()

  const conversations = [
    {
      subject: 'Data Analyst opening at Brembo',
      messages: [
        { from: 'recruiter', text: 'I noticed your data analysis projects on InTransparency. We have an opening in our Manufacturing Intelligence team that could be a strong fit. The role involves building dashboards and predictive models for our production plants. Would you be open to a conversation?' },
        { from: 'student', text: 'Thank you for reaching out. I am very interested in the manufacturing intelligence space. I actually used similar techniques in my thesis on predictive maintenance. I would be happy to discuss further.' },
        { from: 'recruiter', text: 'That sounds like a great match. Could you join a 30-minute video call this Thursday at 15:00? I will send a Teams invite.' },
        { from: 'student', text: 'Thursday at 15:00 works for me. Looking forward to it.' },
      ],
    },
    {
      subject: 'Mechanical Engineering role - Brembo R&D',
      messages: [
        { from: 'recruiter', text: 'Your SolidWorks projects caught our attention. We are looking for a junior mechanical engineer to join our R&D team working on braking systems for premium OEMs. The role includes CAD design, FEM simulation, and prototype testing. Interested?' },
        { from: 'student', text: 'Absolutely. Brembo has been my target company since I started my engineering degree. I would welcome the opportunity to learn more about the role and the team.' },
        { from: 'recruiter', text: 'Great to hear. I have attached a detailed job description. Let me know your availability for a first interview next week.' },
      ],
    },
    {
      subject: 'Internship opportunity - Strategy team',
      messages: [
        { from: 'recruiter', text: 'I saw your economics thesis on market analysis and competitive benchmarking. Our strategy and M&A team is looking for an intern. It would involve financial modeling, competitor analysis, and support on acquisition projects. 6 months, compensated.' },
        { from: 'student', text: 'This sounds like an incredible opportunity. I have been following Brembo\'s recent acquisitions in the EV braking space. When would the internship start?' },
      ],
    },
  ]

  let msgCount = 0
  for (let i = 0; i < Math.min(conversations.length, msgStudents.length); i++) {
    const s = msgStudents[i]
    if (seenMsg.has(s.id)) continue
    seenMsg.add(s.id)
    const student = students.find(st => st.id === s.id)
    if (!student) continue
    const conv = conversations[i]
    let prevDate = rd(25)

    for (const msg of conv.messages) {
      const isRecruiter = msg.from === 'recruiter'
      await prisma.message.create({
        data: {
          senderId: isRecruiter ? recruiter.id : s.id,
          recipientId: isRecruiter ? s.id : recruiter.id,
          recipientEmail: isRecruiter ? student.email : recruiter.email,
          subject: conv.subject,
          content: msg.text,
          read: true,
          createdAt: prevDate,
        },
      })
      prevDate = new Date(prevDate.getTime() + ri(2, 24) * 3600000)
      msgCount++
    }
  }
  console.log(`${msgCount} messages across ${conversations.length} conversation threads`)

  console.log('\nBrembo demo seed complete.')
  console.log(`Login: demo@brembo.it / demo2024!`)
  console.log(`\nData: ${jobIds.length} jobs, ${appCount} applications, ${viewCount} views, ${pipeCount} pipeline, ${unlockCount} unlocks, ${msgCount} messages`)
}

main()
  .catch(e => { console.error('Seed failed:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
