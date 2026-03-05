import { create } from 'zustand'

interface User { id: string; username: string; role: string }

interface AuthStore {
  token: string | null
  user: User | null
  login: (token: string, user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: localStorage.getItem('casting_token'),
  user: (() => {
    try { return JSON.parse(localStorage.getItem('casting_user') || 'null') }
    catch { return null }
  })(),

  login: (token, user) => {
    localStorage.setItem('casting_token', token)
    localStorage.setItem('casting_user', JSON.stringify(user))
    set({ token, user })
  },

  logout: () => {
    localStorage.removeItem('casting_token')
    localStorage.removeItem('casting_user')
    set({ token: null, user: null })
  },
}))
