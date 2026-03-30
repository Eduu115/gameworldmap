import { STATUSES } from './status'

export function uniqueCountriesCount(games) {
  return new Set(games.map((g) => g.countryId)).size
}

export function countByStatus(games) {
  /** @type {Record<string, number>} */
  const res = {}
  for (const s of STATUSES) res[s] = 0
  for (const g of games) res[g.status] = (res[g.status] ?? 0) + 1
  return res
}

export function progressPct(games) {
  if (!games.length) return 0
  const completed = games.filter((g) => g.status === 'completed').length
  return Math.round((completed / games.length) * 100)
}

