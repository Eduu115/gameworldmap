const BASE = '/api'

async function http(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, opts)
  if (!res.ok) throw new Error(`${opts.method ?? 'GET'} ${path} → ${res.status}`)
  return res.json()
}

// Normalizes the API game shape to what the components expect
export function normalizeGame(g) {
  return {
    id: g.id,
    rawgId: g.rawg_id,
    title: g.title,
    studio: g.studios?.[0]?.name ?? 'Unknown',
    year: g.year,
    rating: g.rating ? Math.round(g.rating) : null,
    countryId: g.country_id,
    cover: g.cover_url,
    status: g.status ?? null,
  }
}

export const api = {
  games(params = {}) {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null)),
    ).toString()
    return http(`/games${qs ? `?${qs}` : ''}`)
  },

  countries() {
    return http('/countries')
  },

  syncStatus() {
    return http('/sync/status')
  },

  // Auth
  register(email, password) {
    return http('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
  },

  login(email, password) {
    return http('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
  },

  // Tracks (requires token)
  tracks(token) {
    return http('/tracks', { headers: { Authorization: `Bearer ${token}` } })
  },

  upsertTrack(token, game_id, status, rating) {
    return http('/tracks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ game_id, status, rating }),
    })
  },

  deleteTrack(token, game_id) {
    return http(`/tracks/${game_id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
  },
}
