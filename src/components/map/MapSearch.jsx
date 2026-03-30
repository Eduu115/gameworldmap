export function MapSearch({ value, onChange }) {
  return (
    <div className="map-search">
      <span className="search-icon" aria-hidden="true">
        ⌕
      </span>
      <input
        type="text"
        value={value}
        placeholder="Search country or game..."
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

