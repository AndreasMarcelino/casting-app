import { Router } from 'express'
import { body, query, validationResult } from 'express-validator'
import { requireAuth } from '../middleware/auth.js'
import supabase from '../lib/supabase.js'

const router = Router()
router.use(requireAuth)

// GET /api/talents — list with filters
router.get('/', async (req, res) => {
  try {
    const {
      search, status, gender,
      age_min, age_max,
      tinggi_min, tinggi_max,
      berat_min, berat_max,
      pendidikan, bahasa, baju,
      project_id,
      page = 1, limit = 50,
      sort = 'nama', order = 'asc'
    } = req.query

    let q = supabase.from('talents').select(`
      *,
      talent_projects(
        id, role, catatan_project,
        projects(id, nama, tahun)
      )
    `, { count: 'exact' })

    // Text search
    if (search) {
      q = q.or(`nama.ilike.%${search}%,keterampilan.ilike.%${search}%,bahasa.ilike.%${search}%,pengalaman_akting.ilike.%${search}%,alamat.ilike.%${search}%`)
    }

    // Enum filters
    if (status)     q = q.eq('status', status)
    if (gender)     q = q.ilike('gender', `%${gender}%`)
    if (pendidikan) q = q.ilike('pendidikan', `%${pendidikan}%`)
    if (bahasa)     q = q.ilike('bahasa', `%${bahasa}%`)
    if (baju)       q = q.ilike('baju', `%${baju}%`)

    // Range filters
    if (age_min)    q = q.gte('age', parseInt(age_min))
    if (age_max)    q = q.lte('age', parseInt(age_max))
    if (tinggi_min) q = q.gte('tinggi', parseFloat(tinggi_min))
    if (tinggi_max) q = q.lte('tinggi', parseFloat(tinggi_max))
    if (berat_min)  q = q.gte('berat', parseFloat(berat_min))
    if (berat_max)  q = q.lte('berat', parseFloat(berat_max))

    // Filter by project
    if (project_id) {
      q = q.eq('talent_projects.project_id', project_id)
    }

    // Sort & pagination
    const allowedSort = ['nama', 'age', 'tinggi', 'berat', 'status', 'created_at']
    const safeSort = allowedSort.includes(sort) ? sort : 'nama'
    const from = (parseInt(page) - 1) * parseInt(limit)
    const to = from + parseInt(limit) - 1

    q = q.order(safeSort, { ascending: order !== 'desc' }).range(from, to)

    const { data, error, count } = await q
    if (error) throw error

    res.json({
      data,
      meta: { total: count, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(count / limit) }
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/talents/:id
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('talents')
    .select(`
      *,
      talent_projects(
        id, role, catatan_project, terpilih,
        projects(id, nama, tahun, deskripsi)
      )
    `)
    .eq('id', req.params.id)
    .single()

  if (error) return res.status(404).json({ error: 'Talent not found' })
  res.json(data)
})

// PATCH /api/talents/:id — update status, catatan, media links
router.patch('/:id',
  body('status').optional().isIn(['Baru', 'Dipanggil', 'Lolos', 'Tidak Lolos', 'On Hold']),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const allowed = ['status', 'catatan', 'foto_link', 'video_link']
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([k]) => allowed.includes(k))
    )
    updates.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('talents')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  }
)

// DELETE /api/talents/:id
router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('talents').delete().eq('id', req.params.id)
  if (error) return res.status(400).json({ error: error.message })
  res.json({ message: 'Deleted' })
})

export default router
