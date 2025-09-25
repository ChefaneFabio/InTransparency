const database = require('../database/Database')

// Global Top Universities Data
const globalUniversities = [
  // US Universities
  {
    name: 'Stanford University',
    shortName: 'Stanford',
    slug: 'stanford',
    ranking: { global: 2, national: 2, engineering: 2 },
    location: { city: 'Stanford', state: 'California', country: 'United States' },
    stats: {
      students: 17249,
      undergrad: 7087,
      graduate: 10162,
      faculty: 2288,
      internationalStudents: 3879,
      acceptanceRate: 3.9
    },
    programs: [
      { name: 'Computer Science', ranking: 2, students: 1200 },
      { name: 'Engineering', ranking: 2, students: 1800 },
      { name: 'Business', ranking: 1, students: 850 },
      { name: 'Medicine', ranking: 5, students: 460 }
    ],
    topSkills: ['AI', 'Entrepreneurship', 'Computer Science', 'Engineering', 'Innovation'],
    companies: ['Google', 'Apple', 'Facebook', 'Tesla', 'Netflix'],
    avgSalary: '$165,000',
    employmentRate: 97.5,
    description: 'Stanford University is a leading research university known for innovation and entrepreneurship.',
    founded: 1885,
    website: 'https://www.stanford.edu/',
    contact: { email: 'info@stanford.edu', phone: '+1 650-723-2300' },
    socialMedia: { twitter: '@Stanford', linkedin: 'stanford-university' }
  },
  {
    name: 'Harvard University',
    shortName: 'Harvard',
    slug: 'harvard',
    ranking: { global: 4, national: 3, engineering: 20 },
    location: { city: 'Cambridge', state: 'Massachusetts', country: 'United States' },
    stats: {
      students: 23731,
      undergrad: 7240,
      graduate: 16491,
      faculty: 2400,
      internationalStudents: 5877,
      acceptanceRate: 3.2
    },
    programs: [
      { name: 'Business', ranking: 1, students: 1900 },
      { name: 'Medicine', ranking: 1, students: 700 },
      { name: 'Law', ranking: 3, students: 1990 },
      { name: 'Computer Science', ranking: 15, students: 800 }
    ],
    topSkills: ['Leadership', 'Business', 'Medicine', 'Law', 'Research'],
    companies: ['Goldman Sachs', 'McKinsey', 'Bain', 'Microsoft', 'Google'],
    avgSalary: '$175,000',
    employmentRate: 98.1,
    description: 'Harvard University is the oldest institution of higher education in the United States.',
    founded: 1636,
    website: 'https://www.harvard.edu/',
    contact: { email: 'info@harvard.edu', phone: '+1 617-495-1000' },
    socialMedia: { twitter: '@Harvard', linkedin: 'harvard-university' }
  },
  {
    name: 'California Institute of Technology',
    shortName: 'Caltech',
    slug: 'caltech',
    ranking: { global: 8, national: 4, engineering: 3 },
    location: { city: 'Pasadena', state: 'California', country: 'United States' },
    stats: {
      students: 2240,
      undergrad: 961,
      graduate: 1279,
      faculty: 300,
      internationalStudents: 560,
      acceptanceRate: 6.4
    },
    programs: [
      { name: 'Engineering', ranking: 3, students: 650 },
      { name: 'Physics', ranking: 1, students: 180 },
      { name: 'Computer Science', ranking: 7, students: 220 },
      { name: 'Mathematics', ranking: 8, students: 90 }
    ],
    topSkills: ['Physics', 'Engineering', 'Mathematics', 'Research', 'Innovation'],
    companies: ['SpaceX', 'NASA', 'Google', 'Tesla', 'Boeing'],
    avgSalary: '$155,000',
    employmentRate: 96.8,
    description: 'Caltech is a world-renowned science and engineering research university.',
    founded: 1891,
    website: 'https://www.caltech.edu/',
    contact: { email: 'info@caltech.edu', phone: '+1 626-395-6811' },
    socialMedia: { twitter: '@Caltech', linkedin: 'california-institute-of-technology' }
  },

  // More European Universities
  {
    name: 'Sorbonne University',
    shortName: 'Sorbonne',
    slug: 'sorbonne',
    ranking: { global: 35, national: 2, engineering: 45 },
    location: { city: 'Paris', state: 'Île-de-France', country: 'France' },
    stats: {
      students: 55600,
      undergrad: 32000,
      graduate: 23600,
      faculty: 6400,
      internationalStudents: 11120,
      acceptanceRate: 25
    },
    programs: [
      { name: 'Medicine', ranking: 12, students: 8900 },
      { name: 'Natural Sciences', ranking: 15, students: 7800 },
      { name: 'Arts & Humanities', ranking: 6, students: 12000 },
      { name: 'Engineering', ranking: 45, students: 3200 }
    ],
    topSkills: ['Research', 'Medicine', 'Arts', 'Natural Sciences', 'French Culture'],
    companies: ['Sanofi', 'Total', 'L\'Oréal', 'Airbus', 'Thales'],
    avgSalary: '€38,000',
    employmentRate: 89.5,
    description: 'Sorbonne University is a public research university located in Paris, France.',
    founded: 1150,
    website: 'https://www.sorbonne-universite.fr/',
    contact: { email: 'info@sorbonne-universite.fr', phone: '+33 1 44 27 44 27' },
    socialMedia: { twitter: '@Sorbonne_Univ_', linkedin: 'sorbonne-université' }
  },

  // Asian Universities
  {
    name: 'University of Tokyo',
    shortName: 'Todai',
    slug: 'university-tokyo',
    ranking: { global: 23, national: 1, engineering: 8 },
    location: { city: 'Tokyo', state: 'Tokyo', country: 'Japan' },
    stats: {
      students: 28753,
      undergrad: 14056,
      graduate: 14697,
      faculty: 4000,
      internationalStudents: 4300,
      acceptanceRate: 35
    },
    programs: [
      { name: 'Engineering', ranking: 8, students: 4200 },
      { name: 'Natural Sciences', ranking: 10, students: 3800 },
      { name: 'Medicine', ranking: 15, students: 1200 },
      { name: 'Economics', ranking: 12, students: 2400 }
    ],
    topSkills: ['Engineering', 'Technology', 'Research', 'Innovation', 'Japanese'],
    companies: ['Toyota', 'Sony', 'SoftBank', 'Nintendo', 'Panasonic'],
    avgSalary: '¥6,800,000',
    employmentRate: 94.2,
    description: 'The University of Tokyo is a public research university in Tokyo, Japan.',
    founded: 1877,
    website: 'https://www.u-tokyo.ac.jp/',
    contact: { email: 'info@u-tokyo.ac.jp', phone: '+81 3-3812-2111' },
    socialMedia: { twitter: '@UTokyo_News_en', linkedin: 'university-of-tokyo' }
  },
  {
    name: 'National University of Singapore',
    shortName: 'NUS',
    slug: 'nus-singapore',
    ranking: { global: 11, national: 1, engineering: 5 },
    location: { city: 'Singapore', state: 'Singapore', country: 'Singapore' },
    stats: {
      students: 40000,
      undergrad: 30000,
      graduate: 10000,
      faculty: 2700,
      internationalStudents: 12000,
      acceptanceRate: 15
    },
    programs: [
      { name: 'Engineering', ranking: 5, students: 8000 },
      { name: 'Computer Science', ranking: 3, students: 3200 },
      { name: 'Business', ranking: 8, students: 4500 },
      { name: 'Medicine', ranking: 20, students: 1800 }
    ],
    topSkills: ['Computer Science', 'Engineering', 'Business', 'Innovation', 'Multilingual'],
    companies: ['Google', 'Facebook', 'Grab', 'Shopee', 'Sea Limited'],
    avgSalary: 'S$85,000',
    employmentRate: 95.8,
    description: 'NUS is Singapore\'s flagship university offering a global approach to education.',
    founded: 1905,
    website: 'https://www.nus.edu.sg/',
    contact: { email: 'info@nus.edu.sg', phone: '+65 6516 6666' },
    socialMedia: { twitter: '@NUSingapore', linkedin: 'national-university-of-singapore' }
  },
  {
    name: 'Tsinghua University',
    shortName: 'Tsinghua',
    slug: 'tsinghua',
    ranking: { global: 14, national: 1, engineering: 9 },
    location: { city: 'Beijing', state: 'Beijing', country: 'China' },
    stats: {
      students: 50000,
      undergrad: 15000,
      graduate: 35000,
      faculty: 3400,
      internationalStudents: 3000,
      acceptanceRate: 12
    },
    programs: [
      { name: 'Engineering', ranking: 9, students: 12000 },
      { name: 'Computer Science', ranking: 10, students: 4800 },
      { name: 'Business', ranking: 5, students: 3200 },
      { name: 'Architecture', ranking: 8, students: 1800 }
    ],
    topSkills: ['Engineering', 'Technology', 'Business', 'Innovation', 'Chinese'],
    companies: ['Tencent', 'Alibaba', 'Baidu', 'Huawei', 'ByteDance'],
    avgSalary: '¥450,000',
    employmentRate: 96.5,
    description: 'Tsinghua University is a leading research university in Beijing, China.',
    founded: 1911,
    website: 'https://www.tsinghua.edu.cn/',
    contact: { email: 'info@tsinghua.edu.cn', phone: '+86 10-62793001' },
    socialMedia: { twitter: '@TsinghuaUni', linkedin: 'tsinghua-university' }
  },

  // More European Universities
  {
    name: 'Politecnico di Milano',
    shortName: 'PoliMi',
    slug: 'polimi',
    ranking: { global: 44, national: 1, engineering: 17 },
    location: { city: 'Milan', state: 'Lombardy', country: 'Italy' },
    stats: {
      students: 47000,
      undergrad: 31000,
      graduate: 16000,
      faculty: 1400,
      internationalStudents: 6580,
      acceptanceRate: 45
    },
    programs: [
      { name: 'Engineering', ranking: 17, students: 25000 },
      { name: 'Architecture', ranking: 5, students: 8000 },
      { name: 'Design', ranking: 4, students: 6000 },
      { name: 'Computer Science', ranking: 30, students: 4000 }
    ],
    topSkills: ['Engineering', 'Design', 'Architecture', 'Innovation', 'Italian'],
    companies: ['Ferrari', 'Prada', 'Pirelli', 'Eni', 'Leonardo'],
    avgSalary: '€35,000',
    employmentRate: 91.8,
    description: 'Politecnico di Milano is Italy\'s largest technical university.',
    founded: 1863,
    website: 'https://www.polimi.it/',
    contact: { email: 'info@polimi.it', phone: '+39 02 2399 2008' },
    socialMedia: { twitter: '@polimi', linkedin: 'politecnico-di-milano' }
  }
]

