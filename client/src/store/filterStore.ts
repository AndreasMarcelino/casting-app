import { create } from 'zustand'
import type { FilterState } from '@/types'

const defaults: FilterState = {
  search: '', status: '', gender: '',
  age_min: '', age_max: '',
  tinggi_min: '', tinggi_max: '',
  berat_min: '', berat_max: '',
  pendidikan: '', bahasa: '', baju: '',
  project_id: '',
  page: 1, sort: 'nama', order: 'asc',
}

interface FilterStore {
  filters: FilterState
  setFilter: (key: keyof FilterState, value: string | number) => void
  resetFilters: () => void
  activeCount: () => number
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  filters: { ...defaults },

  setFilter: (key, value) => set(s => ({
    filters: { ...s.filters, [key]: value, ...(key !== 'page' ? { page: 1 } : {}) }
  })),

  resetFilters: () => set({ filters: { ...defaults } }),

  activeCount: () => {
    const f = get().filters
    const keys: (keyof FilterState)[] = [
      'search','status','gender','age_min','age_max',
      'tinggi_min','tinggi_max','berat_min','berat_max',
      'pendidikan','bahasa','baju','project_id'
    ]
    return keys.filter(k => f[k] !== '' && f[k] !== defaults[k]).length
  }
}))
