import clsx from 'clsx'
import type { TalentStatus } from '@/types'

const cfg: Record<TalentStatus, string> = {
  'Baru':         'bg-zinc-800 text-zinc-400',
  'Dipanggil':    'bg-blue-950 text-blue-400 border border-blue-800/40',
  'Lolos':        'bg-emerald-950 text-emerald-400 border border-emerald-800/40',
  'Tidak Lolos':  'bg-red-950 text-red-400 border border-red-800/40',
  'On Hold':      'bg-amber-950 text-amber-400 border border-amber-800/40',
}

export const DOT_CFG: Record<TalentStatus, string> = {
  'Baru':         'bg-zinc-500',
  'Dipanggil':    'bg-blue-400',
  'Lolos':        'bg-emerald-400',
  'Tidak Lolos':  'bg-red-400',
  'On Hold':      'bg-amber-400',
}

export const STATUS_OPTIONS: TalentStatus[] = [
  'Baru', 'Dipanggil', 'Lolos', 'Tidak Lolos', 'On Hold'
]

interface Props { status: TalentStatus; size?: 'sm' | 'md' }

export default function StatusBadge({ status, size = 'sm' }: Props) {
  return (
    <span className={clsx(
      'inline-flex items-center rounded-full font-semibold tracking-wide uppercase',
      size === 'sm' ? 'text-[10px] px-2.5 py-0.5' : 'text-xs px-3 py-1',
      cfg[status]
    )}>
      {status}
    </span>
  )
}
