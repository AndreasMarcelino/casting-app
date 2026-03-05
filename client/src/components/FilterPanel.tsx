import { useFilterStore } from '@/store/filterStore'
import { useProjects } from '@/hooks/useProjects'
import { STATUS_OPTIONS } from '@/components/StatusBadge'
import { X } from 'lucide-react'
import clsx from 'clsx'

interface FieldProps {
  label: string
  children: React.ReactNode
}

function Field({ label, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] uppercase tracking-widest text-zinc-500">{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'bg-[#0d0d0d] border border-[#2a2a2a] text-zinc-200 text-sm rounded px-2.5 py-1.5 w-full focus:outline-none focus:border-gold transition-colors'
const selectCls = inputCls + ' appearance-none'

export default function FilterPanel() {
  const { filters, setFilter, resetFilters, activeCount } = useFilterStore()
  const { data: projects } = useProjects()
  const count = activeCount()

  return (
    <div className="flex flex-col gap-4 p-4 border-b border-[#2a2a2a]">
      {/* Search */}
      <Field label="Cari">
        <input
          type="text"
          placeholder="Nama, skill, kota, pengalaman..."
          value={filters.search}
          onChange={e => setFilter('search', e.target.value)}
          className={inputCls}
        />
      </Field>

      {/* Status + Gender */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Status">
          <select value={filters.status} onChange={e => setFilter('status', e.target.value)} className={selectCls}>
            <option value="">Semua</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Gender">
          <select value={filters.gender} onChange={e => setFilter('gender', e.target.value)} className={selectCls}>
            <option value="">Semua</option>
            <option value="Perempuan">Perempuan</option>
            <option value="Laki-laki">Laki-laki</option>
          </select>
        </Field>
      </div>

      {/* Age range */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Usia Min">
          <input type="number" min="0" max="100" placeholder="—"
            value={filters.age_min} onChange={e => setFilter('age_min', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Usia Maks">
          <input type="number" min="0" max="100" placeholder="—"
            value={filters.age_max} onChange={e => setFilter('age_max', e.target.value)} className={inputCls} />
        </Field>
      </div>

      {/* Tinggi range */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Tinggi Min (cm)">
          <input type="number" placeholder="—"
            value={filters.tinggi_min} onChange={e => setFilter('tinggi_min', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Tinggi Maks (cm)">
          <input type="number" placeholder="—"
            value={filters.tinggi_max} onChange={e => setFilter('tinggi_max', e.target.value)} className={inputCls} />
        </Field>
      </div>

      {/* Ukuran Baju */}
      <Field label="Ukuran Baju">
        <select value={filters.baju} onChange={e => setFilter('baju', e.target.value)} className={selectCls}>
          <option value="">Semua</option>
          {['S', 'M', 'L', 'XL', 'XXL'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>

      {/* Bahasa */}
      <Field label="Bahasa">
        <input type="text" placeholder="Indonesia, Jawa, Inggris..."
          value={filters.bahasa} onChange={e => setFilter('bahasa', e.target.value)} className={inputCls} />
      </Field>

      {/* Project */}
      {projects?.length > 0 && (
        <Field label="Project">
          <select value={filters.project_id} onChange={e => setFilter('project_id', e.target.value)} className={selectCls}>
            <option value="">Semua Project</option>
            {projects.map((p: { id: string; nama: string; tahun: number }) => (
              <option key={p.id} value={p.id}>{p.nama} ({p.tahun})</option>
            ))}
          </select>
        </Field>
      )}

      {/* Reset */}
      {count > 0 && (
        <button
          onClick={resetFilters}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-red-400 transition-colors"
        >
          <X size={12} />
          Reset {count} filter aktif
        </button>
      )}
    </div>
  )
}
