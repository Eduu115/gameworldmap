import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { pool } from './db/index.js'
import authRoutes    from './routes/auth.js'
import gamesRoutes   from './routes/games.js'
import studiosRoutes from './routes/studios.js'
import countriesRoutes from './routes/countries.js'
import tracksRoutes  from './routes/tracks.js'
import syncRoutes    from './routes/sync.js'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

app.use('/api/auth',      authRoutes)
app.use('/api/games',     gamesRoutes)
app.use('/api/studios',   studiosRoutes)
app.use('/api/countries', countriesRoutes)
app.use('/api/tracks',    tracksRoutes)
app.use('/api/sync',      syncRoutes)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})

// Graceful shutdown
process.on('SIGTERM', () => pool.end())
process.on('SIGINT',  () => pool.end())
