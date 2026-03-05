import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import supabase from '../lib/supabase.js'

const router = Router()

router.post('/login',
  body('username').notEmpty(),
  body('password').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { username, password } = req.body

    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .single()

    if (error || !admin) return res.status(401).json({ error: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, admin.password_hash)
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ token, user: { id: admin.id, username: admin.username, role: admin.role } })
  }
)

router.post('/setup-admin',
  body('username').isLength({ min: 3 }),
  body('password').isLength({ min: 8 }),
  body('setup_key').notEmpty(),
  async (req, res) => {
    // One-time setup protected by a secret key in .env
    if (req.body.setup_key !== process.env.SETUP_KEY) {
      return res.status(403).json({ error: 'Invalid setup key' })
    }

    const { username, password } = req.body
    const password_hash = await bcrypt.hash(password, 12)

    const { data, error } = await supabase
      .from('admins')
      .insert({ username, password_hash, role: 'admin' })
      .select('id, username, role')
      .single()

    if (error) return res.status(400).json({ error: error.message })
    res.status(201).json({ message: 'Admin created', admin: data })
  }
)

export default router
