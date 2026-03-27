/**
 * Brand Images Configuration
 *
 * Local images stored in /public/images/brand/ for reliable loading.
 * Original source: Unsplash (free commercial license).
 */

export const BRAND_IMAGES = {
  // --- HOMEPAGE ---
  hero: {
    main: '/images/brand/team.jpg',
    students: '/images/brand/students.jpg',
    companies: '/images/brand/meeting.jpg',
    universities: '/images/brand/campus.jpg',
  },

  // --- FOR STUDENTS ---
  forStudents: {
    hero: '/images/brand/students.jpg',
    success: '/images/brand/campus.jpg',
    presenting: '/images/brand/team.jpg',
  },

  // --- FOR COMPANIES ---
  forCompanies: {
    hero: '/images/brand/handshake.jpg',
  },

  // --- FOR UNIVERSITIES ---
  forUniversities: {
    hero: '/images/brand/campus.jpg',
  },

  // --- ABOUT / MISSION ---
  about: {
    hero: '/images/brand/team.jpg',
  },
} as const
