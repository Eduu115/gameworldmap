import { Router } from 'express'
import { pool } from '../db/index.js'
import { rawg } from '../services/rawg.js'
import { lookupMany } from '../services/wikidata.js'
import { inferStudiosCountries } from '../services/countryInference.js'
import { isoToCountryId } from '../services/countryMapper.js'

const router = Router()

// ── Shared job state ─────────────────────────────────────────────────────────

const syncJob = {
  running: false, phase: null,
  pagesTotal: 0,  pagesDone: 0,
  inserted: 0,    updated: 0,
  studiosInserted: 0, studiosMapped: 0,
  errors: [],
  startedAt: null, finishedAt: null,
}

// ── Phase 1: Sync games ───────────────────────────────────────────────────────

async function upsertGamesBatch(client, rawGames) {
  if (!rawGames.length) return { inserted: 0, updated: 0 }

  const gameValues = [], params = []
  let i = 1
  for (const raw of rawGames) {
    const year = raw.released ? new Date(raw.released).getFullYear() : null
    params.push(raw.id, raw.name, raw.slug, raw.background_image, year, raw.rating ?? null)
    gameValues.push(`($${i},$${i+1},$${i+2},$${i+3},$${i+4},$${i+5})`)
    i += 6
  }

  const { rows } = await client.query(
    `INSERT INTO games (rawg_id, title, slug, cover_url, year, rating)
     VALUES ${gameValues.join(',')}
     ON CONFLICT (rawg_id) DO UPDATE
       SET title=EXCLUDED.title, slug=EXCLUDED.slug, cover_url=EXCLUDED.cover_url,
           year=EXCLUDED.year, rating=EXCLUDED.rating, synced_at=NOW()
     RETURNING id, rawg_id, (xmax=0) AS is_new`,
    params,
  )

  let inserted = 0, updated = 0
  for (const r of rows) r.is_new ? inserted++ : updated++
  return { inserted, updated }
}

async function runGamesSync(maxPages, ordering) {
  for (let page = 1; page <= maxPages; page++) {
    syncJob.pagesDone = page

    let data
    try {
      data = await rawg.games({ page, page_size: 40, ordering })
    } catch (err) {
      syncJob.errors.push(`games page ${page}: ${err.message}`)
      if (err.message.includes('404')) break
      continue
    }
    if (!data.results?.length) break

    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      const { inserted, updated } = await upsertGamesBatch(client, data.results)
      await client.query('COMMIT')
      syncJob.inserted += inserted
      syncJob.updated += updated
    } catch (err) {
      await client.query('ROLLBACK')
      syncJob.errors.push(`games page ${page} DB: ${err.message}`)
    } finally {
      client.release()
    }

    await new Promise((r) => setTimeout(r, 250))
  }
}

// ── Phase 2: Sync studios + link to games ────────────────────────────────────

async function runStudiosSync(maxPages) {
  for (let page = 1; page <= maxPages; page++) {
    let data
    try {
      data = await rawg.developers({ page, page_size: 40 })
    } catch (err) {
      syncJob.errors.push(`studios page ${page}: ${err.message}`)
      if (err.message.includes('404')) break
      continue
    }
    if (!data.results?.length) break

    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      // Bulk upsert studios
      const sv = [], sp = []
      let si = 1
      for (const dev of data.results) {
        sp.push(dev.id, dev.name, dev.slug)
        sv.push(`($${si},$${si+1},$${si+2})`)
        si += 3
      }
      const { rows: studioRows } = await client.query(
        `INSERT INTO studios (rawg_id, name, slug)
         VALUES ${sv.join(',')}
         ON CONFLICT (rawg_id) DO UPDATE SET name=EXCLUDED.name, slug=EXCLUDED.slug
         RETURNING id, rawg_id`,
        sp,
      )
      syncJob.studiosInserted += studioRows.length

      const studioIdMap = {}
      for (const r of studioRows) studioIdMap[r.rawg_id] = r.id

      // Link studios to games using the games[] in each developer response
      const allRawgGameIds = data.results.flatMap((dev) =>
        (dev.games ?? []).map((g) => ({ rawgGameId: g.id, studioDbId: studioIdMap[dev.id] }))
      ).filter((x) => x.studioDbId)

      if (allRawgGameIds.length) {
        // Find which rawg_ids we have in our games table
        const rawgIds = [...new Set(allRawgGameIds.map((x) => x.rawgGameId))]
        const { rows: gameRows } = await client.query(
          `SELECT id, rawg_id FROM games WHERE rawg_id = ANY($1)`,
          [rawgIds],
        )
        const gameIdMap = {}
        for (const r of gameRows) gameIdMap[r.rawg_id] = r.id

        const linkSeen = new Set()
        const lv = [], lp = []
        let li = 1
        for (const { rawgGameId, studioDbId } of allRawgGameIds) {
          const gameDbId = gameIdMap[rawgGameId]
          if (!gameDbId) continue
          const key = `${gameDbId}-${studioDbId}`
          if (linkSeen.has(key)) continue
          linkSeen.add(key)
          lp.push(gameDbId, studioDbId)
          lv.push(`($${li},$${li+1})`)
          li += 2
        }
        if (lv.length) {
          await client.query(
            `INSERT INTO game_studios(game_id,studio_id) VALUES ${lv.join(',')} ON CONFLICT DO NOTHING`,
            lp,
          )
        }
      }

      await client.query('COMMIT')
    } catch (err) {
      await client.query('ROLLBACK')
      syncJob.errors.push(`studios page ${page} DB: ${err.message}`)
    } finally {
      client.release()
    }

    await new Promise((r) => setTimeout(r, 250))
  }
}

