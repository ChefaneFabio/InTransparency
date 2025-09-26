import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? '' : 'https://intransparency.onrender.com')

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/auth/login'
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