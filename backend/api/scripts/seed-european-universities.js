const database = require('../database/Database')

// Top European Universities with realistic data
const europeanUniversities = [
  {
    name: 'ETH Zurich',
    shortName: 'ETH',
    slug: 'eth-zurich',
    ranking: { global: 7, national: 1, engineering: 4 },
    location: { city: 'Zurich', state: 'Zurich', country: 'Switzerland' },
    stats: {
      students: 22200,
      undergrad: 9800,
      graduate: 12400,
      faculty: 530,
      internationalStudents: 8800,
      acceptanceRate: 27.0
    },
    programs: [
      { name: 'Computer Science', ranking: 8, students: 1200 },
      { name: 'Engineering', ranking: 4, students: 2800 },
      { name: 'Mathematics', ranking: 9, students: 800 },
      { name: 'Physics', ranking: 6, students: 900 }
    ],
    topSkills: ['Machine Learning', 'Data Science', 'Computer Science', 'Engineering', 'Mathematics'],
    companies: ['Google', 'Microsoft', 'Credit Suisse', 'Roche', 'Nestlé'],
    avgSalary: 'CHF 95,000',
    employmentRate: 95.8,
    description: 'ETH Zurich is a leading international university for technology and natural sciences.',
    founded: 1855,
    website: 'https://ethz.ch/',
    contact: { email: 'info@ethz.ch', phone: '+41 44 632 11 11' },
    socialMedia: { twitter: '@ETH_en', linkedin: 'eth-zurich' }
  },

  {
    name: 'University of Oxford',
    shortName: 'Oxford',
    slug: 'oxford',
    ranking: { global: 3, national: 1, engineering: 6 },
    location: { city: 'Oxford', state: 'Oxfordshire', country: 'United Kingdom' },
    stats: {
      students: 24300,
      undergrad: 11800,
      graduate: 12500,
      faculty: 7000,
      internationalStudents: 12100,
      acceptanceRate: 17.5
    },
    programs: [
      { name: 'Computer Science', ranking: 5, students: 900 },
      { name: 'Engineering', ranking: 6, students: 1100 },
      { name: 'Medicine', ranking: 2, students: 1800 },
      { name: 'Economics', ranking: 4, students: 1200 }
    ],
    topSkills: ['Research', 'Critical Thinking', 'Computer Science', 'Medicine', 'Economics'],
    companies: ['Microsoft', 'Goldman Sachs', 'McKinsey', 'Google', 'Deloitte'],
    avgSalary: '£45,000',
    employmentRate: 96.7,
    description: 'The University of Oxford is the oldest university in the English-speaking world.',
    founded: 1096,
    website: 'https://www.ox.ac.uk/',
    contact: { email: 'information@ox.ac.uk', phone: '+44 1865 270000' },
    socialMedia: { twitter: '@UniofOxford', linkedin: 'university-of-oxford' }
  },

  {
    name: 'University of Cambridge',
    shortName: 'Cambridge',
    slug: 'cambridge',
    ranking: { global: 5, national: 2, engineering: 7 },
    location: { city: 'Cambridge', state: 'Cambridgeshire', country: 'United Kingdom' },
    stats: {
      students: 23247,
      undergrad: 12850,
      graduate: 10397,
      faculty: 6170,
      internationalStudents: 7925,
      acceptanceRate: 21.0
    },
    programs: [
      { name: 'Computer Science', ranking: 4, students: 1050 },
      { name: 'Engineering', ranking: 7, students: 1300 },
      { name: 'Mathematics', ranking: 2, students: 950 },
      { name: 'Natural Sciences', ranking: 3, students: 2200 }
    ],
    topSkills: ['Mathematics', 'Computer Science', 'Engineering', 'Natural Sciences', 'Research'],
    companies: ['Google', 'Microsoft', 'ARM', 'Amazon', 'Goldman Sachs'],
    avgSalary: '£48,000',
    employmentRate: 97.2,
    description: 'The University of Cambridge is a collegiate research university.',
    founded: 1209,
    website: 'https://www.cam.ac.uk/',
    contact: { email: 'information@admin.cam.ac.uk', phone: '+44 1223 337733' },
    socialMedia: { twitter: '@Cambridge_Uni', linkedin: 'university-of-cambridge' }
  },

  {
    name: 'Imperial College London',
    shortName: 'Imperial',
    slug: 'imperial-london',
    ranking: { global: 6, national: 3, engineering: 3 },
    location: { city: 'London', state: 'Greater London', country: 'United Kingdom' },
    stats: {
      students: 19945,
      undergrad: 10600,
      graduate: 9345,
      faculty: 3500,
      internationalStudents: 12967,
      acceptanceRate: 14.3
    },
    programs: [
      { name: 'Engineering', ranking: 3, students: 3200 },
      { name: 'Computer Science', ranking: 6, students: 1400 },
      { name: 'Medicine', ranking: 8, students: 1900 },
      { name: 'Business', ranking: 15, students: 800 }
    ],
    topSkills: ['Engineering', 'Computer Science', 'Data Science', 'Medicine', 'Business'],
    companies: ['Google', 'Microsoft', 'Goldman Sachs', 'Shell', 'BP'],
    avgSalary: '£52,000',
    employmentRate: 94.8,
    description: 'Imperial College London is a world-class university with a mission to benefit society.',
    founded: 1907,
    website: 'https://www.imperial.ac.uk/',
    contact: { email: 'info@imperial.ac.uk', phone: '+44 20 7589 5111' },
    socialMedia: { twitter: '@imperialcollege', linkedin: 'imperial-college-london' }
  },

  {
    name: 'École Polytechnique Fédérale de Lausanne',
    shortName: 'EPFL',
    slug: 'epfl',
    ranking: { global: 26, national: 2, engineering: 12 },
    location: { city: 'Lausanne', state: 'Vaud', country: 'Switzerland' },
    stats: {
      students: 12000,
      undergrad: 4500,
      graduate: 7500,
      faculty: 350,
      internationalStudents: 7200,
      acceptanceRate: 35.0
    },
    programs: [
      { name: 'Computer Science', ranking: 12, students: 1800 },
      { name: 'Engineering', ranking: 12, students: 2200 },
      { name: 'Architecture', ranking: 6, students: 600 },
      { name: 'Life Sciences', ranking: 18, students: 900 }
    ],
    topSkills: ['Computer Science', 'Engineering', 'Machine Learning', 'Architecture', 'Research'],
    companies: ['Google', 'Microsoft', 'Nestlé', 'Roche', 'Logitech'],
    avgSalary: 'CHF 90,000',
    employmentRate: 94.5,
    description: 'EPFL is one of the two Swiss Federal Institutes of Technology.',
    founded: 1969,
    website: 'https://www.epfl.ch/',
    contact: { email: 'info@epfl.ch', phone: '+41 21 693 11 11' },
    socialMedia: { twitter: '@EPFL_en', linkedin: 'epfl' }
  },

  {
    name: 'Université PSL',
    shortName: 'PSL',
    slug: 'psl-paris',
    ranking: { global: 24, national: 1, engineering: 35 },
    location: { city: 'Paris', state: 'Île-de-France', country: 'France' },
    stats: {
      students: 21000,
      undergrad: 9500,
      graduate: 11500,
      faculty: 4500,
      internationalStudents: 6300,
      acceptanceRate: 20.0
    },
    programs: [
      { name: 'Arts & Humanities', ranking: 8, students: 3200 },
      { name: 'Natural Sciences', ranking: 12, students: 2800 },
      { name: 'Engineering', ranking: 35, students: 1500 },
      { name: 'Social Sciences', ranking: 15, students: 2200 }
    ],
    topSkills: ['Research', 'Arts', 'Natural Sciences', 'Social Sciences', 'Engineering'],
    companies: ['L\'Oréal', 'LVMH', 'Airbus', 'Total', 'Sanofi'],
    avgSalary: '€42,000',
    employmentRate: 91.2,
    description: 'PSL is a collegial and graduate research university.',
    founded: 2010,
    website: 'https://www.psl.eu/',
    contact: { email: 'contact@psl.eu', phone: '+33 1 44 32 20 00' },
    socialMedia: { twitter: '@UniversitePSL', linkedin: 'université-psl' }
  },

  {
    name: 'University of Edinburgh',
    shortName: 'Edinburgh',
    slug: 'edinburgh',
    ranking: { global: 27, national: 5, engineering: 28 },
    location: { city: 'Edinburgh', state: 'Scotland', country: 'United Kingdom' },
    stats: {
      students: 50000,
      undergrad: 32000,
      graduate: 18000,
      faculty: 7500,
      internationalStudents: 20000,
      acceptanceRate: 40.0
    },
    programs: [
      { name: 'Computer Science', ranking: 20, students: 2500 },
      { name: 'Medicine', ranking: 18, students: 2800 },
      { name: 'Engineering', ranking: 28, students: 2000 },
      { name: 'Business', ranking: 25, students: 1800 }
    ],
    topSkills: ['Computer Science', 'Medicine', 'Engineering', 'Business', 'Research'],
    companies: ['Microsoft', 'Amazon', 'Skyscanner', 'Royal Bank of Scotland', 'Vodafone'],
    avgSalary: '£38,000',
    employmentRate: 92.8,
    description: 'The University of Edinburgh is a world-leading centre of academic excellence.',
    founded: 1583,
    website: 'https://www.ed.ac.uk/',
    contact: { email: 'communications@ed.ac.uk', phone: '+44 131 650 1000' },
    socialMedia: { twitter: '@EdinburghUni', linkedin: 'university-of-edinburgh' }
  },

  {
    name: 'Technical University of Munich',
    shortName: 'TUM',
    slug: 'tum-munich',
    ranking: { global: 37, national: 1, engineering: 15 },
    location: { city: 'Munich', state: 'Bavaria', country: 'Germany' },
    stats: {
      students: 48000,
      undergrad: 28000,
      graduate: 20000,
      faculty: 10000,
      internationalStudents: 14400,
      acceptanceRate: 8.0
    },
    programs: [
      { name: 'Engineering', ranking: 15, students: 18000 },
      { name: 'Computer Science', ranking: 25, students: 3200 },
      { name: 'Natural Sciences', ranking: 22, students: 4800 },
      { name: 'Medicine', ranking: 45, students: 2200 }
    ],
    topSkills: ['Engineering', 'Computer Science', 'Natural Sciences', 'Innovation', 'Technology'],
    companies: ['BMW', 'Siemens', 'SAP', 'Audi', 'Google'],
    avgSalary: '€48,000',
    employmentRate: 95.2,
    description: 'TUM is one of Europe\'s leading universities for the natural sciences and engineering.',
    founded: 1868,
    website: 'https://www.tum.de/',
    contact: { email: 'info@tum.de', phone: '+49 89 289 01' },
    socialMedia: { twitter: '@TU_Muenchen', linkedin: 'technische-universität-münchen' }
  },

  {
    name: 'Delft University of Technology',
    shortName: 'TU Delft',
    slug: 'tu-delft',
    ranking: { global: 47, national: 1, engineering: 16 },
    location: { city: 'Delft', state: 'South Holland', country: 'Netherlands' },
    stats: {
      students: 28000,
      undergrad: 18500,
      graduate: 9500,
      faculty: 6000,
      internationalStudents: 8400,
      acceptanceRate: 50.0
    },
    programs: [
      { name: 'Engineering', ranking: 16, students: 12000 },
      { name: 'Computer Science', ranking: 35, students: 2800 },
      { name: 'Architecture', ranking: 3, students: 2200 },
      { name: 'Applied Sciences', ranking: 28, students: 3500 }
    ],
    topSkills: ['Engineering', 'Computer Science', 'Architecture', 'Applied Sciences', 'Innovation'],
    companies: ['ASML', 'Philips', 'Shell', 'ING', 'KLM'],
    avgSalary: '€45,000',
    employmentRate: 93.8,
    description: 'TU Delft is the largest and oldest Dutch public technical university.',
    founded: 1842,
    website: 'https://www.tudelft.nl/',
    contact: { email: 'info@tudelft.nl', phone: '+31 15 278 9111' },
    socialMedia: { twitter: '@TUDelft', linkedin: 'tu-delft' }
  },

  {
    name: 'KTH Royal Institute of Technology',
    shortName: 'KTH',
    slug: 'kth-stockholm',
    ranking: { global: 73, national: 1, engineering: 18 },
    location: { city: 'Stockholm', state: 'Stockholm County', country: 'Sweden' },
    stats: {
      students: 18000,
      undergrad: 12000,
      graduate: 6000,
      faculty: 3100,
      internationalStudents: 5400,
      acceptanceRate: 35.0
    },
    programs: [
      { name: 'Engineering', ranking: 18, students: 8500 },
      { name: 'Computer Science', ranking: 42, students: 2200 },
      { name: 'Architecture', ranking: 15, students: 1200 },
      { name: 'Technology', ranking: 25, students: 3800 }
    ],
    topSkills: ['Engineering', 'Computer Science', 'Technology', 'Innovation', 'Sustainability'],
    companies: ['Spotify', 'Ericsson', 'Volvo', 'H&M', 'Klarna'],
    avgSalary: 'SEK 420,000',
    employmentRate: 94.1,
    description: 'KTH is a leading technical university in Sweden and one of Europe\'s top technical universities.',
    founded: 1827,
    website: 'https://www.kth.se/',
    contact: { email: 'info@kth.se', phone: '+46 8 790 60 00' },
    socialMedia: { twitter: '@KTHuniversity', linkedin: 'kth-royal-institute-of-technology' }
  }
]

