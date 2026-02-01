/**
 * Seed Company Challenges Test Data
 *
 * This script populates the database with test data for:
 * - CompanyChallenge records with various statuses
 * - ChallengeUniversityApproval records
 * - ChallengeSubmission records at different stages
 *
 * Run with: npx tsx prisma/seed-challenges.ts
 */

import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Helper to generate unique slugs
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') + '-' + Date.now().toString(36)
}

async function seed() {
  console.log('🌱 Seeding challenges test data...')

  try {
    // =========================================
    // CREATE TEST USERS
    // =========================================
    console.log('\n📝 Creating test users...')

    const passwordHash = await bcrypt.hash('TestPassword123!', 12)

    // Create Recruiter Users
    const recruiter1 = await prisma.user.upsert({
      where: { email: 'recruiter1@techcorp.com' },
      update: {},
      create: {
        email: 'recruiter1@techcorp.com',
        username: 'techcorp_recruiter',
        passwordHash,
        role: 'RECRUITER',
        firstName: 'Marco',
        lastName: 'Rossi',
        company: 'TechCorp Solutions',
        jobTitle: 'Senior Talent Acquisition',
        emailVerified: true,
        profilePublic: true
      }
    })

    const recruiter2 = await prisma.user.upsert({
      where: { email: 'hr@financeplus.com' },
      update: {},
      create: {
        email: 'hr@financeplus.com',
        username: 'financeplus_hr',
        passwordHash,
        role: 'RECRUITER',
        firstName: 'Laura',
        lastName: 'Bianchi',
        company: 'FinancePlus SpA',
        jobTitle: 'HR Director',
        emailVerified: true,
        profilePublic: true
      }
    })

    const recruiter3 = await prisma.user.upsert({
      where: { email: 'talent@designstudio.io' },
      update: {},
      create: {
        email: 'talent@designstudio.io',
        username: 'designstudio_talent',
        passwordHash,
        role: 'RECRUITER',
        firstName: 'Giovanni',
        lastName: 'Ferrari',
        company: 'Creative Design Studio',
        jobTitle: 'Design Lead',
        emailVerified: true,
        profilePublic: true
      }
    })

    console.log(`✅ Created/updated 3 recruiter users`)

    // Create University Users
    const university1 = await prisma.user.upsert({
      where: { email: 'admin@polimi.it' },
      update: {},
      create: {
        email: 'admin@polimi.it',
        username: 'polimi_admin',
        passwordHash,
        role: 'UNIVERSITY',
        firstName: 'Prof. Alessandro',
        lastName: 'Romano',
        university: 'Politecnico di Milano',
        jobTitle: 'Career Services Director',
        emailVerified: true,
        profilePublic: true
      }
    })

    const university2 = await prisma.user.upsert({
      where: { email: 'careers@unibocconi.it' },
      update: {},
      create: {
        email: 'careers@unibocconi.it',
        username: 'bocconi_careers',
        passwordHash,
        role: 'UNIVERSITY',
        firstName: 'Prof. Chiara',
        lastName: 'Costa',
        university: 'Università Bocconi',
        jobTitle: 'Career Center Manager',
        emailVerified: true,
        profilePublic: true
      }
    })

    console.log(`✅ Created/updated 2 university users`)

    // Create Student Users
    const student1 = await prisma.user.upsert({
      where: { email: 'student1@mail.polimi.it' },
      update: {},
      create: {
        email: 'student1@mail.polimi.it',
        username: 'mario_tech',
        passwordHash,
        role: 'STUDENT',
        firstName: 'Mario',
        lastName: 'Verdi',
        university: 'Politecnico di Milano',
        degree: 'Computer Engineering',
        graduationYear: '2025',
        gpa: '28/30',
        emailVerified: true,
        profilePublic: true,
        bio: 'Passionate about AI and full-stack development'
      }
    })

    const student2 = await prisma.user.upsert({
      where: { email: 'student2@mail.polimi.it' },
      update: {},
      create: {
        email: 'student2@mail.polimi.it',
        username: 'giulia_dev',
        passwordHash,
        role: 'STUDENT',
        firstName: 'Giulia',
        lastName: 'Esposito',
        university: 'Politecnico di Milano',
        degree: 'Software Engineering',
        graduationYear: '2025',
        gpa: '29/30',
        emailVerified: true,
        profilePublic: true,
        bio: 'Full-stack developer interested in fintech'
      }
    })

    const student3 = await prisma.user.upsert({
      where: { email: 'student3@studbocconi.it' },
      update: {},
      create: {
        email: 'student3@studbocconi.it',
        username: 'francesco_biz',
        passwordHash,
        role: 'STUDENT',
        firstName: 'Francesco',
        lastName: 'Greco',
        university: 'Università Bocconi',
        degree: 'Economics and Management',
        graduationYear: '2025',
        gpa: '110/110',
        emailVerified: true,
        profilePublic: true,
        bio: 'Strategy and consulting enthusiast'
      }
    })

    const student4 = await prisma.user.upsert({
      where: { email: 'student4@studbocconi.it' },
      update: {},
      create: {
        email: 'student4@studbocconi.it',
        username: 'sara_design',
        passwordHash,
        role: 'STUDENT',
        firstName: 'Sara',
        lastName: 'Ricci',
        university: 'Università Bocconi',
        degree: 'Management',
        graduationYear: '2024',
        gpa: '108/110',
        emailVerified: true,
        profilePublic: true,
        bio: 'UX researcher with business background'
      }
    })

    const student5 = await prisma.user.upsert({
      where: { email: 'student5@mail.polimi.it' },
      update: {},
      create: {
        email: 'student5@mail.polimi.it',
        username: 'luca_ml',
        passwordHash,
        role: 'STUDENT',
        firstName: 'Luca',
        lastName: 'Fontana',
        university: 'Politecnico di Milano',
        degree: 'Data Science',
        graduationYear: '2025',
        gpa: '27/30',
        emailVerified: true,
        profilePublic: true,
        bio: 'Machine learning and data visualization specialist'
      }
    })

    console.log(`✅ Created/updated 5 student users`)

    // =========================================
    // CREATE COMPANY CHALLENGES
    // =========================================
    console.log('\n📝 Creating company challenges...')

    // Challenge 1: Active, Approved
    const challenge1 = await prisma.companyChallenge.upsert({
      where: { slug: 'ai-customer-service-chatbot' },
      update: {},
      create: {
        recruiterId: recruiter1.id,
        companyName: 'TechCorp Solutions',
        companyLogo: 'https://ui-avatars.com/api/?name=TechCorp&background=0D8ABC&color=fff',
        companyIndustry: 'Technology',
        title: 'AI-Powered Customer Service Chatbot',
        description: 'Design and develop an intelligent chatbot system capable of handling customer inquiries, providing product recommendations, and escalating complex issues to human agents. The solution should integrate with our existing CRM system and support multiple languages.',
        problemStatement: 'Our customer service team is overwhelmed with repetitive inquiries. We need an AI solution that can handle 80% of routine questions while providing a seamless handoff to human agents when needed.',
        expectedOutcome: 'A working prototype demonstrating natural language understanding, context retention across conversations, and integration capabilities with REST APIs.',
        challengeType: 'CAPSTONE',
        discipline: 'TECHNOLOGY',
        requiredSkills: ['Python', 'NLP', 'Machine Learning', 'REST APIs', 'React'],
        tools: ['OpenAI API', 'LangChain', 'PostgreSQL', 'Docker'],
        teamSizeMin: 2,
        teamSizeMax: 4,
        estimatedDuration: '3 months',
        startDate: new Date('2025-02-01'),
        endDate: new Date('2025-05-01'),
        applicationDeadline: new Date('2025-02-15'),
        targetCourses: ['Software Engineering', 'Artificial Intelligence', 'Natural Language Processing'],
        targetSemesters: ['Spring 2025'],
        creditWorth: 6,
        maxSubmissions: 5,
        mentorshipOffered: true,
        compensation: '€500 team bonus for best solution',
        equipmentProvided: 'API credits and cloud hosting',
        status: 'ACTIVE',
        isPublic: true,
        slug: 'ai-customer-service-chatbot',
        views: 156,
        publishedAt: new Date()
      }
    })

    // Challenge 2: Active, Pending University Review
    const challenge2 = await prisma.companyChallenge.upsert({
      where: { slug: 'financial-analytics-dashboard' },
      update: {},
      create: {
        recruiterId: recruiter2.id,
        companyName: 'FinancePlus SpA',
        companyLogo: 'https://ui-avatars.com/api/?name=FinancePlus&background=2E7D32&color=fff',
        companyIndustry: 'Financial Services',
        title: 'Real-Time Financial Analytics Dashboard',
        description: 'Create a modern analytics dashboard that visualizes financial data in real-time, including stock prices, portfolio performance, and market trends. The dashboard should support customizable widgets and automated alerts.',
        problemStatement: 'Investment managers need quick access to portfolio analytics without relying on complex Excel models. Current solutions are either too expensive or too basic.',
        expectedOutcome: 'Interactive dashboard with real-time data visualization, customizable layouts, and export functionality.',
        challengeType: 'COURSE_PROJECT',
        discipline: 'TECHNOLOGY',
        requiredSkills: ['JavaScript', 'TypeScript', 'Data Visualization', 'SQL', 'Financial Analysis'],
        tools: ['React', 'D3.js', 'PostgreSQL', 'WebSocket'],
        teamSizeMin: 1,
        teamSizeMax: 3,
        estimatedDuration: '2 months',
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-05-01'),
        applicationDeadline: new Date('2025-02-28'),
        targetCourses: ['Data Visualization', 'Web Development', 'Financial Technology'],
        targetSemesters: ['Spring 2025'],
        creditWorth: 4,
        maxSubmissions: 8,
        mentorshipOffered: true,
        compensation: 'Reference letter for all participants',
        status: 'APPROVED',
        isPublic: true,
        slug: 'financial-analytics-dashboard',
        views: 89,
        publishedAt: new Date()
      }
    })

    // Challenge 3: Draft status
    const challenge3 = await prisma.companyChallenge.upsert({
      where: { slug: 'mobile-ux-redesign' },
      update: {},
      create: {
        recruiterId: recruiter3.id,
        companyName: 'Creative Design Studio',
        companyLogo: 'https://ui-avatars.com/api/?name=CDS&background=9C27B0&color=fff',
        companyIndustry: 'Design Agency',
        title: 'Mobile Banking App UX Redesign',
        description: 'Conduct user research and redesign the mobile banking experience for a major Italian bank. Focus on improving accessibility, reducing friction in common tasks, and modernizing the visual design.',
        problemStatement: 'The current app has low user satisfaction scores and high abandonment rates during key flows like money transfers and bill payments.',
        expectedOutcome: 'Complete UX case study including user research findings, wireframes, high-fidelity prototypes, and usability testing results.',
        challengeType: 'THESIS',
        discipline: 'DESIGN',
        requiredSkills: ['UX Research', 'UI Design', 'Prototyping', 'User Testing', 'Accessibility'],
        tools: ['Figma', 'Maze', 'Hotjar', 'Miro'],
        teamSizeMin: 1,
        teamSizeMax: 2,
        estimatedDuration: '4 months',
        startDate: new Date('2025-04-01'),
        endDate: new Date('2025-08-01'),
        applicationDeadline: new Date('2025-03-15'),
        targetCourses: ['User Experience Design', 'Interaction Design'],
        targetSemesters: ['Spring 2025', 'Summer 2025'],
        creditWorth: 12,
        maxSubmissions: 3,
        mentorshipOffered: true,
        compensation: 'Paid internship opportunity for best candidate',
        status: 'DRAFT',
        isPublic: false,
        slug: 'mobile-ux-redesign',
        views: 0
      }
    })

    // Challenge 4: Pending Review
    const challenge4 = await prisma.companyChallenge.upsert({
      where: { slug: 'supply-chain-optimization' },
      update: {},
      create: {
        recruiterId: recruiter2.id,
        companyName: 'FinancePlus SpA',
        companyLogo: 'https://ui-avatars.com/api/?name=FinancePlus&background=2E7D32&color=fff',
        companyIndustry: 'Financial Services',
        title: 'Supply Chain Optimization Model',
        description: 'Develop a mathematical optimization model to improve supply chain efficiency for our retail banking clients. The model should minimize costs while maintaining service level requirements.',
        problemStatement: 'Retail banks struggle with optimizing ATM cash replenishment and branch staffing. Current heuristic approaches are suboptimal.',
        expectedOutcome: 'Working optimization model with documented methodology, sensitivity analysis, and implementation recommendations.',
        challengeType: 'RESEARCH',
        discipline: 'BUSINESS',
        requiredSkills: ['Operations Research', 'Python', 'Mathematical Modeling', 'Data Analysis'],
        tools: ['Gurobi', 'Python', 'Excel', 'Jupyter'],
        teamSizeMin: 1,
        teamSizeMax: 3,
        estimatedDuration: '3 months',
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-06-01'),
        applicationDeadline: new Date('2025-02-20'),
        targetCourses: ['Operations Research', 'Management Science', 'Quantitative Methods'],
        targetSemesters: ['Spring 2025'],
        creditWorth: 6,
        maxSubmissions: 4,
        mentorshipOffered: true,
        status: 'PENDING_REVIEW',
        isPublic: true,
        slug: 'supply-chain-optimization',
        views: 34,
        publishedAt: new Date()
      }
    })

    // Challenge 5: In Progress
    const challenge5 = await prisma.companyChallenge.upsert({
      where: { slug: 'iot-energy-monitoring' },
      update: {},
      create: {
        recruiterId: recruiter1.id,
        companyName: 'TechCorp Solutions',
        companyLogo: 'https://ui-avatars.com/api/?name=TechCorp&background=0D8ABC&color=fff',
        companyIndustry: 'Technology',
        title: 'IoT Energy Monitoring System',
        description: 'Build an IoT solution for monitoring energy consumption in commercial buildings. The system should collect data from multiple sensors, provide real-time analytics, and generate actionable insights for energy savings.',
        problemStatement: 'Commercial buildings waste significant energy due to lack of granular monitoring. Existing solutions are expensive and complex to deploy.',
        expectedOutcome: 'Prototype system with sensor integration, data pipeline, and analytics dashboard showing energy consumption patterns and recommendations.',
        challengeType: 'CAPSTONE',
        discipline: 'ENGINEERING',
        requiredSkills: ['IoT', 'Embedded Systems', 'Python', 'Time Series Analysis', 'Cloud Computing'],
        tools: ['Raspberry Pi', 'MQTT', 'InfluxDB', 'Grafana', 'AWS IoT'],
        teamSizeMin: 3,
        teamSizeMax: 5,
        estimatedDuration: '4 months',
        startDate: new Date('2024-10-01'),
        endDate: new Date('2025-02-01'),
        applicationDeadline: new Date('2024-09-15'),
        targetCourses: ['IoT Systems', 'Embedded Programming', 'Data Engineering'],
        targetSemesters: ['Fall 2024'],
        creditWorth: 8,
        maxSubmissions: 4,
        mentorshipOffered: true,
        compensation: 'Hardware kit provided (€200 value)',
        equipmentProvided: 'Raspberry Pi, sensors, cloud credits',
        status: 'IN_PROGRESS',
        isPublic: true,
        slug: 'iot-energy-monitoring',
        views: 234,
        publishedAt: new Date('2024-08-15')
      }
    })

    // Challenge 6: Completed
    const challenge6 = await prisma.companyChallenge.upsert({
      where: { slug: 'blockchain-voting-system' },
      update: {},
      create: {
        recruiterId: recruiter1.id,
        companyName: 'TechCorp Solutions',
        companyLogo: 'https://ui-avatars.com/api/?name=TechCorp&background=0D8ABC&color=fff',
        companyIndustry: 'Technology',
        title: 'Blockchain-Based Voting System',
        description: 'Research and prototype a secure, transparent voting system using blockchain technology. Focus on ensuring vote integrity, voter privacy, and system scalability.',
        problemStatement: 'Traditional voting systems lack transparency and are vulnerable to manipulation. We need a modern solution that builds trust.',
        expectedOutcome: 'Proof of concept with security analysis, performance benchmarks, and recommendations for production deployment.',
        challengeType: 'RESEARCH',
        discipline: 'TECHNOLOGY',
        requiredSkills: ['Blockchain', 'Cryptography', 'Smart Contracts', 'Solidity', 'Security'],
        tools: ['Ethereum', 'Hardhat', 'IPFS', 'React'],
        teamSizeMin: 2,
        teamSizeMax: 4,
        estimatedDuration: '3 months',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-09-01'),
        applicationDeadline: new Date('2024-05-15'),
        targetCourses: ['Distributed Systems', 'Cryptography', 'Blockchain Technology'],
        targetSemesters: ['Summer 2024'],
        creditWorth: 6,
        maxSubmissions: 5,
        mentorshipOffered: true,
        status: 'COMPLETED',
        isPublic: true,
        slug: 'blockchain-voting-system',
        views: 312,
        publishedAt: new Date('2024-05-01')
      }
    })

    console.log(`✅ Created/updated 6 company challenges`)

    // =========================================
    // CREATE UNIVERSITY APPROVALS
    // =========================================
    console.log('\n📝 Creating university approvals...')

    // PoliMi approvals
    await prisma.challengeUniversityApproval.upsert({
      where: {
        challengeId_universityId: {
          challengeId: challenge1.id,
          universityId: 'polimi'
        }
      },
      update: {},
      create: {
        challengeId: challenge1.id,
        universityId: 'polimi',
        universityName: 'Politecnico di Milano',
        approvedBy: university1.id,
        status: 'APPROVED',
        courseName: 'Software Engineering Capstone',
        courseCode: 'SE-CAP-101',
        semester: 'Spring 2025',
        professorName: 'Prof. Alessandro Romano',
        professorEmail: 'alessandro.romano@polimi.it',
        approvedAt: new Date()
      }
    })

    await prisma.challengeUniversityApproval.upsert({
      where: {
        challengeId_universityId: {
          challengeId: challenge5.id,
          universityId: 'polimi'
        }
      },
      update: {},
      create: {
        challengeId: challenge5.id,
        universityId: 'polimi',
        universityName: 'Politecnico di Milano',
        approvedBy: university1.id,
        status: 'APPROVED',
        courseName: 'IoT and Embedded Systems',
        courseCode: 'IOT-401',
        semester: 'Fall 2024',
        professorName: 'Prof. Marco Bellini',
        professorEmail: 'marco.bellini@polimi.it',
        approvedAt: new Date('2024-08-20')
      }
    })

    await prisma.challengeUniversityApproval.upsert({
      where: {
        challengeId_universityId: {
          challengeId: challenge6.id,
          universityId: 'polimi'
        }
      },
      update: {},
      create: {
        challengeId: challenge6.id,
        universityId: 'polimi',
        universityName: 'Politecnico di Milano',
        approvedBy: university1.id,
        status: 'APPROVED',
        courseName: 'Distributed Systems',
        courseCode: 'DS-301',
        semester: 'Summer 2024',
        professorName: 'Prof. Elena Martini',
        professorEmail: 'elena.martini@polimi.it',
        approvedAt: new Date('2024-05-10')
      }
    })

    // Pending approval for PoliMi
    await prisma.challengeUniversityApproval.upsert({
      where: {
        challengeId_universityId: {
          challengeId: challenge2.id,
          universityId: 'polimi'
        }
      },
      update: {},
      create: {
        challengeId: challenge2.id,
        universityId: 'polimi',
        universityName: 'Politecnico di Milano',
        status: 'PENDING'
      }
    })

    // Bocconi approvals
    await prisma.challengeUniversityApproval.upsert({
      where: {
        challengeId_universityId: {
          challengeId: challenge2.id,
          universityId: 'bocconi'
        }
      },
      update: {},
      create: {
        challengeId: challenge2.id,
        universityId: 'bocconi',
        universityName: 'Università Bocconi',
        approvedBy: university2.id,
        status: 'APPROVED',
        courseName: 'Financial Technology',
        courseCode: 'FIN-TECH-301',
        semester: 'Spring 2025',
        professorName: 'Prof. Chiara Costa',
        professorEmail: 'chiara.costa@unibocconi.it',
        approvedAt: new Date()
      }
    })

    await prisma.challengeUniversityApproval.upsert({
      where: {
        challengeId_universityId: {
          challengeId: challenge4.id,
          universityId: 'bocconi'
        }
      },
      update: {},
      create: {
        challengeId: challenge4.id,
        universityId: 'bocconi',
        universityName: 'Università Bocconi',
        status: 'PENDING'
      }
    })

    // Rejected approval example
    await prisma.challengeUniversityApproval.upsert({
      where: {
        challengeId_universityId: {
          challengeId: challenge1.id,
          universityId: 'bocconi'
        }
      },
      update: {},
      create: {
        challengeId: challenge1.id,
        universityId: 'bocconi',
        universityName: 'Università Bocconi',
        approvedBy: university2.id,
        status: 'REJECTED',
        statusMessage: 'This challenge requires technical skills not covered in our curriculum. We recommend partnership with our Computer Science department.'
      }
    })

    console.log(`✅ Created/updated 7 university approvals`)

    // =========================================
    // CREATE CHALLENGE SUBMISSIONS
    // =========================================
    console.log('\n📝 Creating challenge submissions...')

    // Submissions for Challenge 1 (AI Chatbot - Active)
    await prisma.challengeSubmission.upsert({
      where: {
        challengeId_studentId: {
          challengeId: challenge1.id,
          studentId: student1.id
        }
      },
      update: {},
      create: {
        challengeId: challenge1.id,
        studentId: student1.id,
        universityId: 'polimi',
        universityName: 'Politecnico di Milano',
        courseName: 'Software Engineering Capstone',
        courseCode: 'SE-CAP-101',
        semester: 'Spring 2025',
        professorName: 'Prof. Alessandro Romano',
        isTeamProject: true,
        teamName: 'AI Wizards',
        teamMembers: [
          { name: 'Anna Lombardi', email: 'anna.lombardi@mail.polimi.it', role: 'ML Engineer' },
          { name: 'Pietro Conti', email: 'pietro.conti@mail.polimi.it', role: 'Backend Developer' }
        ],
        status: 'SELECTED',
        applicationText: 'Our team has strong experience in NLP and chatbot development. We completed a similar project for a local startup and are excited to tackle this challenge.',
        proposalUrl: 'https://docs.google.com/document/d/team-proposal-chatbot',
        selectedAt: new Date()
      }
    })

    await prisma.challengeSubmission.upsert({
      where: {
        challengeId_studentId: {
          challengeId: challenge1.id,
          studentId: student2.id
        }
      },
      update: {},
      create: {
        challengeId: challenge1.id,
        studentId: student2.id,
        universityId: 'polimi',
        universityName: 'Politecnico di Milano',
        courseName: 'Software Engineering Capstone',
        semester: 'Spring 2025',
        status: 'APPLIED',
        applicationText: 'I am passionate about conversational AI and have completed several online courses on the topic. Looking forward to applying my skills in a real-world scenario.'
      }
    })

    // Submissions for Challenge 2 (Financial Dashboard - Approved)
    await prisma.challengeSubmission.upsert({
      where: {
        challengeId_studentId: {
          challengeId: challenge2.id,
          studentId: student3.id
        }
      },
      update: {},
      create: {
        challengeId: challenge2.id,
        studentId: student3.id,
        universityId: 'bocconi',
        universityName: 'Università Bocconi',
        courseName: 'Financial Technology',
        courseCode: 'FIN-TECH-301',
        semester: 'Spring 2025',
        status: 'APPLIED',
        applicationText: 'As a finance student with programming skills, I can bridge the gap between financial requirements and technical implementation. I have experience with Python for financial modeling.'
      }
    })

    // Submissions for Challenge 5 (IoT - In Progress)
    await prisma.challengeSubmission.upsert({
      where: {
        challengeId_studentId: {
          challengeId: challenge5.id,
          studentId: student5.id
        }
      },
      update: {},
      create: {
        challengeId: challenge5.id,
        studentId: student5.id,
        universityId: 'polimi',
        universityName: 'Politecnico di Milano',
        courseName: 'IoT and Embedded Systems',
        courseCode: 'IOT-401',
        semester: 'Fall 2024',
        isTeamProject: true,
        teamName: 'Green Energy Squad',
        teamMembers: [
          { name: 'Sofia Rizzo', email: 'sofia.rizzo@mail.polimi.it', role: 'Hardware Engineer' },
          { name: 'Andrea Marino', email: 'andrea.marino@mail.polimi.it', role: 'Data Engineer' },
          { name: 'Elena Gallo', email: 'elena.gallo@mail.polimi.it', role: 'Frontend Developer' }
        ],
        status: 'IN_PROGRESS',
        applicationText: 'Our diverse team combines expertise in IoT hardware, data engineering, and visualization. We are excited to create an impactful solution for energy efficiency.',
        selectedAt: new Date('2024-09-20'),
        submissionTitle: 'EcoWatch: Smart Energy Monitor',
        submissionDescription: 'We are developing a comprehensive IoT solution using Raspberry Pi nodes with various sensors (current, temperature, motion) connected via MQTT to our central analytics platform.'
      }
    })

    await prisma.challengeSubmission.upsert({
      where: {
        challengeId_studentId: {
          challengeId: challenge5.id,
          studentId: student1.id
        }
      },
      update: {},
      create: {
        challengeId: challenge5.id,
        studentId: student1.id,
        universityId: 'polimi',
        universityName: 'Politecnico di Milano',
        status: 'SUBMITTED',
        isTeamProject: true,
        teamName: 'PowerTrack',
        teamMembers: [
          { name: 'Lorenzo Barbieri', email: 'lorenzo.barbieri@mail.polimi.it', role: 'Backend Developer' }
        ],
        applicationText: 'We have a working prototype and are ready for the next phase.',
        selectedAt: new Date('2024-09-22'),
        submissionTitle: 'PowerTrack Analytics Platform',
        submissionDescription: 'A real-time energy monitoring solution with predictive analytics for identifying energy waste patterns.',
        submissionUrl: 'https://github.com/powertrack/energy-monitor',
        documentationUrl: 'https://powertrack-docs.notion.site',
        submittedAt: new Date()
      }
    })

    // Submissions for Challenge 6 (Blockchain - Completed)
    await prisma.challengeSubmission.upsert({
      where: {
        challengeId_studentId: {
          challengeId: challenge6.id,
          studentId: student2.id
        }
      },
      update: {},
      create: {
        challengeId: challenge6.id,
        studentId: student2.id,
        universityId: 'polimi',
        universityName: 'Politecnico di Milano',
        courseName: 'Distributed Systems',
        semester: 'Summer 2024',
        isTeamProject: true,
        teamName: 'BlockVote',
        teamMembers: [
          { name: 'Matteo Santoro', email: 'matteo.santoro@mail.polimi.it', role: 'Smart Contract Developer' },
          { name: 'Valentina Rossi', email: 'valentina.rossi@mail.polimi.it', role: 'Security Analyst' }
        ],
        status: 'APPROVED',
        applicationText: 'We are blockchain enthusiasts with experience in Ethereum development.',
        selectedAt: new Date('2024-05-20'),
        submissionTitle: 'BlockVote: Transparent Democracy',
        submissionDescription: 'A complete blockchain voting solution with zero-knowledge proofs for voter privacy and a user-friendly web interface.',
        submissionUrl: 'https://github.com/blockvote/voting-system',
        documentationUrl: 'https://blockvote.gitbook.io/docs',
        submittedAt: new Date('2024-08-25'),
        reviewedAt: new Date('2024-09-05'),
        companyFeedback: 'Excellent work! The team demonstrated deep understanding of blockchain security principles. The ZK-proof implementation was particularly impressive. We would love to continue collaboration.',
        companyRating: 5,
        grade: '30L/30',
        convertedToProject: true
      }
    })

    // Rejected submission example
    await prisma.challengeSubmission.upsert({
      where: {
        challengeId_studentId: {
          challengeId: challenge6.id,
          studentId: student4.id
        }
      },
      update: {},
      create: {
        challengeId: challenge6.id,
        studentId: student4.id,
        universityId: 'bocconi',
        universityName: 'Università Bocconi',
        status: 'REJECTED',
        applicationText: 'I am interested in the business implications of blockchain voting.',
        companyFeedback: 'Thank you for your interest. Unfortunately, this challenge requires strong technical skills in blockchain development which did not match your profile. We encourage you to apply to our business-focused challenges.',
        reviewedAt: new Date('2024-05-22')
      }
    })

    // Withdrawn submission example
    await prisma.challengeSubmission.upsert({
      where: {
        challengeId_studentId: {
          challengeId: challenge2.id,
          studentId: student4.id
        }
      },
      update: {},
      create: {
        challengeId: challenge2.id,
        studentId: student4.id,
        universityId: 'bocconi',
        universityName: 'Università Bocconi',
        status: 'WITHDRAWN',
        applicationText: 'Excited to work on this project!'
      }
    })

    // Revision requested example
    await prisma.challengeSubmission.upsert({
      where: {
        challengeId_studentId: {
          challengeId: challenge5.id,
          studentId: student2.id
        }
      },
      update: {},
      create: {
        challengeId: challenge5.id,
        studentId: student2.id,
        universityId: 'polimi',
        universityName: 'Politecnico di Milano',
        status: 'REVISION_REQUESTED',
        isTeamProject: false,
        applicationText: 'Solo project focusing on the software side.',
        selectedAt: new Date('2024-09-25'),
        submissionTitle: 'Energy Insights Dashboard',
        submissionDescription: 'A web-based dashboard for energy data visualization.',
        submissionUrl: 'https://github.com/giulia-dev/energy-insights',
        submittedAt: new Date('2025-01-15'),
        companyFeedback: 'Good progress on the visualization layer, but we need to see better integration with the hardware sensors. Please add real-time data ingestion capabilities and resubmit.'
      }
    })

    console.log(`✅ Created/updated 10 challenge submissions`)

    // =========================================
    // SUMMARY
    // =========================================
    console.log('\n🎉 Challenges test data seeded successfully!')
    console.log('\n📊 Summary:')
    console.log('  - 3 Recruiter users')
    console.log('  - 2 University users')
    console.log('  - 5 Student users')
    console.log('  - 6 Company Challenges (various statuses)')
    console.log('  - 7 University Approvals')
    console.log('  - 10 Challenge Submissions (various statuses)')

    console.log('\n🔑 Test Credentials (password: TestPassword123!):')
    console.log('  - Recruiter: recruiter1@techcorp.com')
    console.log('  - University: admin@polimi.it')
    console.log('  - Student: student1@mail.polimi.it')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
