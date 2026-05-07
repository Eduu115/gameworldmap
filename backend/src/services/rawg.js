const BASE = 'https://api.rawg.io/api'

function apiUrl(path, params = {}) {
  const url = new URL(`${BASE}${path}`)
  url.searchParams.set('key', process.env.RAWG_API_KEY)
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) url.searchParams.set(k, v)
  }
  return url.toString()
}

async function get(path, params = {}) {
  const res = await fetch(apiUrl(path, params))
  if (!res.ok) throw new Error(`RAWG ${path} → ${res.status}`)
  return res.json()
}

export const rawg = {
  // List games — paginated, up to 40 per page
  games(params = {}) {
    return get('/games', { page_size: 40, ...params })
  },

  // Single game detail (includes developers, publishers)
  game(id) {
    return get(`/games/${id}`)
  },

  // List developers/studios
  developers(params = {}) {
    return get('/developers', { page_size: 40, ...params })
  },

  // Single developer detail
  developer(id) {
    return get(`/developers/${id}`)
  },
}
