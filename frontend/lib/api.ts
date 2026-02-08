import axios from 'axios'
import { secureStorage } from './secure-storage'

const API_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? '' : 'https://api-intransparency.onrender.com')

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = secureStorage.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Try to refresh token
      const refreshToken = secureStorage.getRefreshToken()
      if (refreshToken) {
        try {
          const response = await api.post('/api/auth/refresh', {
            refreshToken
          })

          const { accessToken, refreshToken: newRefreshToken } = response.data
          const user = secureStorage.getUserInfo()

          secureStorage.setAuthData({
            accessToken,
            refreshToken: newRefreshToken,
            user,
            expiresAt: Date.now() + (60 * 60 * 1000) // 1 hour
          })

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return api(originalRequest)
        } catch (refreshError) {
          // Refresh failed, redirect to login
          secureStorage.clearAuthData()
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login'
          }
        }
      } else {
        // No refresh token, redirect to login
        secureStorage.clearAuthData()
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login'
        }
      }
    }

    return Promise.reject(error)
  }
)

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  
  register: (userData: any) =>
    api.post('/api/auth/register', userData),
  
  me: () =>
    api.get('/api/auth/me'),
  
  logout: () =>
    api.post('/api/auth/logout'),
}

export const projectsApi = {
  getAll: (params?: any) =>
    api.get('/api/projects', { params }),
  
  getById: (id: string) =>
    api.get(`/api/projects/${id}`),
  
  create: (projectData: any) =>
    api.post('/api/projects', projectData),
  
  update: (id: string, projectData: any) =>
    api.put(`/api/projects/${id}`, projectData),
  
  delete: (id: string) =>
    api.delete(`/api/projects/${id}`),
  
  analyze: (id: string) =>
    api.post(`/api/projects/${id}/analyze`),
}

export const matchesApi = {
  getRecommendations: (userId: string) =>
    api.get(`/api/matches/recommendations/${userId}`),
  
  createMatch: (matchData: any) =>
    api.post('/api/matches', matchData),
  
  getMatches: (userId: string) =>
    api.get(`/api/matches/user/${userId}`),
}

export const coursesApi = {
  getAll: (params?: any) =>
    api.get('/api/courses', { params }),
  
  getById: (id: string) =>
    api.get(`/api/courses/${id}`),
  
  create: (courseData: any) =>
    api.post('/api/courses', courseData),
  
  update: (id: string, courseData: any) =>
    api.put(`/api/courses/${id}`, courseData),
  
  delete: (id: string) =>
    api.delete(`/api/courses/${id}`),
  
  bulkCreate: (courses: any[]) =>
    api.post('/api/courses/bulk', { courses }),
  
  getAnalytics: (id: string) =>
    api.get(`/api/courses/${id}/analytics`),
}

