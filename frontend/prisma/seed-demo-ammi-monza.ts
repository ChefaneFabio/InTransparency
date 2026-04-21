/**
 * Seed script: Create demo data for AMMI Monza (ITS Academy).
 *
 * Prepared for the 2026-04-21 call with Francesca Anedda (tirocini).
 * Run: npx tsx prisma/seed-demo-ammi-monza.ts
 *
 * Login:    monza@ammi-monza.it
 * Password: demo2024!
 *
 * Differs from seed-demo-unibg.ts in three ways:
 *   1. institutionType = 'its' (not 'university') — triggers the ITS-flavoured
 *      onboarding copy and dashboards.
 *   2. Tracks (indirizzi) replace degrees — ITS is organised by specialisation.
 *   3. Every student has at least one stage/tirocinio — that's the core ITS
 *      activity and the procurement angle AMMI will care about.
 */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const INSTITUTION_NAME = 'AMMI Monza'
const INSTITUTION_FULL = 'Fondazione ITS AMMI Monza'
const INSTITUTION_SHORT = 'AMMI'

// ITS is organised by "indirizzi" (tracks), not degrees. These are the most
// common tracks in a Monza/Brianza technical ITS.
const TRACKS = [
  'Meccatronica e Automazione Industriale',
  'Digital Transformation & Industria 4.0',
  'Sistemi Meccanici e Produzione',
  'Elettronica e IoT Industriale',
  'Programmazione CNC e Produzione',
  'Tecnico Superiore Manutenzione Industriale',
]

const SKILLS_POOL = [
  // Mechatronics & automation
  'PLC Siemens', 'PLC Rockwell', 'SCADA', 'HMI', 'CNC Fanuc', 'CAD/CAM',
  'SolidWorks', 'Inventor', 'AutoCAD', 'CATIA',
  // Robotics
  'Robotica ABB', 'Robotica KUKA', 'Robotica Comau', 'Fanuc Robot Programming',
  // Industry 4.0 / digital
  'Industria 4.0', 'IoT', 'MQTT', 'OPC UA', 'Digital Twin', 'Manutenzione Predittiva',
  // Programming (for ITS level)
  'Python', 'C#', 'Ladder Logic', 'Structured Text', 'SQL', 'Node-RED',
  // Data / AI basics
  'Power BI', 'Excel avanzato', 'Machine Learning base', 'Visione Artificiale',
  // Soft / business
  'Teamwork', 'Problem Solving', 'Lean Manufacturing', 'ISO 9001', 'Sicurezza sul lavoro',
]

// Realistic Monza / Brianza / north Lombardia partner pool. Mix of automotive,
// mechatronics, packaging, electronics — the actual industrial fabric.
const COMPANIES = [
  'Brembo', 'Pirelli Monza', 'Magneti Marelli', 'ST Microelectronics Agrate',
  'Candy Hoover', 'Whirlpool Cassinetta', 'Comau Robotics',
  'ABB Italy', 'Schneider Electric Stezzano', 'Omron Adaptive Industrial',
  'Rockwell Automation Italy', 'Mitsubishi Electric Italy',
  'Coesia Group', 'IMA Automation', 'Marposs',
  'Pedrollo Pumps', 'GEFIT Automation', 'Tenova Italia',
  'Breton Machine Tools', 'Fagor Automation Italy',
]

const PROJECT_TITLES = [
  'Cella robotizzata per pick-and-place — ABB IRB 1200',
  'Sistema di manutenzione predittiva su linea di assemblaggio',
  'Retrofit PLC Siemens S7-1500 su pressa idraulica',
  'Digital twin di un magazzino automatico',
  'Integrazione OPC UA tra MES e linea CNC',
  'Visione artificiale per controllo qualità su linea packaging',
  'Automazione macchina etichettatrice con PLC + HMI',
  'Monitoraggio vibrazioni cuscinetti via IoT + Node-RED',
  'Ottimizzazione tempi ciclo cella robotizzata',
  'Dashboard OEE in tempo reale per reparto produttivo',
  'Pianificazione produzione con algoritmo JSSP',
  'Simulazione FEM ammortizzatore automotive',
  'Sistema tracciabilità lotti con QR + DB PostgreSQL',
  'Retrofit macchina taglio laser con controllo numerico moderno',
  'Interfaccia HMI touchscreen per linea imbottigliamento',
  'Quadro elettrico macchina confezionatrice — dimensionamento e cablaggio',
  'Calibrazione robot collaborativo UR5 per pallettizzazione',
  'Analisi guasti (RCA) linea assemblaggio motori',
  'Programma CNC fresatura 5 assi per componente auto',
  'Audit energetico reparto con contatori IoT',
]

