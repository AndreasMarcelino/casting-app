import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { syncApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { useTalents } from '@/hooks/useTalents'
import { RefreshCw, LogOut, Film } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'

export default function TopBar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { data: talentData } = useTalents()

  const { data: syncStatus } = useQuery({
    queryKey: ['sync-status'],
    queryFn: syncApi.status,
    refetchInterval: 1000 * 60 * 5,
  })

  const syncMutation = useMutation({
    mutationFn: syncApi.run,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['talents'] })
      qc.invalidateQueries({ queryKey: ['sync-status'] })
      toast.success(`Sync selesai: ${data.inserted} baru, ${data.updated} diperbarui`)
    },
    onError: () => toast.error('Sync gagal — periksa koneksi Google Sheets'),
  })

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const total = talentData?.meta?.total ?? '—'
  const lolos = '—' // would need a separate stats endpoint; kept simple

  return (
    <header className="h-14 bg-[#161616] border-b border-[#2a2a2a] flex items-center justify-between px-6 flex-shrink-0 z-10">
      <div>
        <span className="font-display text-xl text-gold tracking-wide">Casting Studio</span>
        <span className="text-[10px] uppercase tracking-[3px] text-zinc-600 ml-3">Management</span>
      </div>

      <div className="flex items-center gap-5">
        {/* Stats */}
        <div className="hidden sm:flex items-center gap-4 text-xs text-zinc-500">
          <span>Total: <strong className="text-gold">{total}</strong></span>
          {syncStatus?.last_sync && (
            <span>
              Sync: <strong className="text-zinc-400">
                {new Date(syncStatus.last_sync).toLocaleDateString('id-ID', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}
              </strong>
            </span>
          )}
        </div>

        {/* Sync button */}
        <button
          onClick={() => syncMutation.mutate()}
          disabled={syncMutation.isPending}
          className={clsx(
            'flex items-center gap-1.5 text-xs border border-[#2a2a2a] px-3 py-1.5 rounded',
            'text-zinc-400 hover:text-gold hover:border-gold/40 transition-all',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          <RefreshCw size={12} className={syncMutation.isPending ? 'animate-spin' : ''} />
          {syncMutation.isPending ? 'Syncing...' : 'Sync Sheets'}
        </button>

        {/* Projects nav */}
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-gold border border-[#2a2a2a] hover:border-gold/40 px-3 py-1.5 rounded transition-all"
        >
          <Film size={12} /> Projects
        </button>

        {/* Logout */}
        <button onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 border border-[#2a2a2a] px-3 py-1.5 rounded transition-colors"
        >
          <LogOut size={12} /> {user?.username}
        </button>
      </div>
    </header>
  )
}
