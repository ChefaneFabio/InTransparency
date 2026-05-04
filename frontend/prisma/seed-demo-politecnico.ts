/**
 * Seed script: Politecnico di Milano (demo identity).
 *
 * Prepared for the 2026-04-23 meeting with the Politecnico career service.
 * Run: npx tsx prisma/seed-demo-politecnico.ts
 *
 * Demo login:
 *   Admin:    career@polimi.demo     (password: demo2024!)
 *   Student:  marco.rossi1@studenti.polimi.demo
 *
 * After seeding, the Institutional Workspace is fully populated:
 *   - M1 Mediation Inbox  — several in PENDING_REVIEW from partner companies
 *   - M2 Offer Moderation — a handful of offers in PENDING_APPROVAL
 *   - M3 Company CRM      — ~18 partner companies across the 8-stage pipeline
 *   - M4 Placement Pipeline — ~22 placements in various stages
 *   - Conversational assistants have real data to query
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const INSTITUTION_NAME = 'Politecnico di Milano'
const INSTITUTION_SHORT = 'PoliMi'
const INSTITUTION_DOMAIN = 'polimi.demo'
const INSTITUTION_SLUG = 'politecnico-milano-demo'

// Real Politecnico programs — Laurea Magistrale (MSc)
const PROGRAMS: Array<{ name: string; discipline: string; school: string }> = [
  { name: 'Ingegneria Meccanica',       discipline: 'ENGINEERING',  school: 'Ingegneria Industriale' },
  { name: 'Ingegneria Aerospaziale',    discipline: 'ENGINEERING',  school: 'Ingegneria Industriale' },
  { name: 'Ingegneria Biomedica',       discipline: 'ENGINEERING',  school: 'Ingegneria Industriale' },
  { name: 'Ingegneria Elettrica',       discipline: 'ENGINEERING',  school: 'Ingegneria Industriale' },
  { name: 'Ingegneria Informatica',     discipline: 'TECHNOLOGY',   school: 'Ingegneria Informatica' },
  { name: 'Computer Science & Engineering', discipline: 'TECHNOLOGY', school: 'Ingegneria Informatica' },
  { name: 'Data Science & Engineering', discipline: 'TECHNOLOGY',   school: 'Ingegneria Informatica' },
  { name: 'Ingegneria Gestionale',      discipline: 'BUSINESS',     school: 'Ingegneria Gestionale' },
  { name: 'Ingegneria Matematica',      discipline: 'SCIENCE',      school: 'Ingegneria Industriale' },
  { name: 'Design del Prodotto',        discipline: 'DESIGN',       school: 'Design' },
]

const SKILLS_BY_PROGRAM: Record<string, string[]> = {
  'Ingegneria Meccanica': [
    'SolidWorks', 'CATIA', 'Ansys Mechanical', 'MATLAB', 'Simulink',
    'CFD', 'FEM', 'OpenFOAM', 'ParaView', 'Abaqus',
    'Additive Manufacturing', 'CNC Programming', 'GD&T',
    'Thermodynamics', 'Fluid Dynamics', 'Python',
  ],
  'Ingegneria Aerospaziale': [
    'OpenVSP', 'ANSYS Fluent', 'MATLAB', 'Simulink', 'Python',
    'Aerodynamics', 'Propulsion', 'Flight Dynamics', 'CFD',
    'STK (Systems Tool Kit)', 'MATLAB/Simulink Aerospace Toolbox',
    'Composite Materials', 'FEA', 'Trajectory Optimization',
  ],
  'Ingegneria Biomedica': [
    'Python', 'MATLAB', 'Medical Image Processing', 'DICOM',
    'ITK/VTK', 'TensorFlow', 'PyTorch', 'Signal Processing',
    'EEG/ECG analysis', '3D Slicer', 'COMSOL', 'LabVIEW',
    'Biosensors', 'Machine Learning',
  ],
  'Ingegneria Elettrica': [
    'MATLAB', 'Simulink', 'PSCAD', 'PLECS', 'LTspice',
    'Power Electronics', 'Electric Machines', 'Grid Integration',
    'Renewable Energy Systems', 'FPGA (VHDL/Verilog)', 'Smart Grid',
    'Python', 'Control Systems',
  ],
  'Ingegneria Informatica': [
    'Java', 'Python', 'C++', 'JavaScript', 'TypeScript',
    'Spring Boot', 'React', 'Node.js', 'PostgreSQL', 'MongoDB',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'Git',
    'System Design', 'Microservices', 'REST API',
  ],
  'Computer Science & Engineering': [
    'Python', 'C++', 'Java', 'Rust', 'Haskell',
    'TensorFlow', 'PyTorch', 'scikit-learn', 'Hugging Face',
    'Kubernetes', 'Docker', 'Linux systems', 'Algorithms',
    'Distributed Systems', 'Computer Vision', 'NLP',
  ],
  'Data Science & Engineering': [
    'Python', 'R', 'SQL', 'Spark', 'PySpark', 'Hadoop',
    'TensorFlow', 'PyTorch', 'scikit-learn', 'XGBoost',
    'Pandas', 'NumPy', 'Tableau', 'Power BI', 'dbt',
    'Statistics', 'A/B Testing', 'Causal Inference',
  ],
  'Ingegneria Gestionale': [
    'Excel', 'Power BI', 'Tableau', 'Python', 'R',
    'SAP', 'Salesforce', 'Monday.com', 'Jira',
    'Supply Chain Management', 'Lean Six Sigma', 'PMP',
    'Financial Modeling', 'Process Optimization',
    'SQL', 'Data Visualization',
  ],
  'Ingegneria Matematica': [
    'MATLAB', 'Python', 'R', 'Julia', 'Mathematica',
    'Numerical Analysis', 'Optimization', 'Stochastic Processes',
    'PDEs', 'Monte Carlo', 'Scientific Computing',
    'Machine Learning', 'Quantitative Finance',
  ],
  'Design del Prodotto': [
    'Figma', 'Adobe Creative Suite', 'Rhino', 'Grasshopper',
    'Keyshot', 'Blender', 'SolidWorks', '3D Printing',
    'UX Research', 'Prototyping', 'User Testing',
    'Design Thinking', 'Service Design',
  ],
}

const PROJECT_TITLES_BY_PROGRAM: Record<string, string[]> = {
  'Ingegneria Meccanica': [
    'CFD simulation of turbulent flow around wind turbine blades',
    'Topology optimization of aerospace bracket for additive manufacturing',
    'Thermal analysis of lithium-ion battery pack under fast-charging',
    'Design of a regenerative braking system for urban EVs',
    'FEM study on fatigue life of offshore wind tower welds',
  ],
  'Ingegneria Aerospaziale': [
    'Trajectory optimization for CubeSat deorbit maneuvers',
    'Aeroelastic analysis of high-aspect-ratio wings',
    'Hybrid-electric propulsion system for regional aircraft',
    'CFD study on inlet distortion for supersonic engines',
    'Guidance, Navigation & Control for lunar lander descent',
  ],
  'Ingegneria Biomedica': [
    'Deep learning segmentation of cardiac MRI for volumetric analysis',
    'Wearable ECG device with real-time arrhythmia detection',
    'Computational modeling of blood flow in aneurysms',
    'ML-based early detection of diabetic retinopathy',
    'Brain-computer interface for motor-impaired users',
  ],
  'Ingegneria Elettrica': [
    'Grid integration of a 100 kW rooftop PV system',
    'Power electronics converter for electric vehicle fast-charging',
    'Fault detection in distribution networks using ML',
    'FPGA-based control of induction motors',
    'Optimal sizing of community energy storage',
  ],
  'Ingegneria Informatica': [
    'Microservices architecture for e-commerce checkout',
    'Real-time video streaming with adaptive bitrate (MPEG-DASH)',
    'Distributed task queue with Kubernetes and Redis',
    'GraphQL federation for a multi-product SaaS',
    'Blockchain-based supply chain traceability',
  ],
  'Computer Science & Engineering': [
    'Transformer-based code completion for Italian public sector',
    'Federated learning for medical imaging across hospitals',
    'Vector database for semantic search on patent archives',
    'Compiler optimization for embedded ARM Cortex-M',
    'RAG pipeline with citation tracking for legal research',
  ],
  'Data Science & Engineering': [
    'Predictive maintenance on Trenord rolling-stock telemetry',
    'Causal inference on marketing campaign lift (A/B testing)',
    'Real-time fraud detection for PSD2 open-banking APIs',
    'Demand forecasting for urban bike-sharing network',
    'Recommender system with fairness constraints',
  ],
  'Ingegneria Gestionale': [
    'Supply chain optimization for Italian fashion retail',
    'Digital transformation roadmap for a manufacturing SME',
    'Lean Six Sigma in automotive Tier-1 assembly line',
    'ESG reporting automation pipeline',
    'Process mining on claims-handling workflow (bank)',
  ],
  'Ingegneria Matematica': [
    'Monte Carlo pricing of exotic derivatives',
    'PDE-constrained optimization for seismic inversion',
    'Stochastic volatility models for crypto markets',
    'Machine learning for PDE discovery from data',
    'Neural ODEs for system identification',
  ],
  'Design del Prodotto': [
    'Redesign of public transit ticketing kiosks for accessibility',
    'Circular-economy product system for small appliances',
    'Digital twin UX for a manufacturing shop floor',
    'Assistive device for elderly mobility',
    'Service blueprint for a hospital patient journey',
  ],
}

// Real Lombardy-region & Italian industrial employers of Politecnico grads.
const PARTNER_COMPANIES = [
  { name: 'Leonardo',            sector: 'Aerospace & Defense' },
  { name: 'Pirelli',             sector: 'Automotive' },
  { name: 'STMicroelectronics',  sector: 'Semiconductors' },
  { name: 'Eni',                 sector: 'Energy' },
  { name: 'Enel',                sector: 'Energy' },
  { name: 'A2A',                 sector: 'Utilities' },
  { name: 'Luxottica',           sector: 'Consumer Goods' },
  { name: 'Ferrari',             sector: 'Automotive' },
  { name: 'Ducati',              sector: 'Automotive' },
  { name: 'Prada',               sector: 'Fashion & Luxury' },
  { name: 'Brembo',              sector: 'Automotive' },
  { name: 'UniCredit',           sector: 'Banking' },
  { name: 'Intesa Sanpaolo',     sector: 'Banking' },
  { name: 'Generali',            sector: 'Insurance' },
  { name: 'Accenture Italia',    sector: 'Consulting' },
  { name: 'Deloitte Italy',      sector: 'Consulting' },
  { name: 'Reply',               sector: 'Consulting' },
  { name: 'Bending Spoons',      sector: 'Tech' },
  { name: 'Satispay',            sector: 'Fintech' },
  { name: 'Musixmatch',          sector: 'Tech' },
]

const FIRST_NAMES = [
  'Marco', 'Giulia', 'Francesco', 'Alessandro', 'Chiara', 'Matteo',
  'Sara', 'Luca', 'Martina', 'Davide', 'Elena', 'Andrea',
  'Giorgia', 'Simone', 'Alessia', 'Lorenzo', 'Federica',
  'Riccardo', 'Beatrice', 'Stefano', 'Valentina', 'Tommaso',
  'Ilaria', 'Paolo', 'Anna', 'Pietro', 'Silvia', 'Luigi',
  'Camilla', 'Edoardo',
]

const LAST_NAMES = [
  'Rossi', 'Bianchi', 'Ferrari', 'Russo', 'Esposito', 'Romano',
  'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno', 'Gallo',
  'Conti', 'De Luca', 'Mancini', 'Costa', 'Giordano', 'Rizzo',
  'Moretti', 'Barbieri', 'Fontana', 'Santoro', 'Marchetti', 'Monti',
  'Leone', 'Villa', 'Pellegrini', 'Caruso', 'Ferri', 'Galli',
]

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
const pickN = <T,>(arr: T[], n: number): T[] => {
  const copy = [...arr]
  const out: T[] = []
  for (let i = 0; i < Math.min(n, copy.length); i++) {
    out.push(...copy.splice(Math.floor(Math.random() * copy.length), 1))
  }
  return out
}
const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min
const randDate = (daysAgoMax: number) =>
  new Date(Date.now() - randInt(0, daysAgoMax) * 86_400_000)

async function main() {
  console.log(`\n🎓 Seeding ${INSTITUTION_NAME} demo...\n`)
  const passwordHash = await bcrypt.hash('demo2024!', 10)

  // ── Clean previous Politecnico seed data ───────────────────────────────
  const stale = await prisma.user.findMany({
    where: {
      OR: [
        { email: { endsWith: `@studenti.${INSTITUTION_DOMAIN}` } },
        { email: { endsWith: `@${INSTITUTION_DOMAIN}` } },
        { university: INSTITUTION_NAME },
      ],
    },
    select: { id: true },
  })
  const staleIds = stale.map(s => s.id)
  if (staleIds.length) {
    await prisma.project.deleteMany({ where: { userId: { in: staleIds } } })
    await prisma.placement.deleteMany({ where: { studentId: { in: staleIds } } })
    await prisma.profileView.deleteMany({
      where: {
        OR: [
          { profileUserId: { in: staleIds } },
          { viewerId: { in: staleIds } },
        ],
      },
    })
    await prisma.savedCandidate.deleteMany({
      where: {
        OR: [
          { candidateId: { in: staleIds } },
          { recruiterId: { in: staleIds } },
        ],
      },
    })
    await prisma.institutionAffiliation.deleteMany({
      where: { studentId: { in: staleIds } },
    })
    await prisma.user.deleteMany({ where: { id: { in: staleIds } } })
    console.log(`🧹 Cleaned up ${staleIds.length} stale records`)
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email: `career@${INSTITUTION_DOMAIN}` },
    select: { id: true },
  })
  if (existingAdmin) {
    await prisma.companyLead.deleteMany({ where: { institutionId: existingAdmin.id } })
    await prisma.mediationMessage.deleteMany({
      where: { thread: { institutionId: existingAdmin.id } },
    })
    await prisma.mediationThread.deleteMany({ where: { institutionId: existingAdmin.id } })
    await prisma.pipelineStage.deleteMany({ where: { institutionId: existingAdmin.id } })
    await prisma.placementStage.deleteMany({ where: { institutionId: existingAdmin.id } })
  }

  // Also clean any Institution row matching our slug (it gets keyed by the
  // prior admin.id which may have been deleted above — an orphan otherwise)
  const existingInst = await prisma.institution.findUnique({
    where: { slug: INSTITUTION_SLUG },
    select: { id: true },
  })
  if (existingInst) {
    await prisma.institutionStaff.deleteMany({ where: { institutionId: existingInst.id } })
    await prisma.institutionAffiliation.deleteMany({ where: { institutionId: existingInst.id } })
    await prisma.companyLead.deleteMany({ where: { institutionId: existingInst.id } })
    await prisma.pipelineStage.deleteMany({ where: { institutionId: existingInst.id } })
    await prisma.placementStage.deleteMany({ where: { institutionId: existingInst.id } })
    await prisma.mediationMessage.deleteMany({
      where: { thread: { institutionId: existingInst.id } },
    })
    await prisma.mediationThread.deleteMany({ where: { institutionId: existingInst.id } })
    await prisma.placement.deleteMany({ where: { institutionId: existingInst.id } })
    await prisma.job.deleteMany({ where: { institutionId: existingInst.id } })
    await prisma.institution.delete({ where: { id: existingInst.id } })
  }

  // ── 1. Admin (career-service owner) ────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: `career@${INSTITUTION_DOMAIN}` },
    update: {
      firstName: 'Elisa',
      lastName: 'Moretti',
      jobTitle: 'Career Service Coordinator',
      university: INSTITUTION_NAME,
      company: INSTITUTION_NAME,
      bio: "Career Service del Politecnico di Milano. Ci occupiamo di connettere gli studenti con le aziende partner per stage curriculari, tesi in azienda e placement post-laurea.",
      location: 'Milano, Italy',
    },
    create: {
      email: `career@${INSTITUTION_DOMAIN}`,
      passwordHash,
      role: 'UNIVERSITY',
      firstName: 'Elisa',
      lastName: 'Moretti',
      company: INSTITUTION_NAME,
      university: INSTITUTION_NAME,
      jobTitle: 'Career Service Coordinator',
      emailVerified: true,
      profilePublic: true,
      bio: "Career Service del Politecnico di Milano. Ci occupiamo di connettere gli studenti con le aziende partner per stage curriculari, tesi in azienda e placement post-laurea.",
      location: 'Milano, Italy',
    },
  })
  console.log(`✅ Admin: ${admin.email}`)

  // ── 2. Institution record — PREMIUM, full workspace enabled ────────────
  await prisma.institution.upsert({
    where: { id: admin.id },
    update: {
      plan: 'PREMIUM',
      mediationEnabled: true,
      requireOfferApproval: true,
    },
    create: {
      id: admin.id,
      name: INSTITUTION_NAME,
      slug: INSTITUTION_SLUG,
      type: 'UNIVERSITY_PUBLIC',
      plan: 'PREMIUM',
      mediationEnabled: true,
      requireOfferApproval: true,
      city: 'Milano',
      region: 'Lombardia',
      country: 'IT',
      primaryAdminId: admin.id,
      legalName: 'Politecnico di Milano',
      website: 'https://www.polimi.it',
    },
  })
  console.log(`✅ Institution: PREMIUM, M1+M2+M3+M4 enabled`)

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

  // ── 3. Pipeline stages for M3 (CRM kanban) ─────────────────────────────
  const pipelineStageDefs = [
    { name: 'Lead',           type: 'LEAD',       order: 0 },
    { name: 'Contattato',     type: 'CONTACTED',  order: 1 },
    { name: 'In discussione', type: 'MEETING',    order: 2 },
    { name: 'Proposta',       type: 'PROPOSAL',   order: 3 },
    { name: 'Convenzione firmata', type: 'SIGNED', order: 4 },
    { name: 'Attiva',         type: 'ACTIVE',     order: 5 },
    { name: 'Rinnovo',        type: 'RENEWAL',    order: 6 },
    { name: 'Persa',          type: 'LOST',       order: 7 },
  ]
  const pipelineStages = []
  for (const s of pipelineStageDefs) {
    const stage = await prisma.pipelineStage.create({
      data: {
        institutionId: admin.id,
        name: s.name,
        type: s.type as any,
        order: s.order,
      },
    })
    pipelineStages.push(stage)
  }
  console.log(`✅ ${pipelineStages.length} CRM pipeline stages`)

  // ── 4. Placement stages for M4 ─────────────────────────────────────────
  const placementStageDefs = [
    { name: 'Candidatura',      type: 'APPLICATION',      order: 0 },
    { name: 'Colloquio',        type: 'INTERVIEW',        order: 1 },
    { name: 'Matched',          type: 'MATCHED',          order: 2 },
    { name: 'Convenzione firmata', type: 'CONVENTION_SIGNED', order: 3 },
    { name: 'In corso',         type: 'IN_PROGRESS',      order: 4 },
    { name: 'Valutazione medio termine', type: 'MID_EVALUATION', order: 5 },
    { name: 'Valutazione finale',type: 'FINAL_EVALUATION', order: 6 },
    { name: 'Completato',       type: 'COMPLETED',        order: 7 },
    { name: 'Follow-up',        type: 'FOLLOW_UP',        order: 8 },
  ]
  const placementStages = []
  for (const s of placementStageDefs) {
    const stage = await prisma.placementStage.create({
      data: {
        institutionId: admin.id,
        name: s.name,
        type: s.type as any,
        order: s.order,
      },
    })
    placementStages.push(stage)
  }
  console.log(`✅ ${placementStages.length} placement pipeline stages`)

  // ── 5. Students — 30 across 10 programs ────────────────────────────────
  const studentIds: string[] = []
  for (let i = 0; i < 30; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length]
    const lastName = LAST_NAMES[i % LAST_NAMES.length]
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@studenti.${INSTITUTION_DOMAIN}`
    const program = PROGRAMS[i % PROGRAMS.length]
    const programSkills = SKILLS_BY_PROGRAM[program.name] || []
    const skills = pickN(programSkills, randInt(5, 9))
    const gradYear = String(randInt(2025, 2027))
    const gpa = `${randInt(24, 30)}/30`
    const jobSearchStatus = pick(['ACTIVELY_LOOKING', 'OPEN', 'NOT_LOOKING'] as const)

    const student = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        passwordHash,
        role: 'STUDENT',
        firstName,
        lastName,
        university: INSTITUTION_NAME,
        degree: `${program.name} (Laurea Magistrale)`,
        graduationYear: gradYear,
        gpa,
        gpaPublic: Math.random() > 0.3,
        skills,
        bio: `Studente ${INSTITUTION_SHORT} ${program.name}. Area di interesse: ${program.school}. Competenze principali: ${skills.slice(0, 3).join(', ')}.`,
        location: 'Milano',
        emailVerified: Math.random() > 0.1,
        profilePublic: Math.random() > 0.15,
        jobSearchStatus,
        lastLoginAt: randDate(45),
        interests: pickN(
          ['R&D', 'Startup', 'Consulenza', 'Industria 4.0', 'AI', 'Sostenibilità', 'Design', 'Ricerca accademica'],
          randInt(2, 4),
        ),
      },
    })
    studentIds.push(student.id)

    // ACTIVE institutional affiliation → enables MEDIATED contact mode
    await prisma.institutionAffiliation.deleteMany({
      where: { studentId: student.id, institutionId: admin.id },
    })
    await prisma.institutionAffiliation.create({
      data: {
        studentId: student.id,
        institutionId: admin.id,
        program: program.name,
        status: 'ACTIVE',
        startDate: new Date(Date.now() - 180 * 86_400_000),
      },
    })
  }
  console.log(`✅ ${studentIds.length} students across ${PROGRAMS.length} programs (all affiliated ACTIVE)`)

  // ── 6. Projects — engineering-quality, verified ────────────────────────
  let projectCount = 0
  for (const studentId of studentIds) {
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: { degree: true, skills: true },
    })
    if (!student?.degree) continue
    const programName = student.degree.replace(/\s*\(Laurea Magistrale\)\s*$/, '')
    const titles = PROJECT_TITLES_BY_PROGRAM[programName] || []
    const programInfo = PROGRAMS.find(p => p.name === programName)
    if (titles.length === 0) continue

    const n = randInt(2, 4)
    for (let p = 0; p < n; p++) {
      const title = pick(titles)
      const verified = Math.random() > 0.2
      const projectSkills = pickN(
        student.skills ?? SKILLS_BY_PROGRAM[programName] ?? [],
        randInt(3, 6),
      )
      await prisma.project.create({
        data: {
          userId: studentId,
          title,
          description: `Tesi/progetto nell'ambito del corso ${programName} al ${INSTITUTION_SHORT}, svolto in collaborazione con un laboratorio di ricerca o un'azienda partner. Competenze sviluppate: ${projectSkills.slice(0, 4).join(', ')}. Valutato dal relatore e verificato tramite Career Service.`,
          skills: projectSkills,
          technologies: pickN(projectSkills, 3),
          discipline: (programInfo?.discipline as any) || 'ENGINEERING',
          verificationStatus: verified ? 'VERIFIED' : pick(['PENDING', 'NEEDS_INFO']),
          verifiedBy: verified ? admin.id : null,
          verifiedAt: verified ? randDate(90) : null,
          innovationScore: verified ? randInt(62, 94) : null,
          grade: Math.random() > 0.3 ? `${randInt(26, 30)}/30${Math.random() > 0.85 ? 'L' : ''}` : null,
          isPublic: true,
          createdAt: randDate(240),
        },
      })
      projectCount++
    }
  }
  console.log(`✅ ${projectCount} projects created (verified with innovation scores)`)

  // ── 6b. Seed SkillDelta records from verified projects ─────────────────
  // The platform writes SkillDelta rows only when a professor endorsement
  // is verified. The seed creates verified projects directly, so we need
  // to backfill the deltas here — otherwise /dashboard/student/skill-graph
  // reads an empty graph even though projects exist.
  //
  // Wipe prior deltas for our students, then write one delta per project-
  // skill pair with a realistic proficiency distribution.
  await prisma.skillDelta.deleteMany({
    where: { studentId: { in: studentIds } },
  })

  let deltaCount = 0
  for (const sid of studentIds) {
    const verifiedProjects = await prisma.project.findMany({
      where: { userId: sid, verificationStatus: 'VERIFIED' },
      select: { id: true, title: true, skills: true, verifiedAt: true, innovationScore: true },
    })
    for (const proj of verifiedProjects) {
      const projSkills = (proj.skills || []).slice(0, randInt(3, 6))
      for (const skill of projSkills) {
        // Realistic distribution: 40% Intermediate, 40% Advanced, 15% Expert, 5% Beginner
        const r = Math.random()
        const afterLevel = r < 0.05 ? 1 : r < 0.45 ? 2 : r < 0.85 ? 3 : 4

        await prisma.skillDelta.create({
          data: {
            studentId: sid,
            skillTerm: skill,
            source: 'PROJECT',
            sourceId: proj.id,
            sourceName: proj.title,
            afterLevel,
            beforeLevel: null,
            confidence: 0.9,
            evaluatorType: 'PROFESSOR',
            evaluatorName: 'Tutor accademico',
            evidence: {
              innovationScore: proj.innovationScore,
            } as any,
            occurredAt: proj.verifiedAt || new Date(),
          },
        })
        deltaCount++
      }
    }
  }
  console.log(`✅ ${deltaCount} skill deltas seeded (feeds /skill-graph)`)

  // ── 7. Partner recruiters (one per company) ────────────────────────────
  const recruiters: Array<{ id: string; company: string; sector: string }> = []
  for (const p of PARTNER_COMPANIES) {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const recruiter = await prisma.user.upsert({
      where: { email: `hr@${slug}.${INSTITUTION_DOMAIN}` },
      update: { company: p.name },
      create: {
        email: `hr@${slug}.${INSTITUTION_DOMAIN}`,
        passwordHash,
        role: 'RECRUITER',
        firstName: pick(FIRST_NAMES),
        lastName: pick(LAST_NAMES),
        company: p.name,
        jobTitle: pick([
          'Talent Acquisition Manager',
          'Head of University Relations',
          'Recruiter',
          'HR Business Partner',
          'Campus Recruiter',
        ]),
        emailVerified: true,
        profilePublic: true,
      },
    })
    recruiters.push({ id: recruiter.id, company: p.name, sector: p.sector })

    const viewed = pickN(studentIds, randInt(3, 10))
    for (const sid of viewed) {
      await prisma.profileView.create({
        data: {
          profileUserId: sid,
          viewerId: recruiter.id,
          viewerRole: 'RECRUITER',
          viewerCompany: p.name,
          createdAt: randDate(45),
        },
      })
    }
  }
  console.log(`✅ ${recruiters.length} partner companies + recruiters`)

  // ── 8. CompanyLeads in M3 pipeline — populate all stages ───────────────
  const leadsToCreate = Math.min(18, PARTNER_COMPANIES.length)
  for (let i = 0; i < leadsToCreate; i++) {
    const p = PARTNER_COMPANIES[i]
    // Distribute across stages realistically: more in early + active, fewer in lost
    const stageIdx = i < 3 ? 0
      : i < 6 ? 1
      : i < 8 ? 2
      : i < 10 ? 3
      : i < 13 ? 4
      : i < 16 ? 5
      : i < 17 ? 6 : 7
    const stage = pipelineStages[stageIdx]
    const daysInStage = randInt(3, 60)

    await prisma.companyLead.create({
      data: {
        institutionId: admin.id,
        externalName: p.name,
        externalDomain: `${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '')}.it`,
        sector: p.sector,
        region: 'Lombardia',
        city: 'Milano',
        currentStageId: stage.id,
        stageEnteredAt: new Date(Date.now() - daysInStage * 86_400_000),
        source: pick(['event', 'direct_outreach', 'referral', 'inbound']),
        primaryContactName: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
        primaryContactEmail: `hr@${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '')}.it`,
        nextActionAt: stage.type === 'LOST' ? null : new Date(Date.now() + randInt(-10, 30) * 86_400_000),
        createdAt: new Date(Date.now() - daysInStage * 86_400_000),
        updatedAt: new Date(Date.now() - randInt(0, daysInStage) * 86_400_000),
      },
    })
  }
  console.log(`✅ ${leadsToCreate} company leads across CRM pipeline`)

  // ── 9. Placements in M4 pipeline — populate various stages ─────────────
  const placedCount = Math.round(studentIds.length * 0.7)
  const placedStudents = pickN(studentIds, placedCount)
  for (let i = 0; i < placedStudents.length; i++) {
    const sid = placedStudents[i]
    const recruiter = pick(recruiters)
    // Distribute: 20% in APPLICATION/INTERVIEW, 50% IN_PROGRESS/MID, 30% near completion
    const stageIdx = i < placedStudents.length * 0.2 ? randInt(0, 2)
      : i < placedStudents.length * 0.7 ? randInt(3, 5)
      : randInt(6, 8)
    const stage = placementStages[stageIdx]
    const plannedHours = pick([300, 500, 750, 1000])
    const completedHours = stage.order >= 4
      ? randInt(Math.floor(plannedHours * 0.3), Math.floor(plannedHours * 0.9))
      : 0
    const lastLogAgo = completedHours > 0 ? randInt(0, 25) : 999
    const isExtraCurricular = Math.random() > 0.4

    const student = await prisma.user.findUnique({
      where: { id: sid },
      select: { degree: true, firstName: true, lastName: true },
    })
    const programName = (student?.degree ?? '').replace(/\s*\(Laurea Magistrale\)\s*$/, '')

    await prisma.placement.create({
      data: {
        studentId: sid,
        institutionId: admin.id,
        universityName: INSTITUTION_NAME,
        companyName: recruiter.company,
        companyIndustry: recruiter.sector,
        jobTitle: pick([
          `Junior ${programName.startsWith('Ingegneria') ? 'Engineer' : 'Analyst'}`,
          'Tirocinante R&D',
          'Thesis Intern',
          'Process Engineer Intern',
          'Data Scientist Intern',
        ]),
        offerType: isExtraCurricular ? 'TIROCINIO_EXTRA' : 'TIROCINIO_CURRICULARE',
        jobType: 'INTERNSHIP',
        status: stage.order >= 4 ? 'CONFIRMED' : 'PENDING',
        salaryAmount: isExtraCurricular ? randInt(800, 1200) : null,
        salaryCurrency: 'EUR',
        salaryPeriod: 'monthly',
        startDate: new Date(Date.now() - randInt(30, 180) * 86_400_000),
        endDate:
          stage.order >= 6
            ? new Date(Date.now() - randInt(0, 30) * 86_400_000)
            : new Date(Date.now() + randInt(30, 150) * 86_400_000),
        currentStageId: stage.id,
        stageEnteredAt: new Date(Date.now() - randInt(0, 40) * 86_400_000),
        plannedHours,
        completedHours,
        lastHoursLoggedAt:
          completedHours > 0
            ? new Date(Date.now() - lastLogAgo * 86_400_000)
            : null,
      },
    })
  }
  console.log(`✅ ${placedStudents.length} placements across M4 pipeline`)

  // ── 10. Mediation threads — M1 Inbox demo content ──────────────────────
  const mediationCount = 6
  const mediationStudents = pickN(studentIds, mediationCount)
  for (let i = 0; i < mediationCount; i++) {
    const sid = mediationStudents[i]
    const recruiter = pick(recruiters)
    const status = i < 5 ? 'OPEN' : 'CLOSED'
    const student = await prisma.user.findUnique({
      where: { id: sid },
      select: { firstName: true, lastName: true },
    })

    const thread = await prisma.mediationThread.create({
      data: {
        studentId: sid,
        companyUserId: recruiter.id,
        institutionId: admin.id,
        subject: pick([
          'Interessati a un colloquio per uno stage estivo',
          'Opportunità di tesi in azienda',
          'Graduate program 2026 — candidatura',
          'Progetto R&D condiviso — conversazione iniziale',
        ]),
        status: status as any,
      },
    })

    const body = `Buongiorno ${student?.firstName},\n\nAbbiamo visto il tuo profilo su InTransparency — in particolare il progetto su ${pick(PROJECT_TITLES_BY_PROGRAM['Ingegneria Meccanica'])}. Stiamo cercando un tirocinante per il nostro team R&D su ${recruiter.sector.toLowerCase()}.\n\nSaresti disponibile per un colloquio conoscitivo?\n\nGrazie,\n${recruiter.company} HR`

    await prisma.mediationMessage.create({
      data: {
        threadId: thread.id,
        direction: 'COMPANY_TO_STUDENT',
        authorUserId: recruiter.id,
        bodyOriginal: body,
        bodyApproved: i >= 3 ? body : null,
        status: i < 3 ? 'PENDING_REVIEW' : 'APPROVED',
        reviewedAt: i >= 3 ? new Date(Date.now() - randInt(0, 6) * 86_400_000) : null,
        reviewedByStaffId: i >= 3 ? admin.id : null,
        deliveredAt: i >= 3 ? new Date(Date.now() - randInt(0, 5) * 86_400_000) : null,
      },
    })
  }
  console.log(`✅ ${mediationCount} mediation threads (3 PENDING_REVIEW + 3 APPROVED)`)

  // ── 11. Offers awaiting moderation — M2 demo content ───────────────────
  const offerTitles = [
    'Thesis Internship — Power Electronics',
    'Junior Data Scientist — Graduate Program',
    'R&D Internship — CFD/FEM',
    'Product Engineer — Automotive',
  ]
  const offersToCreate = offerTitles.length
  for (let i = 0; i < offersToCreate; i++) {
    const recruiter = pick(recruiters)
    const title = offerTitles[i]
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${Date.now()}-${i}`
    await prisma.job.create({
      data: {
        recruiterId: recruiter.id,
        institutionId: admin.id,
        slug,
        title,
        description: 'Opportunità di stage per laureandi magistrali del Politecnico di Milano. Durata 6 mesi, sede Milano, possibilità di assunzione post-stage.',
        companyName: recruiter.company,
        location: 'Milano, Italia',
        jobType: 'INTERNSHIP',
        workLocation: pick(['HYBRID', 'ON_SITE'] as const),
        salaryMin: 800,
        salaryMax: 1500,
        salaryCurrency: 'EUR',
        salaryPeriod: 'MONTHLY',
        requiredSkills: ['Python', 'MATLAB', 'Git'],
        status: i < 2 ? 'PENDING_APPROVAL' : 'ACTIVE',
        isPublic: i >= 2,
        offerType: 'TIROCINIO_EXTRA',
        approvedByStaffId: i >= 2 ? admin.id : null,
        approvedAt: i >= 2 ? randDate(14) : null,
        postedAt: i >= 2 ? randDate(14) : null,
      },
    })
  }
  console.log(`✅ ${offersToCreate} offers (2 PENDING_APPROVAL, 2 ACTIVE)`)

  // ── 12. Applications — populate student journey pipelines ──────────────
  const activeJobs = await prisma.job.findMany({
    where: { institutionId: admin.id, status: 'ACTIVE' },
    select: { id: true },
  })
  if (activeJobs.length > 0) {
    let appsCreated = 0
    const statuses: Array<'PENDING' | 'REVIEWING' | 'SHORTLISTED' | 'INTERVIEW' | 'OFFER' | 'REJECTED'> = [
      'PENDING', 'PENDING', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW', 'OFFER', 'REJECTED',
    ]
    // 60% of students apply to 1-3 active jobs
    const applicants = pickN(studentIds, Math.round(studentIds.length * 0.6))
    for (const sid of applicants) {
      const numApps = randInt(1, Math.min(3, activeJobs.length))
      const chosenJobs = pickN(activeJobs, numApps)
      for (const job of chosenJobs) {
        try {
          await prisma.application.create({
            data: {
              applicantId: sid,
              jobId: job.id,
              status: pick(statuses) as any,
              coverLetter:
                'Gentile team, sono uno studente magistrale del Politecnico di Milano. Trovo molto interessante questa opportunità in linea con i miei progetti accademici.',
              createdAt: randDate(60),
            },
          })
          appsCreated++
        } catch {
          // Unique [jobId, applicantId] — skip duplicates
        }
      }
    }
    console.log(`✅ ${appsCreated} applications across students' journey`)
  }

  // ── 13. Showcase demo accounts — predictable creds for handoff ─────────
  // The generic Studente / Azienda accounts shared with prospective
  // customers. Always populated with curated data so the dashboard
  // doesn't look empty: complete profile, verified university connection,
  // professor endorsement, applications, profile views, messages.
  // Idempotent via upsert.

  const studentProfile = {
    firstName: 'Marco',
    lastName: 'Bianchi',
    username: 'marco-bianchi-polimi',
    photo: 'https://api.dicebear.com/9.x/avataaars/svg?seed=marco-bianchi-polimi&backgroundColor=b6e3f4',
    tagline: 'Sistemi distribuiti + ML inference · in cerca di stage primavera 2026',
    bio: "Studente Computer Science & Engineering al Politecnico di Milano (M.Sc., laurea prevista luglio 2026). Tesi su inferenza ML on-device con modelli quantizzati. Maintainer di una piccola libreria SQL type-safe in TypeScript (~600 ⭐ GitHub). Cerco uno stage curriculare di 6 mesi su backend distribuiti o ML systems, preferibilmente Milano o EU remote.",
    linkedinUrl: 'https://linkedin.com/in/marco-bianchi-polimi-demo',
    githubUrl: 'https://github.com/marco-bianchi-polimi',
    skills: [
      'Python', 'TypeScript', 'Go', 'React', 'Next.js', 'PostgreSQL',
      'Docker', 'Kubernetes', 'Redis', 'PyTorch', 'TensorFlow', 'CUDA',
      'gRPC', 'REST APIs', 'Distributed Systems', 'CI/CD',
    ],
    interests: ['AI', 'Startup', 'Cloud Computing', 'Open Source', 'Sistemi distribuiti'],
    workExperience: [
      {
        company: 'Vodafone Italia',
        role: 'Backend Engineer Intern',
        startDate: '2025-06-01',
        endDate: '2025-09-30',
        description: 'Stage estivo nel team Network Analytics. Ho contribuito al refactor di una pipeline Spark per metriche di rete (riduzione runtime 35%). Stack: Python, Spark, Kafka, Airflow.',
        current: false,
      },
    ],
  }

  const showcaseStudent = await prisma.user.upsert({
    where: { email: `studente@${INSTITUTION_DOMAIN}` },
    update: {
      ...studentProfile,
      university: INSTITUTION_NAME,
      degree: 'Computer Science & Engineering (Laurea Magistrale)',
      profilePublic: true,
      jobSearchStatus: 'ACTIVELY_LOOKING',
      emailVerified: true,
      emailVerifiedAt: new Date(),
      // workExperience needs JSON cast in update
      workExperience: studentProfile.workExperience as any,
    },
    create: {
      email: `studente@${INSTITUTION_DOMAIN}`,
      passwordHash,
      role: 'STUDENT',
      ...studentProfile,
      workExperience: studentProfile.workExperience as any,
      university: INSTITUTION_NAME,
      degree: 'Computer Science & Engineering (Laurea Magistrale)',
      graduationYear: '2026',
      gpa: '28/30',
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

  // Reset projects + affiliation so re-seeds give a clean slate
  await prisma.project.deleteMany({ where: { userId: showcaseStudent.id } })
  await prisma.institutionAffiliation.deleteMany({
    where: { studentId: showcaseStudent.id, institutionId: admin.id },
  })

  await prisma.institutionAffiliation.create({
    data: {
      studentId: showcaseStudent.id,
      institutionId: admin.id,
      program: 'Computer Science & Engineering',
      status: 'ACTIVE',
      startDate: new Date(Date.now() - 365 * 86_400_000),
    },
  })

  const showcaseProjects = [
    {
      title: 'Distributed cache with consistent hashing — Go + Redis',
      description: "Sistema di cache distribuito con consistent hashing implementato in Go, deploy su Kubernetes con sharding automatico e replication. Benchmark vs Redis Cluster su workload realistici. Tesi triennale, voto 30L.",
      skills: ['Go', 'Redis', 'Docker', 'Kubernetes', 'Distributed Systems'],
      grade: '30/30L',
      innovationScore: 88,
    },
    {
      title: 'On-device LLM inference — quantized Llama on M1',
      description: "Esperimento di inferenza LLM on-device usando quantizzazione GPTQ a 4-bit per Llama 3 8B su Apple Silicon. Misurazione throughput (tok/s) vs cloud baseline e analisi qualità output. Progetto del corso di Deep Learning.",
      skills: ['Python', 'PyTorch', 'TensorFlow', 'CUDA', 'LLM'],
      grade: '29/30',
      innovationScore: 84,
    },
    {
      title: 'Type-safe SQL builder for TypeScript — open source',
      description: "Libreria open source per query SQL fortemente tipizzate in TypeScript, ispirata a Drizzle e Kysely. Compilazione delle query a tempo di compilazione, supporto Postgres + MySQL. Progetto personale, ~600 stelle GitHub.",
      skills: ['TypeScript', 'PostgreSQL', 'Open Source', 'SQL'],
      grade: null,
      innovationScore: 82,
    },
  ]
  const studentProjectIds: string[] = []
  for (const p of showcaseProjects) {
    const created = await prisma.project.create({
      data: {
        userId: showcaseStudent.id,
        title: p.title,
        description: p.description,
        skills: p.skills,
        technologies: p.skills.slice(0, 3),
        discipline: 'TECHNOLOGY',
        verificationStatus: 'VERIFIED',
        verifiedBy: admin.id,
        verifiedAt: randDate(60),
        innovationScore: p.innovationScore,
        grade: p.grade,
        isPublic: true,
        createdAt: randDate(180),
      },
    })
    studentProjectIds.push(created.id)
  }

  // Verified university email connection — closes the "Collega email
  // universitaria" onboarding tappa
  await prisma.universityConnection.upsert({
    where: { userId: showcaseStudent.id },
    update: {
      verificationStatus: 'VERIFIED',
      verifiedAt: randDate(120),
      universityName: INSTITUTION_NAME,
    },
    create: {
      userId: showcaseStudent.id,
      universityId: 'polimi',
      universityName: INSTITUTION_NAME,
      universityType: 'university',
      city: 'Milano',
      country: 'IT',
      institutionalEmail: 'marco.bianchi@studenti.polimi.it',
      verificationStatus: 'VERIFIED',
      verifiedAt: randDate(120),
    },
  })

  // Professor endorsement — closes the "Richiedi referenza professore"
  // tappa and unlocks the Professor Endorsed achievement
  await prisma.professorEndorsement.deleteMany({
    where: { studentId: showcaseStudent.id },
  })
  if (studentProjectIds.length > 0) {
    await prisma.professorEndorsement.create({
      data: {
        studentId: showcaseStudent.id,
        projectId: studentProjectIds[0],
        professorName: 'Prof. Andrea Rossi',
        professorEmail: 'andrea.rossi@polimi.it',
        professorTitle: 'Associate Professor',
        department: 'DEIB — Dipartimento di Elettronica, Informazione e Bioingegneria',
        university: INSTITUTION_NAME,
        courseName: 'Distributed Systems',
        courseCode: '054321',
        semester: 'Fall 2025',
        grade: '30L',
        endorsementText:
          "Marco ha mostrato un'ottima padronanza dei concetti di consistent hashing e replication. Il progetto di tesi triennale era in linea con il livello atteso da un esame di Sistemi Distribuiti magistrale. Lo raccomando con convinzione per posizioni R&D in ambito backend o ML systems.",
        skills: ['Distributed Systems', 'Go', 'Redis', 'System Design', 'Problem Solving'],
        rating: 5,
        verified: true,
        verifiedAt: randDate(45),
        status: 'VERIFIED',
      },
    })
  }

  const recruiterProfile = {
    firstName: 'Laura',
    lastName: 'Conti',
    username: 'laura-conti-azienda-demo',
    photo: 'https://api.dicebear.com/9.x/avataaars/svg?seed=laura-conti-azienda-demo&backgroundColor=ffd5dc',
    company: 'Azienda Demo Spa',
    jobTitle: 'Head of Engineering Recruiting',
    bio: 'Engineering recruiter con 8 anni di esperienza nel matching tra studenti STEM e ruoli backend / ML systems. Partner attivo del Career Service Politecnico dal 2024.',
    linkedinUrl: 'https://linkedin.com/in/laura-conti-azienda-demo',
  }

  const showcaseRecruiter = await prisma.user.upsert({
    where: { email: `azienda@${INSTITUTION_DOMAIN}` },
    update: {
      ...recruiterProfile,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
    create: {
      email: `azienda@${INSTITUTION_DOMAIN}`,
      passwordHash,
      role: 'RECRUITER',
      ...recruiterProfile,
      location: 'Milano',
      country: 'IT',
      emailVerified: true,
      emailVerifiedAt: new Date(),
      profilePublic: true,
      lastLoginAt: new Date(),
    },
  })

  // Reset showcase recruiter's saved candidates + jobs to keep deterministic
  await prisma.savedCandidate.deleteMany({ where: { recruiterId: showcaseRecruiter.id } })
  await prisma.job.deleteMany({ where: { recruiterId: showcaseRecruiter.id } })

  await prisma.job.create({
    data: {
      recruiterId: showcaseRecruiter.id,
      institutionId: admin.id,
      slug: `software-engineer-intern-backend-demo-${Date.now()}`,
      title: 'Software Engineer Intern — Backend',
      description: "Stage curriculare 6 mesi, sede Milano, modalità ibrida. Cerchiamo studenti magistrali in Computer Science / Ingegneria Informatica con interesse per sistemi distribuiti, API design e cloud-native development. Possibilità di assunzione post-stage.",
      companyName: 'Azienda Demo Spa',
      location: 'Milano, Italia',
      jobType: 'INTERNSHIP',
      workLocation: 'HYBRID',
      salaryMin: 1000,
      salaryMax: 1500,
      salaryCurrency: 'EUR',
      salaryPeriod: 'MONTHLY',
      requiredSkills: ['Python', 'PostgreSQL', 'Docker', 'REST APIs', 'Git'],
      status: 'ACTIVE',
      isPublic: true,
      offerType: 'TIROCINIO_EXTRA',
      approvedByStaffId: admin.id,
      approvedAt: randDate(14),
      postedAt: randDate(14),
    },
  })

  // Save 3 real students + the showcase student so the recruiter's
  // "Saved candidates" tab is populated and the showcase student has
  // recruiter signal too
  const candidatesToSave = [showcaseStudent.id, ...pickN(studentIds, 3)]
  for (const candidateId of candidatesToSave) {
    await prisma.savedCandidate.create({
      data: {
        recruiterId: showcaseRecruiter.id,
        candidateId,
        createdAt: randDate(30),
      },
    })
  }

  // Showcase student → 3 applications across active jobs (kills "0 candidature")
  const allActiveJobs = await prisma.job.findMany({
    where: { institutionId: admin.id, status: 'ACTIVE' },
    select: { id: true, title: true, companyName: true },
    take: 6,
  })
  const appsToCreate = allActiveJobs.slice(0, 3)
  const appStatuses: Array<'PENDING' | 'REVIEWING' | 'INTERVIEW'> = ['REVIEWING', 'PENDING', 'INTERVIEW']
  for (let i = 0; i < appsToCreate.length; i++) {
    try {
      await prisma.application.create({
        data: {
          applicantId: showcaseStudent.id,
          jobId: appsToCreate[i].id,
          status: appStatuses[i],
          coverLetter:
            "Gentile team, sono Marco Bianchi, studente magistrale al Politecnico di Milano (Computer Science & Engineering). La posizione è perfettamente in linea con la mia tesi su sistemi distribuiti e con il mio progetto open source di SQL builder type-safe. Sarei felice di approfondire in un colloquio.",
          selectedProjects: studentProjectIds.slice(0, 2),
          createdAt: randDate(20),
        },
      })
    } catch {
      // duplicate (jobId, applicantId) — skip
    }
  }

  // Profile views from the showcase recruiter + a few partner recruiters →
  // "Sei nel radar" lights up
  await prisma.profileView.deleteMany({ where: { profileUserId: showcaseStudent.id } })
  const viewerSources = [
    { id: showcaseRecruiter.id, role: 'RECRUITER' as const, company: 'Azienda Demo Spa' },
    ...recruiters.slice(0, 4).map(r => ({ id: r.id, role: 'RECRUITER' as const, company: r.company })),
  ]
  for (const v of viewerSources) {
    await prisma.profileView.create({
      data: {
        profileUserId: showcaseStudent.id,
        viewerId: v.id,
        viewerRole: v.role,
        viewerCompany: v.company,
        createdAt: randDate(7),
      },
    })
  }

  // Inbound message from showcase recruiter → student (1 message thread)
  await prisma.message.deleteMany({
    where: {
      senderId: showcaseRecruiter.id,
      recipientId: showcaseStudent.id,
    },
  })
  await prisma.message.create({
    data: {
      senderId: showcaseRecruiter.id,
      recipientId: showcaseStudent.id,
      recipientEmail: showcaseStudent.email,
      subject: 'Stage backend — Azienda Demo Spa',
      content:
        "Ciao Marco,\n\nho visto il tuo profilo e in particolare il progetto sulla cache distribuita in Go — molto interessante. Stiamo cercando un tirocinante backend per il nostro team Platform e penso che il tuo background si adatti bene.\n\nSaresti disponibile per una breve call conoscitiva nei prossimi giorni?\n\nA presto,\nLaura Conti — Head of Engineering Recruiting, Azienda Demo Spa",
      threadId: `demo-thread-${showcaseStudent.id}-${showcaseRecruiter.id}`,
      read: false,
      createdAt: new Date(Date.now() - 3 * 86_400_000),
    },
  })

  console.log(`✅ Showcase accounts: studente@${INSTITUTION_DOMAIN} + azienda@${INSTITUTION_DOMAIN}`)
  console.log(`   Studente: 3 progetti verificati, 3 applications, 5 profile views, 1 messaggio, university+endorsement verificati`)

  console.log(`\n✨ ${INSTITUTION_NAME} demo ready!`)
  console.log(`\n   Università: career@${INSTITUTION_DOMAIN}    / demo2024!`)
  console.log(`   Studente:   studente@${INSTITUTION_DOMAIN}  / demo2024!`)
  console.log(`   Azienda:    azienda@${INSTITUTION_DOMAIN}   / demo2024!`)
  console.log(`   URL:        /dashboard/{university,student,recruiter}\n`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
