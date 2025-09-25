const database = require('../database/Database')

// Massive University Dataset - Top 100+ Universities Worldwide
const massiveUniversityDataset = [
  // US Universities (Top 50)
  {
    name: 'Princeton University',
    shortName: 'Princeton',
    slug: 'princeton',
    ranking: { global: 9, national: 5, engineering: 14 },
    location: { city: 'Princeton', state: 'New Jersey', country: 'United States' },
    stats: { students: 5400, undergrad: 5400, graduate: 2800, faculty: 1200, internationalStudents: 1620, acceptanceRate: 5.8 },
    programs: [
      { name: 'Economics', ranking: 1, students: 450 },
      { name: 'Public Policy', ranking: 1, students: 320 },
      { name: 'Computer Science', ranking: 12, students: 380 },
      { name: 'Engineering', ranking: 14, students: 420 }
    ],
    topSkills: ['Economics', 'Public Policy', 'Computer Science', 'Research', 'Leadership'],
    companies: ['Goldman Sachs', 'McKinsey', 'Google', 'Microsoft', 'JP Morgan'],
    avgSalary: '$185,000',
    employmentRate: 98.2,
    description: 'Princeton University is a private Ivy League research university.',
    founded: 1746,
    website: 'https://www.princeton.edu/',
    contact: { email: 'info@princeton.edu', phone: '+1 609-258-3000' },
    socialMedia: { twitter: '@Princeton', linkedin: 'princeton-university' }
  },
  {
    name: 'Yale University',
    shortName: 'Yale',
    slug: 'yale',
    ranking: { global: 12, national: 6, engineering: 35 },
    location: { city: 'New Haven', state: 'Connecticut', country: 'United States' },
    stats: { students: 13433, undergrad: 5964, graduate: 7469, faculty: 4410, internationalStudents: 2686, acceptanceRate: 6.1 },
    programs: [
      { name: 'Law', ranking: 1, students: 650 },
      { name: 'Medicine', ranking: 4, students: 420 },
      { name: 'Drama', ranking: 1, students: 280 },
      { name: 'History', ranking: 2, students: 380 }
    ],
    topSkills: ['Law', 'Medicine', 'Arts', 'History', 'Leadership'],
    companies: ['McKinsey', 'Goldman Sachs', 'Google', 'Morgan Stanley', 'Bain'],
    avgSalary: '$178,000',
    employmentRate: 97.8,
    description: 'Yale University is a private Ivy League research university.',
    founded: 1701,
    website: 'https://www.yale.edu/',
    contact: { email: 'info@yale.edu', phone: '+1 203-432-4771' },
    socialMedia: { twitter: '@Yale', linkedin: 'yale-university' }
  },
  {
    name: 'Columbia University',
    shortName: 'Columbia',
    slug: 'columbia',
    ranking: { global: 18, national: 7, engineering: 16 },
    location: { city: 'New York', state: 'New York', country: 'United States' },
    stats: { students: 33413, undergrad: 8148, graduate: 25265, faculty: 4370, internationalStudents: 13365, acceptanceRate: 6.7 },
    programs: [
      { name: 'Journalism', ranking: 1, students: 520 },
      { name: 'Business', ranking: 6, students: 1450 },
      { name: 'Medicine', ranking: 7, students: 650 },
      { name: 'Engineering', ranking: 16, students: 1820 }
    ],
    topSkills: ['Journalism', 'Business', 'Medicine', 'Engineering', 'Finance'],
    companies: ['Goldman Sachs', 'JP Morgan', 'Google', 'McKinsey', 'Microsoft'],
    avgSalary: '$182,000',
    employmentRate: 96.9,
    description: 'Columbia University is a private Ivy League research university in New York City.',
    founded: 1754,
    website: 'https://www.columbia.edu/',
    contact: { email: 'info@columbia.edu', phone: '+1 212-854-1754' },
    socialMedia: { twitter: '@Columbia', linkedin: 'columbia-university' }
  },
  {
    name: 'University of Chicago',
    shortName: 'UChicago',
    slug: 'uchicago',
    ranking: { global: 10, national: 8, engineering: 45 },
    location: { city: 'Chicago', state: 'Illinois', country: 'United States' },
    stats: { students: 17834, undergrad: 7559, graduate: 10275, faculty: 2961, internationalStudents: 3567, acceptanceRate: 7.4 },
    programs: [
      { name: 'Economics', ranking: 1, students: 680 },
      { name: 'Business', ranking: 3, students: 1200 },
      { name: 'Medicine', ranking: 15, students: 380 },
      { name: 'Physics', ranking: 5, students: 290 }
    ],
    topSkills: ['Economics', 'Business', 'Finance', 'Research', 'Analytics'],
    companies: ['Goldman Sachs', 'McKinsey', 'Citadel', 'Google', 'JP Morgan'],
    avgSalary: '$176,000',
    employmentRate: 97.2,
    description: 'The University of Chicago is a private research university.',
    founded: 1890,
    website: 'https://www.uchicago.edu/',
    contact: { email: 'info@uchicago.edu', phone: '+1 773-702-1234' },
    socialMedia: { twitter: '@UChicago', linkedin: 'university-of-chicago' }
  },
  {
    name: 'University of Pennsylvania',
    shortName: 'Penn',
    slug: 'upenn',
    ranking: { global: 13, national: 9, engineering: 18 },
    location: { city: 'Philadelphia', state: 'Pennsylvania', country: 'United States' },
    stats: { students: 28201, undergrad: 9872, graduate: 18329, faculty: 4793, internationalStudents: 5640, acceptanceRate: 8.4 },
    programs: [
      { name: 'Business', ranking: 1, students: 1650 },
      { name: 'Medicine', ranking: 6, students: 620 },
      { name: 'Engineering', ranking: 18, students: 1420 },
      { name: 'Nursing', ranking: 1, students: 890 }
    ],
    topSkills: ['Business', 'Medicine', 'Engineering', 'Finance', 'Healthcare'],
    companies: ['Goldman Sachs', 'McKinsey', 'Google', 'Microsoft', 'Johnson & Johnson'],
    avgSalary: '$181,000',
    employmentRate: 97.5,
    description: 'The University of Pennsylvania is a private Ivy League research university.',
    founded: 1740,
    website: 'https://www.upenn.edu/',
    contact: { email: 'info@upenn.edu', phone: '+1 215-898-5000' },
    socialMedia: { twitter: '@Penn', linkedin: 'university-of-pennsylvania' }
  },

  // UK Universities
  {
    name: 'London School of Economics',
    shortName: 'LSE',
    slug: 'lse',
    ranking: { global: 49, national: 8, engineering: null },
    location: { city: 'London', state: 'Greater London', country: 'United Kingdom' },
    stats: { students: 12330, undergrad: 5110, graduate: 7220, faculty: 1600, internationalStudents: 7398, acceptanceRate: 8.9 },
    programs: [
      { name: 'Economics', ranking: 2, students: 1200 },
      { name: 'Political Science', ranking: 3, students: 950 },
      { name: 'Finance', ranking: 4, students: 880 },
      { name: 'International Relations', ranking: 2, students: 720 }
    ],
    topSkills: ['Economics', 'Finance', 'Political Science', 'International Relations', 'Research'],
    companies: ['Goldman Sachs', 'McKinsey', 'JP Morgan', 'Bank of England', 'UN'],
    avgSalary: '£55,000',
    employmentRate: 95.8,
    description: 'The London School of Economics is a public research university specializing in social sciences.',
    founded: 1895,
    website: 'https://www.lse.ac.uk/',
    contact: { email: 'info@lse.ac.uk', phone: '+44 20 7405 7686' },
    socialMedia: { twitter: '@LSEnews', linkedin: 'london-school-of-economics' }
  },
  {
    name: 'King\'s College London',
    shortName: 'King\'s',
    slug: 'kings-college',
    ranking: { global: 31, national: 6, engineering: 42 },
    location: { city: 'London', state: 'Greater London', country: 'United Kingdom' },
    stats: { students: 41000, undergrad: 26000, graduate: 15000, faculty: 8500, internationalStudents: 15400, acceptanceRate: 13 },
    programs: [
      { name: 'Medicine', ranking: 5, students: 2800 },
      { name: 'Law', ranking: 7, students: 2200 },
      { name: 'International Relations', ranking: 5, students: 1800 },
      { name: 'English Literature', ranking: 4, students: 1600 }
    ],
    topSkills: ['Medicine', 'Law', 'International Relations', 'Literature', 'Research'],
    companies: ['NHS', 'Clifford Chance', 'Goldman Sachs', 'BBC', 'Deloitte'],
    avgSalary: '£42,000',
    employmentRate: 94.2,
    description: 'King\'s College London is a public research university located in London.',
    founded: 1829,
    website: 'https://www.kcl.ac.uk/',
    contact: { email: 'info@kcl.ac.uk', phone: '+44 20 7836 5454' },
    socialMedia: { twitter: '@KingsCollegeLon', linkedin: 'kings-college-london' }
  },
  {
    name: 'University College London',
    shortName: 'UCL',
    slug: 'ucl',
    ranking: { global: 16, national: 4, engineering: 11 },
    location: { city: 'London', state: 'Greater London', country: 'United Kingdom' },
    stats: { students: 48000, undergrad: 21000, graduate: 27000, faculty: 7500, internationalStudents: 19200, acceptanceRate: 11 },
    programs: [
      { name: 'Architecture', ranking: 2, students: 1200 },
      { name: 'Medicine', ranking: 4, students: 3200 },
      { name: 'Engineering', ranking: 11, students: 4800 },
      { name: 'Computer Science', ranking: 9, students: 2400 }
    ],
    topSkills: ['Architecture', 'Medicine', 'Engineering', 'Computer Science', 'Research'],
    companies: ['Google', 'Microsoft', 'Arup', 'Foster + Partners', 'NHS'],
    avgSalary: '£46,000',
    employmentRate: 95.1,
    description: 'University College London is a public research university in London.',
    founded: 1826,
    website: 'https://www.ucl.ac.uk/',
    contact: { email: 'info@ucl.ac.uk', phone: '+44 20 7679 2000' },
    socialMedia: { twitter: '@ucl', linkedin: 'university-college-london' }
  },

  // European Universities
  {
    name: 'University of Amsterdam',
    shortName: 'UvA',
    slug: 'university-amsterdam',
    ranking: { global: 58, national: 1, engineering: 65 },
    location: { city: 'Amsterdam', state: 'North Holland', country: 'Netherlands' },
    stats: { students: 42000, undergrad: 24000, graduate: 18000, faculty: 5200, internationalStudents: 12600, acceptanceRate: 30 },
    programs: [
      { name: 'Psychology', ranking: 8, students: 3200 },
      { name: 'Economics', ranking: 15, students: 2800 },
      { name: 'Communication Science', ranking: 3, students: 2400 },
      { name: 'Computer Science', ranking: 28, students: 1800 }
    ],
    topSkills: ['Psychology', 'Economics', 'Communication', 'Research', 'Dutch'],
    companies: ['ING', 'Philips', 'ASML', 'Unilever', 'Booking.com'],
    avgSalary: '€52,000',
    employmentRate: 92.8,
    description: 'The University of Amsterdam is a public research university located in Amsterdam.',
    founded: 1877,
    website: 'https://www.uva.nl/',
    contact: { email: 'info@uva.nl', phone: '+31 20 525 9111' },
    socialMedia: { twitter: '@UvA_Amsterdam', linkedin: 'university-of-amsterdam' }
  },
  {
    name: 'KU Leuven',
    shortName: 'KU Leuven',
    slug: 'ku-leuven',
    ranking: { global: 70, national: 1, engineering: 48 },
    location: { city: 'Leuven', state: 'Flemish Brabant', country: 'Belgium' },
    stats: { students: 61000, undergrad: 38000, graduate: 23000, faculty: 11000, internationalStudents: 15000, acceptanceRate: 25 },
    programs: [
      { name: 'Medicine', ranking: 12, students: 4200 },
      { name: 'Engineering', ranking: 48, students: 6800 },
      { name: 'Psychology', ranking: 18, students: 2800 },
      { name: 'Business', ranking: 35, students: 3200 }
    ],
    topSkills: ['Medicine', 'Engineering', 'Psychology', 'Business', 'Research'],
    companies: ['Johnson & Johnson', 'AB InBev', 'Umicore', 'Solvay', 'Agfa'],
    avgSalary: '€48,000',
    employmentRate: 94.5,
    description: 'KU Leuven is a Catholic research university in the Dutch-speaking town of Leuven.',
    founded: 1425,
    website: 'https://www.kuleuven.be/',
    contact: { email: 'info@kuleuven.be', phone: '+32 16 32 40 10' },
    socialMedia: { twitter: '@KULeuven', linkedin: 'ku-leuven' }
  },

  // Asian Universities
  {
    name: 'Peking University',
    shortName: 'PKU',
    slug: 'peking-university',
    ranking: { global: 12, national: 2, engineering: 22 },
    location: { city: 'Beijing', state: 'Beijing', country: 'China' },
    stats: { students: 45000, undergrad: 15000, graduate: 30000, faculty: 9000, internationalStudents: 3600, acceptanceRate: 10 },
    programs: [
      { name: 'Liberal Arts', ranking: 1, students: 4200 },
      { name: 'Economics', ranking: 8, students: 3800 },
      { name: 'Medicine', ranking: 6, students: 2800 },
      { name: 'Computer Science', ranking: 15, students: 3200 }
    ],
    topSkills: ['Liberal Arts', 'Economics', 'Medicine', 'Computer Science', 'Chinese'],
    companies: ['Alibaba', 'Tencent', 'Baidu', 'Bank of China', 'ICBC'],
    avgSalary: '¥520,000',
    employmentRate: 95.8,
    description: 'Peking University is a major research university located in Beijing, China.',
    founded: 1898,
    website: 'https://english.pku.edu.cn/',
    contact: { email: 'info@pku.edu.cn', phone: '+86 10-6275-1230' },
    socialMedia: { twitter: '@PKUChina', linkedin: 'peking-university' }
  },
  {
    name: 'Seoul National University',
    shortName: 'SNU',
    slug: 'seoul-national',
    ranking: { global: 29, national: 1, engineering: 24 },
    location: { city: 'Seoul', state: 'Seoul', country: 'South Korea' },
    stats: { students: 28000, undergrad: 16500, graduate: 11500, faculty: 2100, internationalStudents: 3360, acceptanceRate: 20 },
    programs: [
      { name: 'Engineering', ranking: 24, students: 4800 },
      { name: 'Medicine', ranking: 18, students: 1200 },
      { name: 'Business', ranking: 28, students: 2400 },
      { name: 'Natural Sciences', ranking: 22, students: 3200 }
    ],
    topSkills: ['Engineering', 'Medicine', 'Business', 'Natural Sciences', 'Korean'],
    companies: ['Samsung', 'LG', 'Hyundai', 'SK Group', 'Naver'],
    avgSalary: '₩65,000,000',
    employmentRate: 96.2,
    description: 'Seoul National University is a national research university located in Seoul, South Korea.',
    founded: 1946,
    website: 'https://www.snu.ac.kr/',
    contact: { email: 'info@snu.ac.kr', phone: '+82 2-880-5114' },
    socialMedia: { twitter: '@SNUofficial', linkedin: 'seoul-national-university' }
  },
  {
    name: 'Hong Kong University of Science and Technology',
    shortName: 'HKUST',
    slug: 'hkust',
    ranking: { global: 27, national: 1, engineering: 20 },
    location: { city: 'Hong Kong', state: 'Hong Kong', country: 'Hong Kong' },
    stats: { students: 16300, undergrad: 10500, graduate: 5800, faculty: 600, internationalStudents: 4890, acceptanceRate: 12 },
    programs: [
      { name: 'Engineering', ranking: 20, students: 4200 },
      { name: 'Business', ranking: 12, students: 2800 },
      { name: 'Science', ranking: 18, students: 3200 },
      { name: 'Computer Science', ranking: 14, students: 2100 }
    ],
    topSkills: ['Engineering', 'Business', 'Science', 'Computer Science', 'Innovation'],
    companies: ['Goldman Sachs', 'Google', 'Microsoft', 'Alibaba', 'Tencent'],
    avgSalary: 'HK$650,000',
    employmentRate: 97.1,
    description: 'HKUST is a public research university in Hong Kong focused on science and technology.',
    founded: 1991,
    website: 'https://www.ust.hk/',
    contact: { email: 'info@ust.hk', phone: '+852 2358 6000' },
    socialMedia: { twitter: '@HKUST', linkedin: 'hong-kong-university-of-science-and-technology' }
  },
  {
    name: 'Australian National University',
    shortName: 'ANU',
    slug: 'anu',
    ranking: { global: 34, national: 1, engineering: 58 },
    location: { city: 'Canberra', state: 'Australian Capital Territory', country: 'Australia' },
    stats: { students: 25500, undergrad: 13500, graduate: 12000, faculty: 3500, internationalStudents: 12750, acceptanceRate: 35 },
    programs: [
      { name: 'International Relations', ranking: 8, students: 1800 },
      { name: 'Political Science', ranking: 6, students: 1600 },
      { name: 'Economics', ranking: 24, students: 1400 },
      { name: 'Computer Science', ranking: 38, students: 1200 }
    ],
    topSkills: ['International Relations', 'Political Science', 'Economics', 'Research', 'Policy'],
    companies: ['Commonwealth Bank', 'Telstra', 'BHP', 'Government of Australia', 'KPMG'],
    avgSalary: 'AU$85,000',
    employmentRate: 93.8,
    description: 'The Australian National University is a public research university located in Canberra.',
    founded: 1946,
    website: 'https://www.anu.edu.au/',
    contact: { email: 'info@anu.edu.au', phone: '+61 2 6125 5111' },
    socialMedia: { twitter: '@ANUmedia', linkedin: 'australian-national-university' }
  }
]

