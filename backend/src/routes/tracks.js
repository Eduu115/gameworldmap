import { Router } from 'express'
import { query } from '../db/index.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// All track routes require login
router.use(requireAuth)

// GET /api/tracks — all tracks for the current user
router.get('/', async (req, res) => {
  const { rows } = await query(
    `SELECT
        t.id, t.status, t.rating, t.created_at, t.updated_at,
        g.id AS game_id, g.rawg_id, g.title, g.cover_url, g.year, g.country_id
      FROM user_game_tracks t
      JOIN games g ON g.id = t.game_id
      WHERE t.user_id = $1
      ORDER BY t.updated_at DESC`,
    [req.user.sub],
  )
  res.json(rows)
})

// POST /api/tracks — upsert a track
router.post('/', async (req, res) => {
  const { game_id, status, rating } = req.body ?? {}
  if (!game_id || !status) {
    return res.status(400).json({ error: 'game_id and status required' })
  }
  const validStatuses = ['completed', 'playing', 'abandoned', 'wishlist']
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${validStatuses.join(', ')}` })
  }

  const { rows } = await query(
    `INSERT INTO user_game_tracks (user_id, game_id, status, rating, updated_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (user_id, game_id) DO UPDATE
        SET status = EXCLUDED.status,
            rating = EXCLUDED.rating,
            updated_at = NOW()
      RETURNING *`,
    [req.user.sub, game_id, status, rating ?? null],
  )
  res.status(201).json(rows[0])
})

// DELETE /api/tracks/:game_id — remove a track
router.delete('/:game_id', async (req, res) => {
  const { rowCount } = await query(
    'DELETE FROM user_game_tracks WHERE user_id = $1 AND game_id = $2',
    [req.user.sub, req.params.game_id],
  )
  if (rowCount === 0) return res.status(404).json({ error: 'Track not found' })
  res.status(204).end()
})

export default router
