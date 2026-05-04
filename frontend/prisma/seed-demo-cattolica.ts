/**
 * Seed script: Università Cattolica del Sacro Cuore (real identity).
 *
 * Italy's largest private research university — 40,000 students across 5
 * campuses (Milano, Roma, Brescia, Piacenza, Cremona) and 12 faculties.
 * Particularly strong in business, law, humanities, psychology, and (Roma)
 * medicine — Policlinico Gemelli is the teaching hospital.
 *
 * Prepared as the post-meeting recovery seed after the 2026-04-17 call with
 * Caterina Soave (Stage e Placement Milano), Roberto Reggiani, Giuseppe Arena.
 * Demo creds were shared 2026-04-20 but the dashboard behind cattolica@unicatt.it
 * was empty — this seed populates it with substantive demo data.
 *
 * Run: npx tsx prisma/seed-demo-cattolica.ts
 *
 * Login:    cattolica@unicatt.it
 * Password: demo2024!
 */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const INSTITUTION_NAME = 'Cattolica'
const INSTITUTION_FULL = 'Università Cattolica del Sacro Cuore'
const INSTITUTION_SHORT = 'UCSC'

// Faculty + program tracks. Tagged by primary campus so we can route
// student affiliations + recruiter events realistically.
type Track = { name: string; faculty: string; campus: string; level: 'L' | 'LM' }
const TRACKS: Track[] = [
  { name: 'Economia e Gestione Aziendale',           faculty: 'Economia',                  campus: 'Milano',    level: 'L' },
  { name: 'Banking and Finance',                     faculty: 'Economia',                  campus: 'Milano',    level: 'LM' },
  { name: 'Management for Sustainability',           faculty: 'Economia',                  campus: 'Milano',    level: 'LM' },
  { name: 'Giurisprudenza',                          faculty: 'Giurisprudenza',            campus: 'Milano',    level: 'LM' },
  { name: 'Lettere Moderne',                         faculty: 'Lettere e Filosofia',       campus: 'Milano',    level: 'L'  },
  { name: 'Filologia Moderna',                       faculty: 'Lettere e Filosofia',       campus: 'Milano',    level: 'LM' },
  { name: 'Psicologia',                              faculty: 'Psicologia',                campus: 'Milano',    level: 'L'  },
  { name: 'Psicologia Clinica',                      faculty: 'Psicologia',                campus: 'Milano',    level: 'LM' },
  { name: 'Medicina e Chirurgia',                    faculty: 'Medicina e Chirurgia',      campus: 'Roma',      level: 'LM' },
  { name: 'Infermieristica',                         faculty: 'Medicina e Chirurgia',      campus: 'Roma',      level: 'L'  },
  { name: 'Scienze Politiche e Relazioni Internaz.', faculty: 'Scienze Politiche',         campus: 'Milano',    level: 'L'  },
  { name: 'Comunicazione',                           faculty: 'Scienze Politiche',         campus: 'Milano',    level: 'L'  },
  { name: 'Scienze Agrarie',                         faculty: 'Scienze Agrarie',           campus: 'Piacenza',  level: 'L'  },
  { name: 'Food Production Management',              faculty: 'Scienze Agrarie',           campus: 'Cremona',   level: 'LM' },
  { name: 'Scienze della Formazione Primaria',       faculty: 'Scienze della Formazione',  campus: 'Brescia',   level: 'LM' },
]

// Skills pool keyed by faculty area — used to build a realistic per-student profile.
const SKILLS_BY_FACULTY: Record<string, string[]> = {
  Economia: [
    'Financial Modeling', 'Excel Avanzato', 'Bloomberg Terminal', 'Capital IQ',
    'Valuation', 'M&A', 'Corporate Finance', 'Accounting', 'IFRS',
    'Power BI', 'SQL', 'Python (data analysis)', 'VBA',
    'Business Strategy', 'Pricing Strategy', 'Market Research',
    'ESG Reporting', 'Sustainability Metrics', 'Risk Management',
  ],
  Giurisprudenza: [
    'Diritto Civile', 'Diritto Commerciale', 'Diritto Societario',
    'Diritto del Lavoro', 'Diritto Tributario', 'Diritto Internazionale',
    'M&A Legal Due Diligence', 'Contract Drafting', 'GDPR / Privacy',
    'Compliance', 'Litigation Support', 'Legal Research', 'Westlaw', 'DeJure',
  ],
  'Lettere e Filosofia': [
    'Editing', 'Copywriting', 'Storytelling', 'Content Strategy',
    'Digital Humanities', 'Archivistica', 'Critica Letteraria',
    'Italiano L2', 'Latino', 'Greco', 'Public Speaking',
    'Comunicazione Culturale', 'Curatela Mostre', 'Adobe InDesign',
  ],
  Psicologia: [
    'Statistical Analysis (SPSS)', 'R', 'Test Psicometrici',
    'Colloquio Clinico', 'CBT (Cognitive Behavioral Therapy)',
    'UX Research', 'Usability Testing', 'Behavioral Design',
    'Neuropsicologia', 'Psicologia del Lavoro', 'Selezione del Personale',
    'Assessment Center', 'Coaching', 'HR Analytics',
  ],
  'Medicina e Chirurgia': [
    'Clinical Practice', 'EBM (Evidence-Based Medicine)', 'Diagnostica per Immagini',
    'Sutura Chirurgica', 'Biostatistica', 'R (medical stats)',
    'GCP (Good Clinical Practice)', 'Pubmed Search', 'EndNote',
    'Patient Communication', 'Telemedicina', 'Cartella Clinica Elettronica',
    'Pronto Soccorso', 'Anatomia', 'Farmacologia',
  ],
  'Scienze Politiche': [
    'Policy Analysis', 'Political Risk Analysis', 'EU Affairs',
    'Public Affairs', 'Lobbying / Advocacy', 'Public Speaking',
    'Inglese C1', 'Francese B2', 'Statistical Analysis (R)',
    'Geopolitics', 'International Relations', 'Public Diplomacy',
    'Journalism', 'Audiovisual Production', 'Adobe Premiere',
  ],
  'Scienze Agrarie': [
    'Agronomia', 'Sustainable Agriculture', 'Precision Farming',
    'Soil Science', 'Plant Pathology', 'Food Science',
    'Food Safety / HACCP', 'Quality Assurance Alimentare',
    'Supply Chain Alimentare', 'GIS / QGIS', 'Remote Sensing',
    'Sensory Analysis', 'Wine Technology', 'Dairy Technology',
  ],
  'Scienze della Formazione': [
    'Pedagogia', 'Didattica', 'Psicologia dello Sviluppo',
    'Progettazione Educativa', 'Didattica Inclusiva',
    'Tecnologie Educative', 'Italiano L2', 'Storytelling Didattico',
    'Valutazione Apprendimenti', 'Tutoring',
  ],
}

function skillsForTrack(track: Track): string[] {
  const pool = SKILLS_BY_FACULTY[track.faculty] || SKILLS_BY_FACULTY['Economia']
  // M&A track gets banking-flavored extras
  if (track.name === 'Banking and Finance') {
    return [...pool, 'DCF Modeling', 'LBO Modeling', 'Equity Research', 'Trading Floor Experience']
  }
  if (track.name === 'Management for Sustainability') {
    return [...pool, 'CSRD Reporting', 'Carbon Accounting', 'Sustainable Finance', 'Impact Measurement']
  }
  return pool
}

