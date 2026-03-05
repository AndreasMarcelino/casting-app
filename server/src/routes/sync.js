import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { fetchSheetTalents } from '../lib/sheets.js'
import supabase from '../lib/supabase.js'

const router = Router()
router.use(requireAuth)

// POST /api/sync — pull latest data from Google Sheets into Supabase
// Upserts rows: updates existing (matched by sheet_row_id / timestamp),
// inserts new ones. Never overwrites admin-managed fields: status, catatan,
// foto_link (admin override), video_link (admin override).
router.post('/', async (_req, res) => {
  try {
    const sheetRows = await fetchSheetTalents()
    if (!sheetRows.length) return res.json({ inserted: 0, updated: 0, total: 0 })

    // Fetch existing sheet_row_ids from DB
    const { data: existing } = await supabase
      .from('talents')
      .select('id, sheet_row_id, status, catatan, foto_link, video_link')

    const existingMap = new Map(existing?.map(r => [r.sheet_row_id, r]) ?? [])

    const toInsert = []
    const toUpdate = []

    for (const row of sheetRows) {
      const ex = existingMap.get(row.sheet_row_id)
      if (!ex) {
        toInsert.push({ ...row, status: 'Baru' })
      } else {
        // Preserve admin-managed fields
        toUpdate.push({
          ...row,
          id: ex.id,
          status: ex.status,
          catatan: ex.catatan,
          // Preserve admin foto/video overrides if they've set one manually
          foto_link: ex.foto_link || row.foto_link,
          video_link: ex.video_link || row.video_link,
          updated_at: new Date().toISOString(),
        })
      }
    }

    let inserted = 0, updated = 0

    if (toInsert.length) {
      const { error } = await supabase.from('talents').insert(toInsert)
      if (error) throw error
      inserted = toInsert.length
    }

    if (toUpdate.length) {
      for (const row of toUpdate) {
        await supabase.from('talents').update(row).eq('id', row.id)
      }
      updated = toUpdate.length
    }

    res.json({
      inserted,
      updated,
      total: sheetRows.length,
      message: `Sync complete. ${inserted} new, ${updated} updated.`
    })
  } catch (err) {
    console.error('Sync error:', err)
    res.status(500).json({ error: err.message })
  }
})

// GET /api/sync/status — last sync info
router.get('/status', async (_req, res) => {
  const { data } = await supabase
    .from('talents')
    .select('updated_at')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  res.json({ last_sync: data?.updated_at ?? null })
})

export default router