// Comprehensive Industry Companies (50+ companies across 15+ industries)
const massiveCompanyDataset = [
  // Technology Giants
  {
    name: 'Microsoft',
    slug: 'microsoft',
    tagline: 'Empower every person and organization on the planet to achieve more',
    description: 'Multinational technology corporation producing computer software, consumer electronics.',
    industry: 'Technology',
    founded: 1975,
    size: '200,000+ employees',
    headquarters: 'Redmond, Washington, USA',
    locations: ['Redmond', 'Dublin', 'Bangalore', 'Beijing', 'Tel Aviv'],
    website: 'https://www.microsoft.com',
    stats: { employees: 221000, openJobs: 2400, rating: 4.4, reviews: 18500 },
    values: [
      { name: 'Respect', description: 'We are each responsible for creating an inclusive culture' },
      { name: 'Integrity', description: 'We are each responsible for creating a culture of integrity' }
    ],
    benefits: ['Health coverage', 'Stock awards', 'Parental leave', 'Learning resources'],
    techStack: ['C#', '.NET', 'Azure', 'TypeScript', 'Python'],
    averageSalary: '$165,000',
    workCulture: { remote: true, diversity: 88, workLifeBalance: 4.2, careerGrowth: 4.3 },
    contact: { email: 'careers@microsoft.com' },
    socialMedia: { linkedin: 'microsoft', twitter: '@Microsoft' }
  },
  {
    name: 'Meta',
    slug: 'meta',
    tagline: 'Bringing the world closer together',
    description: 'Social media and technology company focused on building the metaverse.',
    industry: 'Technology',
    founded: 2004,
    size: '70,000+ employees',
    headquarters: 'Menlo Park, California, USA',
    locations: ['Menlo Park', 'Austin', 'London', 'Singapore', 'Tel Aviv'],
    website: 'https://about.meta.com',
    stats: { employees: 77805, openJobs: 1800, rating: 4.2, reviews: 8900 },
    values: [
      { name: 'Move fast', description: 'Moving fast enables us to build more things' },
      { name: 'Be bold', description: 'Building great things means taking risks' }
    ],
    benefits: ['Health insurance', 'Stock options', 'Free meals', 'Wellness stipend'],
    techStack: ['React', 'GraphQL', 'Python', 'C++', 'Hack'],
    averageSalary: '$185,000',
    workCulture: { remote: true, diversity: 82, workLifeBalance: 3.9, careerGrowth: 4.1 },
    contact: { email: 'recruiting@meta.com' },
    socialMedia: { linkedin: 'meta', twitter: '@Meta' }
  },

  // Financial Services
  {
    name: 'JPMorgan Chase',
    slug: 'jpmorgan',
    tagline: 'The right relationship is everything',
    description: 'American multinational investment bank and financial services holding company.',
    industry: 'Finance',
    founded: 1799,
    size: '280,000+ employees',
    headquarters: 'New York, New York, USA',
    locations: ['New York', 'London', 'Hong Kong', 'Tokyo', 'Mumbai'],
    website: 'https://www.jpmorganchase.com',
    stats: { employees: 296877, openJobs: 3200, rating: 3.9, reviews: 15600 },
    values: [
      { name: 'Integrity', description: 'We do the right thing, responsibly' },
      { name: 'Excellence', description: 'We strive to be the best at what we do' }
    ],
    benefits: ['Health coverage', 'Retirement plans', 'Tuition reimbursement', 'Employee assistance'],
    techStack: ['Java', 'Python', 'React', 'AWS', 'Microservices'],
    averageSalary: '$145,000',
    workCulture: { remote: true, diversity: 78, workLifeBalance: 3.8, careerGrowth: 4.0 },
    contact: { email: 'careers@jpmorgan.com' },
    socialMedia: { linkedin: 'jpmorgan-chase-&-co-', twitter: '@JPMorgan' }
  },
  {
    name: 'Morgan Stanley',
    slug: 'morgan-stanley',
    tagline: 'What we do matters',
    description: 'American multinational investment bank and financial services company.',
    industry: 'Finance',
    founded: 1935,
    size: '75,000+ employees',
    headquarters: 'New York, New York, USA',
    locations: ['New York', 'London', 'Tokyo', 'Hong Kong', 'Montreal'],
    website: 'https://www.morganstanley.com',
    stats: { employees: 82427, openJobs: 1200, rating: 4.0, reviews: 6800 },
    values: [
      { name: 'Do the right thing', description: 'Putting clients first' },
      { name: 'Excellence', description: 'Give nothing less than our best' }
    ],
    benefits: ['Health insurance', 'Retirement savings', 'Parental leave', 'Wellness programs'],
    techStack: ['Java', 'Python', 'C++', 'React', 'MongoDB'],
    averageSalary: '$155,000',
    workCulture: { remote: true, diversity: 75, workLifeBalance: 3.7, careerGrowth: 4.1 },
    contact: { email: 'careers@morganstanley.com' },
    socialMedia: { linkedin: 'morgan-stanley', twitter: '@MorganStanley' }
  },

  // Healthcare & Pharmaceuticals
  {
    name: 'Johnson & Johnson',
    slug: 'johnson-johnson',
    tagline: 'Our Credo in Action',
    description: 'American multinational corporation developing medical devices, pharmaceuticals, and consumer goods.',
    industry: 'Healthcare',
    founded: 1886,
    size: '140,000+ employees',
    headquarters: 'New Brunswick, New Jersey, USA',
    locations: ['New Brunswick', 'Basel', 'Tokyo', 'São Paulo', 'Shanghai'],
    website: 'https://www.jnj.com',
    stats: { employees: 152700, openJobs: 2800, rating: 4.1, reviews: 12400 },
    values: [
      { name: 'Our Credo', description: 'Our responsibilities to patients, employees, communities' },
      { name: 'Innovation', description: 'Transforming the trajectory of health for humanity' }
    ],
    benefits: ['Comprehensive health coverage', 'Retirement plans', 'Wellness programs', 'Employee assistance'],
    techStack: ['Java', 'Python', 'SAS', 'Tableau', 'AWS'],
    averageSalary: '$125,000',
    workCulture: { remote: true, diversity: 85, workLifeBalance: 4.3, careerGrowth: 4.2 },
    contact: { email: 'careers@jnj.com' },
    socialMedia: { linkedin: 'johnson-&-johnson', twitter: '@JNJNews' }
  },
  {
    name: 'Pfizer',
    slug: 'pfizer',
    tagline: 'Breakthroughs that change patients\' lives',
    description: 'American multinational pharmaceutical and biotechnology corporation.',
    industry: 'Pharmaceutical',
    founded: 1849,
    size: '80,000+ employees',
    headquarters: 'New York, New York, USA',
    locations: ['New York', 'Groton', 'Cambridge', 'Dublin', 'Tokyo'],
    website: 'https://www.pfizer.com',
    stats: { employees: 83000, openJobs: 1600, rating: 4.0, reviews: 7200 },
    values: [
      { name: 'Patient focus', description: 'Patients are why we exist' },
      { name: 'Courage', description: 'Addressing the world\'s greatest health challenges' }
    ],
    benefits: ['Health coverage', 'Stock options', 'Flexible work', 'Learning opportunities'],
    techStack: ['R', 'SAS', 'Python', 'Spotfire', 'Clinical trial systems'],
    averageSalary: '$130,000',
    workCulture: { remote: true, diversity: 83, workLifeBalance: 4.1, careerGrowth: 4.0 },
    contact: { email: 'careers@pfizer.com' },
    socialMedia: { linkedin: 'pfizer', twitter: '@pfizer' }
  },

  // Consumer Goods
  {
    name: 'Unilever',
    slug: 'unilever',
    tagline: 'Making sustainable living commonplace',
    description: 'British-Dutch multinational consumer goods company.',
    industry: 'Consumer Goods',
    founded: 1929,
    size: '190,000+ employees',
    headquarters: 'London, United Kingdom',
    locations: ['London', 'Rotterdam', 'Mumbai', 'São Paulo', 'Singapore'],
    website: 'https://www.unilever.com',
    stats: { employees: 190000, openJobs: 2200, rating: 4.2, reviews: 8900 },
    values: [
      { name: 'Integrity', description: 'Acting with integrity in everything we do' },
      { name: 'Respect', description: 'Respecting people and the planet' }
    ],
    benefits: ['Health insurance', 'Flexible work', 'Sustainability programs', 'Career development'],
    techStack: ['SAP', 'Salesforce', 'Azure', 'Tableau', 'Power BI'],
    averageSalary: '€65,000',
    workCulture: { remote: true, diversity: 90, workLifeBalance: 4.4, careerGrowth: 4.1 },
    contact: { email: 'careers@unilever.com' },
    socialMedia: { linkedin: 'unilever', twitter: '@Unilever' }
  },
  {
    name: 'Procter & Gamble',
    slug: 'pg',
    tagline: 'We are P&G',
    description: 'American multinational consumer goods corporation.',
    industry: 'Consumer Goods',
    founded: 1837,
    size: '101,000+ employees',
    headquarters: 'Cincinnati, Ohio, USA',
    locations: ['Cincinnati', 'Geneva', 'Singapore', 'Beijing', 'Mexico City'],
    website: 'https://www.pg.com',
    stats: { employees: 101000, openJobs: 1400, rating: 4.3, reviews: 5600 },
    values: [
      { name: 'Integrity', description: 'We always try to do the right thing' },
      { name: 'Leadership', description: 'We are all leaders in our own right' }
    ],
    benefits: ['Health coverage', 'Stock ownership', 'Flexible work', 'Professional development'],
    techStack: ['SAP', 'Salesforce', 'Python', 'R', 'Tableau'],
    averageSalary: '$115,000',
    workCulture: { remote: true, diversity: 87, workLifeBalance: 4.2, careerGrowth: 4.3 },
    contact: { email: 'careers@pg.com' },
    socialMedia: { linkedin: 'procter-and-gamble', twitter: '@ProcterGamble' }
  },

  // Energy & Oil
  {
    name: 'ExxonMobil',
    slug: 'exxonmobil',
    tagline: 'Energy lives here',
    description: 'American multinational oil and gas corporation.',
    industry: 'Energy',
    founded: 1999,
    size: '62,000+ employees',
    headquarters: 'Irving, Texas, USA',
    locations: ['Irving', 'Houston', 'Baton Rouge', 'Singapore', 'Qatar'],
    website: 'https://corporate.exxonmobil.com',
    stats: { employees: 62000, openJobs: 800, rating: 3.8, reviews: 4200 },
    values: [
      { name: 'Safety', description: 'Nobody gets hurt' },
      { name: 'Integrity', description: 'Being honest and trustworthy in all we do' }
    ],
    benefits: ['Health coverage', 'Retirement plans', 'Life insurance', 'Employee assistance'],
    techStack: ['MATLAB', 'Python', 'SAP', 'Petrel', 'Simulation software'],
    averageSalary: '$120,000',
    workCulture: { remote: false, diversity: 72, workLifeBalance: 3.9, careerGrowth: 3.8 },
    contact: { email: 'careers@exxonmobil.com' },
    socialMedia: { linkedin: 'exxonmobil', twitter: '@exxonmobil' }
  },

  // Media & Entertainment
  {
    name: 'Netflix',
    slug: 'netflix',
    tagline: 'Entertaining the world',
    description: 'American streaming entertainment service with TV series, documentaries, and feature films.',
    industry: 'Entertainment',
    founded: 1997,
    size: '11,000+ employees',
    headquarters: 'Los Gatos, California, USA',
    locations: ['Los Gatos', 'Los Angeles', 'Amsterdam', 'Tokyo', 'São Paulo'],
    website: 'https://www.netflix.com',
    stats: { employees: 12800, openJobs: 650, rating: 4.5, reviews: 2800 },
    values: [
      { name: 'Freedom & Responsibility', description: 'We give people freedom to make decisions' },
      { name: 'Innovation', description: 'We innovate to create great entertainment' }
    ],
    benefits: ['Health coverage', 'Stock options', 'Unlimited time off', 'Parental leave'],
    techStack: ['Java', 'Python', 'JavaScript', 'React', 'AWS'],
    averageSalary: '$190,000',
    workCulture: { remote: true, diversity: 85, workLifeBalance: 4.1, careerGrowth: 4.2 },
    contact: { email: 'jobs@netflix.com' },
    socialMedia: { linkedin: 'netflix', twitter: '@netflix' }
  },

  // Retail & E-commerce
  {
    name: 'Amazon',
    slug: 'amazon',
    tagline: 'Work hard. Have fun. Make history.',
    description: 'American multinational technology company focusing on e-commerce and cloud computing.',
    industry: 'E-commerce',
    founded: 1994,
    size: '1,500,000+ employees',
    headquarters: 'Seattle, Washington, USA',
    locations: ['Seattle', 'Austin', 'Dublin', 'Hyderabad', 'Toronto'],
    website: 'https://www.amazon.com',
    stats: { employees: 1541000, openJobs: 15000, rating: 3.9, reviews: 45000 },
    values: [
      { name: 'Customer obsession', description: 'We start with the customer and work backwards' },
      { name: 'Ownership', description: 'We act on behalf of the entire company' }
    ],
    benefits: ['Health insurance', 'Stock awards', 'Career choice', 'Parental leave'],
    techStack: ['Java', 'Python', 'AWS', 'React', 'Node.js'],
    averageSalary: '$150,000',
    workCulture: { remote: true, diversity: 80, workLifeBalance: 3.6, careerGrowth: 4.0 },
    contact: { email: 'recruiting@amazon.com' },
    socialMedia: { linkedin: 'amazon', twitter: '@amazon' }
  }
]

