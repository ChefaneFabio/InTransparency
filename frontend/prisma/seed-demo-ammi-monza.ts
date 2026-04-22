/**
 * Seed script: AMMI Monza ITS Academy (real identity).
 *
 * Fondazione ITS AMMI — "L'alternativa all'università".
 * Two campuses (Milano + Monza). Funded by Regione Lombardia + MIM.
 * Portfolio: 4 ITS tracks (Sport + Digital Marketing) + 3 IFTS tracks
 * (Sport Marketing, AI & Robotica, Web Design & App).
 *
 * Prepared for the 2026-04-21 call with Francesca Anedda (Responsabile tirocini).
 * Run: npx tsx prisma/seed-demo-ammi-monza.ts
 *
 * Login:    monza@ammi-monza.it
 * Password: demo2024!
 */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const INSTITUTION_NAME = 'AMMI Monza'
const INSTITUTION_FULL = 'Fondazione ITS AMMI'
const INSTITUTION_SHORT = 'AMMI'

// Real AMMI programmes, labelled by level (ITS = 2y, IFTS = 1y intensive).
const TRACKS: Array<{ name: string; level: 'ITS' | 'IFTS' }> = [
  { name: 'Digital Marketing Communication', level: 'ITS' },
  { name: 'Digital Marketing Content Creation', level: 'ITS' },
  { name: 'Football Management', level: 'ITS' },
  { name: 'Sport Management', level: 'ITS' },
  { name: 'Sport Marketing', level: 'IFTS' },
  { name: 'Intelligenza Artificiale & Robotica', level: 'IFTS' },
  { name: 'Web Design & App Creation', level: 'IFTS' },
]

// Skills that make sense per domain (used as base pool; we slice per track).
const SKILLS_BY_DOMAIN: Record<string, string[]> = {
  digitalMarketing: [
    'SEO', 'SEM', 'Google Ads', 'Meta Ads', 'Google Analytics 4',
    'HubSpot', 'Mailchimp', 'Content Strategy', 'Copywriting',
    'Adobe Photoshop', 'Adobe Illustrator', 'Adobe Premiere', 'Figma',
    'Brand Management', 'Corporate Communication', 'PR', 'Crisis Communication',
    'Social Media Management', 'Community Management', 'TikTok Ads',
    'Video Editing', 'Photography', 'Storytelling', 'Canva',
  ],
  sportManagement: [
    'Event Management', 'Sponsorship Activation', 'Licensing', 'Media Rights',
    'Ticketing', 'Fan Engagement', 'CRM Sportivo', 'Budget Management',
    'Gestione squadra', 'Sport Law (base)', 'Contract Negotiation',
    'Sport PR', 'Athlete Management', 'Match-day Operations',
  ],
  football: [
    'Scouting Analytics', 'Video Analysis', 'Wyscout', 'Hudl',
    'Performance Data', 'Match Analysis', 'Football Manager software',
    'Gestione settore giovanile', 'Tattica', 'Sport Science (base)',
  ],
  aiRobotics: [
    'Python', 'Machine Learning', 'Computer Vision', 'TensorFlow', 'PyTorch',
    'ROS (Robot Operating System)', 'C++', 'Arduino', 'Raspberry Pi',
    'Sensor Integration', 'IoT', 'OpenCV', 'Data Analysis', 'Jupyter',
  ],
  webDesign: [
    'Figma', 'Adobe XD', 'HTML', 'CSS', 'JavaScript', 'TypeScript',
    'React', 'Next.js', 'Vue', 'WordPress', 'Shopify',
    'iOS/Swift', 'Android/Kotlin', 'React Native', 'UX Research',
    'Prototyping', 'Responsive Design', 'Git', 'Figma Prototyping',
  ],
}

