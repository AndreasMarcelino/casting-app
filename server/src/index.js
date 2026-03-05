import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'

import authRoutes from './routes/auth.js'
import talentRoutes from './routes/talents.js'
import projectRoutes from './routes/projects.js'
import syncRoutes from './routes/sync.js'

const app = express()
const PORT = process.env.PORT || 3001

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests, please try again later.' }
}))

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json())
app.use(morgan('dev'))

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/talents', talentRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/sync', syncRoutes)

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'ok', ts: new Date() }))

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

app.listen(PORT, () => console.log(`🎬 Casting API running on http://localhost:${PORT}`))
