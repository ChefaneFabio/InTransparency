/**
 * Mock Candidate Data for Geographic Talent Search
 * Includes universities, courses, grades, projects, and skills
 */

export interface Course {
  id: string
  code: string
  name: string
  grade: string // A+, A, A-, B+, etc
  gpa: number // 4.0 scale
  credits: number
  semester: string
  year: number
  professor?: string
  relevantSkills: string[]
}

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  role: string
  teamSize: number
  duration: string // "3 months", "6 months"
  githubUrl?: string
  liveUrl?: string
  stars?: number
  highlights: string[]
  aiScore: number // 0-100
  images?: string[]
}

export interface Education {
  university: string
  universityRank: number // QS World Ranking
  degree: string
  major: string
  minor?: string
  gpa: number
  maxGPA: number
  graduationYear: number
  startYear: number
  honors: string[] // "Dean's List", "Summa Cum Laude", etc
  courses: Course[]
  thesis?: {
    title: string
    advisor: string
    abstract: string
  }
}

export interface WorkExperience {
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  achievements: string[]
  technologies: string[]
}

export interface Candidate {
  id: string
  firstName: string
  lastName: string
  email: string
  location: {
    city: string
    country: string
    coordinates: { lat: number; lng: number }
  }

  // Education
  education: Education[]

  // Projects
  projects: Project[]

  // Experience
  experience: WorkExperience[]

  // Skills
  skills: {
    programming: string[]
    frameworks: string[]
    databases: string[]
    tools: string[]
    languages: string[] // spoken languages
  }

  // Profile
  bio: string
  profileImage?: string
  portfolioUrl?: string
  githubUrl?: string
  linkedinUrl?: string

  // Preferences
  lookingFor: {
    roles: string[]
    industries: string[]
    workTypes: string[] // remote, hybrid, onsite
    willingToRelocate: boolean
    availableFrom: string
    salaryExpectation: { min: number; max: number; currency: string }
  }

  // Legal
  visaStatus: string
  requiresSponsorship: boolean

  // Metadata
  profileViews: number
  lastActive: string
  joinedDate: string
  aiProfileScore: number // 0-100
}

// Mock Universities Database
export const universities = {
  // USA - Top Tier
  'MIT': { rank: 1, country: 'USA', city: 'Cambridge, MA', type: 'Private' },
  'Stanford': { rank: 3, country: 'USA', city: 'Stanford, CA', type: 'Private' },
  'Harvard': { rank: 4, country: 'USA', city: 'Cambridge, MA', type: 'Private' },
  'Caltech': { rank: 6, country: 'USA', city: 'Pasadena, CA', type: 'Private' },
  'Berkeley': { rank: 10, country: 'USA', city: 'Berkeley, CA', type: 'Public' },
  'CMU': { rank: 52, country: 'USA', city: 'Pittsburgh, PA', type: 'Private' },

  // UK
  'Oxford': { rank: 2, country: 'UK', city: 'Oxford', type: 'Public' },
  'Cambridge': { rank: 5, country: 'UK', city: 'Cambridge', type: 'Public' },
  'Imperial College London': { rank: 7, country: 'UK', city: 'London', type: 'Public' },
  'UCL': { rank: 9, country: 'UK', city: 'London', type: 'Public' },

  // Europe
  'ETH Zurich': { rank: 8, country: 'Switzerland', city: 'Zurich', type: 'Public' },
  'TU Munich': { rank: 37, country: 'Germany', city: 'Munich', type: 'Public' },
  'EPFL': { rank: 36, country: 'Switzerland', city: 'Lausanne', type: 'Public' },

  // Asia
  'NUS': { rank: 11, country: 'Singapore', city: 'Singapore', type: 'Public' },
  'Tsinghua': { rank: 17, country: 'China', city: 'Beijing', type: 'Public' },
  'Tokyo': { rank: 23, country: 'Japan', city: 'Tokyo', type: 'Public' },

  // Canada
  'Toronto': { rank: 21, country: 'Canada', city: 'Toronto', type: 'Public' },
  'UBC': { rank: 34, country: 'Canada', city: 'Vancouver', type: 'Public' },

  // Australia
  'ANU': { rank: 30, country: 'Australia', city: 'Canberra', type: 'Public' },
  'Melbourne': { rank: 33, country: 'Australia', city: 'Melbourne', type: 'Public' }
}

