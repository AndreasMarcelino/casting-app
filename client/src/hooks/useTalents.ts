import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { talentsApi } from '@/lib/api'
import { useFilterStore } from '@/store/filterStore'
import type { Talent } from '@/types'
import toast from 'react-hot-toast'

export function useTalents() {
  const { filters } = useFilterStore()

  // Strip empty params
  const params = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v !== '' && v !== null)
  )

  return useQuery({
    queryKey: ['talents', params],
    queryFn: () => talentsApi.list(params),
    staleTime: 1000 * 30,
  })
}

export function useTalent(id: string) {
  return useQuery({
    queryKey: ['talent', id],
    queryFn: () => talentsApi.get(id),
    enabled: !!id,
  })
}

export function useUpdateTalent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & Partial<Talent>) =>
      talentsApi.update(id, body),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['talents'] })
      qc.setQueryData(['talent', data.id], data)
      toast.success('Data tersimpan')
    },
    onError: () => toast.error('Gagal menyimpan'),
  })
}

export function useDeleteTalent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => talentsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['talents'] })
      toast.success('Talent dihapus')
    },
    onError: () => toast.error('Gagal menghapus'),
  })
}
