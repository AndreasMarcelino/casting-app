import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTalent, useUpdateTalent, useDeleteTalent } from '@/hooks/useTalents'
import { useAssignTalent } from '@/hooks/useProjects'
import { useProjects } from '@/hooks/useProjects'
import Avatar from '@/components/Avatar'
import StatusBadge, { STATUS_OPTIONS } from '@/components/StatusBadge'
import type { TalentStatus } from '@/types'
import { ExternalLink, Trash2, Film, Plus, Loader2 } from 'lucide-react'
import clsx from 'clsx'

function InfoItem({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">{label}</div>
      <div className="text-sm text-zinc-200 leading-relaxed">
        {value && value !== '-' && value !== '' ? String(value) : <span className="text-zinc-700">—</span>}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <div className="text-[10px] uppercase tracking-[3px] text-gold mb-4 pb-2 border-b border-[#2a2a2a]">
        {title}
      </div>
      {children}
    </div>
  )
}

export default function TalentDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: talent, isLoading } = useTalent(id!)
  const updateTalent = useUpdateTalent()
  const deleteTalent = useDeleteTalent()
  const assignTalent = useAssignTalent()
  const { data: projects } = useProjects()

  const [catatan, setCatatan] = useState('')
  const [catatanDirty, setCatatanDirty] = useState(false)
  const [showAssign, setShowAssign] = useState(false)
  const [assignProjectId, setAssignProjectId] = useState('')
  const [assignRole, setAssignRole] = useState('')

  // Sync catatan from server on load
  if (talent && !catatanDirty && catatan !== talent.catatan) {
    setCatatan(talent.catatan || '')
  }

  if (isLoading) return (
    <div className="flex-1 flex items-center justify-center text-zinc-600">
      <Loader2 size={24} className="animate-spin" />
    </div>
  )
  if (!talent) return (
    <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">
      Talent tidak ditemukan
    </div>
  )

  const handleStatusChange = (status: TalentStatus) => {
    updateTalent.mutate({ id: talent.id, status })
  }

  const handleSaveCatatan = () => {
    updateTalent.mutate({ id: talent.id, catatan })
    setCatatanDirty(false)
  }

  const handleDelete = async () => {
    if (!confirm(`Hapus ${talent.nama}?`)) return
    await deleteTalent.mutateAsync(talent.id)
    navigate('/')
  }

  const handleAssign = async () => {
    if (!assignProjectId) return
    await assignTalent.mutateAsync({
      projectId: assignProjectId,
      talent_id: talent.id,
      role: assignRole,
    })
    setShowAssign(false)
    setAssignProjectId('')
    setAssignRole('')
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-start gap-6 mb-10">
        <Avatar nama={talent.nama} fotoLink={talent.foto_link} size="lg" />
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-3xl text-zinc-100 leading-tight">{talent.nama}</h1>
          <div className="text-sm text-zinc-500 mt-1">{talent.ttl}</div>

          {/* Status selector */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <StatusBadge status={talent.status as TalentStatus} size="md" />
            <select
              value={talent.status}
              onChange={e => handleStatusChange(e.target.value as TalentStatus)}
              className="bg-[#1e1e1e] border border-[#2a2a2a] text-zinc-300 text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-gold"
            >
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <button
              onClick={() => setShowAssign(v => !v)}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-gold border border-[#2a2a2a] hover:border-gold/40 px-2.5 py-1.5 rounded transition-all"
            >
              <Film size={12} /> Assign ke Project
            </button>

            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 text-xs text-red-500/70 hover:text-red-400 border border-transparent hover:border-red-900/40 px-2.5 py-1.5 rounded transition-all ml-auto"
            >
              <Trash2 size={12} /> Hapus
            </button>
          </div>

          {/* Assign panel */}
          {showAssign && (
            <div className="mt-3 flex gap-2 flex-wrap">
              <select
                value={assignProjectId}
                onChange={e => setAssignProjectId(e.target.value)}
                className="bg-[#0d0d0d] border border-[#2a2a2a] text-zinc-300 text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-gold"
              >
                <option value="">Pilih project...</option>
                {projects?.map((p: { id: string; nama: string; tahun: number }) => (
                  <option key={p.id} value={p.id}>{p.nama} ({p.tahun})</option>
                ))}
              </select>
              <input
                type="text" placeholder="Role (opsional)"
                value={assignRole} onChange={e => setAssignRole(e.target.value)}
                className="bg-[#0d0d0d] border border-[#2a2a2a] text-zinc-300 text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-gold w-36"
              />
              <button
                onClick={handleAssign}
                disabled={!assignProjectId || assignTalent.isPending}
                className="flex items-center gap-1 text-xs bg-gold text-black font-semibold px-3 py-1.5 rounded disabled:opacity-50"
              >
                <Plus size={12} /> Tambah
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Personal */}
      <Section title="Data Pribadi & Kontak">
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          <InfoItem label="Email" value={talent.email} />
          <InfoItem label="Telepon" value={talent.telp} />
          <InfoItem label="Alamat" value={talent.alamat} />
          <InfoItem label="Pendidikan" value={talent.pendidikan} />
          <InfoItem label="Jenis Kelamin" value={talent.gender} />
          <InfoItem label="Media Sosial" value={talent.sosmed} />
        </div>
      </Section>

      {/* Fisik */}
      <Section title="Data Fisik">
        <div className="grid grid-cols-3 gap-x-8 gap-y-5">
          <InfoItem label="Tinggi" value={talent.tinggi ? `${talent.tinggi} cm` : null} />
          <InfoItem label="Berat" value={talent.berat ? `${talent.berat} kg` : null} />
          <InfoItem label="Usia" value={talent.age ? `${talent.age} tahun` : null} />
          <InfoItem label="Warna Rambut" value={talent.rambut} />
          <InfoItem label="Warna Mata" value={talent.mata} />
          <InfoItem label="Ukuran Baju" value={talent.baju} />
          <InfoItem label="Ukuran Sepatu" value={talent.sepatu} />
        </div>
      </Section>

      {/* Pengalaman */}
      <Section title="Pengalaman & Keterampilan">
        <div className="grid grid-cols-1 gap-5">
          <InfoItem label="Info Pengalaman" value={talent.pengalaman_info} />
          <InfoItem label="Pengalaman Akting" value={talent.pengalaman_akting} />
          <InfoItem label="Pengalaman Voice Over" value={talent.pengalaman_vo} />
          <div className="grid grid-cols-2 gap-x-8">
            <InfoItem label="Bahasa" value={talent.bahasa} />
            <InfoItem label="Keterampilan Khusus" value={talent.keterampilan} />
          </div>
          <InfoItem label="Portofolio / Reel" value={talent.link_portofolio} />
        </div>
      </Section>

      {/* Media */}
      <Section title="Media Casting">
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: '🖼️ Foto', link: talent.foto_link, field: 'foto_link' },
            { label: '🎥 Video Casting', link: talent.video_link, field: 'video_link' },
          ].map(({ label, link, field }) => (
            <div key={field} className="bg-[#161616] border border-[#2a2a2a] rounded p-4">
              <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2">{label}</div>
              {link ? (
                <a href={link} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-gold hover:text-gold-light transition-colors break-all">
                  <ExternalLink size={12} className="flex-shrink-0" />
                  Buka link
                </a>
              ) : (
                <div>
                  <span className="text-zinc-700 text-sm italic">Belum ada link</span>
                  <input
                    type="text"
                    placeholder="Paste link Synology Drive / YouTube..."
                    onBlur={e => { if(e.target.value) updateTalent.mutate({ id: talent.id, [field]: e.target.value }) }}
                    className="mt-2 w-full bg-[#0d0d0d] border border-[#2a2a2a] text-zinc-300 text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-gold"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Project History */}
      {talent.talent_projects && talent.talent_projects.length > 0 && (
        <Section title="Riwayat Project">
          <div className="flex flex-col gap-2">
            {talent.talent_projects.map((tp) => (
              <div key={tp.id} className="flex items-center gap-4 bg-[#161616] border border-[#2a2a2a] rounded px-4 py-3">
                <Film size={14} className="text-gold flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-zinc-200">
                    {tp.projects?.nama ?? '—'}
                    <span className="text-zinc-500 font-normal ml-2">({tp.projects?.tahun})</span>
                  </div>
                  {tp.role && <div className="text-xs text-zinc-500 mt-0.5">Role: {tp.role}</div>}
                </div>
                {tp.terpilih && (
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded-full font-semibold">
                    TERPILIH
                  </span>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Catatan Admin */}
      <Section title="Catatan Admin">
        <div className="bg-[#161616] border border-[#2a2a2a] rounded p-4">
          <textarea
            value={catatan}
            onChange={e => { setCatatan(e.target.value); setCatatanDirty(true) }}
            placeholder="Catatan internal tentang talent ini..."
            rows={4}
            className="w-full bg-transparent text-sm text-zinc-300 resize-y focus:outline-none leading-relaxed placeholder:text-zinc-700"
          />
          {catatanDirty && (
            <div className="flex justify-end mt-2">
              <button
                onClick={handleSaveCatatan}
                disabled={updateTalent.isPending}
                className="text-xs bg-gold text-black font-semibold px-3 py-1.5 rounded disabled:opacity-50"
              >
                Simpan Catatan
              </button>
            </div>
          )}
        </div>
      </Section>
    </div>
  )
}
