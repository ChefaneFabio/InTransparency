/**
 * Brand Images Configuration
 *
 * Curated Unsplash images for the InTransparency platform.
 * All images are free for commercial use (Unsplash License).
 * Using images.unsplash.com CDN with size optimization params.
 */

// Image helper — generates optimized Unsplash URLs
const unsplash = (photoId: string, width = 1200, quality = 80) =>
  `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${width}&q=${quality}`

export const BRAND_IMAGES = {
  // --- HOMEPAGE ---
  hero: {
    // Diverse team collaborating around a laptop in modern office
    main: unsplash('1522071820081-009f0129c71c', 1400),
    // Students gathered around laptop
    students: unsplash('1523240795612-9a054b0db644', 1200),
    // Professional office meeting
    companies: unsplash('1600880292203-757bb62b4baf', 1200),
    // University campus / lecture hall
    universities: unsplash('1523050854058-8df90110c9f1', 1200),
  },

  // --- FOR STUDENTS ---
  forStudents: {
    // Young woman working confidently on laptop
    hero: unsplash('1517245386807-bb43f82c33c4', 1400),
    // Students collaborating on project
    collaboration: unsplash('1529156069898-49953e39b3ac', 800),
    // Student with graduation cap, confident
    success: unsplash('1627556704302-624286467c65', 800),
    // Person coding on laptop
    coding: unsplash('1498050108023-c5249f4df085', 800),
    // Student presenting project
    presenting: unsplash('1552664730-d307ca884978', 800),
  },

  // --- FOR COMPANIES ---
  forCompanies: {
    // Professional handshake — hiring moment
    hero: unsplash('1521791136064-7986c2920216', 1400),
    // Two people at interview/meeting
    interview: unsplash('1573497019940-1c28c88b4f3e', 800),
    // Team reviewing candidates on screen
    screening: unsplash('1553877522-43269d4ea984', 800),
    // Modern office team working
    team: unsplash('1522202176988-66273c2fd55f', 800),
    // Business analytics / data on screen
    analytics: unsplash('1460925895917-afdab827c52f', 800),
  },

  // --- FOR UNIVERSITIES ---
  forUniversities: {
    // University building / campus
    hero: unsplash('1541339907198-e08756dedf3f', 1400),
    // Professor with students
    teaching: unsplash('1524178232363-1fb2b075b655', 800),
    // Graduation ceremony
    graduation: unsplash('1523050854058-8df90110c9f1', 800),
    // Library / study space
    library: unsplash('1481627834876-b7833e8f5570', 800),
    // Data analytics dashboard
    analytics: unsplash('1551288049-bebda4e38f71', 800),
  },

  // --- ABOUT / MISSION ---
  about: {
    // Diverse team high-five / celebration
    hero: unsplash('1582213782179-e0d53f98f2ca', 1400),
    // Person looking at city skyline — vision/ambition
    vision: unsplash('1507003211169-0a1dd7228f2d', 800),
    // Handshake — trust
    trust: unsplash('1521791136064-7986c2920216', 800),
  },

  // --- COMPANY PROFILE ---
  companyProfile: {
    // Modern workspace
    office: unsplash('1497366216548-37526070297c', 1200),
    // Team brainstorming
    brainstorm: unsplash('1552664730-d307ca884978', 800),
  },

  // --- DISCIPLINES ---
  disciplines: {
    engineering: unsplash('1581092160607-ee22621dd758', 800),
    business: unsplash('1454165804606-c3d57bc86b40', 800),
    design: unsplash('1561070791-2526d30994b5', 800),
    science: unsplash('1532094349884-543bc11b234d', 800),
    healthcare: unsplash('1579684385127-1ef15d508118', 800),
    architecture: unsplash('1503387762-592deb58ef4e', 800),
    legal: unsplash('1589829545856-d10d557cf95f', 800),
    tech: unsplash('1498050108023-c5249f4df085', 800),
  },
} as const

export type BrandImageKey = keyof typeof BRAND_IMAGES
