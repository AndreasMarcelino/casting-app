import { useNavigate, useParams } from 'react-router-dom'
import { useTalents } from '@/hooks/useTalents'
import { useFilterStore } from '@/store/filterStore'
import Avatar from '@/components/Avatar'
import { DOT_CFG } from '@/components/StatusBadge'
import type { Talent, TalentStatus } from '@/types'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import clsx from 'clsx'

export default function TalentList() {
  const { id: activeId } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useTalents()
  const { filters, setFilter } = useFilterStore()

  if (isLoading) return (
    <div className="flex-1 flex items-center justify-center text-zinc-600">
      <Loader2 size={20} className="animate-spin" />
    </div>
  )
  if (isError) return (
    <div className="flex-1 flex items-center justify-center text-red-500 text-sm p-4 text-center">
      Gagal memuat data
    </div>
  )

  const talents: Talent[] = data?.data ?? []
  const meta = data?.meta

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        {talents.length === 0 ? (
          <div className="p-8 text-center text-zinc-600 text-sm">Tidak ada talent ditemukan</div>
        ) : (
          talents.map(t => (
            <button
              key={t.id}
              onClick={() => navigate(`/talent/${t.id}`)}
              className={clsx(
                'w-full flex items-center gap-3 px-4 py-3 border-b border-[#1e1e1e]',
                'text-left transition-colors hover:bg-[#1e1e1e]',
                activeId === t.id
                  ? 'bg-[#1f1a0e] border-l-2 border-l-gold pl-[14px]'
                  : 'border-l-2 border-l-transparent'
              )}
            >
              <Avatar nama={t.nama} fotoLink={t.foto_link} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-zinc-200 truncate">{t.nama}</div>
                <div className="text-xs text-zinc-500 mt-0.5 truncate">
                  {[t.age ? `${t.age}th` : null, t.tinggi ? `${t.tinggi}cm` : null, t.gender].filter(Boolean).join(' · ')}
                </div>
              </div>
              <div className={clsx('w-2 h-2 rounded-full flex-shrink-0', DOT_CFG[t.status as TalentStatus])} />
            </button>
          ))
        )}
      </div>

      {/* Pagination */}
      {meta && meta.pages > 1 && (
        <div className="flex items-center justify-between px-4 py-2 border-t border-[#2a2a2a] text-xs text-zinc-500">
          <span>{meta.total} talent</span>
          <div className="flex items-center gap-2">
            <button
              disabled={filters.page <= 1}
              onClick={() => setFilter('page', filters.page - 1)}
              className="disabled:opacity-30 hover:text-zinc-300 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <span>{filters.page} / {meta.pages}</span>
            <button
              disabled={filters.page >= meta.pages}
              onClick={() => setFilter('page', filters.page + 1)}
              className="disabled:opacity-30 hover:text-zinc-300 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
