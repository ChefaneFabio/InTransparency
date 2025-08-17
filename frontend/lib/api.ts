import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://intransparency.onrender.com'

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