export const filesApi = {
  upload: (file: File, type: string) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(`/api/files/upload/${type}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  
  uploadMultiple: (files: File[], type: string) => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    return api.post(`/api/files/upload-multiple/${type}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  
  parseTranscript: (file: File) => {
    const formData = new FormData()
    formData.append('transcript', file)
    return api.post('/api/files/parse-transcript', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  
  download: (filename: string) =>
    api.get(`/api/files/download/${filename}`, {
      responseType: 'blob',
    }),
  
  delete: (filename: string) =>
    api.delete(`/api/files/${filename}`),
}

export const uploadApi = {
  getUploadUrl: (fileName: string, fileType: string) =>
    api.post('/api/upload/signed-url', { fileName, fileType }),

  uploadToS3: (signedUrl: string, file: File) =>
    axios.put(signedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    }),
}

export const universitiesApi = {
  getAll: (params?: any) =>
    api.get('/api/universities', { params }),

  getBySlug: (slug: string) =>
    api.get(`/api/universities/${slug}`),

  create: (universityData: any) =>
    api.post('/api/universities', universityData),

  update: (id: string, universityData: any) =>
    api.put(`/api/universities/${id}`, universityData),

  delete: (id: string) =>
    api.delete(`/api/universities/${id}`),

  getStudents: (slug: string, params?: any) =>
    api.get(`/api/universities/${slug}/students`, { params }),

  getAnalytics: (slug: string) =>
    api.get(`/api/universities/${slug}/analytics`),
}

export const jobsApi = {
  getAll: (params?: any) =>
    api.get('/api/jobs', { params }),

  getById: (id: string) =>
    api.get(`/api/jobs/${id}`),

  create: (jobData: any) =>
    api.post('/api/jobs', jobData),

  update: (id: string, jobData: any) =>
    api.put(`/api/jobs/${id}`, jobData),

  delete: (id: string) =>
    api.delete(`/api/jobs/${id}`),

  apply: (id: string, applicationData: any) =>
    api.post(`/api/jobs/${id}/apply`, applicationData),

  getApplications: (id: string) =>
    api.get(`/api/jobs/${id}/applications`),
}

export const companiesApi = {
  getAll: (params?: any) =>
    api.get('/api/companies', { params }),

  getBySlug: (slug: string) =>
    api.get(`/api/companies/${slug}`),

  create: (companyData: any) =>
    api.post('/api/companies', companyData),

  update: (id: string, companyData: any) =>
    api.put(`/api/companies/${id}`, companyData),

  delete: (id: string) =>
    api.delete(`/api/companies/${id}`),

  getJobs: (slug: string, params?: any) =>
    api.get(`/api/companies/${slug}/jobs`, { params }),

  follow: (id: string) =>
    api.post(`/api/companies/${id}/follow`),

  unfollow: (id: string) =>
    api.delete(`/api/companies/${id}/follow`),
}

export const studentsApi = {
  getAll: (params?: any) =>
    api.get('/api/students', { params }),

  getById: (id: string) =>
    api.get(`/api/students/${id}`),

  create: (studentData: any) =>
    api.post('/api/students', studentData),

  update: (id: string, studentData: any) =>
    api.put(`/api/students/${id}`, studentData),

  delete: (id: string) =>
    api.delete(`/api/students/${id}`),

  getProjects: (id: string) =>
    api.get(`/api/students/${id}/projects`),

  getMatches: (id: string) =>
    api.get(`/api/students/${id}/matches`),

  updateProfile: (id: string, profileData: any) =>
    api.put(`/api/students/${id}/profile`, profileData),
}

export const applicationsApi = {
  getUserApplications: (userId: string) =>
    api.get(`/api/applications/user/${userId}`),

  getJobApplications: (jobId: string) =>
    api.get(`/api/applications/job/${jobId}`),

  create: (applicationData: any) =>
    api.post('/api/applications', applicationData),

  updateStatus: (id: string, status: string, feedback?: string) =>
    api.patch(`/api/applications/${id}/status`, { status, feedback }),

  withdraw: (id: string) =>
    api.delete(`/api/applications/${id}`),
}

export const searchApi = {
  global: (query: string, type?: string, limit?: number) =>
    api.get('/api/search', { params: { q: query, type, limit } }),

  jobs: (params: {
    q?: string
    location?: string
    remote?: boolean
    level?: string
    salary_min?: number
    salary_max?: number
    company_id?: string
    skills?: string
    limit?: number
  }) => api.get('/api/search/jobs', { params }),

  students: (params: {
    q?: string
    university_id?: string
    major?: string
    graduation_year?: string
    min_gpa?: number
    skills?: string
    location?: string
    limit?: number
  }) => api.get('/api/search/students', { params }),
}

export const matchingApi = {
  getJobRecommendations: (studentId: string) =>
    api.get(`/api/matching/jobs/${studentId}`),

  getCandidateRecommendations: (jobId: string) =>
    api.get(`/api/matching/candidates/${jobId}`),

  getMutualMatches: (studentId: string) =>
    api.get(`/api/matching/mutual/${studentId}`),
}

export const usersApi = {
  getProfile: () =>
    api.get('/api/users/me'),

  updateProfile: (profileData: any) =>
    api.put('/api/users/me', profileData),

  getDashboard: () =>
    api.get('/api/users/dashboard'),

  getNotifications: () =>
    api.get('/api/users/notifications'),

  markNotificationRead: (notificationId: string) =>
    api.patch(`/api/users/notifications/${notificationId}/read`),

  updatePreferences: (preferences: any) =>
    api.put('/api/users/preferences', preferences),

  getSavedItems: (type?: string) =>
    api.get('/api/users/saved', { params: { type } }),

  saveItem: (type: string, itemId: string) =>
    api.post('/api/users/saved', { type, itemId, action: 'save' }),

  unsaveItem: (type: string, itemId: string) =>
    api.post('/api/users/saved', { type, itemId, action: 'unsave' }),
}

export const analyticsApi = {
  getPlatformAnalytics: () =>
    api.get('/api/analytics/platform'),

  getUniversityAnalytics: (slug: string) =>
    api.get(`/api/analytics/university/${slug}`),

  getCompanyAnalytics: (slug: string) =>
    api.get(`/api/analytics/company/${slug}`),

  getJobAnalytics: (jobId: string) =>
    api.get(`/api/analytics/job/${jobId}`),

  getStudentAnalytics: (studentId: string) =>
    api.get(`/api/analytics/student/${studentId}`),
}

// Chat / Conversation API
export type ChatUserRole = 'student' | 'recruiter' | 'company' | 'institution' | 'university'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

export interface ChatResponse {
  message: string
  intent: string
  confidence?: number
  entities: Record<string, unknown>
  suggested_actions: Array<{ label: string; action: string }>
  session_id: string
  status: string
}

export const chatApi = {
  // Send a message and get AI response
  sendMessage: async (
    sessionId: string,
    message: string,
    userRole: ChatUserRole = 'student'
  ): Promise<ChatResponse> => {
    const response = await api.post('/api/chat', {
      session_id: sessionId,
      message,
      user_role: userRole,
      stream: false
    })
    return response.data
  },

  // Stream a message response (returns EventSource-like interface)
  streamMessage: async (
    sessionId: string,
    message: string,
    userRole: ChatUserRole = 'student',
    onChunk: (text: string) => void,
    onComplete?: () => void,
    onError?: (error: Error) => void
  ): Promise<void> => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id: sessionId,
          message,
          user_role: userRole,
          stream: true
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No reader available')
      }

      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          onComplete?.()
          break
        }

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              onComplete?.()
              return
            }
            try {
              const parsed = JSON.parse(data)
              if (parsed.text) {
                onChunk(parsed.text)
              }
            } catch {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      onError?.(error as Error)
      throw error
    }
  },

  // Get conversation history
  getHistory: async (sessionId: string): Promise<{
    session_id: string
    messages: ChatMessage[]
    user_role: string
    created_at: string
    status: string
  }> => {
    const response = await api.get(`/api/chat?session_id=${sessionId}`)
    return response.data
  },

  // Delete a conversation session
  deleteSession: async (sessionId: string): Promise<void> => {
    await api.delete(`/api/chat?session_id=${sessionId}`)
  },

  // Generate a unique session ID
  generateSessionId: (): string => {
    return `chat_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
  }
}

export const recruiterDashboardApi = {
  // Stats
  getStats: () =>
    api.get('/api/dashboard/recruiter/stats'),

  // Jobs
  getJobs: (params?: { status?: string; search?: string; page?: number; limit?: number }) =>
    api.get('/api/dashboard/recruiter/jobs', { params }),

  // Candidate profile
  getCandidate: (id: string) =>
    api.get(`/api/dashboard/recruiter/candidates/${id}`),

  // Saved candidates
  getSavedCandidates: (params?: { folder?: string }) =>
    api.get('/api/dashboard/recruiter/saved-candidates', { params }),

  saveCandidate: (candidateId: string, folder?: string) =>
    api.post('/api/dashboard/recruiter/saved-candidates', { candidateId, folder }),

  unsaveCandidate: (candidateId: string) =>
    api.delete('/api/dashboard/recruiter/saved-candidates', { data: { candidateId } }),

  updateSavedCandidate: (id: string, data: { folder?: string; notes?: string; rating?: number; tags?: string[] }) =>
    api.put(`/api/dashboard/recruiter/saved-candidates/${id}`, data),

  // Settings
  getSettings: () =>
    api.get('/api/dashboard/recruiter/settings'),

  updateSettings: (data: any) =>
    api.put('/api/dashboard/recruiter/settings', data),

  // Search
  searchStudents: (params?: { search?: string; university?: string; skills?: string; gpaMin?: string; minProjects?: string; graduationYear?: string; location?: string; major?: string; page?: number; limit?: number }) =>
    api.get('/api/dashboard/recruiter/search/students', { params }),

  searchByCourse: (params?: { courseCategory?: string; minGrade?: string; institutionType?: string; page?: number; limit?: number }) =>
    api.get('/api/dashboard/recruiter/search/by-course', { params }),

  // Saved searches
  getSavedSearches: () =>
    api.get('/api/dashboard/recruiter/saved-searches'),

  createSavedSearch: (data: { name: string; description?: string; filters: any; alertsEnabled?: boolean; alertFrequency?: string }) =>
    api.post('/api/dashboard/recruiter/saved-searches', data),

  updateSavedSearch: (id: string, data: any) =>
    api.put(`/api/dashboard/recruiter/saved-searches/${id}`, data),

  deleteSavedSearch: (id: string) =>
    api.delete(`/api/dashboard/recruiter/saved-searches/${id}`),

  // Analytics
  getAnalytics: (params?: { timeRange?: string }) =>
    api.get('/api/dashboard/recruiter/analytics', { params }),

  getTalentAnalytics: () =>
    api.get('/api/dashboard/recruiter/talent-analytics'),
}

export const messagesApi = {
  getConversations: (params?: { page?: number; limit?: number }) =>
    api.get('/api/messages/conversations', { params }),

  getMessages: (params?: { threadId?: string; unreadOnly?: string; page?: number; limit?: number }) =>
    api.get('/api/messages', { params }),

  sendMessage: (data: { recipientId?: string; recipientEmail: string; subject?: string; content: string; threadId?: string; replyToId?: string }) =>
    api.post('/api/messages', data),

  getMessage: (id: string) =>
    api.get(`/api/messages/${id}`),

  deleteMessage: (id: string) =>
    api.delete(`/api/messages/${id}`),
}

export const skillPathApi = {
  getRecommendations: () =>
    api.get('/api/student/skill-path'),

  refreshRecommendations: () =>
    api.post('/api/student/skill-path/refresh'),
}

export const studentDashboardApi = {
  getAnalytics: (params?: { timeRange?: string }) =>
    api.get('/api/dashboard/student/analytics', { params }),

  getProfile: () =>
    api.get('/api/dashboard/student/profile'),

  updateProfile: (data: any) =>
    api.patch('/api/dashboard/student/profile', data),

  getActivity: () =>
    api.get('/api/dashboard/student/activity'),
}

export const universityDashboardApi = {
  // Students
  getStudents: (params?: { search?: string; major?: string; year?: string; page?: number; limit?: number }) =>
    api.get('/api/dashboard/university/students', { params }),

  addStudent: (data: { firstName: string; lastName: string; email: string; department?: string; degree?: string; enrollmentYear?: string; expectedGraduation?: string }) =>
    api.post('/api/dashboard/university/students/add', data),

  importStudents: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/api/dashboard/university/students/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // Courses
  getCourses: (params?: { search?: string; department?: string; semester?: string }) =>
    api.get('/api/dashboard/university/courses', { params }),

  getCourse: (id: string) =>
    api.get(`/api/dashboard/university/courses/${id}`),

  createCourse: (data: any) =>
    api.post('/api/dashboard/university/courses', data),

  updateCourse: (id: string, data: any) =>
    api.patch(`/api/dashboard/university/courses/${id}`, data),

  deleteCourse: (id: string) =>
    api.delete(`/api/dashboard/university/courses/${id}`),

  // Departments
  getDepartments: () =>
    api.get('/api/dashboard/university/departments'),

  // Placements
  getPlacements: (params?: { search?: string; status?: string; type?: string }) =>
    api.get('/api/dashboard/university/placements', { params }),

  // Recruiters
  getRecruiters: () =>
    api.get('/api/dashboard/university/recruiters'),

  // Analytics
  getAnalytics: (tab?: string) =>
    api.get('/api/dashboard/university/analytics', { params: { tab } }),

  // Alumni
  getAlumni: (params?: { search?: string; status?: string; year?: string }) =>
    api.get('/api/dashboard/university/alumni', { params }),

  createAlumni: (data: any) =>
    api.post('/api/dashboard/university/alumni', data),

  // Sync
  getSyncData: () =>
    api.get('/api/dashboard/university/sync'),

  triggerSync: (dataType: string) =>
    api.post('/api/dashboard/university/sync', { dataType }),

  // Settings
  getSettings: () =>
    api.get('/api/dashboard/university/settings'),

  updateSettings: (data: any) =>
    api.put('/api/dashboard/university/settings', data),
}