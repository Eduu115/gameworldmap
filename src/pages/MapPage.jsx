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
  const [zoom, setZoom] = useState(1)
  const ZOOM_MIN = 1
  const ZOOM_MAX = 2.4
  const ZOOM_STEP = 0.2

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
        <div className="screen-label">WORLD MAP — CLICK A COUNTRY</div>

        <MapSearch value={search} onChange={setSearch} />

        <div className="map-viewport" style={{ transform: `scale(${zoom})` }}>
          <WorldMapSvg
            highlightedCountryId={selectedCountryId}
            gameCountsByCountryId={gameCountsByCountryId}
            onSelectCountryId={onSelectCountryId}
          />
        </div>

        <CountryTooltip
          country={selectedCountry}
          gamesCount={selectedCountryId ? gameCountsByCountryId[selectedCountryId] ?? 0 : 0}
        />

        <MapControls
          canZoomIn={zoom < ZOOM_MAX}
          canZoomOut={zoom > ZOOM_MIN}
          onZoomIn={() => setZoom((z) => Math.min(ZOOM_MAX, Math.round((z + ZOOM_STEP) * 10) / 10))}
          onZoomOut={() => setZoom((z) => Math.max(ZOOM_MIN, Math.round((z - ZOOM_STEP) * 10) / 10))}
          onReset={() => {
            onSelectCountryId(null)
            setZoom(1)
          }}
        />
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

