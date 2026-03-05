import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsApi } from '@/lib/api'
import toast from 'react-hot-toast'

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.list,
    staleTime: 1000 * 60,
  })
}

export function useProjectTalents(id: string) {
  return useQuery({
    queryKey: ['project-talents', id],
    queryFn: () => projectsApi.getTalents(id),
    enabled: !!id,
  })
}

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['projects'] }); toast.success('Project dibuat') },
    onError: () => toast.error('Gagal membuat project'),
  })
}

export function useAssignTalent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, ...body }: { projectId: string; talent_id: string; role?: string }) =>
      projectsApi.assignTalent(projectId, body),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['project-talents', vars.projectId] })
      qc.invalidateQueries({ queryKey: ['talents'] })
      toast.success('Talent ditambahkan ke project')
    },
    onError: () => toast.error('Gagal menambahkan talent'),
  })
}

export function useRemoveAssignment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, assignId }: { projectId: string; assignId: string }) =>
      projectsApi.removeAssignment(projectId, assignId),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['project-talents', vars.projectId] })
      toast.success('Talent dikeluarkan dari project')
    },
  })
}
