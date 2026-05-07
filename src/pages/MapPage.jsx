import { useEffect, useMemo, useRef, useState } from 'react'
import { getCountryLabel } from '../data/countries'
import { CountryTooltip } from '../components/map/CountryTooltip'
import { MapControls } from '../components/map/MapControls'
import { MapLegend } from '../components/map/MapLegend'
import { MapSearch } from '../components/map/MapSearch'
import { WorldMapSvg } from '../components/map/WorldMapSvg'
import { Sidebar } from '../components/sidebar/Sidebar'

function buildGameCountsByCountryId(games) {
  const res = {}
  for (const g of games) {
    if (g.countryId) res[g.countryId] = (res[g.countryId] ?? 0) + 1
  }
  return res
}

export function MapPage({ games, selectedCountryId, onSelectCountryId }) {
  const [search, setSearch] = useState('')
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const viewportRef = useRef(null)
  const dragRef = useRef(null)
  const [viewportSize, setViewportSize] = useState({ w: 0, h: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const ZOOM_MIN = 1
  const ZOOM_MAX = 2.4
  const ZOOM_STEP = 0.2

  const gameCountsByCountryId = useMemo(() => buildGameCountsByCountryId(games), [games])
  const selectedCountry = selectedCountryId ? getCountryLabel(selectedCountryId) : null
  const selectedGames = useMemo(() => {
    if (!selectedCountryId) return []
    return games.filter((g) => g.countryId === selectedCountryId)
  }, [games, selectedCountryId])

  // Search: jump to country or game's country
  useEffect(() => {
    if (!search.trim()) return
    const q = search.trim().toLowerCase()
    const gameMatch = games.find(
      (g) => g.title.toLowerCase().includes(q) || g.studio?.toLowerCase().includes(q),
    )
    if (gameMatch?.countryId) { onSelectCountryId(gameMatch.countryId); return }
    const ids = Object.keys(gameCountsByCountryId)
    const idMatch =
      ids.find((id) => id.toLowerCase().includes(q)) ??
      ids.find((id) => getCountryLabel(id)?.name?.toLowerCase().includes(q))
    if (idMatch) onSelectCountryId(idMatch)
  }, [search, games, gameCountsByCountryId, onSelectCountryId])

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect
      if (r) setViewportSize({ w: r.width, h: r.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const clampPan = (candidate, z = zoom) => {
    const extraX = Math.max(0, (viewportSize.w * (z - 1)) / 2)
    const extraY = Math.max(0, (viewportSize.h * (z - 1)) / 2)
    return {
      x: Math.max(-extraX, Math.min(extraX, candidate.x)),
      y: Math.max(-extraY, Math.min(extraY, candidate.y)),
    }
  }

  useEffect(() => {
    setPan((p) => clampPan(p))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, viewportSize.w, viewportSize.h])

  const onPointerDown = (e) => {
    if (zoom <= 1) return
    e.currentTarget.setPointerCapture?.(e.pointerId)
    dragRef.current = { startX: e.clientX, startY: e.clientY, startPanX: pan.x, startPanY: pan.y }
    setIsPanning(true)
    e.preventDefault()
  }
  const onPointerMove = (e) => {
    const d = dragRef.current
    if (!d) return
    setPan(clampPan({ x: d.startPanX + e.clientX - d.startX, y: d.startPanY + e.clientY - d.startY }))
    e.preventDefault()
  }
  const onPointerUp = () => { dragRef.current = null; setIsPanning(false) }

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
          gamesCount={selectedCountryId ? (gameCountsByCountryId[selectedCountryId] ?? 0) : 0}
        />
        <MapControls
          canZoomIn={zoom < ZOOM_MAX}
          canZoomOut={zoom > ZOOM_MIN}
          onZoomIn={() => setZoom((z) => Math.min(ZOOM_MAX, Math.round((z + ZOOM_STEP) * 10) / 10))}
          onZoomOut={() => setZoom((z) => Math.max(ZOOM_MIN, Math.round((z - ZOOM_STEP) * 10) / 10))}
          onReset={() => { onSelectCountryId(null); setZoom(1); setPan({ x: 0, y: 0 }) }}
        />
        <MapLegend />
      </div>

      <Sidebar
        selectedCountry={selectedCountry}
        games={selectedGames}
        totalGames={games.length}
        totalCountries={Object.keys(gameCountsByCountryId).length}
      />
    </div>
  )
}