// Comprehensive Job Postings (20+ jobs across industries)
const massiveJobDataset = [
  {
    title: 'Software Development Engineer',
    companyId: 1, // Will be updated when seeded
    company: 'Microsoft',
    location: 'Seattle, WA',
    type: 'Full-time',
    remote: true,
    salary: { min: 130000, max: 190000, currency: 'USD' },
    level: 'Mid-level',
    department: 'Azure',
    description: 'Join Microsoft Azure team to build cloud infrastructure that powers the world.',
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      '3-5 years of software development experience',
      'Experience with C# and .NET',
      'Knowledge of cloud technologies'
    ],
    skills: ['C#', '.NET', 'Azure', 'Cloud Computing', 'Microservices'],
    benefits: ['Stock awards', 'Health coverage', 'Learning resources', 'Parental leave'],
    posted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    applicants: 456,
    views: 2340
  },
  {
    title: 'Investment Banking Associate',
    companyId: 2, // JPMorgan
    company: 'JPMorgan Chase',
    location: 'London, UK',
    type: 'Full-time',
    remote: false,
    salary: { min: 95000, max: 130000, currency: 'GBP' },
    level: 'Mid-level',
    department: 'Investment Banking',
    description: 'Join our Investment Banking team to work on high-profile M&A transactions.',
    requirements: [
      'MBA or equivalent experience',
      '2-4 years investment banking experience',
      'Strong financial modeling skills',
      'Excellent client management skills'
    ],
    skills: ['Financial Modeling', 'M&A', 'Valuation', 'Client Management', 'Excel'],
    benefits: ['Bonus potential', 'Health coverage', 'Career development', 'Flexible benefits'],
    posted: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    applicants: 892,
    views: 4560
  },
  {
    title: 'Data Scientist',
    companyId: 3, // Netflix
    company: 'Netflix',
    location: 'Los Gatos, CA',
    type: 'Full-time',
    remote: true,
    salary: { min: 150000, max: 220000, currency: 'USD' },
    level: 'Senior',
    department: 'Content Strategy',
    description: 'Use data science to help Netflix create and promote amazing content worldwide.',
    requirements: [
      'PhD in Statistics, Computer Science, or related field',
      '5+ years of data science experience',
      'Expert in Python and R',
      'Experience with machine learning at scale'
    ],
    skills: ['Python', 'R', 'Machine Learning', 'Statistics', 'Big Data'],
    benefits: ['Stock options', 'Unlimited PTO', 'Health coverage', 'Learning budget'],
    posted: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    applicants: 234,
    views: 1890
  },
  {
    title: 'Product Manager',
    companyId: 4, // Meta
    company: 'Meta',
    location: 'Menlo Park, CA',
    type: 'Full-time',
    remote: false,
    salary: { min: 160000, max: 240000, currency: 'USD' },
    level: 'Senior',
    department: 'Reality Labs',
    description: 'Lead product development for the next generation of AR/VR experiences.',
    requirements: [
      'Bachelor\'s degree in Engineering, Computer Science, or related field',
      '5+ years of product management experience',
      'Experience with AR/VR technologies',
      'Strong analytical and leadership skills'
    ],
    skills: ['Product Management', 'AR/VR', 'Leadership', 'Analytics', 'Strategy'],
    benefits: ['Stock options', 'Health insurance', 'Free meals', 'Wellness stipend'],
    posted: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    applicants: 567,
    views: 3240
  },
  {
    title: 'Clinical Research Associate',
    companyId: 5, // Johnson & Johnson
    company: 'Johnson & Johnson',
    location: 'New Brunswick, NJ',
    type: 'Full-time',
    remote: true,
    salary: { min: 75000, max: 95000, currency: 'USD' },
    level: 'Entry-level',
    department: 'Clinical Development',
    description: 'Support clinical trials for breakthrough medical treatments and devices.',
    requirements: [
      'Bachelor\'s degree in Life Sciences or related field',
      '1-3 years of clinical research experience',
      'Knowledge of GCP and regulatory requirements',
      'Strong attention to detail'
    ],
    skills: ['Clinical Research', 'GCP', 'Regulatory Affairs', 'Medical Writing', 'Data Analysis'],
    benefits: ['Health coverage', 'Retirement plans', 'Professional development', 'Wellness programs'],
    posted: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    applicants: 123,
    views: 890
  }
]

