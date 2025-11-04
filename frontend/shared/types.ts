export interface User {
  id: number;
  username?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'recruiter' | 'university' | 'admin';
  university?: string;
  company?: string;
  department?: string;
  graduationYear?: string;
  major?: string;
  gpa?: number;
  isEmailVerified: boolean;
  profileComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
}

export interface Course {
  id: number;
  userId: number;
  courseCode: string;
  courseName: string;
  institution: string;
  instructor?: string;
  semester: string;
  year: number;
  credits: number;
  grade?: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: number;
  userId: number;
  courseId?: number;
  title: string;
  description: string;
  category: string;
  githubUrl?: string;
  liveUrl?: string;
  demoUrl?: string;
  documentation?: string;
  technologies: string[];
  skills: string[];
  complexityLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  completionDate?: Date;
  aiScore?: number;
  aiAnalysis?: {
    strengths: string[];
    improvements: string[];
    industryRelevance: number;
    innovationScore: number;
    codeQuality: number;
  };
  isPublic: boolean;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface Match {
  id: number;
  studentId: number;
  recruiterId?: number;
  projectId?: number;
  matchScore: number;
  matchReasons: string[];
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}