// Major Companies across industries
const majorCompanies = [
  // Technology
  {
    name: 'Google',
    slug: 'google',
    tagline: 'Organize the world\'s information',
    description: 'Multinational technology company specializing in Internet-related services.',
    industry: 'Technology',
    founded: 1998,
    size: '100,000+ employees',
    headquarters: 'Mountain View, California, USA',
    locations: ['Mountain View', 'London', 'Dublin', 'Singapore', 'Tokyo'],
    website: 'https://www.google.com',
    stats: { employees: 174014, openJobs: 1200, rating: 4.5, reviews: 12500 },
    values: [
      { name: 'Focus on the user', description: 'User comes first in everything' },
      { name: 'Innovation', description: 'Think 10x, not 10%' }
    ],
    benefits: ['Health insurance', 'Free meals', '20% time', 'Stock options'],
    techStack: ['Python', 'Go', 'C++', 'Java', 'Kubernetes'],
    averageSalary: '$180,000',
    workCulture: { remote: true, diversity: 90, workLifeBalance: 4.3, careerGrowth: 4.4 },
    contact: { email: 'careers@google.com' },
    socialMedia: { linkedin: 'google', twitter: '@Google' }
  },
  {
    name: 'Apple',
    slug: 'apple',
    tagline: 'Think Different',
    description: 'Technology company that designs and manufactures consumer electronics.',
    industry: 'Technology',
    founded: 1976,
    size: '100,000+ employees',
    headquarters: 'Cupertino, California, USA',
    locations: ['Cupertino', 'Austin', 'Cork', 'Singapore', 'Shanghai'],
    website: 'https://www.apple.com',
    stats: { employees: 164000, openJobs: 800, rating: 4.4, reviews: 8900 },
    values: [
      { name: 'Innovation', description: 'Revolutionary products that change lives' },
      { name: 'Quality', description: 'Uncompromising attention to detail' }
    ],
    benefits: ['Health coverage', 'Employee discounts', 'Stock purchase plan', 'Wellness programs'],
    techStack: ['Swift', 'Objective-C', 'C++', 'Metal', 'Core ML'],
    averageSalary: '$175,000',
    workCulture: { remote: false, diversity: 85, workLifeBalance: 4.0, careerGrowth: 4.2 },
    contact: { email: 'jobs@apple.com' },
    socialMedia: { linkedin: 'apple', twitter: '@Apple' }
  },

  // Finance
  {
    name: 'Goldman Sachs',
    slug: 'goldman-sachs',
    tagline: 'Progress is everyone\'s business',
    description: 'Leading global investment banking, securities and investment management firm.',
    industry: 'Finance',
    founded: 1869,
    size: '50,000+ employees',
    headquarters: 'New York, New York, USA',
    locations: ['New York', 'London', 'Hong Kong', 'Tokyo', 'Frankfurt'],
    website: 'https://www.goldmansachs.com',
    stats: { employees: 49100, openJobs: 450, rating: 4.2, reviews: 3200 },
    values: [
      { name: 'Client service', description: 'Our clients\' interests always come first' },
      { name: 'Excellence', description: 'Strive for the highest standards' }
    ],
    benefits: ['Health insurance', 'Retirement plans', 'Tuition assistance', 'Wellness programs'],
    techStack: ['Java', 'Python', 'C++', 'React', 'AWS'],
    averageSalary: '$195,000',
    workCulture: { remote: true, diversity: 75, workLifeBalance: 3.8, careerGrowth: 4.3 },
    contact: { email: 'careers@gs.com' },
    socialMedia: { linkedin: 'goldman-sachs', twitter: '@GoldmanSachs' }
  },

  // Consulting
  {
    name: 'McKinsey & Company',
    slug: 'mckinsey',
    tagline: 'Serving organizations and society',
    description: 'Global management consulting firm serving leading businesses and institutions.',
    industry: 'Consulting',
    founded: 1926,
    size: '30,000+ employees',
    headquarters: 'New York, New York, USA',
    locations: ['New York', 'London', 'Dubai', 'Shanghai', 'São Paulo'],
    website: 'https://www.mckinsey.com',
    stats: { employees: 34000, openJobs: 320, rating: 4.3, reviews: 2800 },
    values: [
      { name: 'Client impact', description: 'Help clients achieve lasting impact' },
      { name: 'Collaboration', description: 'Work together to solve complex problems' }
    ],
    benefits: ['Health coverage', 'Travel opportunities', 'Learning budget', 'Sabbatical'],
    techStack: ['Python', 'R', 'Tableau', 'PowerBI', 'SQL'],
    averageSalary: '$185,000',
    workCulture: { remote: true, diversity: 80, workLifeBalance: 3.5, careerGrowth: 4.5 },
    contact: { email: 'careers@mckinsey.com' },
    socialMedia: { linkedin: 'mckinsey-and-company', twitter: '@McKinsey' }
  },

  // Automotive
  {
    name: 'Tesla',
    slug: 'tesla',
    tagline: 'Accelerating the world\'s transition to sustainable energy',
    description: 'Electric vehicle and clean energy company.',
    industry: 'Automotive',
    founded: 2003,
    size: '100,000+ employees',
    headquarters: 'Austin, Texas, USA',
    locations: ['Austin', 'Fremont', 'Berlin', 'Shanghai', 'Nevada'],
    website: 'https://www.tesla.com',
    stats: { employees: 127855, openJobs: 900, rating: 3.9, reviews: 6700 },
    values: [
      { name: 'Sustainability', description: 'Accelerate sustainable transport and energy' },
      { name: 'Innovation', description: 'Push the boundaries of technology' }
    ],
    benefits: ['Stock options', 'Health insurance', 'Gym membership', 'Employee discounts'],
    techStack: ['Python', 'C++', 'JavaScript', 'React', 'TensorFlow'],
    averageSalary: '$145,000',
    workCulture: { remote: false, diversity: 78, workLifeBalance: 3.2, careerGrowth: 4.0 },
    contact: { email: 'careers@tesla.com' },
    socialMedia: { linkedin: 'tesla-motors', twitter: '@Tesla' }
  },

  // Pharmaceutical
  {
    name: 'Roche',
    slug: 'roche',
    tagline: 'Doing now what patients need next',
    description: 'Swiss multinational healthcare company that operates worldwide.',
    industry: 'Pharmaceutical',
    founded: 1896,
    size: '100,000+ employees',
    headquarters: 'Basel, Switzerland',
    locations: ['Basel', 'San Francisco', 'Tokyo', 'Shanghai', 'Mumbai'],
    website: 'https://www.roche.com',
    stats: { employees: 101465, openJobs: 650, rating: 4.1, reviews: 4200 },
    values: [
      { name: 'Patient focus', description: 'Patients are at the center of everything' },
      { name: 'Innovation', description: 'Science-driven innovation' }
    ],
    benefits: ['Health insurance', 'Flexible work', 'Learning opportunities', 'Wellness programs'],
    techStack: ['R', 'Python', 'SAS', 'Java', 'Cloud platforms'],
    averageSalary: 'CHF 110,000',
    workCulture: { remote: true, diversity: 85, workLifeBalance: 4.2, careerGrowth: 4.1 },
    contact: { email: 'careers@roche.com' },
    socialMedia: { linkedin: 'roche', twitter: '@Roche' }
  },

  // Entertainment/Media
  {
    name: 'Spotify',
    slug: 'spotify',
    tagline: 'Music for everyone',
    description: 'Audio streaming and media services provider.',
    industry: 'Entertainment',
    founded: 2006,
    size: '5,000+ employees',
    headquarters: 'Stockholm, Sweden',
    locations: ['Stockholm', 'New York', 'London', 'Berlin', 'São Paulo'],
    website: 'https://www.spotify.com',
    stats: { employees: 8359, openJobs: 280, rating: 4.4, reviews: 1800 },
    values: [
      { name: 'Innovation', description: 'Innovate and iterate quickly' },
      { name: 'Collaboration', description: 'Play as a team and win as a team' }
    ],
    benefits: ['Flexible work', 'Health coverage', 'Parental leave', 'Spotify Premium'],
    techStack: ['Java', 'Python', 'JavaScript', 'React', 'Google Cloud'],
    averageSalary: 'SEK 650,000',
    workCulture: { remote: true, diversity: 88, workLifeBalance: 4.5, careerGrowth: 4.3 },
    contact: { email: 'jobs@spotify.com' },
    socialMedia: { linkedin: 'spotify', twitter: '@Spotify' }
  }
]

