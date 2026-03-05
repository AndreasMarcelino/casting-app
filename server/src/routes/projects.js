import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import { requireAuth } from '../middleware/auth.js'
import supabase from '../lib/supabase.js'

const router = Router()
router.use(requireAuth)

// GET /api/projects
router.get('/', async (_req, res) => {
  const { data, error } = await supabase
    .from('projects')
    .select(`*, talent_projects(count)`)
    .order('tahun', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// POST /api/projects
router.post('/',
  body('nama').notEmpty().trim(),
  body('tahun').isInt({ min: 2000, max: 2100 }),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { nama, tahun, deskripsi, tipe } = req.body
    const { data, error } = await supabase
      .from('projects')
      .insert({ nama, tahun, deskripsi, tipe })
      .select()
      .single()

    if (error) return res.status(400).json({ error: error.message })
    res.status(201).json(data)
  }
)

// PATCH /api/projects/:id
router.patch('/:id', async (req, res) => {
  const allowed = ['nama', 'tahun', 'deskripsi', 'tipe', 'status']
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([k]) => allowed.includes(k))
  )
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', req.params.id)
    .select()
    .single()

  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
})

// DELETE /api/projects/:id
router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('projects').delete().eq('id', req.params.id)
  if (error) return res.status(400).json({ error: error.message })
  res.json({ message: 'Deleted' })
})

// ── Talent ↔ Project assignments ─────────────────────────────────────────────

// GET /api/projects/:id/talents
router.get('/:id/talents', async (req, res) => {
  const { data, error } = await supabase
    .from('talent_projects')
    .select(`*, talents(id, nama, gender, age, tinggi, berat, foto_link, status)`)
    .eq('project_id', req.params.id)

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// POST /api/projects/:id/talents — assign talent to project
router.post('/:id/talents',
  body('talent_id').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { talent_id, role, catatan_project, terpilih } = req.body
    const { data, error } = await supabase
      .from('talent_projects')
      .insert({
        project_id: req.params.id,
        talent_id,
        role: role || '',
        catatan_project: catatan_project || '',
        terpilih: terpilih ?? false,
      })
      .select()
      .single()

    if (error) return res.status(400).json({ error: error.message })
    res.status(201).json(data)
  }
)

// PATCH /api/projects/:id/talents/:assignId
router.patch('/:id/talents/:assignId', async (req, res) => {
  const allowed = ['role', 'catatan_project', 'terpilih']
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([k]) => allowed.includes(k))
  )
  const { data, error } = await supabase
    .from('talent_projects')
    .update(updates)
    .eq('id', req.params.assignId)
    .select()
    .single()

  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
})

// DELETE /api/projects/:id/talents/:assignId
router.delete('/:id/talents/:assignId', async (req, res) => {
  const { error } = await supabase
    .from('talent_projects').delete().eq('id', req.params.assignId)
  if (error) return res.status(400).json({ error: error.message })
  res.json({ message: 'Removed from project' })
})

export default router
