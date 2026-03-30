export function MapLegend() {
  return (
    <div className="map-legend">
      <div className="legend-title">Leyenda</div>
      <div className="legend-item">
        <div
          className="legend-dot"
          style={{ background: '#D4A017', boxShadow: '0 0 6px rgba(212,160,23,0.5)' }}
        />
        <span>Muchos juegos</span>
      </div>
      <div className="legend-item">
        <div className="legend-dot" style={{ background: '#9B7410' }} />
        <span>Algún juego</span>
      </div>
      <div className="legend-item">
        <div className="legend-dot" style={{ background: '#3A3A45' }} />
        <span>Sin juegos</span>
      </div>
    </div>
  )
}

