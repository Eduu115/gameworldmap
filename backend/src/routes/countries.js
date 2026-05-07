import { Router } from 'express'
import { query } from '../db/index.js'

const router = Router()

// GET /api/countries — with game count per country
router.get('/', async (_req, res) => {
  const { rows } = await query(
    `SELECT
        c.id, c.name, c.flag,
        COUNT(g.id)::int AS game_count
      FROM countries c
      LEFT JOIN games g ON g.country_id = c.id
      GROUP BY c.id
      ORDER BY game_count DESC, c.name`,
  )
  res.json(rows)
})

// GET /api/countries/:id
router.get('/:id', async (req, res) => {
  const { rows } = await query('SELECT * FROM countries WHERE id = $1', [req.params.id])
  if (!rows[0]) return res.status(404).json({ error: 'Country not found' })
  res.json(rows[0])
})

// PUT /api/countries/:id  — update country metadata (flag, name)
// This will be useful when we map studios → countries manually
router.put('/:id', async (req, res) => {
  const { name, flag } = req.body ?? {}
  const { rows } = await query(
    `UPDATE countries SET
        name = COALESCE($1, name),
        flag = COALESCE($2, flag)
      WHERE id = $3 RETURNING *`,
    [name, flag, req.params.id],
  )
  if (!rows[0]) return res.status(404).json({ error: 'Country not found' })
  res.json(rows[0])
})

export default router
