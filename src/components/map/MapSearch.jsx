export function MapSearch({ value, onChange }) {
  return (
    <div className="map-search">
      <span className="search-icon" aria-hidden="true">
        ⌕
      </span>
      <input
        type="text"
        value={value}
        placeholder="Buscar país o juego..."
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

