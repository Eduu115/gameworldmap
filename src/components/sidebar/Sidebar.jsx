import { statusLabel } from '../../utils/status'

export function Sidebar({
  selectedCountry,
  activeTab,
  onChangeTab,
  activeFilters,
  onToggleFilter,
  games,
  stats,
  progressPct,
}) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">País seleccionado</div>
        <div className="selected-country">
          <span className="flag">{selectedCountry?.flag ?? '🌍'}</span>
          <span>{selectedCountry?.name ?? 'Haz clic en un país'}</span>
        </div>
      </div>

      <div className="sidebar-tabs">
        <button
          type="button"
          className={`sidebar-tab ${activeTab === 'games' ? 'active' : ''}`}
          onClick={() => onChangeTab('games')}
        >
          JUEGOS
        </button>
        <button
          type="button"
          className={`sidebar-tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => onChangeTab('info')}
        >
          INFO
        </button>
      </div>

      <div className="achievement-bar">
        <div className="ach-label">
          <span>PROGRESO GLOBAL</span>
          <span className="ach-val">{progressPct}%</span>
        </div>
        <div className="ach-track">
          <div className="ach-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div className="filter-bar">
        <FilterChip
          status="completed"
          label="✓ Completado"
          active={activeFilters.includes('completed')}
          onClick={() => onToggleFilter('completed')}
        />
        <FilterChip
          status="playing"
          label="▶ Jugando"
          active={activeFilters.includes('playing')}
          onClick={() => onToggleFilter('playing')}
        />
        <FilterChip
          status="abandoned"
          label="✕ Abandonado"
          active={activeFilters.includes('abandoned')}
          onClick={() => onToggleFilter('abandoned')}
        />
        <FilterChip
          status="wishlist"
          label="◈ Wishlist"
          active={activeFilters.includes('wishlist')}
          onClick={() => onToggleFilter('wishlist')}
        />
      </div>

      {activeTab === 'games' ? <GameList selectedCountry={selectedCountry} games={games} /> : <SidebarInfo />}

      <div className="sidebar-stats">
        <StatCell value={stats.completed ?? 0} label="Complet." />
        <StatCell value={stats.playing ?? 0} label="Jugando" />
        <StatCell value={stats.countries ?? 0} label="Países" />
      </div>
    </div>
  )
}

function FilterChip({ status, label, active, onClick }) {
  return (
    <button
      type="button"
      className={`filter-chip ${status} ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

function GameList({ selectedCountry, games }) {
  if (!selectedCountry) {
    return (
      <div className="game-list">
        <div className="empty-state">
          <div className="empty-icon">🗺️</div>
          <div className="empty-text">Haz clic en cualquier país del mapa para ver sus juegos</div>
        </div>
      </div>
    )
  }

  if (!games.length) {
    return (
      <div className="game-list">
        <div className="empty-state">
          <div className="empty-icon">🎮</div>
          <div className="empty-text">No hay juegos con los filtros activos para este país.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="game-list">
      {games.map((g, idx) => (
        <div key={`${g.title}-${idx}`} className={`game-card ${g.status}`}>
          <div className="game-title">{g.title}</div>
          <div className="game-meta">
            <span className="game-studio">{g.studio}</span>
            <span className="game-year">{g.year}</span>
            <span className={`status-badge ${g.status}`}>{statusLabel(g.status)}</span>
          </div>
          {g.rating ? (
            <div className="game-rating">
              {g.rating}
              <span className="star">★</span>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

function SidebarInfo() {
  return (
    <div className="game-list">
      <div className="empty-state">
        <div className="empty-icon">ℹ️</div>
        <div className="empty-text">Aquí puedes añadir información del país, estudios destacados, notas, etc.</div>
      </div>
    </div>
  )
}

function StatCell({ value, label }) {
  return (
    <div className="stat-cell">
      <div className="stat-val">{value}</div>
      <div className="stat-lbl">{label}</div>
    </div>
  )
}