// Sample European students for these universities
const europeanStudents = [
  {
    name: 'Emma Schneider',
    email: 'emma.schneider@student.ethz.ch',
    title: 'Computer Science Student',
    university: 'ETH Zurich',
    major: 'Computer Science',
    year: 'Master\'s',
    graduation: '2025',
    gpa: 5.2, // Swiss scale
    location: 'Zurich, Switzerland',
    skills: [
      { name: 'Python', level: 'Expert', years: 3 },
      { name: 'Machine Learning', level: 'Advanced', years: 2 },
      { name: 'Deep Learning', level: 'Intermediate', years: 1 }
    ],
    experience: [
      {
        company: 'Google',
        position: 'Software Engineering Intern',
        duration: 'Summer 2024',
        description: 'Worked on ML infrastructure for search ranking'
      }
    ],
    languages: ['German (Native)', 'English (Fluent)', 'French (Conversational)'],
    interests: ['Machine Learning', 'Hiking', 'Photography']
  },

  {
    name: 'James Mitchell',
    email: 'james.mitchell@oxford.edu',
    title: 'Computer Science Student',
    university: 'University of Oxford',
    major: 'Computer Science',
    year: 'Final Year',
    graduation: '2025',
    gpa: 3.9, // UK First Class
    location: 'Oxford, UK',
    skills: [
      { name: 'Java', level: 'Expert', years: 4 },
      { name: 'Algorithms', level: 'Expert', years: 3 },
      { name: 'Distributed Systems', level: 'Advanced', years: 2 }
    ],
    experience: [
      {
        company: 'DeepMind',
        position: 'Research Intern',
        duration: 'Summer 2024',
        description: 'Researched reinforcement learning algorithms'
      }
    ],
    languages: ['English (Native)', 'Spanish (Conversational)'],
    interests: ['AI Research', 'Chess', 'Classical Music']
  },

  {
    name: 'Sophie Dubois',
    email: 'sophie.dubois@psl.eu',
    title: 'Data Science Student',
    university: 'Université PSL',
    major: 'Data Science',
    year: 'Master 2',
    graduation: '2025',
    gpa: 16.8, // French scale /20
    location: 'Paris, France',
    skills: [
      { name: 'Python', level: 'Expert', years: 3 },
      { name: 'Statistics', level: 'Advanced', years: 2 },
      { name: 'SQL', level: 'Advanced', years: 2 }
    ],
    experience: [
      {
        company: 'L\'Oréal',
        position: 'Data Science Intern',
        duration: '6 months 2024',
        description: 'Built recommendation systems for cosmetic products'
      }
    ],
    languages: ['French (Native)', 'English (Fluent)', 'German (Intermediate)'],
    interests: ['Data Science', 'Art', 'Travel']
  },

  {
    name: 'Lars Andersen',
    email: 'lars.andersen@kth.se',
    title: 'Software Engineering Student',
    university: 'KTH Royal Institute of Technology',
    major: 'Software Engineering',
    year: 'Master\'s',
    graduation: '2025',
    gpa: 4.2, // Swedish scale
    location: 'Stockholm, Sweden',
    skills: [
      { name: 'JavaScript', level: 'Expert', years: 4 },
      { name: 'React', level: 'Expert', years: 3 },
      { name: 'Node.js', level: 'Advanced', years: 2 }
    ],
    experience: [
      {
        company: 'Spotify',
        position: 'Frontend Developer Intern',
        duration: 'Summer 2024',
        description: 'Developed new features for the Spotify web player'
      }
    ],
    languages: ['Swedish (Native)', 'English (Fluent)', 'Norwegian (Fluent)'],
    interests: ['Web Development', 'Music', 'Skiing']
  },

  {
    name: 'Marco Rossi',
    email: 'marco.rossi@polimi.it',
    title: 'Mechanical Engineering Student',
    university: 'Politecnico di Milano',
    major: 'Mechanical Engineering',
    year: 'Laurea Magistrale',
    graduation: '2025',
    gpa: 28.5, // Italian scale /30
    location: 'Milan, Italy',
    skills: [
      { name: 'CAD Design', level: 'Expert', years: 3 },
      { name: 'MATLAB', level: 'Advanced', years: 2 },
      { name: 'Python', level: 'Intermediate', years: 1 }
    ],
    experience: [
      {
        company: 'Ferrari',
        position: 'Engineering Intern',
        duration: 'Summer 2024',
        description: 'Worked on aerodynamics optimization for Formula 1'
      }
    ],
    languages: ['Italian (Native)', 'English (Fluent)', 'German (Basic)'],
    interests: ['Automotive Engineering', 'Formula 1', 'Cycling']
  }
]

