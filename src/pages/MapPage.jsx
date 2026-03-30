import { useEffect, useMemo, useState } from 'react'
import { getCountryLabel } from '../data/countries'
import { countByStatus, progressPct, uniqueCountriesCount } from '../utils/gameStats'
import { CountryTooltip } from '../components/map/CountryTooltip'
import { MapControls } from '../components/map/MapControls'
import { MapLegend } from '../components/map/MapLegend'
import { MapSearch } from '../components/map/MapSearch'
import { WorldMapSvg } from '../components/map/WorldMapSvg'
import { Sidebar } from '../components/sidebar/Sidebar'

function buildGameCountsByCountryId(games) {
  /** @type {Record<string, number>} */
  const res = {}
  for (const g of games) res[g.countryId] = (res[g.countryId] ?? 0) + 1
  return res
}

export function MapPage({ games, selectedCountryId, onSelectCountryId, activeFilters, onToggleFilter }) {
  const [sidebarTab, setSidebarTab] = useState('games')
  const [search, setSearch] = useState('')

  const gameCountsByCountryId = useMemo(() => buildGameCountsByCountryId(games), [games])

  const selectedCountry = selectedCountryId ? getCountryLabel(selectedCountryId) : null
  const selectedGames = useMemo(() => {
    if (!selectedCountryId) return []
    return games.filter((g) => g.countryId === selectedCountryId && activeFilters.includes(g.status))
  }, [games, selectedCountryId, activeFilters])

  const globalStats = useMemo(() => {
    const byStatus = countByStatus(games)
    return {
      ...byStatus,
      countries: uniqueCountriesCount(games),
      progress: progressPct(games),
    }
  }, [games])

  useEffect(() => {
    if (!search.trim()) return

    const q = search.trim().toLowerCase()

    // Search by games
    const gameMatch = games.find((g) => g.title.toLowerCase().includes(q) || g.studio.toLowerCase().includes(q))
    if (gameMatch) {
      onSelectCountryId(gameMatch.countryId)
      return
    }

    // Search by country name
    const ids = Object.keys(gameCountsByCountryId)
    const idMatch =
      ids.find((id) => id.toLowerCase().includes(q)) ??
      ids.find((id) => getCountryLabel(id).name.toLowerCase().includes(q))
    if (idMatch) onSelectCountryId(idMatch)
  }, [search, games, gameCountsByCountryId, onSelectCountryId])

  return (
    <div className="main">
      <div className="map-container">
        <div className="screen-label">MAPA MUNDIAL — HAZ CLIC EN UN PAÍS</div>

        <MapSearch value={search} onChange={setSearch} />

        <WorldMapSvg
          highlightedCountryId={selectedCountryId}
          gameCountsByCountryId={gameCountsByCountryId}
          onSelectCountryId={onSelectCountryId}
        />

        <CountryTooltip
          country={selectedCountry}
          gamesCount={selectedCountryId ? gameCountsByCountryId[selectedCountryId] ?? 0 : 0}
        />

        <MapControls onReset={() => onSelectCountryId(null)} />
        <MapLegend />
      </div>

      <Sidebar
        selectedCountry={selectedCountry}
        activeTab={sidebarTab}
        onChangeTab={setSidebarTab}
        activeFilters={activeFilters}
        onToggleFilter={onToggleFilter}
        games={selectedGames}
        stats={{
          completed: globalStats.completed,
          playing: globalStats.playing,
          countries: globalStats.countries,
        }}
        progressPct={globalStats.progress}
      />
    </div>
  )
}

