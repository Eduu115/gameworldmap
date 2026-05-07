import { Router } from 'express'
import { pool } from '../db/index.js'
import { rawg } from '../services/rawg.js'

const router = Router()

// POST /api/sync/games?pages=5
// Fetches N pages from RAWG and upserts into DB.
// country_id will be null until studios are mapped — that's intentional.
router.post('/games', async (req, res) => {
  const pages = Math.min(Number(req.query.pages ?? 1), 20) // cap at 20 pages (800 games)
  const results = { inserted: 0, updated: 0, errors: [] }

  for (let page = 1; page <= pages; page++) {
    let data
    try {
      data = await rawg.games({ page, ordering: '-rating', page_size: 40 })
    } catch (err) {
      results.errors.push(`page ${page}: ${err.message}`)
      continue
    }

    for (const raw of data.results) {
      const client = await pool.connect()
      try {
        await client.query('BEGIN')

        // Upsert game (without country for now — populated later via studio mapping)
        const year = raw.released ? new Date(raw.released).getFullYear() : null
        const { rows: gameRows } = await client.query(
          `INSERT INTO games (rawg_id, title, slug, cover_url, year, rating)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (rawg_id) DO UPDATE
              SET title = EXCLUDED.title,
                  slug  = EXCLUDED.slug,
                  cover_url = EXCLUDED.cover_url,
                  year = EXCLUDED.year,
                  rating = EXCLUDED.rating,
                  synced_at = NOW()
            RETURNING id, (xmax = 0) AS inserted`,
          [raw.id, raw.name, raw.slug, raw.background_image, year, raw.rating],
        )
        const game = gameRows[0]
        if (game.inserted) results.inserted++
        else results.updated++

        // Upsert studios from the short list (full developers require detail call)
        const devList = [
          ...(raw.developers ?? []),
          ...(raw.publishers ?? []),
        ]
        for (const dev of devList) {
          const { rows: studioRows } = await client.query(
            `INSERT INTO studios (rawg_id, name, slug)
              VALUES ($1, $2, $3)
              ON CONFLICT (rawg_id) DO UPDATE
                SET name = EXCLUDED.name, slug = EXCLUDED.slug
              RETURNING id`,
            [dev.id, dev.name, dev.slug],
          )
          await client.query(
            `INSERT INTO game_studios (game_id, studio_id)
              VALUES ($1, $2)
              ON CONFLICT DO NOTHING`,
            [game.id, studioRows[0].id],
          )
        }

        await client.query('COMMIT')
      } catch (err) {
        await client.query('ROLLBACK')
        results.errors.push(`game rawg:${raw.id}: ${err.message}`)
      } finally {
        client.release()
      }
    }
  }

  res.json({ pages_synced: pages, ...results })
})

// POST /api/sync/developers?pages=5
// Fetches developer pages from RAWG to populate studios table.
router.post('/developers', async (req, res) => {
  const pages = Math.min(Number(req.query.pages ?? 1), 20)
  const results = { inserted: 0, updated: 0, errors: [] }

  for (let page = 1; page <= pages; page++) {
    let data
    try {
      data = await rawg.developers({ page })
    } catch (err) {
      results.errors.push(`page ${page}: ${err.message}`)
      continue
    }

    for (const dev of data.results) {
      try {
        const { rows } = await pool.query(
          `INSERT INTO studios (rawg_id, name, slug)
            VALUES ($1, $2, $3)
            ON CONFLICT (rawg_id) DO UPDATE
              SET name = EXCLUDED.name, slug = EXCLUDED.slug
            RETURNING id, (xmax = 0) AS inserted`,
          [dev.id, dev.name, dev.slug],
        )
        if (rows[0].inserted) results.inserted++
        else results.updated++
      } catch (err) {
        results.errors.push(`dev rawg:${dev.id}: ${err.message}`)
      }
    }
  }

  res.json({ pages_synced: pages, ...results })
})

// GET /api/sync/status
router.get('/status', async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT
        (SELECT COUNT(*) FROM games)::int AS games,
        (SELECT COUNT(*) FROM studios)::int AS studios,
        (SELECT COUNT(*) FROM games WHERE country_id IS NOT NULL)::int AS games_with_country,
        (SELECT COUNT(*) FROM studios WHERE country_id IS NOT NULL)::int AS studios_with_country,
        (SELECT MAX(synced_at) FROM games) AS last_sync`,
  )
  res.json(rows[0])
})

export default router
