export function MapLegend() {
  return (
    <div className="map-legend">
      <div className="legend-title">Legend</div>
      <div className="legend-item">
        <div
          className="legend-dot"
          style={{ background: '#D4A017', boxShadow: '0 0 6px rgba(212,160,23,0.5)' }}
        />
        <span>Many games</span>
      </div>
      <div className="legend-item">
        <div className="legend-dot" style={{ background: '#9B7410' }} />
        <span>Some games</span>
      </div>
      <div className="legend-item">
        <div className="legend-dot" style={{ background: '#3A3A45' }} />
        <span>No games</span>
      </div>
    </div>
  )
}

