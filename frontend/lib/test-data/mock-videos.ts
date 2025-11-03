/**
 * Mock video data for testing and demos
 * Use this to test video features without actual uploads
 */

export const mockVideos = [
  {
    id: 'video-1',
    projectId: 'project-1',
    projectTitle: 'AI-Powered Task Management System',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Public test video
    thumbnailUrl: '/api/placeholder/400/300',
    duration: 150, // 2:30
    views: 487,
    uploadedAt: '2024-11-15T10:30:00Z',
    verified: true,
    verificationLevel: 'university' as const,
    institutionName: 'Stanford University'
  },
  {
    id: 'video-2',
    projectId: 'project-2',
    projectTitle: 'Real-time Collaboration Platform',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: '/api/placeholder/400/300',
    duration: 120, // 2:00
    views: 312,
    uploadedAt: '2024-10-20T14:15:00Z',
    verified: true,
    verificationLevel: 'professor' as const,
    institutionName: 'Stanford University'
  },
  {
    id: 'video-3',
    projectId: 'project-3',
    projectTitle: 'Machine Learning Stock Predictor',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: '/api/placeholder/400/300',
    duration: 90, // 1:30
    views: 245,
    uploadedAt: '2024-09-10T09:00:00Z',
    verified: false,
    verificationLevel: 'ai' as const,
    institutionName: 'Stanford University'
  }
]

export const mockVerificationDetails = {
  projectId: 'project-1',
  projectTitle: 'AI-Powered Task Management System',
  studentName: 'Alex Johnson',
  verificationType: 'university' as const,
  institution: 'Stanford University',
  courseName: 'Advanced Web Development',
  courseCode: 'CS401',
  semester: 'Fall 2024',
  academicYear: '2024-2025',
  grade: 'A (95/100)',
  professor: 'Prof. Dr. Sarah Chen',
  verificationMethod: 'esse3' as const,
  verifiedDate: '2024-11-20T15:30:00Z',
  verificationId: 'STANFORD-2024-AI12345',
  skills: [
    {
      name: 'React',
      proficiencyLevel: 'Advanced',
      evidence: 'Built complex state management system with React hooks and Context API'
    },
    {
      name: 'TypeScript',
      proficiencyLevel: 'Advanced',
      evidence: 'Full type safety implementation across 50+ components'
    },
    {
      name: 'Node.js',
      proficiencyLevel: 'Intermediate',
      evidence: 'RESTful API development with Express and PostgreSQL'
    },
    {
      name: 'OpenAI API Integration',
      proficiencyLevel: 'Intermediate',
      evidence: 'Implemented AI task categorization and priority suggestion system'
    },
    {
      name: 'Real-time Systems',
      proficiencyLevel: 'Beginner',
      evidence: 'WebSocket implementation for collaborative features'
    }
  ],
  endorsement: {
    professorName: 'Prof. Dr. Sarah Chen',
    professorEmail: 's.chen@stanford.edu',
    professorTitle: 'Associate Professor of Computer Science',
    department: 'Department of Computer Science',
    endorsementText: 'Alex demonstrated exceptional technical skills and creativity in this project. The AI integration was particularly impressive, showing deep understanding of both web development and machine learning concepts. The code quality and documentation were exemplary.',
    rating: 5
  }
}

// Helper function to use in components
export function getMockVideos(projectIds?: string[]) {
  if (!projectIds) return mockVideos
  return mockVideos.filter(v => projectIds.includes(v.projectId))
}

export function getMockVideo(videoId: string) {
  return mockVideos.find(v => v.id === videoId)
}
