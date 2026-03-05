import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('casting_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('casting_token')
      localStorage.removeItem('casting_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }).then(r => r.data),
}

// ── Talents ───────────────────────────────────────────────────────────────────
export const talentsApi = {
  list: (params?: Record<string, string | number>) =>
    api.get('/talents', { params }).then(r => r.data),

  get: (id: string) =>
    api.get(`/talents/${id}`).then(r => r.data),

  update: (id: string, body: Record<string, unknown>) =>
    api.patch(`/talents/${id}`, body).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/talents/${id}`).then(r => r.data),
}

// ── Projects ──────────────────────────────────────────────────────────────────
export const projectsApi = {
  list: () =>
    api.get('/projects').then(r => r.data),

  create: (body: Record<string, unknown>) =>
    api.post('/projects', body).then(r => r.data),

  update: (id: string, body: Record<string, unknown>) =>
    api.patch(`/projects/${id}`, body).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/projects/${id}`).then(r => r.data),

  getTalents: (id: string) =>
    api.get(`/projects/${id}/talents`).then(r => r.data),

  assignTalent: (id: string, body: Record<string, unknown>) =>
    api.post(`/projects/${id}/talents`, body).then(r => r.data),

  updateAssignment: (projectId: string, assignId: string, body: Record<string, unknown>) =>
    api.patch(`/projects/${projectId}/talents/${assignId}`, body).then(r => r.data),

  removeAssignment: (projectId: string, assignId: string) =>
    api.delete(`/projects/${projectId}/talents/${assignId}`).then(r => r.data),
}

// ── Sync ──────────────────────────────────────────────────────────────────────
export const syncApi = {
  run: () => api.post('/sync').then(r => r.data),
  status: () => api.get('/sync/status').then(r => r.data),
}