// Mock Candidates with Rich Data
export const mockCandidates: Candidate[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@mit.edu',
    location: {
      city: 'Boston',
      country: 'USA',
      coordinates: { lat: 42.3601, lng: -71.0589 }
    },
    education: [{
      university: 'MIT',
      universityRank: 1,
      degree: 'Bachelors',
      major: 'Computer Science',
      minor: 'Mathematics',
      gpa: 3.92,
      maxGPA: 4.0,
      graduationYear: 2024,
      startYear: 2020,
      honors: ["Dean's List (All Semesters)", "Phi Beta Kappa", "MIT Presidential Scholar"],
      courses: [
        {
          id: 'cs1', code: '6.006', name: 'Introduction to Algorithms',
          grade: 'A', gpa: 4.0, credits: 4, semester: 'Fall', year: 2021,
          professor: 'Prof. Erik Demaine',
          relevantSkills: ['Algorithms', 'Data Structures', 'Python']
        },
        {
          id: 'cs2', code: '6.033', name: 'Computer Systems Engineering',
          grade: 'A', gpa: 4.0, credits: 4, semester: 'Spring', year: 2022,
          relevantSkills: ['Systems Design', 'Networks', 'C']
        },
        {
          id: 'cs3', code: '6.046', name: 'Design and Analysis of Algorithms',
          grade: 'A-', gpa: 3.7, credits: 4, semester: 'Fall', year: 2022,
          relevantSkills: ['Advanced Algorithms', 'Optimization']
        },
        {
          id: 'cs4', code: '6.824', name: 'Distributed Systems',
          grade: 'A', gpa: 4.0, credits: 4, semester: 'Spring', year: 2023,
          professor: 'Prof. Robert Morris',
          relevantSkills: ['Distributed Systems', 'Go', 'Raft Consensus']
        },
        {
          id: 'ml1', code: '6.867', name: 'Machine Learning',
          grade: 'A', gpa: 4.0, credits: 4, semester: 'Fall', year: 2023,
          relevantSkills: ['Machine Learning', 'Python', 'TensorFlow']
        }
      ],
      thesis: {
        title: 'Efficient Algorithms for Large-Scale Graph Neural Networks',
        advisor: 'Prof. Tommi Jaakkola',
        abstract: 'Novel approach to scaling GNNs using hierarchical sampling...'
      }
    }],
    projects: [
      {
        id: 'p1',
        title: 'DistributedKV - High-Performance Key-Value Store',
        description: 'Built a distributed key-value store supporting 100k+ ops/sec with strong consistency guarantees using Raft consensus algorithm.',
        technologies: ['Go', 'Raft', 'gRPC', 'Docker', 'Kubernetes'],
        role: 'Lead Developer',
        teamSize: 3,
        duration: '4 months',
        githubUrl: 'github.com/sarahchen/distributedkv',
        stars: 342,
        highlights: [
          'Achieved 99.99% uptime in production testing',
          'Handles automatic failover in less than 2 seconds',
          'Featured in MIT\'s Systems Lab showcase'
        ],
        aiScore: 94
      },
      {
        id: 'p2',
        title: 'GraphLearn - GNN Framework for Fraud Detection',
        description: 'Machine learning framework using Graph Neural Networks to detect fraudulent transactions in real-time payment systems.',
        technologies: ['Python', 'PyTorch', 'PyTorch Geometric', 'FastAPI', 'PostgreSQL'],
        role: 'Research Lead',
        teamSize: 2,
        duration: '6 months',
        githubUrl: 'github.com/sarahchen/graphlearn',
        liveUrl: 'graphlearn-demo.ml',
        stars: 156,
        highlights: [
          '94% fraud detection accuracy (15% improvement over baseline)',
          'Processes 50k transactions/second',
          'Published at NeurIPS 2023 Workshop'
        ],
        aiScore: 96
      },
      {
        id: 'p3',
        title: 'CloudOps - Infrastructure as Code Platform',
        description: 'DevOps platform for automating cloud infrastructure deployment across AWS, GCP, and Azure.',
        technologies: ['TypeScript', 'React', 'Node.js', 'Terraform', 'AWS CDK'],
        role: 'Full Stack Developer',
        teamSize: 4,
        duration: '5 months',
        githubUrl: 'github.com/sarahchen/cloudops',
        stars: 89,
        highlights: [
          'Reduced deployment time by 70%',
          'Supports multi-cloud deployments',
          'Used by 3 MIT research labs'
        ],
        aiScore: 88
      }
    ],
    experience: [
      {
        company: 'Google',
        position: 'Software Engineering Intern',
        location: 'Mountain View, CA',
        startDate: '2023-06',
        endDate: '2023-09',
        current: false,
        description: 'Worked on Google Cloud infrastructure team',
        achievements: [
          'Reduced latency of internal API by 35% through caching optimization',
          'Implemented auto-scaling system handling 1M+ requests/day',
          'Received return offer for full-time position'
        ],
        technologies: ['Go', 'Kubernetes', 'Prometheus', 'Grafana']
      },
      {
        company: 'MIT CSAIL',
        position: 'Research Assistant',
        location: 'Cambridge, MA',
        startDate: '2022-09',
        endDate: '2024-05',
        current: false,
        description: 'Graph Neural Networks research under Prof. Tommi Jaakkola',
        achievements: [
          'Co-authored 2 papers (1 accepted to NeurIPS)',
          'Developed novel GNN architecture for large graphs',
          'Mentored 3 undergraduate researchers'
        ],
        technologies: ['Python', 'PyTorch', 'CUDA', 'AWS']
      }
    ],
    skills: {
      programming: ['Python', 'Go', 'TypeScript', 'C++', 'Java'],
      frameworks: ['PyTorch', 'React', 'Node.js', 'FastAPI', 'gRPC'],
      databases: ['PostgreSQL', 'MongoDB', 'Redis', 'DynamoDB'],
      tools: ['Docker', 'Kubernetes', 'Terraform', 'Git', 'AWS'],
      languages: ['English (Native)', 'Mandarin (Fluent)', 'Spanish (Basic)']
    },
    bio: 'MIT CS grad passionate about distributed systems and machine learning. Interested in infrastructure and ML systems roles at innovative tech companies.',
    portfolioUrl: 'sarahchen.dev',
    githubUrl: 'github.com/sarahchen',
    linkedinUrl: 'linkedin.com/in/sarahchen',
    lookingFor: {
      roles: ['Software Engineer', 'ML Engineer', 'Infrastructure Engineer'],
      industries: ['Tech', 'FinTech', 'Cloud Computing'],
      workTypes: ['Hybrid', 'Remote'],
      willingToRelocate: true,
      availableFrom: '2024-06-01',
      salaryExpectation: { min: 120000, max: 180000, currency: 'USD' }
    },
    visaStatus: 'US Citizen',
    requiresSponsorship: false,
    profileViews: 1247,
    lastActive: '2024-10-01',
    joinedDate: '2023-09-15',
    aiProfileScore: 95
  },
  {
    id: '2',
    firstName: 'Alex',
    lastName: 'Kumar',
    email: 'alex.kumar@stanford.edu',
    location: {
      city: 'San Francisco',
      country: 'USA',
      coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    education: [{
      university: 'Stanford',
      universityRank: 3,
      degree: 'Masters',
      major: 'Artificial Intelligence',
      gpa: 3.88,
      maxGPA: 4.0,
      graduationYear: 2025,
      startYear: 2023,
      honors: ["Stanford AI Lab Fellow", "Best MS Thesis Award Nominee"],
      courses: [
        {
          id: 'ai1', code: 'CS229', name: 'Machine Learning',
          grade: 'A', gpa: 4.0, credits: 3, semester: 'Fall', year: 2023,
          professor: 'Prof. Andrew Ng',
          relevantSkills: ['ML', 'Python', 'Scikit-learn']
        },
        {
          id: 'ai2', code: 'CS224N', name: 'Natural Language Processing',
          grade: 'A', gpa: 4.0, credits: 3, semester: 'Winter', year: 2024,
          relevantSkills: ['NLP', 'Transformers', 'PyTorch']
        },
        {
          id: 'ai3', code: 'CS231N', name: 'Computer Vision',
          grade: 'A-', gpa: 3.7, credits: 3, semester: 'Spring', year: 2024,
          relevantSkills: ['CV', 'CNNs', 'TensorFlow']
        },
        {
          id: 'ai4', code: 'CS330', name: 'Deep Multi-Task Learning',
          grade: 'A', gpa: 4.0, credits: 3, semester: 'Fall', year: 2024,
          relevantSkills: ['Meta-Learning', 'Transfer Learning']
        }
      ],
      thesis: {
        title: 'Few-Shot Learning for Medical Image Analysis',
        advisor: 'Prof. Fei-Fei Li',
        abstract: 'Novel meta-learning approach for medical imaging with limited labeled data...'
      }
    }, {
      university: 'IIT Delhi',
      universityRank: 174,
      degree: 'Bachelors',
      major: 'Computer Science',
      gpa: 9.2,
      maxGPA: 10.0,
      graduationYear: 2023,
      startYear: 2019,
      honors: ["Department Rank 2", "Institute Gold Medal", "ACM ICPC Regionalist"],
      courses: []
    }],
    projects: [
      {
        id: 'p1',
        title: 'MedAI - AI-Powered Diagnostic Assistant',
        description: 'Deep learning system for automated medical image analysis achieving radiologist-level accuracy.',
        technologies: ['Python', 'PyTorch', 'FastAPI', 'React', 'Docker'],
        role: 'Lead ML Engineer',
        teamSize: 5,
        duration: '8 months',
        githubUrl: 'github.com/alexkumar/medai',
        liveUrl: 'medai-demo.stanford.edu',
        highlights: [
          '96% accuracy on chest X-ray diagnosis',
          'Deployed in 2 hospitals for pilot testing',
          'Won Stanford Healthcare Innovation Award'
        ],
        aiScore: 98
      },
      {
        id: 'p2',
        title: 'LLM-Optimizer - Fine-tuning Platform',
        description: 'Platform for efficient fine-tuning of large language models with PEFT techniques.',
        technologies: ['Python', 'PyTorch', 'Hugging Face', 'LoRA', 'QLoRA'],
        role: 'ML Research Engineer',
        teamSize: 3,
        duration: '6 months',
        githubUrl: 'github.com/alexkumar/llm-optimizer',
        stars: 524,
        highlights: [
          'Reduces fine-tuning cost by 80%',
          '10x faster than full fine-tuning',
          'Supports models up to 70B parameters'
        ],
        aiScore: 92
      }
    ],
    experience: [
      {
        company: 'OpenAI',
        position: 'ML Research Intern',
        location: 'San Francisco, CA',
        startDate: '2024-06',
        endDate: '2024-09',
        current: false,
        description: 'Worked on GPT model optimization and deployment',
        achievements: [
          'Improved inference speed by 25% through quantization',
          'Contributed to internal LLM evaluation framework',
          'Collaborated with 15+ research scientists'
        ],
        technologies: ['Python', 'PyTorch', 'CUDA', 'Triton']
      },
      {
        company: 'Google Research',
        position: 'Research Intern',
        location: 'Mountain View, CA',
        startDate: '2022-05',
        endDate: '2022-08',
        current: false,
        description: 'Computer vision research for Google Photos',
        achievements: [
          'Developed image search feature used by 100M+ users',
          'Published findings at CVPR 2023',
          'Filed 1 patent on image similarity matching'
        ],
        technologies: ['Python', 'TensorFlow', 'GCP', 'BigQuery']
      }
    ],
    skills: {
      programming: ['Python', 'C++', 'JavaScript', 'SQL'],
      frameworks: ['PyTorch', 'TensorFlow', 'Hugging Face', 'FastAPI', 'React'],
      databases: ['PostgreSQL', 'MongoDB', 'BigQuery'],
      tools: ['Docker', 'Kubernetes', 'Git', 'AWS', 'GCP'],
      languages: ['English (Fluent)', 'Hindi (Native)', 'Spanish (Intermediate)']
    },
    bio: 'Stanford AI grad specializing in deep learning and NLP. Passionate about applying AI to healthcare and education.',
    portfolioUrl: 'alexkumar.ai',
    githubUrl: 'github.com/alexkumar',
    linkedinUrl: 'linkedin.com/in/alexkumar',
    lookingFor: {
      roles: ['ML Engineer', 'AI Research Engineer', 'Applied Scientist'],
      industries: ['AI/ML', 'Healthcare', 'Research'],
      workTypes: ['Hybrid', 'On-Site'],
      willingToRelocate: true,
      availableFrom: '2025-06-01',
      salaryExpectation: { min: 140000, max: 200000, currency: 'USD' }
    },
    visaStatus: 'F-1 OPT',
    requiresSponsorship: true,
    profileViews: 2134,
    lastActive: '2024-09-30',
    joinedDate: '2023-08-01',
    aiProfileScore: 97
  },
  {
    id: '3',
    firstName: 'Emma',
    lastName: 'Schmidt',
    email: 'emma.schmidt@tum.de',
    location: {
      city: 'Munich',
      country: 'Germany',
      coordinates: { lat: 48.1351, lng: 11.5820 }
    },
    education: [{
      university: 'TU Munich',
      universityRank: 37,
      degree: 'Masters',
      major: 'Computer Science',
      minor: 'Entrepreneurship',
      gpa: 1.3, // German system: 1.0 is best
      maxGPA: 1.0,
      graduationYear: 2024,
      startYear: 2022,
      honors: ["TUM Presidential Scholarship", "Best Capstone Project"],
      courses: [
        {
          id: 'cs1', code: 'IN2128', name: 'Advanced Deep Learning',
          grade: '1.0', gpa: 1.0, credits: 6, semester: 'Winter', year: 2023,
          relevantSkills: ['Deep Learning', 'PyTorch', 'Computer Vision']
        },
        {
          id: 'cs2', code: 'IN0003', name: 'Scalable Systems',
          grade: '1.3', gpa: 1.3, credits: 8, semester: 'Summer', year: 2023,
          relevantSkills: ['Distributed Systems', 'Microservices', 'Docker']
        }
      ]
    }, {
      university: 'ETH Zurich',
      universityRank: 8,
      degree: 'Bachelors',
      major: 'Computer Science',
      gpa: 5.6,
      maxGPA: 6.0,
      graduationYear: 2022,
      startYear: 2018,
      honors: ["ETH Excellence Scholarship", "Willi Studer Prize"],
      courses: []
    }],
    projects: [
      {
        id: 'p1',
        title: 'AutoDrive - Autonomous Vehicle Simulation',
        description: 'End-to-end self-driving car system trained in simulation achieving Level 4 autonomy.',
        technologies: ['Python', 'PyTorch', 'C++', 'ROS', 'CARLA', 'CUDA'],
        role: 'Lead Developer',
        teamSize: 6,
        duration: '10 months',
        githubUrl: 'github.com/emmaschmidt/autodrive',
        stars: 678,
        highlights: [
          'Won BMW Innovation Challenge 2024',
          '99.2% successful navigation in complex scenarios',
          'Collaboration with BMW Research Lab'
        ],
        aiScore: 95
      },
      {
        id: 'p2',
        title: 'EcoRoute - Sustainable Delivery Optimization',
        description: 'Route optimization algorithm reducing CO2 emissions for last-mile delivery by 30%.',
        technologies: ['Python', 'OR-Tools', 'FastAPI', 'React', 'PostgreSQL'],
        role: 'Algorithm Developer',
        teamSize: 4,
        duration: '5 months',
        liveUrl: 'ecoroute.app',
        highlights: [
          'Deployed by 3 logistics companies in Germany',
          'Saves 2000+ tons CO2 annually',
          'Featured in TechCrunch'
        ],
        aiScore: 89
      }
    ],
    experience: [
      {
        company: 'BMW Group',
        position: 'Autonomous Driving Engineer Intern',
        location: 'Munich, Germany',
        startDate: '2023-03',
        endDate: '2023-09',
        current: false,
        description: 'Worked on perception systems for autonomous vehicles',
        achievements: [
          'Improved object detection accuracy by 12%',
          'Developed real-time sensor fusion algorithm',
          'Contributed to BMW iX autonomous features'
        ],
        technologies: ['C++', 'Python', 'ROS', 'TensorFlow', 'LiDAR']
      }
    ],
    skills: {
      programming: ['Python', 'C++', 'JavaScript', 'Rust'],
      frameworks: ['PyTorch', 'ROS', 'React', 'FastAPI'],
      databases: ['PostgreSQL', 'MongoDB', 'Redis'],
      tools: ['Docker', 'Kubernetes', 'Git', 'CI/CD', 'AWS'],
      languages: ['German (Native)', 'English (Fluent)', 'French (Intermediate)']
    },
    bio: 'Robotics and AI engineer specializing in autonomous systems. Passionate about sustainable technology and mobility solutions.',
    portfolioUrl: 'emmaschmidt.dev',
    githubUrl: 'github.com/emmaschmidt',
    linkedinUrl: 'linkedin.com/in/emmaschmidt',
    lookingFor: {
      roles: ['Robotics Engineer', 'Autonomous Systems Engineer', 'AI Engineer'],
      industries: ['Automotive', 'Robotics', 'Clean Tech'],
      workTypes: ['Hybrid', 'On-Site'],
      willingToRelocate: true,
      availableFrom: '2024-11-01',
      salaryExpectation: { min: 75000, max: 95000, currency: 'EUR' }
    },
    visaStatus: 'EU Citizen',
    requiresSponsorship: false,
    profileViews: 892,
    lastActive: '2024-10-01',
    joinedDate: '2024-01-15',
    aiProfileScore: 91
  }
]

