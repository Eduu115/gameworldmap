import { Router } from 'express'
import { query } from '../db/index.js'
import { optionalAuth } from '../middleware/auth.js'

const router = Router()

// GET /api/games
// Query params: country_id, year, search, page, limit
router.get('/', optionalAuth, async (req, res) => {
  const { country_id, year, search, page = 1, limit = 50 } = req.query
  const offset = (Number(page) - 1) * Number(limit)

  const conditions = []
  const params = []

  if (country_id) {
    params.push(country_id)
    conditions.push(`g.country_id = $${params.length}`)
  }
  if (year) {
    params.push(Number(year))
    conditions.push(`g.year = $${params.length}`)
  }
  if (search) {
    params.push(`%${search}%`)
    conditions.push(`g.title ILIKE $${params.length}`)
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  params.push(Number(limit), offset)
  const limitClause = `LIMIT $${params.length - 1} OFFSET $${params.length}`

  const { rows } = await query(
    `SELECT
        g.id, g.rawg_id, g.title, g.slug, g.cover_url, g.year, g.rating, g.country_id,
        COALESCE(
          json_agg(json_build_object('id', s.id, 'name', s.name, 'slug', s.slug))
            FILTER (WHERE s.id IS NOT NULL),
          '[]'
        ) AS studios
      FROM games g
      LEFT JOIN game_studios gs ON gs.game_id = g.id
      LEFT JOIN studios s       ON s.id = gs.studio_id
      ${where}
      GROUP BY g.id
      ORDER BY g.rating DESC NULLS LAST, g.title
      ${limitClause}`,
    params,
  )

  const countParams = params.slice(0, -2)
  const { rows: countRows } = await query(
    `SELECT COUNT(*) FROM games g ${where}`,
    countParams,
  )

  res.json({
    results: rows,
    count: Number(countRows[0].count),
    page: Number(page),
    limit: Number(limit),
  })
})

// GET /api/games/:id
router.get('/:id', optionalAuth, async (req, res) => {
  const { rows } = await query(
    `SELECT
        g.*,
        COALESCE(
          json_agg(json_build_object('id', s.id, 'name', s.name, 'slug', s.slug, 'country_id', s.country_id))
            FILTER (WHERE s.id IS NOT NULL),
          '[]'
        ) AS studios
      FROM games g
      LEFT JOIN game_studios gs ON gs.game_id = g.id
      LEFT JOIN studios s       ON s.id = gs.studio_id
      WHERE g.id = $1
      GROUP BY g.id`,
    [req.params.id],
  )
  if (!rows[0]) return res.status(404).json({ error: 'Game not found' })
  res.json(rows[0])
})

export default router
