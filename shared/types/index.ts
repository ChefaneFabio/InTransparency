// User Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'student' | 'professional' | 'recruiter'
  university?: string
  major?: string
  graduationYear?: number
  company?: string
  position?: string
  bio?: string
  avatarUrl?: string
  skills: string[]
  interests: string[]
  location?: string
  linkedinUrl?: string
  githubUrl?: string
  portfolioUrl?: string
  isActive: boolean
  emailVerified: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export interface UserProfile extends Omit<User, 'password' | 'emailVerificationToken'> {
  projectsCount?: number
  matchesCount?: number
  profileCompleteness?: number
}

// Project Types
export interface Project {
  id: string
  userId: string
  title: string
  description: string
  technologies: string[]
  category: ProjectCategory
  repositoryUrl?: string
  liveUrl?: string
  images: string[]
  tags: string[]
  isPublic: boolean
  isFeatured: boolean
  collaborators: string[]
  status: 'pending_analysis' | 'analyzing' | 'analyzed' | 'failed'
  
  // AI Analysis Results
  aiAnalysis?: AIAnalysis
  innovationScore: number
  complexityLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  skillLevel: number // 1-10
  technicalDepth: number // 1-10
  marketRelevance: number // 1-10
  professionalStory?: string
  
  // Author info (when populated)
  authorFirstName?: string
  authorLastName?: string
  authorAvatar?: string
  authorUniversity?: string
  
  // Statistics (when populated)
  stats?: {
    views: number
    likes: number
    shares: number
    bookmarks: number
  }
  
  createdAt: string
  updatedAt: string
}

export type ProjectCategory = 
  | 'web-development'
  | 'mobile-development'
  | 'data-science'
  | 'machine-learning'
  | 'ai'
  | 'blockchain'
  | 'game-development'
  | 'iot'
  | 'cybersecurity'
  | 'other'

export interface AIAnalysis {
  keyStrengths: string[]
  innovationAspects: string
  technicalChallenges: string
  learningValue: string
  industryRelevance: string
  scalabilityPotential: string
  codeQualityIndicators: string
  projectMaturity: string
  learningOutcomes: string[]
  improvementSuggestions: string[]
  technologyAssessment: {
    categories: Record<string, string[]>
    modernStack: boolean
    complexityLevel: string
    learningCurve: string
  }
}

// Match Types
export interface Match {
  id: string
  requesterId: string
  targetUserId?: string
  projectId?: string
  matchType: 'user_to_user' | 'user_to_project' | 'project_to_user'
  confidenceScore: number // 0-1
  matchingCriteria: string[]
  sharedSkills: string[]
  complementarySkills: string[]
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  requesterMessage?: string
  responseMessage?: string
  respondedAt?: string
  expiresAt: string
  createdAt: string
  updatedAt: string
  
  // Populated fields
  requester?: UserProfile
  targetUser?: UserProfile
  project?: Project
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface ProjectsResponse {
  projects: Project[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Auth Types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  role: User['role']
  university?: string
  major?: string
  graduationYear?: number
  company?: string
  position?: string
}

export interface AuthResponse {
  token: string
  user: UserProfile
  message: string
}

// Project Form Types
export interface ProjectFormData {
  title: string
  description: string
  technologies: string[]
  category: ProjectCategory
  repositoryUrl?: string
  liveUrl?: string
  images?: string[]
  tags?: string[]
  isPublic: boolean
  collaborators?: string[]
}

// Filter Types
export interface ProjectFilters {
  category?: ProjectCategory
  technologies?: string[]
  search?: string
  userId?: string
  featured?: boolean
  sortBy?: 'created_at' | 'updated_at' | 'title' | 'innovation_score' | 'complexity_level'
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface UserFilters {
  role?: User['role']
  university?: string
  skills?: string[]
  location?: string
  search?: string
  page?: number
  limit?: number
}

// Analytics Types
export interface ProjectAnalytics {
  projectId: string
  userId: string
  action: 'view' | 'like' | 'share' | 'bookmark' | 'contact'
  metadata?: Record<string, any>
  sessionId?: string
  userAgent?: string
  ipAddress?: string
  referrer?: string
  createdAt: string
}

export interface AnalyticsStats {
  totalViews: number
  totalLikes: number
  totalShares: number
  totalBookmarks: number
  totalContacts: number
  uniqueViewers: number
  viewsOverTime: { date: string; views: number }[]
  topProjects: { projectId: string; title: string; views: number }[]
  topTechnologies: { technology: string; count: number }[]
}

// Upload Types
export interface UploadRequest {
  fileName: string
  fileType: string
  fileSize: number
}

export interface UploadResponse {
  uploadUrl: string
  fileUrl: string
  fileId: string
}

// Story Generation Types
export interface StoryRequest {
  projectData: Project
  targetAudience: 'recruiter' | 'peer' | 'academic' | 'client' | 'general'
  tone: 'professional' | 'casual' | 'academic' | 'enthusiastic' | 'technical'
  length: 'short' | 'medium' | 'long'
  focusAreas?: string[]
}

export interface StoryResponse {
  story: string
  keyPoints: string[]
  callToAction: string
  alternativeVersions?: string[]
  status: string
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  type: 'match' | 'project_analyzed' | 'message' | 'system'
  title: string
  message: string
  data?: Record<string, any>
  read: boolean
  createdAt: string
}

// Search Types
export interface SearchResult {
  type: 'user' | 'project'
  id: string
  title: string
  description?: string
  avatarUrl?: string
  technologies?: string[]
  relevanceScore: number
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
  facets: {
    categories: { name: string; count: number }[]
    technologies: { name: string; count: number }[]
    users: { name: string; count: number }[]
  }
}

// Error Types
export interface ApiError {
  code: string
  message: string
  details?: any
  field?: string
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

// Utility Types
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>>
  & {
      [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]

export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>

export type OptionalExcept<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>