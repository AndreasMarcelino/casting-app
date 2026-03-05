import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { token, user } = await authApi.login(username, password)
      login(token, user)
      navigate('/')
    } catch {
      toast.error('Username atau password salah')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at 30% 50%, #1a1200 0%, #0d0d0d 70%)' }}>
      <form onSubmit={handleSubmit} className="w-[360px] p-12 bg-[#161616] border border-[#2a2a2a] rounded">
        <h1 className="font-display text-3xl text-gold mb-1">Casting Admin</h1>
        <p className="text-[11px] uppercase tracking-[3px] text-zinc-500 mb-10">Management System</p>

        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Username</label>
            <input
              type="text" value={username} onChange={e => setUsername(e.target.value)}
              placeholder="admin" autoFocus required
              className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#2a2a2a] rounded text-zinc-200 text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required
              className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#2a2a2a] rounded text-zinc-200 text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full py-3 bg-gold hover:bg-gold-light text-black font-semibold text-sm uppercase tracking-widest rounded transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Memuat...' : 'Masuk'}
          </button>
        </div>
      </form>
    </div>
  )
}