// Partner companies — realistic Cattolica recruiting fabric.
// Banking + insurance dominate, then consulting (the path most Cattolica
// economisti take), industrial Made in Italy, luxury, and the Gemelli/health
// cluster for the Roma medical campus.
const COMPANIES_BANKING = [
  'Intesa Sanpaolo', 'UniCredit', 'Banca Mediolanum', 'Banco BPM', 'Banca Generali',
]
const COMPANIES_INSURANCE = [
  'Generali Italia', 'Allianz Italia', 'Poste Vita',
]
const COMPANIES_CONSULTING = [
  'McKinsey & Company Italia', 'BCG Italia', 'Bain & Company Italia',
  'Deloitte Italia', 'PwC Italia', 'EY Italia', 'KPMG Italia',
  'Accenture Strategy', 'Roland Berger Italia',
]
const COMPANIES_INDUSTRIAL = [
  'Pirelli', 'Eni', 'Snam', 'A2A', 'Leonardo', 'Ferrero',
]
const COMPANIES_LUXURY = [
  'Bulgari', 'Brunello Cucinelli', 'Gucci', 'Moncler', 'Prada Group',
]
const COMPANIES_HEALTH = [
  'Policlinico Gemelli', 'Humanitas', 'Ospedale San Raffaele', 'Bracco Imaging',
]
const COMPANIES_TECH = [
  'Microsoft Italia', 'IBM Italia', 'SAP Italia', 'Oracle Italia',
]
const COMPANIES_PUBLIC_NONPROFIT = [
  'Fondazione Cariplo', 'AVSI', 'Caritas Italiana',
]
const COMPANIES_AGRI_FOOD = [
  'Barilla', 'Lavazza', 'Granarolo', 'Cattolica Assicurazioni Agriventure',
]

// Project archetypes per faculty — used to build realistic project portfolios.
const PROJECT_TITLES_BY_FACULTY: Record<string, string[]> = {
  Economia: [
    'Valutazione M&A: target nel settore food italiano',
    'Modello DCF per IPO mid-cap del Made in Italy',
    'Analisi competitiva del retail bancario europeo post-PNRR',
    'Pricing strategy per SaaS B2B in fase early-revenue',
    'Studio di sostenibilità ESG per gruppo industriale lombardo',
    'Equity research report su titolo del FTSE MIB',
  ],
  Giurisprudenza: [
    'Due diligence legale su acquisizione cross-border IT-DE',
    'Memoria difensiva su controversia di lavoro (settore retail)',
    'Analisi di compliance GDPR per healthtech startup',
    'Contratto di franchising per espansione network ristorazione',
    'Parere legale su passaggio generazionale di PMI familiare',
    'Ricerca giurisprudenziale: clausole arbitrato in contratti M&A',
  ],
  'Lettere e Filosofia': [
    'Edizione critica di carteggio inedito del Novecento italiano',
    'Progetto di digital humanities: corpus annotato di poesia barocca',
    'Curatela mostra "Letteratura e fotografia" per fondazione culturale',
    'Brand storytelling per casa editrice indipendente',
    'Ricerca di storia culturale: festival letterari milanesi 1990–2020',
  ],
  Psicologia: [
    'Studio empirico: bias cognitivi nei processi di selezione del personale',
    'Progetto di assessment center per multinazionale del settore retail',
    'UX research su app di mental wellness (campione 200 utenti)',
    'Validazione italiana di test di personalità per uso clinico',
    'Intervento di gruppo su ansia sociale in popolazione universitaria',
    'Analisi quantitativa: clima organizzativo in PMI manifatturiera',
  ],
  'Medicina e Chirurgia': [
    'Caso clinico: gestione multidisciplinare di paziente oncologico al Gemelli',
    'Studio osservazionale su outcomes post-chirurgia bariatrica',
    'Revisione sistematica: efficacia telemedicina in cronicità diabetica',
    'Tirocinio in Pronto Soccorso — gestione triage e codici colore',
    'Ricerca di base in laboratorio di farmacologia (signaling cellulare)',
  ],
  'Scienze Politiche': [
    'Policy brief: misure post-PNRR per la transizione energetica',
    'Analisi geopolitica del Mediterraneo orientale (2022–2026)',
    'Progetto di public affairs per associazione di categoria',
    'Inchiesta giornalistica su filiera del lavoro nelle piattaforme digitali',
    'Documentario breve: impatto del cambiamento climatico nelle Alpi italiane',
  ],
  'Scienze Agrarie': [
    'Sperimentazione precision farming su filiera del pomodoro',
    'Analisi di filiera: vino DOCG dell\'Oltrepò Pavese',
    'Modello di sostenibilità per allevamento bovino (Cremona)',
    'Studio di tracciabilità HACCP in caseificio artigiano',
    'Sviluppo nuovo prodotto plant-based per industria alimentare',
  ],
  'Scienze della Formazione': [
    'Progetto didattico: educazione civica e cittadinanza digitale',
    'Sperimentazione di didattica inclusiva in scuola primaria multietnica',
    'Valutazione efficacia laboratorio STEAM in scuola dell\'infanzia',
    'Tutoring online per studenti con DSA',
  ],
}

// Italian first / last name pools — same convention as the AMMI seed.
const FIRST_NAMES = [
  'Marco', 'Giulia', 'Alessandro', 'Francesca', 'Luca', 'Chiara',
  'Matteo', 'Sara', 'Andrea', 'Valentina', 'Lorenzo', 'Elena',
  'Federico', 'Martina', 'Davide', 'Sofia', 'Simone', 'Anna',
  'Riccardo', 'Laura', 'Nicola', 'Alice', 'Stefano', 'Beatrice',
  'Giovanni', 'Elisa', 'Pietro', 'Greta', 'Tommaso', 'Camilla',
]
const LAST_NAMES = [
  'Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano',
  'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno', 'Gallo',
  'Conti', 'Mancini', 'Costa', 'Giordano', 'Rizzo', 'Lombardi',
  'Moretti', 'Barbieri', 'Fontana', 'Santoro', 'Mariani', 'Rinaldi',
]

const CITY_BY_CAMPUS: Record<string, string> = {
  Milano:   'Milano',
  Roma:     'Roma',
  Brescia:  'Brescia',
  Piacenza: 'Piacenza',
  Cremona:  'Cremona',
}

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
const futureDate = (daysAhead: number) => {
  const d = new Date()
  d.setDate(d.getDate() + Math.floor(Math.random() * daysAhead) + 1)
  return d
}

