import { useEffect, useMemo, useRef, useState } from 'react'
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
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const viewportRef = useRef(null)
  const dragRef = useRef(
    /** @type {null | { startX: number; startY: number; startPanX: number; startPanY: number }} */ (null),
  )
  const [viewportSize, setViewportSize] = useState({ w: 0, h: 0 })
  const ZOOM_MIN = 1
  const ZOOM_MAX = 2.4
  const ZOOM_STEP = 0.2
  const [isPanning, setIsPanning] = useState(false)

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

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return

    const ro = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect
      if (!r) return
      setViewportSize({ w: r.width, h: r.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const clampPan = (candidate, z = zoom) => {
    const extraX = Math.max(0, (viewportSize.w * (z - 1)) / 2)
    const extraY = Math.max(0, (viewportSize.h * (z - 1)) / 2)
    const maxX = extraX
    const maxY = extraY
    return {
      x: Math.max(-maxX, Math.min(maxX, candidate.x)),
      y: Math.max(-maxY, Math.min(maxY, candidate.y)),
    }
  }

  useEffect(() => {
    // Keep pan valid when zoom changes (or when viewport resizes)
    setPan((p) => clampPan(p))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, viewportSize.w, viewportSize.h])

  const onPointerDown = (e) => {
    if (zoom <= 1) return
    if (!(e.currentTarget instanceof HTMLElement)) return
    e.currentTarget.setPointerCapture?.(e.pointerId)
    dragRef.current = { startX: e.clientX, startY: e.clientY, startPanX: pan.x, startPanY: pan.y }
    setIsPanning(true)
    e.preventDefault()
  }

  const onPointerMove = (e) => {
    const d = dragRef.current
    if (!d) return
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    setPan(clampPan({ x: d.startPanX + dx, y: d.startPanY + dy }))
    e.preventDefault()
  }

  const onPointerUp = () => {
    dragRef.current = null
    setIsPanning(false)
  }

  return (
    <div className="main">
      <div className="map-container">
        <div className="screen-label">WORLD MAP — CLICK A COUNTRY</div>

        <MapSearch value={search} onChange={setSearch} />

        <div
          ref={viewportRef}
          className={`map-viewport ${zoom > 1 ? 'is-pannable' : ''} ${isPanning ? 'is-panning' : ''}`}
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
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
            setPan({ x: 0, y: 0 })
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