// Function to seed the database
async function seedEuropeanData() {
  console.log('🌍 Starting European universities and students seeding...')

  try {
    // Add European universities
    console.log('🏛️ Adding European universities...')
    for (const university of europeanUniversities) {
      const created = await database.createUniversity(university)
      console.log(`✅ Added: ${created.name} (${created.location.country})`)
    }

    // Add European students
    console.log('🎓 Adding European students...')
    for (const studentData of europeanStudents) {
      // Find the university ID
      const university = await database.findUniversityBySlug(
        studentData.university.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      )

      const student = {
        ...studentData,
        universityId: university?.id || 1,
        aiScore: Math.floor(Math.random() * 30) + 70, // 70-100
        profileViews: Math.floor(Math.random() * 200) + 50,
        connections: Math.floor(Math.random() * 100) + 20,
        applicationsSent: Math.floor(Math.random() * 15) + 5,
        interviewsScheduled: Math.floor(Math.random() * 5) + 1
      }

      const created = await database.createStudent(student)
      console.log(`✅ Added student: ${created.name} from ${studentData.university}`)
    }

    console.log('🎉 European data seeding completed successfully!')
    console.log(`📊 Added ${europeanUniversities.length} universities and ${europeanStudents.length} students`)

  } catch (error) {
    console.error('❌ Error seeding European data:', error)
  }
}

module.exports = {
  europeanUniversities,
  europeanStudents,
  seedEuropeanData
}