function skillsForTrack(track: string): string[] {
  if (track.startsWith('Digital Marketing')) return SKILLS_BY_DOMAIN.digitalMarketing
  if (track === 'Football Management') return [...SKILLS_BY_DOMAIN.football, ...SKILLS_BY_DOMAIN.sportManagement.slice(0, 5)]
  if (track === 'Sport Management') return SKILLS_BY_DOMAIN.sportManagement
  if (track === 'Sport Marketing') return [...SKILLS_BY_DOMAIN.sportManagement.slice(0, 8), ...SKILLS_BY_DOMAIN.digitalMarketing.slice(0, 6)]
  if (track.startsWith('Intelligenza Artificiale')) return SKILLS_BY_DOMAIN.aiRobotics
  if (track.startsWith('Web Design')) return SKILLS_BY_DOMAIN.webDesign
  return SKILLS_BY_DOMAIN.digitalMarketing
}

// Partner companies: realistic Lombardia-region fabric for the AMMI portfolio.
const COMPANIES_SPORT = [
  'AC Monza', 'AC Milan', 'FC Internazionale Milano',
  'Olimpia Milano', 'Pallacanestro Olimpia Milano',
  'Gazzetta dello Sport', 'DAZN Italia', 'Sky Sport',
  'Lega Serie A', 'FIGC', 'Federazione Italiana Rugby',
  'Technogym', 'Decathlon Italia', 'Diadora', 'Kappa', 'Freddy',
]
const COMPANIES_MARKETING = [
  'We Are Social Milano', 'Havas Milan', 'Ogilvy Milano',
  'Armando Testa', 'Publicis Italia', 'Wavemaker',
  'Accenture Song', 'Mediacom Italia', 'Zenith Italia',
  'Edelman Italia', 'Weber Shandwick Italia',
]
const COMPANIES_TECH = [
  'Bending Spoons', 'Satispay', 'Musement', 'Casavo',
  'Cortilia', 'ScalaPay', 'Prima Assicurazioni',
  'Leonardo', 'STMicroelectronics Agrate', 'Comau Robotics',
]

const PROJECT_TITLES_BY_TRACK: Record<string, string[]> = {
  'Digital Marketing Communication': [
    'Piano di comunicazione interna per azienda del settore food',
    'Crisis communication: gestione social di una crisi di brand',
    'Brand narrative per rebranding B2B del settore fashion',
    'Media relations per lancio prodotto consumer electronics',
    'Comunicazione corporate per merger tra PMI lombarde',
  ],
  'Digital Marketing Content Creation': [
    'Campagna TikTok per brand di sportswear emergente',
    'Video series YouTube per azienda di nutrizione sportiva',
    'Shooting fotografico e post-produzione per catalogo ecommerce',
    'Podcast production per media partner sport',
    'Content strategy Instagram per atleta professionista',
    'Reels campaign per lancio linea cosmetica',
  ],
  'Football Management': [
    'Analisi scouting settore giovanile su piattaforma Wyscout',
    'Match analysis con video software per Serie C',
    'Piano fan engagement per club di Lega Pro',
    'Match-day experience redesign per stadio di periferia',
    'Sponsorship deck per club femminile in crescita',
  ],
  'Sport Management': [
    'Business plan per palestra boutique in centro Milano',
    'Piano sponsorship per evento running cittadino',
    'Gestione stagione sportiva per team giovanile basket',
    'CRM per società sportiva di pallavolo',
    'Licensing merchandise per brand della federazione',
    'Analisi ticketing: revenue management per stadio medio',
  ],
  'Sport Marketing': [
    'Attivazione sponsor match-day Champions League',
    'Athlete management: gestione immagine atleta olimpico',
    'Partnership brand-team per sport emergente (pickleball)',
    'Campagna digitale per federazione sportiva',
  ],
  'Intelligenza Artificiale & Robotica': [
    'Sistema computer vision per analisi postura atleta',
    'Chatbot assistente per fan engagement in matchday',
    'ML model per predire infortuni muscolari',
    'Braccio robotico ROS + telemetria per lab didattico',
    'Visione artificiale per analisi tattica su video partita',
  ],
  'Web Design & App Creation': [
    'App mobile per prenotazione campi da padel',
    'Ecommerce Shopify per brand Made in Italy',
    'Landing page conversion-optimized per SaaS B2B',
    'UX redesign per sito istituzionale',
    'PWA per eventi sportivi itineranti',
    'iOS app per community di runner',
  ],
}