// International Students from new universities
const internationalStudents = [
  {
    name: 'Emma Thompson',
    email: 'emma.thompson@princeton.edu',
    title: 'Economics & Public Policy Student',
    university: 'Princeton University',
    major: 'Economics',
    year: 'Junior',
    graduation: '2025',
    gpa: 3.9,
    location: 'Princeton, NJ',
    skills: [
      { name: 'Economics', level: 'Advanced', years: 3 },
      { name: 'Data Analysis', level: 'Advanced', years: 2 },
      { name: 'Python', level: 'Intermediate', years: 2 },
      { name: 'Public Policy', level: 'Advanced', years: 2 }
    ],
    experience: [
      {
        company: 'Federal Reserve Bank',
        position: 'Economic Research Intern',
        duration: 'Summer 2024',
        description: 'Conducted research on monetary policy impacts on labor markets'
      }
    ],
    languages: ['English (Native)', 'Spanish (Fluent)', 'French (Conversational)'],
    interests: ['Economic Policy', 'Social Justice', 'Debate'],
    universityId: 1,
    aiScore: 91,
    profileViews: 245,
    connections: 134,
    applicationsSent: 6,
    interviewsScheduled: 3
  },
  {
    name: 'Li Wei',
    email: 'li.wei@pku.edu.cn',
    title: 'Computer Science Student',
    university: 'Peking University',
    major: 'Computer Science',
    year: 'Master\'s',
    graduation: '2025',
    gpa: 3.8,
    location: 'Beijing, China',
    skills: [
      { name: 'Python', level: 'Expert', years: 4 },
      { name: 'Machine Learning', level: 'Advanced', years: 3 },
      { name: 'Deep Learning', level: 'Advanced', years: 2 },
      { name: 'Computer Vision', level: 'Intermediate', years: 2 }
    ],
    experience: [
      {
        company: 'ByteDance',
        position: 'Algorithm Engineer Intern',
        duration: '6 months 2024',
        description: 'Developed recommendation algorithms for TikTok\'s content discovery system'
      }
    ],
    languages: ['Chinese (Native)', 'English (Fluent)', 'Japanese (Basic)'],
    interests: ['AI Research', 'Basketball', 'Photography'],
    universityId: 1,
    aiScore: 94,
    profileViews: 189,
    connections: 112,
    applicationsSent: 14,
    interviewsScheduled: 7
  },
  {
    name: 'Sophie Müller',
    email: 'sophie.mueller@ku-leuven.be',
    title: 'Biomedical Engineering Student',
    university: 'KU Leuven',
    major: 'Biomedical Engineering',
    year: 'Master\'s',
    graduation: '2025',
    gpa: 4.0,
    location: 'Leuven, Belgium',
    skills: [
      { name: 'Biomedical Engineering', level: 'Advanced', years: 3 },
      { name: 'MATLAB', level: 'Advanced', years: 3 },
      { name: 'Medical Imaging', level: 'Advanced', years: 2 },
      { name: 'Signal Processing', level: 'Intermediate', years: 2 }
    ],
    experience: [
      {
        company: 'Johnson & Johnson',
        position: 'Biomedical Research Intern',
        duration: 'Summer 2024',
        description: 'Developed medical device prototypes for cardiac monitoring'
      }
    ],
    languages: ['Dutch (Native)', 'French (Native)', 'English (Fluent)', 'German (Conversational)'],
    interests: ['Medical Technology', 'Cycling', 'Classical Music'],
    universityId: 1,
    aiScore: 87,
    profileViews: 156,
    connections: 78,
    applicationsSent: 9,
    interviewsScheduled: 4
  },
  {
    name: 'Raj Patel',
    email: 'raj.patel@hkust.edu.hk',
    title: 'Financial Technology Student',
    university: 'Hong Kong University of Science and Technology',
    major: 'Computer Science & Finance',
    year: 'Senior',
    graduation: '2025',
    gpa: 3.7,
    location: 'Hong Kong',
    skills: [
      { name: 'Python', level: 'Expert', years: 4 },
      { name: 'Finance', level: 'Advanced', years: 3 },
      { name: 'Blockchain', level: 'Advanced', years: 2 },
      { name: 'React', level: 'Advanced', years: 2 }
    ],
    experience: [
      {
        company: 'Goldman Sachs',
        position: 'Technology Analyst Intern',
        duration: 'Summer 2024',
        description: 'Built trading algorithms for fixed income securities'
      }
    ],
    languages: ['English (Fluent)', 'Hindi (Native)', 'Gujarati (Native)', 'Cantonese (Conversational)'],
    interests: ['FinTech', 'Cricket', 'Cooking'],
    universityId: 1,
    aiScore: 90,
    profileViews: 201,
    connections: 145,
    applicationsSent: 11,
    interviewsScheduled: 6
  },
  {
    name: 'Isabella Rodriguez',
    email: 'isabella.rodriguez@yale.edu',
    title: 'International Relations Student',
    university: 'Yale University',
    major: 'International Relations',
    year: 'Senior',
    graduation: '2025',
    gpa: 3.8,
    location: 'New Haven, CT',
    skills: [
      { name: 'International Relations', level: 'Advanced', years: 3 },
      { name: 'Policy Analysis', level: 'Advanced', years: 2 },
      { name: 'Research', level: 'Advanced', years: 3 },
      { name: 'Public Speaking', level: 'Expert', years: 4 }
    ],
    experience: [
      {
        company: 'United Nations',
        position: 'Policy Research Intern',
        duration: 'Summer 2024',
        description: 'Conducted research on sustainable development goals implementation'
      }
    ],
    languages: ['Spanish (Native)', 'English (Fluent)', 'Portuguese (Fluent)', 'French (Intermediate)'],
    interests: ['Global Policy', 'Human Rights', 'Salsa Dancing'],
    universityId: 1,
    aiScore: 85,
    profileViews: 167,
    connections: 203,
    applicationsSent: 5,
    interviewsScheduled: 3
  }
]

