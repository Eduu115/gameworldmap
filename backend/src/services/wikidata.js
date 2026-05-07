const SPARQL = 'https://query.wikidata.org/sparql'

// Returns ISO alpha-2 country code for a studio name, or null
export async function lookupStudioCountry(studioName) {
  // Escape quotes for SPARQL injection safety
  const safe = studioName.replace(/\\/g, '\\\\').replace(/"/g, '\\"')

  const query = `
    SELECT ?isoCode WHERE {
      ?item rdfs:label "${safe}"@en .
      ?item wdt:P17 ?country .
      ?country wdt:P297 ?isoCode .
    }
    LIMIT 1
  `

  try {
    const res = await fetch(
      `${SPARQL}?query=${encodeURIComponent(query)}&format=json`,
      { headers: { Accept: 'application/sparql-results+json', 'User-Agent': 'GameworldApp/1.0' } },
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.results?.bindings?.[0]?.isoCode?.value ?? null
  } catch {
    return null
  }
}

// Process studios in parallel with a concurrency cap
export async function lookupMany(studios, concurrency = 8) {
  const results = {} // studioId → isoCode | null
  const queue = [...studios]

  async function worker() {
    while (queue.length) {
      const studio = queue.shift()
      results[studio.id] = await lookupStudioCountry(studio.name)
      // Small pause to be respectful to Wikidata
      await new Promise((r) => setTimeout(r, 120))
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker))
  return results
}
