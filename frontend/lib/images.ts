// Image configuration for the platform
// Using Unsplash for high-quality, free images

export const IMAGES = {
  hero: {
    // Hero background - students working, technology
    main: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80',
    students: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80',
    technology: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1920&q=80',
  },

  students: {
    // Diverse student profile images
    student1: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    student2: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    student3: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80',
    student4: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80',
    student5: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
    student6: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
  },

  recruiters: {
    // Professional recruiters/business people
    recruiter1: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    recruiter2: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
    recruiter3: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80',
  },

  universities: {
    // University campus images
    campus1: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
    campus2: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
    campus3: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80',
    library: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
  },

  features: {
    // Feature illustrations
    aiAnalysis: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
    collaboration: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
    dataAnalytics: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    search: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=80',
    matching: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
  },

  companies: {
    // Generic office/company images (avoid trademarked logos)
    office1: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
    office2: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80',
    team: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
  },

  backgrounds: {
    // Abstract/geometric backgrounds
    gradient1: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=80',
    gradient2: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=1920&q=80',
    pattern: 'https://images.unsplash.com/photo-1557682268-e3955ed5d83f?w=1920&q=80',
  },

  success: {
    // Success/achievement images
    celebration: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80',
    handshake: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80',
    growth: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80',
  },

  // University-related images for visual enhancement
  universityCampuses: {
    library: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
    campus: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
    graduation: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
  },
}

// Helper function to get Unsplash image with specific dimensions
export function getUnsplashImage(url: string, width: number, height?: number, quality = 80) {
  const heightParam = height ? `&h=${height}` : ''
  return `${url.split('?')[0]}?w=${width}${heightParam}&q=${quality}&fit=crop`
}

// Generate avatar from name (for when no photo is available)
export function getAvatarUrl(name: string, size = 100) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}&background=3B82F6&color=fff&bold=true`
}

// Placeholder for loading states
export function getPlaceholder(width: number, height: number, text = 'Loading...') {
  return `https://placehold.co/${width}x${height}/e5e7eb/6b7280?text=${encodeURIComponent(text)}`
}