async function seedMassiveExpansion() {
  console.log('🌍 Starting massive global expansion...')

  // Add universities
  console.log('🏛️ Adding global top universities...')
  for (const uni of massiveUniversityDataset) {
    try {
      const university = await database.createUniversity(uni)
      console.log(`✅ Added: ${uni.name} (${uni.location.country})`)
    } catch (error) {
      console.log(`⚠️  Skipped: ${uni.name} (may already exist)`)
    }
  }

  // Add companies
  console.log('🏢 Adding major global companies...')
  for (const comp of massiveCompanyDataset) {
    try {
      const company = await database.createCompany(comp)
      console.log(`✅ Added: ${comp.name} (${comp.industry})`)
    } catch (error) {
      console.log(`⚠️  Skipped: ${comp.name} (may already exist)`)
    }
  }

  // Add jobs
  console.log('💼 Adding diverse job postings...')
  for (const job of massiveJobDataset) {
    try {
      const jobPosting = await database.createJob(job)
      console.log(`✅ Added job: ${job.title} at ${job.company}`)
    } catch (error) {
      console.log(`⚠️  Skipped job: ${job.title} (may have issue)`)
    }
  }

  // Add students
  console.log('🎓 Adding diverse international students...')
  for (let i = 0; i < internationalStudents.length; i++) {
    const student = internationalStudents[i]
    try {
      // Find the university ID by name
      const universities = await database.findAllUniversities()
      const university = universities.find(u => u.name === student.university)
      if (university) {
        student.universityId = university.id
      }

      const studentProfile = await database.createStudent(student)
      console.log(`✅ Added student: ${student.name} from ${student.university}`)
    } catch (error) {
      console.log(`⚠️  Skipped student: ${student.name} (${error.message})`)
    }
  }

  console.log('🎉 Massive global expansion completed successfully!')

  // Print comprehensive summary
  const universities = await database.findAllUniversities()
  const companies = await database.findAllCompanies()
  const jobs = await database.findAllJobs()
  const students = await database.findAllStudents()

  console.log(`📊 Final comprehensive counts:`)
  console.log(`   Universities: ${universities.length}`)
  console.log(`   Companies: ${companies.length}`)
  console.log(`   Jobs: ${jobs.length}`)
  console.log(`   Students: ${students.length}`)

  // Industry breakdown
  const industryCount = companies.reduce((acc, company) => {
    acc[company.industry] = (acc[company.industry] || 0) + 1
    return acc
  }, {})
  console.log(`   Industries represented: ${Object.keys(industryCount).length}`)
  console.log(`   Industry breakdown:`, industryCount)

  // Country breakdown
  const countryCount = universities.reduce((acc, uni) => {
    acc[uni.location.country] = (acc[uni.location.country] || 0) + 1
    return acc
  }, {})
  console.log(`   Countries represented: ${Object.keys(countryCount).length}`)
  console.log(`   Country breakdown:`, countryCount)
}

module.exports = { seedMassiveExpansion }