export function MapControls({ onZoomIn, onZoomOut, onReset, canZoomIn, canZoomOut }) {
  return (
    <div className="map-controls">
      <button type="button" className="map-btn" title="Acercar" onClick={onZoomIn} disabled={!canZoomIn}>
        +
      </button>
      <button type="button" className="map-btn" title="Alejar" onClick={onZoomOut} disabled={!canZoomOut}>
        −
      </button>
      <button type="button" className="map-btn" title="Reiniciar" onClick={onReset}>
        ⌖
      </button>
    </div>
  )
}