async function main() {
  console.log(`\n🎓 Seeding demo data for ${INSTITUTION_FULL} (multi-campus, multi-faculty)...\n`)

  const passwordHash = await bcrypt.hash('demo2024!', 10)

  // ── 0. Wipe previous Cattolica seed data so we re-seed cleanly ─────────
  // Match anything tied to the Cattolica identity. The admin account itself
  // (cattolica@unicatt.it) is preserved — only its associated student/recruiter
  // pools and downstream data get rebuilt.
  const staleStudents = await prisma.user.findMany({
    where: {
      OR: [
        { email: { endsWith: '@studenti.unicatt.it' } },
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
    console.log(`🧹 Cleaned up ${staleIds.length} stale Cattolica students + related records`)
  }

  // ── 1. Admin (Caterina Soave — Stage e Placement Milano) ───────────────
  // The user already exists from the manual creation on 2026-04-17.
  // Upsert + update keeps the stable id but refreshes name/title/bio.
  const admin = await prisma.user.upsert({
    where: { email: 'cattolica@unicatt.it' },
    update: {
      firstName: 'Caterina',
      lastName: 'Soave',
      jobTitle: 'Stage e Placement — Sede di Milano',
      university: INSTITUTION_FULL,
      company: INSTITUTION_FULL,
      bio: "Servizio Stage e Placement dell'Università Cattolica del Sacro Cuore. Coordiniamo i tirocini curricolari ed extracurriculari delle nostre 12 facoltà sui 5 campus di Milano, Roma, Brescia, Piacenza e Cremona. Più di 100 eventi recruiting all'anno e network di oltre 4.000 aziende partner.",
      location: 'Milano, Italy',
    },
    create: {
      email: 'cattolica@unicatt.it',
      passwordHash,
      role: 'UNIVERSITY',
      firstName: 'Caterina',
      lastName: 'Soave',
      company: INSTITUTION_FULL,
      university: INSTITUTION_FULL,
      jobTitle: 'Stage e Placement — Sede di Milano',
      emailVerified: true,
      profilePublic: true,
      bio: "Servizio Stage e Placement dell'Università Cattolica del Sacro Cuore. Coordiniamo i tirocini curricolari ed extracurriculari delle nostre 12 facoltà sui 5 campus di Milano, Roma, Brescia, Piacenza e Cremona.",
      location: 'Milano, Italy',
    },
  })
  console.log(`✅ Admin: ${admin.email}`)

  // Wipe deals owned by the Cattolica admin so re-seed is clean
  await prisma.internshipDeal.deleteMany({ where: { ownerId: admin.id } })

  await prisma.universitySettings.upsert({
    where: { userId: admin.id },
    update: {
      name: INSTITUTION_FULL,
      shortName: INSTITUTION_SHORT,
      city: 'Milano',
      region: 'Lombardia',
      country: 'IT',
      institutionType: 'university',
      description:
        "La più grande università cattolica d'Europa: 40.000 studenti, 12 facoltà, 5 campus (Milano, Roma, Brescia, Piacenza, Cremona). Forte tradizione in economia, giurisprudenza, scienze umane, psicologia e — sul campus di Roma — medicina con il Policlinico Gemelli. Più di 100 eventi recruiting all'anno e oltre 4.000 aziende partner.",
      website: 'https://www.unicatt.it',
    },
    create: {
      userId: admin.id,
      name: INSTITUTION_FULL,
      shortName: INSTITUTION_SHORT,
      city: 'Milano',
      region: 'Lombardia',
      country: 'IT',
      website: 'https://www.unicatt.it',
      email: 'info@in-transparency.com',
      phone: '+39 02 7234 1',
      description:
        "La più grande università cattolica d'Europa: 40.000 studenti, 12 facoltà, 5 campus (Milano, Roma, Brescia, Piacenza, Cremona). Forte tradizione in economia, giurisprudenza, scienze umane, psicologia e — sul campus di Roma — medicina con il Policlinico Gemelli.",
      institutionType: 'university',
    },
  })
  console.log(`✅ UniversitySettings (institutionType=university, multi-campus, multi-faculty)`)

  // Flip the matching Institution to PREMIUM with mediation + offer approval
  // enabled so the full workspace works end-to-end for this demo.
  await prisma.institution.upsert({
    where: { id: admin.id },
    update: {
      name: INSTITUTION_FULL,
      type: 'UNIVERSITY_PRIVATE',
      plan: 'PREMIUM',
      mediationEnabled: true,
      requireOfferApproval: true,
      city: 'Milano',
      region: 'Lombardia',
      country: 'IT',
      website: 'https://www.unicatt.it',
      description:
        "Università privata di ricerca, fondata nel 1921. 5 campus, 12 facoltà, 40.000 studenti.",
    },
    create: {
      id: admin.id,
      name: INSTITUTION_FULL,
      slug: `cattolica-${admin.id.slice(-8)}`,
      type: 'UNIVERSITY_PRIVATE',
      plan: 'PREMIUM',
      mediationEnabled: true,
      requireOfferApproval: true,
      city: 'Milano',
      region: 'Lombardia',
      country: 'IT',
      website: 'https://www.unicatt.it',
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

  // ── 2. Students — 30 across multiple faculties + campuses ──────────────
  const studentIds: string[] = []
  for (let i = 0; i < 30; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length]
    const lastName = LAST_NAMES[i % LAST_NAMES.length]
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@studenti.unicatt.it`
    const track = TRACKS[i % TRACKS.length]
    const trackSkills = skillsForTrack(track)
    const skills = pickN(trackSkills, randomInt(5, 9))
    const gradYear = String(track.level === 'L' ? randomInt(2026, 2028) : randomInt(2025, 2027))
    const gpa = (randomInt(24, 30) + randomInt(0, 9) / 10).toFixed(1) // Italian 30-scale
    const location = CITY_BY_CAMPUS[track.campus] ?? 'Milano'

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
        degree: `${track.name} — ${track.faculty} (${track.level === 'L' ? 'Laurea' : 'Laurea Magistrale'})`,
        graduationYear: gradYear,
        gpa,
        gpaPublic: Math.random() > 0.3,
        skills,
        bio: `Studente Cattolica — Facoltà di ${track.faculty} (campus di ${track.campus}). Principali competenze: ${skills.slice(0, 3).join(', ')}.`,
        location,
        emailVerified: Math.random() > 0.1,
        profilePublic: Math.random() > 0.2,
        lastLoginAt: randomDate(60),
        interests: pickN(
          ['Finance', 'Consulting', 'Diritto', 'Editoria', 'Ricerca', 'Public Affairs', 'Health', 'Sostenibilità', 'HR', 'Comunicazione', 'Internazionale', 'Made in Italy'],
          randomInt(2, 4),
        ),
      },
    })
    studentIds.push(student.id)

    // Active institutional affiliation — required for contactMode=MEDIATED.
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
  console.log(`✅ ${studentIds.length} students across ${TRACKS.length} programs (5 campuses, multi-faculty)`)

  // ── 3. Projects (faculty-appropriate titles + skills) ──────────────────
  let projectCount = 0
  for (const studentId of studentIds) {
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: { degree: true, skills: true },
    })
    if (!student?.degree) continue
    // Find the faculty from the student's degree string. Fallback: Economia.
    const facultyMatch = student.degree.match(/—\s*(.+?)\s*\(/)
    const faculty = facultyMatch ? facultyMatch[1] : 'Economia'
    const titles = PROJECT_TITLES_BY_FACULTY[faculty] || PROJECT_TITLES_BY_FACULTY['Economia']
    const n = randomInt(1, 3)
    for (let p = 0; p < n; p++) {
      const title = pick(titles)
      const verified = Math.random() > 0.2
      const projectSkills = pickN(
        student.skills ?? SKILLS_BY_FACULTY[faculty] ?? SKILLS_BY_FACULTY.Economia,
        randomInt(3, 6),
      )
      // Discipline classification — schema enum is fixed; map faculties to the closest match.
      // Valid values: TECHNOLOGY, BUSINESS, DESIGN, HEALTHCARE, ENGINEERING, TRADES, ARCHITECTURE, MEDIA.
      let discipline: 'BUSINESS' | 'DESIGN' | 'MEDIA' | 'TECHNOLOGY' | 'HEALTHCARE' = 'BUSINESS'
      if (faculty === 'Medicina e Chirurgia') discipline = 'HEALTHCARE'
      else if (faculty === 'Scienze Politiche' || faculty === 'Lettere e Filosofia') discipline = 'MEDIA'
      else if (faculty === 'Psicologia') discipline = 'BUSINESS'
      else if (faculty === 'Scienze Agrarie') discipline = 'TECHNOLOGY'

      await prisma.project.create({
        data: {
          userId: studentId,
          title,
          description: `Progetto svolto nel percorso Cattolica (Facoltà di ${faculty}) — esperienza valutata dal docente referente. Competenze sviluppate: ${projectSkills.slice(0, 4).join(', ')}.`,
          skills: projectSkills,
          technologies: pickN(projectSkills, 3),
          discipline,
          verificationStatus: verified ? 'VERIFIED' : pick(['PENDING', 'NEEDS_INFO']),
          verifiedBy: verified ? admin.id : null,
          verifiedAt: verified ? randomDate(90) : null,
          grade: Math.random() > 0.3 ? `${randomInt(26, 30)}/30${Math.random() > 0.7 ? ' e lode' : ''}` : null,
          isPublic: true,
          createdAt: randomDate(180),
        },
      })
      projectCount++
    }
  }
  console.log(`✅ ${projectCount} projects created (faculty-matched titles + skills)`)

  // ── 4. Partner companies ───────────────────────────────────────────────
  const ALL_PARTNERS = [
    ...COMPANIES_BANKING, ...COMPANIES_INSURANCE, ...COMPANIES_CONSULTING,
    ...COMPANIES_INDUSTRIAL, ...COMPANIES_LUXURY, ...COMPANIES_HEALTH,
    ...COMPANIES_TECH, ...COMPANIES_PUBLIC_NONPROFIT, ...COMPANIES_AGRI_FOOD,
  ]
  const recruiterIds: { id: string; company: string }[] = []
  for (let r = 0; r < Math.min(20, ALL_PARTNERS.length); r++) {
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
        jobTitle: pick(['Talent Acquisition Manager', 'HR Business Partner', 'Head of Campus Recruiting', 'Recruiter', 'Responsabile Selezione Junior']),
        emailVerified: true,
        profilePublic: true,
      },
    })
    recruiterIds.push({ id: recruiter.id, company })

    // Each recruiter has viewed several Cattolica students recently.
    const viewed = pickN(studentIds, randomInt(4, 12))
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
  console.log(`✅ ${recruiterIds.length} partner companies (banking, consulting, industrial, luxury, health, tech)`)

  // ── 5. Conventions — registered partnerships per company ───────────────
  // These show up in the dashboard's "Convenzioni" section, which is one of
  // the surfaces Caterina is likely to explore.
  for (const { company } of recruiterIds.slice(0, 16)) {
    const slug = company.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const status = pick(['ACTIVE', 'ACTIVE', 'ACTIVE', 'PENDING_SIGNATURES', 'EXPIRED'] as const)
    await prisma.convention.create({
      data: {
        institutionId: admin.id,
        companyName: company,
        companyDomain: `${slug}.example.com`,
        status,
        signedAt: status === 'ACTIVE' || status === 'EXPIRED' ? randomDate(365) : null,
        expiresAt: status === 'EXPIRED' ? randomDate(30) : futureDate(365),
        notes: `Convenzione quadro per tirocini curricolari ed extracurricolari. Settori prioritari condivisi con il Career Service.`,
        createdById: admin.id,
        createdAt: randomDate(400),
      },
    })
  }
  console.log(`✅ 16 conventions created (mix of ACTIVE / PENDING / EXPIRED)`)

  // ── 6. Career events — the feature Cattolica explicitly liked ──────────
  // 100+ events/year is their stated cadence. We seed 10 representative ones
  // covering past + upcoming so the calendar UI looks lived-in.
  const adminSettings = await prisma.universitySettings.findUnique({
    where: { userId: admin.id },
    select: { id: true },
  })
  const organizerId = adminSettings?.id
  if (organizerId) {
    const eventDefs: Array<{
      title: string; description: string; eventType: string;
      location: string; isOnline: boolean; daysOffset: number;
      durationHours: number; maxAttendees?: number;
    }> = [
      { title: 'Career Day Cattolica Milano 2026', description: 'Flagship recruiting event. Oltre 80 aziende presenti. Aperto a tutti gli studenti e neolaureati di tutte le facoltà.',
        eventType: 'CAREER_DAY', location: 'Largo Gemelli 1, Milano', isOnline: false, daysOffset: 28, durationHours: 8, maxAttendees: 1500 },
      { title: 'Banking & Finance Recruiting Day',  description: 'Dedicato a studenti di Economia + Banking and Finance. Sessioni 1:1 con Intesa Sanpaolo, UniCredit, Generali, Banca Mediolanum.',
        eventType: 'NETWORKING', location: 'Aula Magna — Campus Milano', isOnline: false, daysOffset: 14, durationHours: 4, maxAttendees: 250 },
      { title: 'Consulting Open Day',                description: 'Le big-four della consulenza strategica + 4 boutique presentano i programmi di summer internship. Q&A finale con alumni.',
        eventType: 'INFO_SESSION', location: 'Aula NI 110 — Campus Milano', isOnline: false, daysOffset: 21, durationHours: 3, maxAttendees: 200 },
      { title: 'Roma Medical Career Day — Policlinico Gemelli', description: 'Per gli studenti del polo medico. Specialità ospedaliere, ricerca clinica, pharma, Med-Tech. In collaborazione con Fondazione Policlinico A. Gemelli IRCCS.',
        eventType: 'CAREER_DAY', location: 'Largo F. Vito 1, Roma', isOnline: false, daysOffset: 35, durationHours: 6, maxAttendees: 400 },
      { title: 'Tech & Digital Workshop',           description: 'Workshop pratico su data, AI, cyber e cloud. Ospiti: Microsoft Italia, IBM, Accenture Strategy. Iscrizione su base meritocratica.',
        eventType: 'WORKSHOP',   location: 'Online (Microsoft Teams)', isOnline: true, daysOffset: 10, durationHours: 2, maxAttendees: 300 },
      { title: 'Internship Speed Dating — Milano',  description: 'Format breve: 7 minuti per colloquio, ogni studente incontra fino a 8 aziende partner.',
        eventType: 'NETWORKING', location: 'Cortile d\'Onore — Campus Milano', isOnline: false, daysOffset: 42, durationHours: 4, maxAttendees: 180 },
      { title: 'Skills Gap Workshop — Curriculum vs Mercato', description: 'Discussione aperta facoltà-aziende sulla distanza tra cosa insegniamo e cosa il mercato chiede. Co-organizzato con Fondazione Cariplo.',
        eventType: 'WORKSHOP',   location: 'Sala Negri da Oleggio — Campus Milano', isOnline: false, daysOffset: 49, durationHours: 3, maxAttendees: 120 },
      { title: 'Alumni Network Event — Lombardia',  description: 'Aperitivo di networking con alumni Cattolica attivi in finance, consulting, luxury e legal. Dress code: smart business.',
        eventType: 'NETWORKING', location: 'Sala Pio XI — Campus Milano', isOnline: false, daysOffset: 56, durationHours: 3, maxAttendees: 250 },
      { title: 'Career Day — Campus Brescia + Piacenza', description: 'Edizione satellite per i campus di Brescia (psicologia + lettere + formazione) e Piacenza (agraria + giurisprudenza). Aziende focalizzate sul territorio.',
        eventType: 'CAREER_DAY', location: 'Brescia + Piacenza (formato itinerante)', isOnline: false, daysOffset: -14, durationHours: 6, maxAttendees: 600 },
      { title: 'Webinar: Public Affairs & Carriere nelle Istituzioni UE', description: 'Per Scienze Politiche e Comunicazione. Ospiti dalla Commissione Europea, Confindustria e una boutique di lobbying romana.',
        eventType: 'WEBINAR',    location: 'Online (Zoom)', isOnline: true, daysOffset: -7, durationHours: 1, maxAttendees: 500 },
    ]

    let eventsCreated = 0
    for (const def of eventDefs) {
      const start = new Date(Date.now() + def.daysOffset * 86_400_000)
      start.setHours(10, 0, 0, 0)
      const end = new Date(start.getTime() + def.durationHours * 3_600_000)
      const isPast = def.daysOffset < 0

      const event = await prisma.careerEvent.create({
        data: {
          organizerId,
          title: def.title,
          description: def.description,
          eventType: def.eventType,
          location: def.location,
          isOnline: def.isOnline,
          meetingUrl: def.isOnline ? `https://teams.microsoft.com/l/meetup-join/demo-${eventsCreated}` : null,
          startDate: start,
          endDate: end,
          timezone: 'Europe/Rome',
          maxAttendees: def.maxAttendees,
          maxRecruiters: def.maxAttendees ? Math.round(def.maxAttendees / 8) : null,
          status: isPast ? 'COMPLETED' : 'PUBLISHED',
          publishedAt: randomDate(60),
          registrationDeadline: new Date(start.getTime() - 3 * 86_400_000),
          requiresApproval: false,
        },
      })
      eventsCreated++

      // RSVPs: a sample of students + recruiters confirmed
      const studentRSVPs = pickN(studentIds, randomInt(8, 20))
      for (const sid of studentRSVPs) {
        await prisma.eventRSVP.create({
          data: {
            eventId: event.id,
            userId: sid,
            role: 'STUDENT',
            status: isPast ? pick(['CONFIRMED', 'CONFIRMED', 'CANCELLED']) : pick(['CONFIRMED', 'PENDING', 'WAITLISTED']),
          },
        })
      }
      const recruiterRSVPs = pickN(recruiterIds, randomInt(3, 8))
      for (const r of recruiterRSVPs) {
        await prisma.eventRSVP.create({
          data: {
            eventId: event.id,
            userId: r.id,
            role: 'RECRUITER',
            status: 'CONFIRMED',
            companyName: r.company,
            boothRequest: Math.random() > 0.6,
          },
        })
      }
    }
    console.log(`✅ ${eventsCreated} career events created (past + upcoming, with RSVPs) — populates the Events feature Cattolica liked`)
  } else {
    console.log(`⚠️ Skipped events seeding — UniversitySettings.id not found for admin (this should not happen)`)
  }

  // ── 7. Placements — substantive employability data ─────────────────────
  // Cattolica is known for high placement rates, especially in finance + consulting.
  const placed = pickN(studentIds, Math.round(studentIds.length * 0.7))
  for (const sid of placed) {
    const student = await prisma.user.findUnique({ where: { id: sid }, select: { degree: true } })
    const facultyMatch = (student?.degree || '').match(/—\s*(.+?)\s*\(/)
    const faculty = facultyMatch ? facultyMatch[1] : 'Economia'

    let company: string
    let jobTitle: string
    let industry: string
    if (faculty === 'Economia') {
      company = pick([...COMPANIES_BANKING, ...COMPANIES_CONSULTING, ...COMPANIES_INSURANCE])
      jobTitle = pick(['Investment Banking Analyst', 'Junior Consultant', 'M&A Analyst', 'Equity Research Junior', 'Audit Associate', 'Junior Underwriter'])
      industry = 'Finance & Consulting'
    } else if (faculty === 'Giurisprudenza') {
      company = pick([...COMPANIES_CONSULTING.slice(3), ...COMPANIES_BANKING.slice(0, 2), 'Studio Legale Chiomenti', 'BonelliErede', 'Gianni & Origoni'])
      jobTitle = pick(['Junior Associate (Studio Legale)', 'Legal Counsel Trainee', 'Compliance Officer Junior', 'M&A Legal Junior'])
      industry = 'Legal & Professional Services'
    } else if (faculty === 'Medicina e Chirurgia') {
      company = pick(COMPANIES_HEALTH)
      jobTitle = pick(['Medico Specializzando', 'Clinical Research Associate', 'Junior Researcher (laboratorio)'])
      industry = 'Healthcare'
    } else if (faculty === 'Psicologia') {
      company = pick([...COMPANIES_CONSULTING.slice(0, 4), ...COMPANIES_HEALTH.slice(0, 2), 'Iulm', 'Centro Psicologia Clinica Milano'])
      jobTitle = pick(['HR Junior', 'Talent Specialist', 'Junior UX Researcher', 'Psicologo Junior (tirocinio professionalizzante)'])
      industry = 'HR & Healthcare'
    } else if (faculty === 'Scienze Politiche') {
      company = pick([...COMPANIES_CONSULTING.slice(2), ...COMPANIES_PUBLIC_NONPROFIT, 'Edelman Italia', 'Cattaneo Zanetto & Co.'])
      jobTitle = pick(['Junior Public Affairs Consultant', 'Policy Analyst Junior', 'Communication Specialist'])
      industry = 'Public Affairs & Communication'
    } else if (faculty === 'Scienze Agrarie') {
      company = pick(COMPANIES_AGRI_FOOD)
      jobTitle = pick(['Junior Agronomist', 'Quality Specialist Alimentare', 'Junior R&D Food Technologist'])
      industry = 'Agri-Food'
    } else if (faculty === 'Lettere e Filosofia') {
      company = pick(['Mondadori', 'Feltrinelli', 'Treccani', 'Edelman Italia', ...COMPANIES_LUXURY.slice(0, 2)])
      jobTitle = pick(['Junior Editor', 'Content Strategist', 'Junior Press Officer', 'Brand Storyteller Junior'])
      industry = 'Editoria & Cultura'
    } else if (faculty === 'Scienze della Formazione') {
      company = pick(['Cooperativa Sociale Onlus', 'Comune di Milano — Servizi Educativi', 'Scuola Internazionale di Milano'])
      jobTitle = pick(['Insegnante (Tirocinio Formativo Attivo)', 'Educatore Junior', 'Tutor DSA'])
      industry = 'Education'
    } else {
      company = pick(COMPANIES_TECH)
      jobTitle = pick(['Junior Analyst', 'Business Analyst Junior'])
      industry = 'Tech'
    }

    await prisma.placement.create({
      data: {
        studentId: sid,
        universityName: INSTITUTION_FULL,
        companyName: company,
        jobTitle,
        status: 'CONFIRMED',
        salaryAmount: randomInt(28000, 55000), // higher range than AMMI: Cattolica grads command finance/consulting salaries
        salaryCurrency: 'EUR',
        startDate: randomDate(180),
        companyIndustry: industry,
      },
    })
  }
  console.log(`✅ ${placed.length} confirmed placements (~70% of cohort, finance/consulting weighted)`)

  // ── 8. Alumni records — for the analytics dashboards ───────────────────
  const alumni = pickN(studentIds, 12)
  for (const sid of alumni) {
    const student = await prisma.user.findUnique({ where: { id: sid }, select: { degree: true } })
    const facultyMatch = (student?.degree || '').match(/—\s*(.+?)\s*\(/)
    const faculty = facultyMatch ? facultyMatch[1] : 'Economia'
    const employed = Math.random() > 0.1 // 90% employment for Cattolica

    let currentCompany: string | null = null
    let currentRole: string | null = null
    let industry: string | null = null
    if (employed) {
      if (faculty === 'Economia') {
        currentCompany = pick([...COMPANIES_BANKING, ...COMPANIES_CONSULTING])
        currentRole = pick(['Associate', 'Senior Analyst', 'Consultant', 'Vice President (Junior)'])
        industry = 'Finance & Consulting'
      } else if (faculty === 'Medicina e Chirurgia') {
        currentCompany = pick(COMPANIES_HEALTH)
        currentRole = pick(['Medico Strutturato', 'Specialista', 'Ricercatore'])
        industry = 'Healthcare'
      } else if (faculty === 'Giurisprudenza') {
        currentCompany = pick(['BonelliErede', 'Studio Chiomenti', 'Gianni & Origoni', ...COMPANIES_INDUSTRIAL.slice(0, 2)])
        currentRole = pick(['Associate', 'Senior Legal Counsel', 'Compliance Manager'])
        industry = 'Legal'
      } else {
        currentCompany = pick([...COMPANIES_INDUSTRIAL, ...COMPANIES_LUXURY])
        currentRole = pick(['Senior Analyst', 'Brand Manager Junior', 'Project Manager'])
        industry = 'Industry'
      }
    }

    await prisma.alumniRecord.upsert({
      where: { userId: sid },
      update: {
        currentCompany,
        currentRole,
        currentIndustry: industry,
        employmentStatus: employed ? 'EMPLOYED' : pick(['SEEKING', 'FURTHER_STUDY'] as const),
      },
      create: {
        userId: sid,
        universityName: INSTITUTION_FULL,
        graduationYear: '2024',
        currentCompany,
        currentRole,
        currentIndustry: industry,
        employmentStatus: employed ? 'EMPLOYED' : pick(['SEEKING', 'FURTHER_STUDY'] as const),
      },
    })
  }
  console.log(`✅ ${alumni.length} alumni records (~90% employed — typical for Cattolica)`)

  // ── 9. Recruiter→student contacts (lights up the messaging surface) ────
  let contactCount = 0
  for (const r of recruiterIds.slice(0, 12)) {
    const targets = pickN(studentIds, randomInt(2, 5))
    for (const sid of targets) {
      try {
        await prisma.contactUsage.create({
          data: {
            recruiterId: r.id,
            recipientId: sid,
            // Billing window = current calendar month — matches the AMMI seed pattern.
            billingPeriodStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            billingPeriodEnd: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
            createdAt: randomDate(45),
          },
        })
        contactCount++
      } catch {
        // Unique constraint may exist; skip duplicates silently.
      }
    }
  }
  console.log(`✅ ${contactCount} recruiter→student contacts (last 45 days)`)

  // ── 10. Internship deals across the kanban pipeline ────────────────────
  // Stage names are Italian-flavored (matching the AMMI seed): the kanban
  // board maps these to discovery → convention signed → student matched →
  // active stage → completed → hired (or LOST).
  const DEAL_DISTRIBUTION: Array<{
    stage: 'LEAD' | 'CONVENZIONE' | 'MATCHING' | 'ATTIVO' | 'COMPLETATO' | 'ASSUNTO' | 'LOST';
    count: number;
  }> = [
    { stage: 'LEAD',        count: 4 },
    { stage: 'CONVENZIONE', count: 4 },
    { stage: 'MATCHING',    count: 4 },
    { stage: 'ATTIVO',      count: 3 },
    { stage: 'COMPLETATO',  count: 2 },
    { stage: 'ASSUNTO',     count: 1 },
  ]
  const dealStudents = pickN(studentIds, DEAL_DISTRIBUTION.reduce((s, x) => s + x.count, 0))
  let dealIdx = 0
  let dealCount = 0
  for (const { stage, count } of DEAL_DISTRIBUTION) {
    for (let i = 0; i < count; i++) {
      const sid = dealStudents[dealIdx++]
      if (!sid) break
      const r = pick(recruiterIds)
      await prisma.internshipDeal.create({
        data: {
          universityName: INSTITUTION_FULL,
          ownerId: admin.id,
          studentId: sid,
          companyName: r.company,
          contactEmail: `hr@${r.company.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.demo`,
          role: pick([
            'Stage curricolare estate 2026',
            'Internship 6 mesi finance',
            'Tirocinio extracurricolare consulting',
            'Stage estivo medical affairs',
            'Tirocinio in studio legale',
            'Internship sustainability reporting',
          ]),
          stage: stage as any,
          notes: pick([
            'Profilo preferenziale per la posizione, secondo colloquio in calendario.',
            "Interesse confermato dall'azienda — attendiamo offerta.",
            'Selezione interrotta dallo studente per accettata altra offerta.',
            'Match interessante per il programma summer.',
          ]),
          createdAt: randomDate(60),
        },
      })
      dealCount++
    }
  }
  console.log(`✅ ${dealCount} internship deals seeded across kanban pipeline`)

  // ── 13. Showcase demo accounts — predictable creds for handoff ─────────
  // Generic Studente / Azienda accounts shared with prospective customers.
  // NOTE: real unicatt.it domain by explicit choice (option A on
  // 2026-05-04). The downside — possible collision with real Cattolica
  // mailboxes + outbound email risk — is accepted to keep the pattern
  // visually uniform with cattolica@unicatt.it (already shared 2026-04-20).
  // Idempotent via upsert.

  const cattStudentProfile = {
    firstName: 'Sofia',
    lastName: 'Conti',
    username: 'sofia-conti-cattolica',
    photo: 'https://api.dicebear.com/9.x/avataaars/svg?seed=sofia-conti-cattolica&backgroundColor=ffd5dc',
    tagline: 'M.Sc. Banking and Finance · ESG + valuation · in cerca di stage estate 2026',
    bio: "Studentessa M.Sc. Banking and Finance al Cattolica — campus Milano, laurea prevista luglio 2026. Tesi su framework ESG comparati (SFDR vs ISSB). Esperienza estiva in M&A boutique. Cerco stage curriculare di 6 mesi in investment banking, M&A advisory o ESG strategy, preferibilmente Milano o Londra.",
    linkedinUrl: 'https://linkedin.com/in/sofia-conti-cattolica-demo',
    skills: [
      'Financial Modeling', 'DCF Valuation', 'M&A',
      'Excel Avanzato', 'VBA', 'Bloomberg Terminal', 'Capital IQ',
      'Power BI', 'Python (data analysis)', 'SQL',
      'IFRS', 'Corporate Finance', 'ESG Reporting',
      'SFDR', 'Pitch Book Production',
    ],
    interests: ['Investment Banking', 'ESG', 'Sustainable Finance', 'Private Equity', 'Consulting'],
    workExperience: [
      {
        company: 'Lazard Italia',
        role: 'Summer Analyst — M&A',
        startDate: '2025-06-15',
        endDate: '2025-08-31',
        description: 'Stage estivo nel team M&A Italia. Supporto su 2 deal mid-cap (industrial + healthcare): research di mercato, analisi precedenti M&A multipli, contribuito a draft del pitch book. Stack: Excel, PowerPoint, Bloomberg.',
        current: false,
      },
    ],
  }

  const cattShowcaseStudent = await prisma.user.upsert({
    where: { email: 'studente@unicatt.it' },
    update: {
      ...cattStudentProfile,
      university: INSTITUTION_FULL,
      degree: 'Banking and Finance (Laurea Magistrale)',
      profilePublic: true,
      jobSearchStatus: 'ACTIVELY_LOOKING',
      emailVerified: true,
      emailVerifiedAt: new Date(),
      workExperience: cattStudentProfile.workExperience as any,
    },
    create: {
      email: 'studente@unicatt.it',
      passwordHash,
      role: 'STUDENT',
      ...cattStudentProfile,
      workExperience: cattStudentProfile.workExperience as any,
      university: INSTITUTION_FULL,
      degree: 'Banking and Finance (Laurea Magistrale)',
      graduationYear: '2026',
      gpa: '29/30',
      gpaPublic: true,
      location: 'Milano',
      country: 'IT',
      emailVerified: true,
      emailVerifiedAt: new Date(),
      profilePublic: true,
      jobSearchStatus: 'ACTIVELY_LOOKING',
      availabilityFrom: new Date(Date.now() + 60 * 86_400_000),
      lastLoginAt: new Date(),
    },
  })

  // Reset previous showcase data so re-seeds give a clean slate
  await prisma.project.deleteMany({ where: { userId: cattShowcaseStudent.id } })
  await prisma.application.deleteMany({ where: { applicantId: cattShowcaseStudent.id } })
  await prisma.profileView.deleteMany({ where: { profileUserId: cattShowcaseStudent.id } })
  await prisma.professorEndorsement.deleteMany({ where: { studentId: cattShowcaseStudent.id } })

  const cattProjects = [
    {
      title: 'DCF valuation di Spotify — sensitivity su churn e ARPU',
      description: "Analisi DCF su Spotify Technology SA (NYSE: SPOT) con costruzione del WACC bottom-up, sensitivity matrix su churn rate e ARPU per piano premium, comparable analysis con Apple Music + Sirius XM. Voto 30L. Tesi triennale, ora citata in un paper del corso M&A.",
      skills: ['DCF Valuation', 'Financial Modeling', 'Excel Avanzato', 'Capital IQ', 'Bloomberg Terminal'],
      grade: '30/30L',
      innovationScore: 86,
    },
    {
      title: 'ESG reporting framework — SFDR vs ISSB analisi comparativa',
      description: "Tesi magistrale in corso. Confronto strutturato tra il framework SFDR (UE) e ISSB (IFRS Foundation) per il reporting di sostenibilità. Mapping dei requisiti, gap analysis su un campione di 12 corporate europee, raccomandazioni operative per il CFO. Relatore: Prof. Capizzi (Banking and Finance).",
      skills: ['ESG Reporting', 'SFDR', 'IFRS', 'Sustainability Metrics', 'Corporate Finance'],
      grade: null,
      innovationScore: 88,
    },
    {
      title: 'Forecasting tassi BCE 2026-27 — modello VAR su dati Bloomberg',
      description: "Progetto del corso di Econometrics. Modello VAR multivariato per il forecasting dei tassi di policy BCE su orizzonte 2026-27, con variabili esogene HICP, output gap, M3. Validazione out-of-sample su 2024-25. Implementazione in Python (statsmodels).",
      skills: ['Python (data analysis)', 'Bloomberg Terminal', 'Risk Management'],
      grade: '29/30',
      innovationScore: 82,
    },
  ]
  const cattProjectIds: string[] = []
  for (const p of cattProjects) {
    const created = await prisma.project.create({
      data: {
        userId: cattShowcaseStudent.id,
        title: p.title,
        description: p.description,
        skills: p.skills,
        technologies: p.skills.slice(0, 3),
        discipline: 'BUSINESS',
        verificationStatus: 'VERIFIED',
        verifiedBy: admin.id,
        verifiedAt: randomDate(60),
        innovationScore: p.innovationScore,
        grade: p.grade,
        isPublic: true,
        createdAt: randomDate(180),
      },
    })
    cattProjectIds.push(created.id)
  }

  // Verified university email connection
  await prisma.universityConnection.upsert({
    where: { userId: cattShowcaseStudent.id },
    update: {
      verificationStatus: 'VERIFIED',
      verifiedAt: randomDate(120),
      universityName: INSTITUTION_FULL,
    },
    create: {
      userId: cattShowcaseStudent.id,
      universityId: 'unicatt',
      universityName: INSTITUTION_FULL,
      universityType: 'university',
      city: 'Milano',
      country: 'IT',
      institutionalEmail: 'sofia.conti@studenti.unicatt.it',
      verificationStatus: 'VERIFIED',
      verifiedAt: randomDate(120),
    },
  })

  // Professor endorsement
  if (cattProjectIds.length > 0) {
    await prisma.professorEndorsement.create({
      data: {
        studentId: cattShowcaseStudent.id,
        projectId: cattProjectIds[1], // ESG paper — most relevant for endorsement
        professorName: 'Prof. Giuseppe Capizzi',
        professorEmail: 'giuseppe.capizzi@unicatt.it',
        professorTitle: 'Full Professor',
        department: 'Banking and Finance',
        university: INSTITUTION_FULL,
        courseName: 'Sustainable Finance',
        courseCode: 'BFC-432',
        semester: 'Fall 2025',
        grade: '30L',
        endorsementText:
          "Sofia ha dimostrato capacità eccezionali nell'analisi comparativa dei framework di sustainability reporting. La tesi su SFDR vs ISSB è già materiale citabile per i nostri corsi avanzati. Forte attitudine analitica, comunicazione chiara, eccellente per ruoli M&A o ESG advisory.",
        skills: ['ESG Reporting', 'Financial Modeling', 'Critical Analysis', 'Communication', 'Research'],
        rating: 5,
        verified: true,
        verifiedAt: randomDate(45),
        status: 'VERIFIED',
      },
    })
  }

  // Showcase recruiter
  const cattRecruiterProfile = {
    firstName: 'Alessandro',
    lastName: 'Greco',
    username: 'alessandro-greco-azienda-demo',
    photo: 'https://api.dicebear.com/9.x/avataaars/svg?seed=alessandro-greco-azienda&backgroundColor=c0aede',
    company: 'Studio Demo Consulting',
    jobTitle: 'Talent Acquisition Lead',
    bio: "Talent acquisition con 10 anni di esperienza nel matching tra laureandi Economia / Business e ruoli di consulting, M&A, ESG advisory. Partner del Servizio Stage e Placement Cattolica dal 2023.",
    linkedinUrl: 'https://linkedin.com/in/alessandro-greco-demo',
  }

  const cattShowcaseRecruiter = await prisma.user.upsert({
    where: { email: 'azienda@unicatt.it' },
    update: {
      ...cattRecruiterProfile,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
    create: {
      email: 'azienda@unicatt.it',
      passwordHash,
      role: 'RECRUITER',
      ...cattRecruiterProfile,
      location: 'Milano',
      country: 'IT',
      emailVerified: true,
      emailVerifiedAt: new Date(),
      profilePublic: true,
      lastLoginAt: new Date(),
    },
  })

  await prisma.savedCandidate.deleteMany({ where: { recruiterId: cattShowcaseRecruiter.id } })
  await prisma.job.deleteMany({ where: { recruiterId: cattShowcaseRecruiter.id } })
  await prisma.message.deleteMany({
    where: { senderId: cattShowcaseRecruiter.id, recipientId: cattShowcaseStudent.id },
  })

  // Active job from showcase recruiter, attached to Cattolica workspace
  const cattShowcaseJob = await prisma.job.create({
    data: {
      recruiterId: cattShowcaseRecruiter.id,
      institutionId: admin.id,
      slug: `summer-analyst-ma-advisory-demo-${Date.now()}`,
      title: 'Summer Analyst — M&A Advisory',
      description: "Stage curriculare 3-6 mesi presso il team M&A Advisory di Studio Demo Consulting, sede Milano. Cerchiamo studenti laureandi magistrali in Banking and Finance / Economics con forte attitudine analitica, padronanza di Excel/PowerPoint e interesse per il mondo deal-making. Possibilità di estensione e graduate offer post-stage.",
      companyName: 'Studio Demo Consulting',
      location: 'Milano, Italia',
      jobType: 'INTERNSHIP',
      workLocation: 'ON_SITE',
      salaryMin: 1200,
      salaryMax: 1800,
      salaryCurrency: 'EUR',
      salaryPeriod: 'MONTHLY',
      requiredSkills: ['Financial Modeling', 'Excel Avanzato', 'PowerPoint', 'M&A', 'DCF Valuation'],
      status: 'ACTIVE',
      isPublic: true,
      offerType: 'TIROCINIO_EXTRA',
      approvedByStaffId: admin.id,
      approvedAt: randomDate(14),
      postedAt: randomDate(14),
    },
  })

  // Save showcase student + 3 real students
  const cattCandidatesToSave = [cattShowcaseStudent.id, ...pickN(studentIds, 3)]
  for (const candidateId of cattCandidatesToSave) {
    await prisma.savedCandidate.create({
      data: {
        recruiterId: cattShowcaseRecruiter.id,
        candidateId,
        createdAt: randomDate(30),
      },
    })
  }

  // 3 applications: one to showcase recruiter's job, two to other active jobs
  const cattActiveJobs = await prisma.job.findMany({
    where: { institutionId: admin.id, status: 'ACTIVE', NOT: { id: cattShowcaseJob.id } },
    select: { id: true },
    take: 2,
  })
  const cattAppTargets = [cattShowcaseJob.id, ...cattActiveJobs.map(j => j.id)]
  const cattAppStatuses: Array<'PENDING' | 'REVIEWING' | 'INTERVIEW'> = ['INTERVIEW', 'REVIEWING', 'PENDING']
  for (let i = 0; i < cattAppTargets.length; i++) {
    try {
      await prisma.application.create({
        data: {
          applicantId: cattShowcaseStudent.id,
          jobId: cattAppTargets[i],
          status: cattAppStatuses[i],
          coverLetter:
            "Gentile team, sono Sofia Conti, studentessa M.Sc. Banking and Finance al Cattolica. Ho fatto stage estivo in M&A boutique e la mia tesi su framework ESG è in linea con il vostro approccio. Sarei felice di approfondire in un colloquio.",
          selectedProjects: cattProjectIds.slice(0, 2),
          createdAt: randomDate(20),
        },
      })
    } catch {
      // duplicate (jobId, applicantId) — skip
    }
  }

  // Profile views
  const cattViewers = [
    { id: cattShowcaseRecruiter.id, role: 'RECRUITER' as const, company: 'Studio Demo Consulting' },
    ...recruiterIds.slice(0, 4).map(r => ({ id: r.id, role: 'RECRUITER' as const, company: r.company })),
  ]
  for (const v of cattViewers) {
    await prisma.profileView.create({
      data: {
        profileUserId: cattShowcaseStudent.id,
        viewerId: v.id,
        viewerRole: v.role,
        viewerCompany: v.company,
        createdAt: randomDate(7),
      },
    })
  }

  // Inbound message
  await prisma.message.create({
    data: {
      senderId: cattShowcaseRecruiter.id,
      recipientId: cattShowcaseStudent.id,
      recipientEmail: cattShowcaseStudent.email,
      subject: 'Summer Analyst M&A — Studio Demo Consulting',
      content:
        "Ciao Sofia,\n\nho visto il tuo profilo e in particolare la tesi su SFDR vs ISSB — molto interessante e in linea con un mandato che stiamo seguendo nel settore industrial. Stiamo cercando un summer analyst per il nostro team M&A Advisory e penso che il tuo background si adatti perfettamente.\n\nSaresti disponibile per una breve call conoscitiva nei prossimi giorni?\n\nA presto,\nAlessandro Greco — Talent Acquisition Lead, Studio Demo Consulting",
      threadId: `demo-thread-cat-${cattShowcaseStudent.id}-${cattShowcaseRecruiter.id}`,
      read: false,
      createdAt: new Date(Date.now() - 2 * 86_400_000),
    },
  })

  console.log(`✅ Showcase accounts: studente@unicatt.it + azienda@unicatt.it`)
  console.log(`   Studente: 3 progetti verificati, 3 applications, 5 profile views, 1 messaggio, university+endorsement verificati`)

  console.log(`\n🎉 Cattolica demo ready.`)
  console.log(`   Università: cattolica@unicatt.it / demo2024!`)
  console.log(`   Studente:   studente@unicatt.it  / demo2024!`)
  console.log(`   Azienda:    azienda@unicatt.it   / demo2024!\n`)
  console.log(`   Demo surface area:`)
  console.log(`   - Multi-campus (Milano, Roma, Brescia, Piacenza, Cremona)`)
  console.log(`   - 30 students across ${TRACKS.length} programs / 8 faculties`)
  console.log(`   - 20 partner companies (banking, consulting, industrial, luxury, health)`)
  console.log(`   - 16 conventions (active + pending + expired)`)
  console.log(`   - 10 career events with RSVPs (the feature Cattolica liked)`)
  console.log(`   - 70% placements + 90% alumni employment (Cattolica-realistic numbers)`)
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
