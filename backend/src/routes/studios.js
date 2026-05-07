import { Router } from 'express'
import { query } from '../db/index.js'

const router = Router()

// GET /api/studios
// Query params: country_id, search, page, limit
router.get('/', async (req, res) => {
  const { country_id, search, page = 1, limit = 50 } = req.query
  const offset = (Number(page) - 1) * Number(limit)

  const conditions = []
  const params = []

  if (country_id) {
    params.push(country_id)
    conditions.push(`s.country_id = $${params.length}`)
  }
  if (search) {
    params.push(`%${search}%`)
    conditions.push(`s.name ILIKE $${params.length}`)
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  params.push(Number(limit), offset)

  const { rows } = await query(
    `SELECT
        s.id, s.rawg_id, s.name, s.slug, s.country_id,
        c.name AS country_name, c.flag AS country_flag,
        COUNT(gs.game_id)::int AS game_count
      FROM studios s
      LEFT JOIN countries c  ON c.id = s.country_id
      LEFT JOIN game_studios gs ON gs.studio_id = s.id
      ${where}
      GROUP BY s.id, c.name, c.flag
      ORDER BY game_count DESC, s.name
      LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params,
  )

  res.json(rows)
})

// PATCH /api/studios/:id/country — assign country to a studio manually
router.patch('/:id/country', async (req, res) => {
  const { country_id } = req.body ?? {}
  if (!country_id) return res.status(400).json({ error: 'country_id required' })

  const { rows } = await query(
    `UPDATE studios SET country_id = $1 WHERE id = $2 RETURNING *`,
    [country_id, req.params.id],
  )
  if (!rows[0]) return res.status(404).json({ error: 'Studio not found' })
  res.json(rows[0])
})

export default router
