export function MapControls({ onReset }) {
  return (
    <div className="map-controls">
      <button type="button" className="map-btn" title="Zoom in" disabled>
        +
      </button>
      <button type="button" className="map-btn" title="Zoom out" disabled>
        −
      </button>
      <button type="button" className="map-btn" title="Reset" onClick={onReset}>
        ⌖
      </button>
    </div>
  )
}