// Realistic Jobs Data
const jobPostings = [
  {
    title: 'Senior Software Engineer',
    companyId: 1, // Google
    company: 'Google',
    location: 'Mountain View, CA',
    type: 'Full-time',
    remote: true,
    salary: { min: 160000, max: 250000, currency: 'USD' },
    level: 'Senior',
    department: 'Engineering',
    description: 'Join Google\'s core engineering team to build systems that serve billions of users.',
    requirements: [
      'Bachelor\'s degree in Computer Science or equivalent',
      '5+ years of software development experience',
      'Proficiency in Java, Python, or C++',
      'Experience with distributed systems'
    ],
    skills: ['Java', 'Python', 'Distributed Systems', 'System Design'],
    benefits: ['Health insurance', 'Stock options', 'Free meals', '20% time'],
    posted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    status: 'active',
    applicants: 847,
    views: 3240
  },
  {
    title: 'Machine Learning Engineer',
    companyId: 2, // Tesla
    company: 'Tesla',
    location: 'Palo Alto, CA',
    type: 'Full-time',
    remote: false,
    salary: { min: 140000, max: 200000, currency: 'USD' },
    level: 'Mid-level',
    department: 'AI/Autopilot',
    description: 'Develop ML models for Tesla\'s Autopilot and Full Self-Driving capabilities.',
    requirements: [
      'Master\'s degree in Computer Science, ML, or related field',
      '3+ years of ML engineering experience',
      'Experience with PyTorch or TensorFlow',
      'Knowledge of computer vision and deep learning'
    ],
    skills: ['Python', 'PyTorch', 'Computer Vision', 'Deep Learning'],
    benefits: ['Stock options', 'Health insurance', 'Employee discounts'],
    posted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    status: 'active',
    applicants: 234,
    views: 1820
  },
  {
    title: 'Investment Banking Analyst',
    companyId: 3, // Goldman Sachs
    company: 'Goldman Sachs',
    location: 'New York, NY',
    type: 'Full-time',
    remote: false,
    salary: { min: 110000, max: 150000, currency: 'USD' },
    level: 'Entry-level',
    department: 'Investment Banking',
    description: 'Join our Investment Banking Division to work on M&A, capital markets, and strategic advisory.',
    requirements: [
      'Bachelor\'s degree in Finance, Economics, or related field',
      'Strong analytical and quantitative skills',
      'Proficiency in Excel and financial modeling',
      'Excellent communication skills'
    ],
    skills: ['Financial Modeling', 'Excel', 'Valuation', 'M&A Analysis'],
    benefits: ['Health insurance', 'Bonus potential', 'Career development'],
    posted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    status: 'active',
    applicants: 1823,
    views: 8940
  }
]