// Italian first/last names, same pool as UniBG seed
const FIRST_NAMES = [
  'Marco', 'Giulia', 'Alessandro', 'Francesca', 'Luca', 'Chiara',
  'Matteo', 'Sara', 'Andrea', 'Valentina', 'Lorenzo', 'Elena',
  'Federico', 'Martina', 'Davide', 'Sofia', 'Simone', 'Anna',
  'Riccardo', 'Laura', 'Nicola', 'Alice', 'Stefano', 'Beatrice',
  'Giovanni', 'Elisa',
]
const LAST_NAMES = [
  'Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano',
  'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno', 'Gallo',
  'Conti', 'Mancini', 'Costa', 'Giordano', 'Rizzo', 'Lombardi',
  'Moretti', 'Barbieri', 'Fontana', 'Santoro', 'Mariani', 'Rinaldi',
]

const MONZA_AREA_CITIES = [
  'Monza', 'Lissone', 'Desio', 'Brugherio', 'Vimercate', 'Seregno',
  'Cesano Maderno', 'Cinisello Balsamo', 'Sesto San Giovanni', 'Milano',
]

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
  console.log(`\n🎓 Seeding demo data for ${INSTITUTION_NAME}...\n`)

  const passwordHash = await bcrypt.hash('demo2024!', 10)

  // ── 1. Institution admin (Francesca Anedda persona — tirocini) ─────
  const admin = await prisma.user.upsert({
    where: { email: 'monza@ammi-monza.it' },
    update: {},
    create: {
      email: 'monza@ammi-monza.it',
      passwordHash,
      role: 'UNIVERSITY', // single academic-partner role in DB; institutionType distinguishes ITS from uni in onboarding
      firstName: 'Francesca',
      lastName: 'Anedda',
      company: INSTITUTION_FULL,
      university: INSTITUTION_FULL,
      jobTitle: 'Responsabile tirocini',
      emailVerified: true,
      profilePublic: true,
      bio: "Ufficio tirocini di AMMI Monza. Ci occupiamo di matching tra studenti ITS e aziende del tessuto produttivo di Monza e Brianza.",
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
        "Fondazione ITS Academy specializzata in meccatronica, automazione industriale e Industria 4.0. Partnership attive con il tessuto produttivo di Monza e Brianza. Percorsi biennali post-diploma con 40% di tirocinio curriculare.",
      institutionType: 'its',
    },
  })
  console.log(`✅ UniversitySettings (institutionType=its)`)

  // ── 2. Students — ~30 across the 6 tracks ─────────────────────────
  const studentIds: string[] = []
  const studentByTrack: Record<string, string[]> = {}
  for (let i = 0; i < 30; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length]
    const lastName = LAST_NAMES[i % LAST_NAMES.length]
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@studenti.ammi-monza.it`
    const track = TRACKS[i % TRACKS.length]
    const skills = pickN(SKILLS_POOL, randomInt(4, 9))
    // ITS is 2-year post-diploma; typical ages 19-23.
    const gradYear = String(randomInt(2025, 2027))
    const gpa = (randomInt(23, 30) + randomInt(0, 9) / 10).toFixed(1)

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
        degree: track,
        graduationYear: gradYear,
        gpa,
        gpaPublic: Math.random() > 0.3,
        skills,
        bio: `Studente ${INSTITUTION_SHORT} — indirizzo ${track}. Interessi: ${skills.slice(0, 3).join(', ')}.`,
        location: pick(MONZA_AREA_CITIES),
        emailVerified: Math.random() > 0.15,
        profilePublic: Math.random() > 0.2,
        lastLoginAt: randomDate(60),
        interests: pickN(['Automazione', 'Industria 4.0', 'Robotica', 'Manutenzione predittiva', 'Qualità', 'Sicurezza'], randomInt(2, 3)),
      },
    })
    studentIds.push(student.id)
    ;(studentByTrack[track] ||= []).push(student.id)
  }
  console.log(`✅ ${studentIds.length} students across ${TRACKS.length} tracks`)

  // ── 3. Projects (every student has 1-3 — ITS projects are tirocinio-linked) ──
  let projectCount = 0
  for (const studentId of studentIds) {
    const n = randomInt(1, 3)
    for (let p = 0; p < n; p++) {
      const title = pick(PROJECT_TITLES)
      const verified = Math.random() > 0.25 // ITS projects are highly verified
      const projectSkills = pickN(SKILLS_POOL, randomInt(3, 6))
      await prisma.project.create({
        data: {
          userId: studentId,
          title,
          description: `Progetto sviluppato in collaborazione con un'azienda partner di AMMI Monza nel contesto del tirocinio curriculare. Include ${projectSkills.slice(0, 3).join(', ')}. Valutazione finale in sede di stage.`,
          skills: projectSkills,
          technologies: pickN(projectSkills, 3),
          discipline: pick(['ENGINEERING', 'TECHNOLOGY']),
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
  console.log(`✅ ${projectCount} projects created`)

  // ── 4. Recruiter accounts for Monza/Brianza companies ─────────────
  const recruiterIds: { id: string; company: string }[] = []
  for (let r = 0; r < 12; r++) {
    const company = COMPANIES[r]
    const slug = company.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    const recruiter = await prisma.user.upsert({
      where: { email: `hr@${slug}.demo` },
      update: {},
      create: {
        email: `hr@${slug}.demo`,
        passwordHash,
        role: 'RECRUITER',
        firstName: pick(FIRST_NAMES),
        lastName: pick(LAST_NAMES),
        company,
        jobTitle: pick(['HR Manager', 'Talent Acquisition', 'Recruiter Junior', 'Responsabile Risorse Umane']),
        emailVerified: true,
        profilePublic: true,
      },
    })
    recruiterIds.push({ id: recruiter.id, company })

    // Profile views on 3-8 students
    const viewed = pickN(studentIds, randomInt(3, 8))
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
  console.log(`✅ ${recruiterIds.length} recruiters with profile views`)

  // ── 5. Placements (ITS has strong placement rates — 70% get placed) ───
  const placed = pickN(studentIds, 21)
  for (const sid of placed) {
    await prisma.placement.create({
      data: {
        studentId: sid,
        universityName: INSTITUTION_FULL,
        companyName: pick(COMPANIES),
        jobTitle: pick([
          'Tecnico Meccatronico',
          'PLC Programmer Junior',
          'Manutentore Industriale',
          'Tecnico Automazione',
          'Programmatore CNC',
          'Quality Engineer Junior',
          'Tecnico Industria 4.0',
        ]),
        status: 'CONFIRMED',
        salaryAmount: randomInt(22000, 32000), // ITS post-diploma entry salaries
        salaryCurrency: 'EUR',
        startDate: randomDate(120),
        companyIndustry: pick(['Manufacturing', 'Automotive', 'Automation', 'Packaging', 'Electronics']),
      },
    })
  }
  console.log(`✅ ${placed.length} confirmed placements (70% placement rate)`)

  // ── 6. Alumni records ─────────────────────────────────────────────
  const alumni = pickN(studentIds, 12)
  for (const sid of alumni) {
    const employed = Math.random() > 0.15 // ITS alumni employment ~85%
    await prisma.alumniRecord.upsert({
      where: { userId: sid },
      update: {},
      create: {
        userId: sid,
        universityName: INSTITUTION_FULL,
        graduationYear: String(randomInt(2022, 2025)),
        degree: pick(TRACKS),
        department: 'Meccatronica',
        employmentStatus: employed ? 'EMPLOYED' : pick(['SEEKING', 'FURTHER_STUDY']),
        currentCompany: employed ? pick(COMPANIES) : null,
        currentRole: employed ? pick([
          'Tecnico Meccatronico',
          'PLC Programmer',
          'Manutentore',
          'Automation Engineer',
          'Quality Specialist',
        ]) : null,
        currentIndustry: employed ? 'Manufacturing' : null,
        salary: employed ? randomInt(25000, 38000) : null,
        salaryCurrency: 'EUR',
        location: employed ? pick(MONZA_AREA_CITIES) : null,
      },
    })
  }
  console.log(`✅ ${alumni.length} alumni records (~85% employed)`)

  // ── 7. Some contact usage to show real recruiter engagement ───────
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

  console.log(`
🎉 AMMI Monza demo seed complete.

📧 Login:    monza@ammi-monza.it
🔑 Password: demo2024!

Data:
   ${studentIds.length} students across ${TRACKS.length} tracks
   ${projectCount} projects (most verified)
   ${recruiterIds.length} recruiter accounts (Monza/Brianza companies)
   ${placed.length} confirmed placements
   ${alumni.length} alumni records
   ${contactCount} recruiter→student contacts

Onboarding note: institutionType is set to 'its', so dashboards will
surface ITS-flavoured copy (tracks vs degrees, PCTO/tirocinio focus).
`)
}

main()
  .catch(e => { console.error('❌ Seed failed:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
