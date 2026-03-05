import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjects, useCreateProject } from '@/hooks/useProjects'
import TopBar from '@/components/TopBar'
import { Film, Plus, ArrowLeft, Loader2 } from 'lucide-react'

export default function ProjectsPage() {
  const navigate = useNavigate()
  const { data: projects, isLoading } = useProjects()
  const createProject = useCreateProject()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nama: '', tahun: new Date().getFullYear(), deskripsi: '', tipe: '' })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    await createProject.mutateAsync(form)
    setShowForm(false)
    setForm({ nama: '', tahun: new Date().getFullYear(), deskripsi: '', tipe: '' })
  }

  const inputCls = 'bg-[#0d0d0d] border border-[#2a2a2a] text-zinc-200 text-sm rounded px-3 py-2 w-full focus:outline-none focus:border-gold transition-colors'

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopBar />
      <main className="flex-1 overflow-y-auto p-8 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/')}
            className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-display text-2xl text-zinc-100">Projects Casting</h1>
          <button
            onClick={() => setShowForm(v => !v)}
            className="ml-auto flex items-center gap-1.5 text-xs bg-gold text-black font-semibold px-3 py-2 rounded"
          >
            <Plus size={12} /> Project Baru
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <form onSubmit={handleCreate} className="bg-[#161616] border border-[#2a2a2a] rounded p-6 mb-6 flex flex-col gap-4">
            <div className="text-[10px] uppercase tracking-[3px] text-gold mb-1">Project Baru</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1.5 block">Nama Project *</label>
                <input required type="text" value={form.nama} onChange={e => setForm(f => ({...f, nama: e.target.value}))}
                  placeholder="Film Pendek ABC" className={inputCls} />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1.5 block">Tahun</label>
                <input type="number" value={form.tahun} onChange={e => setForm(f => ({...f, tahun: +e.target.value}))} className={inputCls} />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1.5 block">Tipe</label>
                <select value={form.tipe} onChange={e => setForm(f => ({...f, tipe: e.target.value}))} className={inputCls}>
                  <option value="">—</option>
                  <option>Film</option><option>FTV</option><option>Series</option>
                  <option>Iklan</option><option>Podcast</option><option>Teater</option><option>Lainnya</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1.5 block">Deskripsi</label>
                <textarea value={form.deskripsi} onChange={e => setForm(f => ({...f, deskripsi: e.target.value}))}
                  rows={2} placeholder="Deskripsi singkat project..." className={inputCls + ' resize-none'} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)}
                className="text-xs text-zinc-400 border border-[#2a2a2a] px-3 py-2 rounded hover:bg-[#2a2a2a] transition-colors">
                Batal
              </button>
              <button type="submit" disabled={createProject.isPending}
                className="text-xs bg-gold text-black font-semibold px-4 py-2 rounded disabled:opacity-50">
                Simpan
              </button>
            </div>
          </form>
        )}

        {/* Project list */}
        {isLoading ? (
          <div className="flex justify-center py-12 text-zinc-600"><Loader2 className="animate-spin" /></div>
        ) : projects?.length === 0 ? (
          <div className="text-center py-16 text-zinc-600">
            <Film size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Belum ada project. Buat project pertama!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {projects?.map((p: { id: string; nama: string; tahun: number; tipe: string; deskripsi: string; talent_projects?: {count:number}[] }) => (
              <div key={p.id}
                className="bg-[#161616] border border-[#2a2a2a] hover:border-[#3a3a3a] rounded p-5 cursor-pointer transition-colors"
                onClick={() => navigate(`/projects/${p.id}`)}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium text-zinc-100">{p.nama}</div>
                    <div className="text-xs text-zinc-500 mt-1">
                      {[p.tahun, p.tipe].filter(Boolean).join(' · ')}
                    </div>
                    {p.deskripsi && <div className="text-sm text-zinc-400 mt-2 leading-relaxed">{p.deskripsi}</div>}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-display text-gold">{p.talent_projects?.[0]?.count ?? 0}</div>
                    <div className="text-[10px] text-zinc-600 uppercase tracking-wider">talent</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