// Student profiles for new universities
const additionalStudents = [
  {
    name: 'Sarah Chen',
    email: 'sarah.chen@stanford.edu',
    title: 'AI Research Student',
    university: 'Stanford University',
    major: 'Computer Science',
    year: 'PhD',
    graduation: '2026',
    gpa: 3.9,
    location: 'Stanford, CA',
    skills: [
      { name: 'Python', level: 'Expert', years: 5 },
      { name: 'Machine Learning', level: 'Expert', years: 4 },
      { name: 'TensorFlow', level: 'Advanced', years: 3 },
      { name: 'Research', level: 'Advanced', years: 3 }
    ],
    experience: [
      {
        company: 'OpenAI',
        position: 'Research Intern',
        duration: 'Summer 2024',
        description: 'Researched large language model optimization techniques'
      }
    ],
    languages: ['English (Native)', 'Mandarin (Native)', 'Spanish (Conversational)'],
    interests: ['AI Research', 'Tennis', 'Photography'],
    universityId: 1, // Will be updated when seeded
    aiScore: 96,
    profileViews: 312,
    connections: 145,
    applicationsSent: 5,
    interviewsScheduled: 3
  },
  {
    name: 'Hiroshi Tanaka',
    email: 'hiroshi.tanaka@u-tokyo.ac.jp',
    title: 'Robotics Engineering Student',
    university: 'University of Tokyo',
    major: 'Mechanical Engineering',
    year: 'Master\'s',
    graduation: '2025',
    gpa: 3.7,
    location: 'Tokyo, Japan',
    skills: [
      { name: 'Robotics', level: 'Expert', years: 4 },
      { name: 'C++', level: 'Advanced', years: 3 },
      { name: 'ROS', level: 'Advanced', years: 2 },
      { name: 'Computer Vision', level: 'Intermediate', years: 2 }
    ],
    experience: [
      {
        company: 'Sony',
        position: 'Robotics Engineer Intern',
        duration: '6 months 2024',
        description: 'Developed autonomous navigation algorithms for robotic systems'
      }
    ],
    languages: ['Japanese (Native)', 'English (Fluent)', 'Korean (Basic)'],
    interests: ['Robotics', 'Anime', 'Karate'],
    universityId: 1, // Will be updated when seeded
    aiScore: 89,
    profileViews: 156,
    connections: 78,
    applicationsSent: 12,
    interviewsScheduled: 4
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@nus.edu.sg',
    title: 'Data Science Student',
    university: 'National University of Singapore',
    major: 'Data Science',
    year: 'Master\'s',
    graduation: '2025',
    gpa: 4.1,
    location: 'Singapore',
    skills: [
      { name: 'Python', level: 'Expert', years: 4 },
      { name: 'Machine Learning', level: 'Advanced', years: 3 },
      { name: 'SQL', level: 'Advanced', years: 3 },
      { name: 'Tableau', level: 'Advanced', years: 2 }
    ],
    experience: [
      {
        company: 'Grab',
        position: 'Data Science Intern',
        duration: 'Summer 2024',
        description: 'Built recommendation systems for food delivery optimization'
      }
    ],
    languages: ['English (Fluent)', 'Hindi (Native)', 'Tamil (Native)', 'Mandarin (Basic)'],
    interests: ['Data Science', 'Cooking', 'Travel'],
    universityId: 1, // Will be updated when seeded
    aiScore: 92,
    profileViews: 208,
    connections: 167,
    applicationsSent: 8,
    interviewsScheduled: 5
  }
]