const FIRST_NAMES = [
  'Marco', 'Giulia', 'Alessandro', 'Francesca', 'Luca', 'Chiara',
  'Matteo', 'Sara', 'Andrea', 'Valentina', 'Lorenzo', 'Elena',
  'Federico', 'Martina', 'Davide', 'Sofia', 'Simone', 'Anna',
  'Riccardo', 'Laura', 'Nicola', 'Alice', 'Stefano', 'Beatrice',
  'Giovanni', 'Elisa', 'Pietro', 'Greta',
]
const LAST_NAMES = [
  'Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano',
  'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno', 'Gallo',
  'Conti', 'Mancini', 'Costa', 'Giordano', 'Rizzo', 'Lombardi',
  'Moretti', 'Barbieri', 'Fontana', 'Santoro', 'Mariani', 'Rinaldi',
]

const CAMPUSES = ['Monza', 'Milano']
const NEARBY = ['Monza', 'Milano', 'Lissone', 'Desio', 'Sesto San Giovanni', 'Brugherio']

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
const pickN = <T,>(arr: T[], n: number): T[] => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(n, arr.length))
}
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
const randomDate = (daysAgo: number) => {
  const d = new Date()
  d.setDate(d.getDate() - Math.floor(Math.random() * daysAgo))
  return d
}