// Helper function to generate more mock candidates
export function generateMockCandidates(count: number): Candidate[] {
  const firstNames = ['John', 'Maria', 'David', 'Sophie', 'Michael', 'Lisa', 'James', 'Anna', 'Robert', 'Emily']
  const lastNames = ['Smith', 'Garcia', 'Johnson', 'Lee', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Martinez']

  const candidates: Candidate[] = []

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const universityKeys = Object.keys(universities)
    const university = universityKeys[Math.floor(Math.random() * universityKeys.length)]
    const univData = universities[university as keyof typeof universities]

    candidates.push({
      id: `gen-${i + 4}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      location: {
        city: univData.city,
        country: univData.country,
        coordinates: { lat: 0, lng: 0 } // Would need real coordinates
      },
      education: [{
        university,
        universityRank: univData.rank,
        degree: ['Bachelors', 'Masters', 'PhD'][Math.floor(Math.random() * 3)],
        major: ['Computer Science', 'Data Science', 'AI'][Math.floor(Math.random() * 3)],
        gpa: 3.5 + Math.random() * 0.5,
        maxGPA: 4.0,
        graduationYear: 2024 + Math.floor(Math.random() * 2),
        startYear: 2020 + Math.floor(Math.random() * 2),
        honors: [],
        courses: []
      }],
      projects: [],
      experience: [],
      skills: {
        programming: ['Python', 'JavaScript'],
        frameworks: ['React', 'Node.js'],
        databases: ['PostgreSQL'],
        tools: ['Git', 'Docker'],
        languages: ['English']
      },
      bio: `${university} student specializing in software engineering.`,
      lookingFor: {
        roles: ['Software Engineer'],
        industries: ['Tech'],
        workTypes: ['Remote', 'Hybrid'],
        willingToRelocate: Math.random() > 0.5,
        availableFrom: '2024-06-01',
        salaryExpectation: { min: 80000, max: 120000, currency: 'USD' }
      },
      visaStatus: 'Student Visa',
      requiresSponsorship: true,
      profileViews: Math.floor(Math.random() * 500),
      lastActive: '2024-10-01',
      joinedDate: '2024-01-01',
      aiProfileScore: 70 + Math.floor(Math.random() * 25)
    })
  }

  return candidates
}

export const allCandidates = [...mockCandidates, ...generateMockCandidates(47)] // Total 50 candidates