async function seedGlobalExpansion() {
  console.log('🌍 Starting global university and industry expansion...')

  // Add universities
  console.log('🏛️ Adding global universities...')
  for (const uni of globalUniversities) {
    const university = await database.createUniversity(uni)
    console.log(`✅ Added: ${uni.name} (${uni.location.country})`)
  }

  // Add companies
  console.log('🏢 Adding major companies...')
  for (const comp of majorCompanies) {
    const company = await database.createCompany(comp)
    console.log(`✅ Added: ${comp.name} (${comp.industry})`)
  }

  // Add jobs
  console.log('💼 Adding job postings...')
  for (const job of jobPostings) {
    const jobPosting = await database.createJob(job)
    console.log(`✅ Added job: ${job.title} at ${job.company}`)
  }

  // Add students
  console.log('🎓 Adding international students...')
  for (let i = 0; i < additionalStudents.length; i++) {
    const student = additionalStudents[i]
    // Find the university ID by name
    const universities = await database.findAllUniversities()
    const university = universities.find(u => u.name === student.university)
    if (university) {
      student.universityId = university.id
    }

    const studentProfile = await database.createStudent(student)
    console.log(`✅ Added student: ${student.name} from ${student.university}`)
  }

  console.log('🎉 Global expansion completed successfully!')

  // Print summary
  const summary = await database.findAllUniversities()
  const companies = await database.findAllCompanies()
  const jobs = await database.findAllJobs()
  const students = await database.findAllStudents()

  console.log(`📊 Final counts:`)
  console.log(`   Universities: ${summary.length}`)
  console.log(`   Companies: ${companies.length}`)
  console.log(`   Jobs: ${jobs.length}`)
  console.log(`   Students: ${students.length}`)
}

module.exports = { seedGlobalExpansion }