// ── Phase 3: Country mapping (Wikidata + Gemini) ─────────────────────────────

async function getUnmappedStudios(limit = 200) {
  const { rows } = await pool.query(
    `SELECT id, name FROM studios WHERE country_id IS NULL ORDER BY id LIMIT $1`,
    [limit],
  )
  return rows
}

async function applyCountryMappings(mappings) {
  if (!mappings.length) return
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    for (const { studioId, countryId } of mappings) {
      await client.query('UPDATE studios SET country_id=$1 WHERE id=$2', [countryId, studioId])
      await client.query(
        `UPDATE games g SET country_id=$1
         FROM game_studios gs
         WHERE gs.game_id=g.id AND gs.studio_id=$2 AND g.country_id IS NULL`,
        [countryId, studioId],
      )
    }
    await client.query('COMMIT')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

async function runCountryMapping(batchSize = 200) {
  while (true) {
    const studios = await getUnmappedStudios(batchSize)
    if (!studios.length) break

    // 1. Wikidata (parallel, 8 concurrent)
    const wikidataResults = await lookupMany(studios, 8)

    const mapped = []
    const unknowns = []
    for (const studio of studios) {
      const countryId = isoToCountryId(wikidataResults[studio.id])
      if (countryId) mapped.push({ studioId: studio.id, countryId })
      else unknowns.push(studio)
    }

    // 2. Gemini for unknowns — batches of 30
    for (let i = 0; i < unknowns.length; i += 30) {
      const chunk = unknowns.slice(i, i + 30)
      const inference = await inferStudiosCountries(chunk.map((s) => s.name))
      for (const studio of chunk) {
        const countryId = isoToCountryId(inference[studio.name])
        if (countryId) mapped.push({ studioId: studio.id, countryId })
      }
    }

    if (mapped.length) {
      await applyCountryMappings(mapped)
      syncJob.studiosMapped += mapped.length
    }

    if (studios.length < batchSize) break
  }
}

// ── Full pipeline runner ──────────────────────────────────────────────────────

async function runFullSync(maxGamePages, maxStudioPages, ordering) {
  syncJob.running = true
  syncJob.pagesTotal = maxGamePages
  syncJob.pagesDone = 0
  syncJob.inserted = 0
  syncJob.updated = 0
  syncJob.studiosInserted = 0
  syncJob.studiosMapped = 0
  syncJob.errors = []
  syncJob.startedAt = new Date().toISOString()
  syncJob.finishedAt = null

  // Phase 1
  syncJob.phase = 'games'
  await runGamesSync(maxGamePages, ordering)

  // Phase 2
  syncJob.phase = 'studios'
  await runStudiosSync(maxStudioPages)

  // Phase 3
  syncJob.phase = 'mapping'
  try { await runCountryMapping(200) }
  catch (err) { syncJob.errors.push(`mapping: ${err.message}`) }

  syncJob.running = false
  syncJob.phase = 'done'
  syncJob.finishedAt = new Date().toISOString()
}

// ── Routes ────────────────────────────────────────────────────────────────────

// POST /api/sync/games?pages=500&studio_pages=200
router.post('/games', (req, res) => {
  if (syncJob.running) return res.status(409).json({ error: 'Sync already running', job: syncJob })

  const pages       = Math.min(Number(req.query.pages        ?? 500), 500)
  const studioPages = Math.min(Number(req.query.studio_pages ?? 200), 500)
  const ordering    = req.query.ordering ?? '-rating'

  runFullSync(pages, studioPages, ordering).catch((err) => {
    syncJob.errors.push(`fatal: ${err.message}`)
    syncJob.running = false
    syncJob.finishedAt = new Date().toISOString()
  })

  res.json({
    message: `Sync started — ${pages} game pages + ${studioPages} studio pages + country mapping`,
    status: '/api/sync/status',
  })
})

// POST /api/sync/map-countries — solo fase 3
router.post('/map-countries', (req, res) => {
  if (syncJob.running) return res.status(409).json({ error: 'Sync already running' })

  syncJob.running = true
  syncJob.phase = 'mapping'
  syncJob.studiosMapped = 0
  syncJob.errors = []
  syncJob.startedAt = new Date().toISOString()
  syncJob.finishedAt = null

  runCountryMapping(Number(req.query.batch ?? 200))
    .then(() => { syncJob.running = false; syncJob.phase = 'done'; syncJob.finishedAt = new Date().toISOString() })
    .catch((err) => { syncJob.errors.push(err.message); syncJob.running = false; syncJob.finishedAt = new Date().toISOString() })

  res.json({ message: 'Country mapping started', status: '/api/sync/status' })
})

// GET /api/sync/status
router.get('/status', async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT
      (SELECT COUNT(*)::int FROM games)   AS games,
      (SELECT COUNT(*)::int FROM studios) AS studios,
      (SELECT COUNT(*)::int FROM games   WHERE country_id IS NOT NULL) AS games_with_country,
      (SELECT COUNT(*)::int FROM studios WHERE country_id IS NOT NULL) AS studios_with_country,
      (SELECT MAX(synced_at) FROM games) AS last_sync`,
  )
  res.json({ db: rows[0], job: syncJob })
})

export default router
