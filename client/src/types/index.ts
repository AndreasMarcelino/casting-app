export type TalentStatus = 'Baru' | 'Dipanggil' | 'Lolos' | 'Tidak Lolos' | 'On Hold'

export interface Talent {
  id: string
  sheet_row_id: string
  timestamp: string
  nama: string
  ttl: string
  age: number | null
  gender: string
  email: string
  telp: string
  alamat: string
  pendidikan: string
  tinggi: number | null
  berat: number | null
  rambut: string
  mata: string
  baju: string
  sepatu: string
  pengalaman_info: string
  pengalaman_akting: string
  pengalaman_vo: string
  bahasa: string
  keterampilan: string
  link_portofolio: string
  sosmed: string
  foto_link: string
  video_link: string
  status: TalentStatus
  catatan: string
  created_at: string
  updated_at: string
  talent_projects?: TalentProject[]
}

export interface Project {
  id: string
  nama: string
  tahun: number
  deskripsi: string
  tipe: string
  status: string
  created_at: string
  talent_projects?: { count: number }[]
}

export interface TalentProject {
  id: string
  talent_id: string
  project_id: string
  role: string
  catatan_project: string
  terpilih: boolean
  projects?: Project
  talents?: Partial<Talent>
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: { total: number; page: number; limit: number; pages: number }
}

export interface FilterState {
  search: string
  status: string
  gender: string
  age_min: string
  age_max: string
  tinggi_min: string
  tinggi_max: string
  berat_min: string
  berat_max: string
  pendidikan: string
  bahasa: string
  baju: string
  project_id: string
  page: number
  sort: string
  order: string
}