async function main() {
  console.log(`\n🎓 Seeding demo data for ${INSTITUTION_NAME} (sport + marketing)...\n`)

  const passwordHash = await bcrypt.hash('demo2024!', 10)

  // ── 0. Wipe previous AMMI seed data so we re-seed cleanly ──────────────
  // Match anything tied to the AMMI identity — avoids stale mechatronics
  // projects/students left over from an earlier (wrong-domain) run.
  const staleStudents = await prisma.user.findMany({
    where: {
      OR: [
        { email: { endsWith: '@studenti.ammi-monza.it' } },
        { university: INSTITUTION_FULL },
      ],
      role: 'STUDENT',
    },
    select: { id: true },
  })
  const staleIds = staleStudents.map(s => s.id)
  if (staleIds.length) {
    await prisma.project.deleteMany({ where: { userId: { in: staleIds } } })
    await prisma.placement.deleteMany({ where: { studentId: { in: staleIds } } })
    await prisma.alumniRecord.deleteMany({ where: { userId: { in: staleIds } } })
    await prisma.profileView.deleteMany({ where: { profileUserId: { in: staleIds } } })
    await prisma.contactUsage.deleteMany({ where: { recipientId: { in: staleIds } } })
    await prisma.internshipDeal.deleteMany({ where: { studentId: { in: staleIds } } })
    await prisma.user.deleteMany({ where: { id: { in: staleIds } } })
    console.log(`🧹 Cleaned up ${staleIds.length} stale AMMI students + related records`)
  }
  // Also wipe deals owned by the AMMI admin so re-seed is clean
  const existingAdmin = await prisma.user.findUnique({ where: { email: 'monza@ammi-monza.it' }, select: { id: true } })
  if (existingAdmin) {
    await prisma.internshipDeal.deleteMany({ where: { ownerId: existingAdmin.id } })
  }

  // ── 1. Admin (Francesca Anedda — Responsabile tirocini) ───────────────
  const admin = await prisma.user.upsert({
    where: { email: 'monza@ammi-monza.it' },
    update: {
      firstName: 'Francesca',
      lastName: 'Anedda',
      jobTitle: 'Responsabile tirocini',
      university: INSTITUTION_FULL,
      company: INSTITUTION_FULL,
      bio: "Ufficio tirocini di Fondazione ITS AMMI. Coordiniamo gli stage per i corsi di Sport Management, Digital Marketing e i percorsi IFTS tra i campus di Milano e Monza.",
      location: 'Monza, Italy',
    },
    create: {
      email: 'monza@ammi-monza.it',
      passwordHash,
      role: 'UNIVERSITY',
      firstName: 'Francesca',
      lastName: 'Anedda',
      company: INSTITUTION_FULL,
      university: INSTITUTION_FULL,
      jobTitle: 'Responsabile tirocini',
      emailVerified: true,
      profilePublic: true,
      bio: "Ufficio tirocini di Fondazione ITS AMMI. Coordiniamo gli stage per i corsi di Sport Management, Digital Marketing e i percorsi IFTS tra i campus di Milano e Monza.",
      location: 'Monza, Italy',
    },
  })
  console.log(`✅ Admin: ${admin.email}`)

  await prisma.universitySettings.upsert({
    where: { userId: admin.id },
    update: {
      name: INSTITUTION_FULL,
      shortName: INSTITUTION_SHORT,
      city: 'Monza',
      region: 'Lombardia',
      country: 'IT',
      institutionType: 'its',
      description:
        "Accademia di eccellenza per l'alta formazione post-diploma nei settori dello sport, del marketing e del digitale. Due campus: Milano e Monza. Riconosciuta e finanziata da Regione Lombardia e MIM. Percorsi ITS biennali e IFTS annuali, con il 30-40% del monte ore in stage curriculare presso aziende partner.",
      website: 'https://www.ammi-monza.it',
    },
    create: {
      userId: admin.id,
      name: INSTITUTION_FULL,
      shortName: INSTITUTION_SHORT,
      city: 'Monza',
      region: 'Lombardia',
      country: 'IT',
      website: 'https://www.ammi-monza.it',
      email: 'info@in-transparency.com',
      phone: '+39 039 2000000',
      description:
        "Accademia di eccellenza per l'alta formazione post-diploma nei settori dello sport, del marketing e del digitale. Due campus: Milano e Monza. Riconosciuta e finanziata da Regione Lombardia e MIM. Percorsi ITS biennali e IFTS annuali, con il 30-40% del monte ore in stage curriculare presso aziende partner.",
      institutionType: 'its',
    },
  })
  console.log(`✅ UniversitySettings (institutionType=its, Sport + Marketing focus)`)

  // Flip the matching Institution to PREMIUM with mediation + offer approval
  // enabled so the full workspace (M1-M4) works end-to-end for this demo.
  await prisma.institution.upsert({
    where: { id: admin.id },
    update: {
      plan: 'PREMIUM',
      mediationEnabled: true,
      requireOfferApproval: true,
    },
    create: {
      id: admin.id,
      name: INSTITUTION_FULL,
      slug: `ammi-monza-${admin.id.slice(-8)}`,
      type: 'ITS',
      plan: 'PREMIUM',
      mediationEnabled: true,
      requireOfferApproval: true,
      city: 'Monza',
      region: 'Lombardia',
      country: 'IT',
      primaryAdminId: admin.id,
    },
  })
  console.log(`✅ Institution: PREMIUM plan, mediationEnabled=true, requireOfferApproval=true`)

  // Ensure admin is staff of this institution
  await prisma.institutionStaff.upsert({
    where: { userId_institutionId: { userId: admin.id, institutionId: admin.id } },
    update: { role: 'INSTITUTION_ADMIN' },
    create: {
      userId: admin.id,
      institutionId: admin.id,
      role: 'INSTITUTION_ADMIN',
      activatedAt: new Date(),
    },
  })

  // ── 2. Students — 35 across 7 real tracks ──────────────────────────────
  const studentIds: string[] = []
  for (let i = 0; i < 35; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length]
    const lastName = LAST_NAMES[i % LAST_NAMES.length]
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@studenti.ammi-monza.it`
    const track = TRACKS[i % TRACKS.length]
    const trackSkills = skillsForTrack(track.name)
    const skills = pickN(trackSkills, randomInt(5, 9))
    // ITS = 2-year, IFTS = 1-year. Grad year differs.
    const gradYear = String(track.level === 'ITS' ? randomInt(2025, 2027) : randomInt(2025, 2026))
    const gpa = (randomInt(24, 30) + randomInt(0, 9) / 10).toFixed(1) // Italian 30-scale

    const student = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        passwordHash,
        role: 'STUDENT',
        firstName,
        lastName,
        university: INSTITUTION_FULL,
        degree: `${track.name} (${track.level})`,
        graduationYear: gradYear,
        gpa,
        gpaPublic: Math.random() > 0.3,
        skills,
        bio: `Studente ${INSTITUTION_SHORT} ${track.level} — ${track.name}. Principali competenze: ${skills.slice(0, 3).join(', ')}.`,
        location: pick(NEARBY),
        emailVerified: Math.random() > 0.15,
        profilePublic: Math.random() > 0.2,
        lastLoginAt: randomDate(60),
        interests: pickN(['Sport', 'Marketing', 'Digital', 'Media', 'Social', 'Brand', 'Eventi', 'Tech', 'Startup'], randomInt(2, 4)),
      },
    })
    studentIds.push(student.id)

    // Active institutional affiliation — required for contactMode=MEDIATED.
    // Use deleteMany+create because the compound unique uses COALESCE at
    // the SQL layer (for nullable program support) which Prisma's upsert
    // can't match on.
    await prisma.institutionAffiliation.deleteMany({
      where: { studentId: student.id, institutionId: admin.id, program: track.name },
    })
    await prisma.institutionAffiliation.create({
      data: {
        studentId: student.id,
        institutionId: admin.id,
        program: track.name,
        status: 'ACTIVE',
        startDate: new Date(Date.now() - 180 * 86_400_000),
      },
    })
  }
  console.log(`✅ ${studentIds.length} students across ${TRACKS.length} real AMMI tracks (all affiliated ACTIVE)`)

  // ── 3. Projects (track-appropriate titles + skills) ────────────────────
  let projectCount = 0
  for (const studentId of studentIds) {
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: { degree: true, skills: true },
    })
    if (!student?.degree) continue
    // Extract track name from "Track Name (ITS)" / "Track Name (IFTS)"
    const trackName = student.degree.replace(/\s*\((ITS|IFTS)\)\s*$/, '')
    const titles = PROJECT_TITLES_BY_TRACK[trackName] || PROJECT_TITLES_BY_TRACK['Digital Marketing Communication']
    const n = randomInt(1, 3)
    for (let p = 0; p < n; p++) {
      const title = pick(titles)
      const verified = Math.random() > 0.25
      const projectSkills = pickN(student.skills ?? skillsForTrack(trackName), randomInt(3, 6))
      await prisma.project.create({
        data: {
          userId: studentId,
          title,
          description: `Progetto realizzato nel percorso AMMI (${trackName}) in collaborazione con un'azienda partner. Competenze sviluppate: ${projectSkills.slice(0, 4).join(', ')}. Valutato dal tutor didattico e dal tutor aziendale a fine stage.`,
          skills: projectSkills,
          technologies: pickN(projectSkills, 3),
          discipline: pick(['BUSINESS', 'DESIGN', 'MEDIA', 'TECHNOLOGY']),
          verificationStatus: verified ? 'VERIFIED' : pick(['PENDING', 'NEEDS_INFO']),
          verifiedBy: verified ? admin.id : null,
          verifiedAt: verified ? randomDate(90) : null,
          grade: Math.random() > 0.3 ? `${randomInt(26, 30)}/30` : null,
          isPublic: true,
          createdAt: randomDate(180),
        },
      })
      projectCount++
    }
  }
  console.log(`✅ ${projectCount} projects created (domain-matched to each track)`)

  // ── 4. Partner companies ───────────────────────────────────────────────
  const ALL_PARTNERS = [...COMPANIES_SPORT, ...COMPANIES_MARKETING, ...COMPANIES_TECH]
  const recruiterIds: { id: string; company: string }[] = []
  for (let r = 0; r < Math.min(18, ALL_PARTNERS.length); r++) {
    const company = ALL_PARTNERS[r]
    const slug = company.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    const recruiter = await prisma.user.upsert({
      where: { email: `hr@${slug}.demo` },
      update: { company },
      create: {
        email: `hr@${slug}.demo`,
        passwordHash,
        role: 'RECRUITER',
        firstName: pick(FIRST_NAMES),
        lastName: pick(LAST_NAMES),
        company,
        jobTitle: pick(['HR Manager', 'Talent Acquisition', 'Head of People', 'Recruiter', 'Responsabile Risorse Umane']),
        emailVerified: true,
        profilePublic: true,
      },
    })
    recruiterIds.push({ id: recruiter.id, company })

    const viewed = pickN(studentIds, randomInt(3, 10))
    for (const sid of viewed) {
      await prisma.profileView.create({
        data: {
          profileUserId: sid,
          viewerId: recruiter.id,
          viewerRole: 'RECRUITER',
          viewerCompany: company,
          createdAt: randomDate(60),
        },
      })
    }
  }
  console.log(`✅ ${recruiterIds.length} partner companies (sport + marketing + tech)`)

  // ── 5. Placements — ITS Academies have strong placement; 75% here ──────
  const placed = pickN(studentIds, Math.round(studentIds.length * 0.75))
  for (const sid of placed) {
    const student = await prisma.user.findUnique({ where: { id: sid }, select: { degree: true } })
    const trackName = (student?.degree || '').replace(/\s*\((ITS|IFTS)\)\s*$/, '')
    // Map track → realistic first-job titles + partner pool
    let company: string
    let jobTitle: string
    let industry: string
    if (trackName.startsWith('Digital Marketing')) {
      company = pick(COMPANIES_MARKETING.concat(COMPANIES_TECH.slice(0, 5)))
      jobTitle = pick(['Junior Content Creator', 'Junior Copywriter', 'Social Media Specialist', 'Digital PR Junior', 'Content Strategist Junior'])
      industry = 'Marketing & Communication'
    } else if (trackName === 'Football Management' || trackName === 'Sport Management' || trackName === 'Sport Marketing') {
      company = pick(COMPANIES_SPORT)
      jobTitle = pick(['Event Coordinator', 'Sponsorship Junior', 'Match-day Operations', 'Fan Engagement Junior', 'Scouting Assistant', 'Ticketing Specialist'])
      industry = 'Sport & Entertainment'
    } else if (trackName.startsWith('Intelligenza Artificiale')) {
      company = pick(COMPANIES_TECH)
      jobTitle = pick(['Junior Data Analyst', 'Junior ML Engineer', 'Robotics Technician', 'Computer Vision Junior'])
      industry = 'Tech'
    } else {
      company = pick(COMPANIES_TECH.concat(COMPANIES_MARKETING.slice(0, 3)))
      jobTitle = pick(['Junior Web Developer', 'UI Designer', 'iOS Developer Junior', 'Frontend Developer'])
      industry = 'Tech'
    }

    await prisma.placement.create({
      data: {
        studentId: sid,
        universityName: INSTITUTION_FULL,
        companyName: company,
        jobTitle,
        status: 'CONFIRMED',
        salaryAmount: randomInt(22000, 32000),
        salaryCurrency: 'EUR',
        startDate: randomDate(120),
        companyIndustry: industry,
      },
    })
  }
  console.log(`✅ ${placed.length} confirmed placements (75% of cohort)`)

  // ── 6. Alumni records ──────────────────────────────────────────────────
  const alumni = pickN(studentIds, 14)
  for (const sid of alumni) {
    const student = await prisma.user.findUnique({ where: { id: sid }, select: { degree: true } })
    const trackName = (student?.degree || '').replace(/\s*\((ITS|IFTS)\)\s*$/, '')
    const employed = Math.random() > 0.15

    let currentCompany: string | null = null
    let currentRole: string | null = null
    let industry: string | null = null
    if (employed) {
      if (trackName.startsWith('Digital Marketing')) {
        currentCompany = pick(COMPANIES_MARKETING)
        currentRole = pick(['Content Creator', 'Copywriter', 'Social Media Manager'])
        industry = 'Marketing'
      } else if (trackName.includes('Sport') || trackName === 'Football Management') {
        currentCompany = pick(COMPANIES_SPORT)
        currentRole = pick(['Sponsorship Manager Jr', 'Operations Coordinator', 'Fan Engagement Lead'])
        industry = 'Sport'
      } else {
        currentCompany = pick(COMPANIES_TECH)
        currentRole = pick(['Web Developer', 'Data Analyst', 'UX Designer'])
        industry = 'Tech'
      }
    }

    await prisma.alumniRecord.upsert({
      where: { userId: sid },
      update: {},
      create: {
        userId: sid,
        universityName: INSTITUTION_FULL,
        graduationYear: String(randomInt(2022, 2025)),
        degree: trackName,
        department: pick(['Sport', 'Marketing', 'Digital', 'Tech']),
        employmentStatus: employed ? 'EMPLOYED' : pick(['SEEKING', 'FURTHER_STUDY']),
        currentCompany,
        currentRole,
        currentIndustry: industry,
        salary: employed ? randomInt(24000, 38000) : null,
        salaryCurrency: 'EUR',
        location: employed ? pick(NEARBY) : null,
      },
    })
  }
  console.log(`✅ ${alumni.length} alumni records (~85% employed)`)

  // ── 7. Recruiter contacts ──────────────────────────────────────────────
  let contactCount = 0
  for (const rec of recruiterIds) {
    if (Math.random() > 0.5) {
      const contacted = pickN(studentIds, randomInt(1, 3))
      for (const sid of contacted) {
        await prisma.contactUsage.create({
          data: {
            recruiterId: rec.id,
            recipientId: sid,
            billingPeriodStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            billingPeriodEnd: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
            createdAt: randomDate(45),
          },
        })
        contactCount++
      }
    }
  }
  console.log(`✅ ${contactCount} recruiter→student contacts`)

  // ── 8. Internship deals — HubSpot-style pipeline for Francesca ─────────
  // 20 deals distributed across the 6 active stages so the kanban is full
  // on day one without requiring the backfill path.
  const DEAL_DISTRIBUTION: Array<{ stage: 'LEAD' | 'CONVENZIONE' | 'MATCHING' | 'ATTIVO' | 'COMPLETATO' | 'ASSUNTO'; count: number }> = [
    { stage: 'LEAD', count: 4 },
    { stage: 'CONVENZIONE', count: 4 },
    { stage: 'MATCHING', count: 3 },
    { stage: 'ATTIVO', count: 5 },
    { stage: 'COMPLETATO', count: 2 },
    { stage: 'ASSUNTO', count: 2 },
  ]

  const roleByDomain = (company: string): { role: string; industry: string } => {
    if (COMPANIES_SPORT.includes(company)) {
      return {
        role: pick(['Sponsorship Junior', 'Match-day Operations', 'Fan Engagement Intern', 'Ticketing Specialist', 'Event Coordinator']),
        industry: 'Sport & Entertainment',
      }
    }
    if (COMPANIES_MARKETING.includes(company)) {
      return {
        role: pick(['Junior Content Creator', 'Social Media Intern', 'Digital PR Junior', 'Copywriter Junior']),
        industry: 'Marketing & Communication',
      }
    }
    return {
      role: pick(['Junior Web Developer', 'UX/UI Intern', 'Junior Data Analyst', 'Frontend Developer']),
      industry: 'Tech',
    }
  }

  const tutors = ['Prof. Marco Ferri', 'Prof.ssa Giulia Conti', 'Prof. Luca Mariani', 'Prof.ssa Sara Ricci']
  const ALL_PARTNER_POOL = [...COMPANIES_SPORT, ...COMPANIES_MARKETING, ...COMPANIES_TECH]
  const usedPairs = new Set<string>()
  let dealCount = 0

  for (const { stage, count } of DEAL_DISTRIBUTION) {
    for (let i = 0; i < count; i++) {
      // Pick a unique (student, company) pair
      let sid: string | null = null
      let company: string | null = null
      for (let attempt = 0; attempt < 30; attempt++) {
        const s = pick(studentIds)
        const c = pick(ALL_PARTNER_POOL)
        const key = `${s}::${c}`
        if (!usedPairs.has(key)) {
          usedPairs.add(key)
          sid = s
          company = c
          break
        }
      }
      if (!sid || !company) continue

      const { role, industry } = roleByDomain(company)
      // Realistic stageChangedAt: older for deeper stages
      const stageAge: Record<string, number> = {
        LEAD: 5, CONVENZIONE: 15, MATCHING: 30, ATTIVO: 90, COMPLETATO: 200, ASSUNTO: 240,
      }
      const daysBack = randomInt(1, stageAge[stage])

      // Some ATTIVO deals should be "at risk" (>150 days) to demo that signal
      const atRiskAttivo = stage === 'ATTIVO' && i === 0 ? 165 : daysBack

      const now = new Date()
      const startDate = stage === 'ATTIVO' || stage === 'COMPLETATO' || stage === 'ASSUNTO'
        ? new Date(now.getTime() - atRiskAttivo * 86_400_000)
        : stage === 'MATCHING'
          ? new Date(now.getTime() + randomInt(7, 45) * 86_400_000)
          : null

      await prisma.internshipDeal.create({
        data: {
          universityName: INSTITUTION_FULL,
          ownerId: admin.id,
          companyName: company,
          contactName: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
          contactEmail: `hr@${company.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.demo`,
          role,
          industry,
          studentId: stage === 'LEAD' && Math.random() > 0.5 ? null : sid,
          stage: stage as any,
          stageChangedAt: new Date(now.getTime() - atRiskAttivo * 86_400_000),
          startDate,
          tutorName: stage !== 'LEAD' ? pick(tutors) : null,
          salaryAmount: stage !== 'LEAD' ? randomInt(600, 1000) : null,
          salaryCurrency: 'EUR',
          notes: stage === 'ASSUNTO'
            ? 'Studente assunto con contratto di apprendistato al termine dello stage.'
            : null,
          sourceType: 'DEMO',
        },
      })
      dealCount++
    }
  }
  console.log(`✅ ${dealCount} internship deals seeded across kanban pipeline`)

  console.log(`
🎉 AMMI Monza demo seed complete (real domain: sport + marketing + digital).

📧 Login:    monza@ammi-monza.it
🔑 Password: demo2024!

Data:
   ${studentIds.length} students across ${TRACKS.length} tracks
     ITS:  Digital Marketing Communication, Digital Marketing Content Creation,
           Football Management, Sport Management
     IFTS: Sport Marketing, Intelligenza Artificiale & Robotica, Web Design & App Creation
   ${projectCount} projects (all domain-matched)
   ${recruiterIds.length} partner companies
     Sport:     AC Monza, AC Milan, Inter, Olimpia Milano, Gazzetta, DAZN, Sky Sport,
                Lega Serie A, FIGC, Technogym, Decathlon, Diadora, Kappa, Freddy
     Marketing: We Are Social, Havas, Ogilvy, Armando Testa, Publicis, Wavemaker,
                Accenture Song, Edelman
     Tech:      Bending Spoons, Satispay, Musement, Casavo, Leonardo, STM, Comau
   ${placed.length} confirmed placements (75%)
   ${alumni.length} alumni records (~85% employed)
   ${contactCount} recruiter→student contacts
   ${dealCount} tirocinio deals in kanban pipeline (LEAD→ASSUNTO)

Positioning: "L'alternativa all'università" — 2 campus (Milano + Monza),
Regione Lombardia + MIM funded.
`)
}

main()
  .catch(e => { console.error('❌ Seed failed:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
