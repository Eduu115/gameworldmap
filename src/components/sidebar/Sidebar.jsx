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
        <div className="sidebar-title">Selected country</div>
        <div className="selected-country">
          <span className="flag">{selectedCountry?.flag ?? '🌍'}</span>
          <span>{selectedCountry?.name ?? 'Click a country'}</span>
        </div>
      </div>

      <div className="sidebar-tabs">
        <button
          type="button"
          className={`sidebar-tab ${activeTab === 'games' ? 'active' : ''}`}
          onClick={() => onChangeTab('games')}
        >
          GAMES
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
          <span>GLOBAL PROGRESS</span>
          <span className="ach-val">{progressPct}%</span>
        </div>
        <div className="ach-track">
          <div className="ach-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div className="filter-bar">
        <FilterChip
          status="completed"
          label="✓ Completed"
          active={activeFilters.includes('completed')}
          onClick={() => onToggleFilter('completed')}
        />
        <FilterChip
          status="playing"
          label="▶ Playing"
          active={activeFilters.includes('playing')}
          onClick={() => onToggleFilter('playing')}
        />
        <FilterChip
          status="abandoned"
          label="✕ Dropped"
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
        <StatCell value={stats.completed ?? 0} label="Done" />
        <StatCell value={stats.playing ?? 0} label="Playing" />
        <StatCell value={stats.countries ?? 0} label="Countries" />
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
          <div className="empty-text">Click any country on the map to see its games</div>
        </div>
      </div>
    )
  }

  if (!games.length) {
    return (
      <div className="game-list">
        <div className="empty-state">
          <div className="empty-text">No games match your current filters for this country.</div>
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
        <div className="empty-text">Country notes, studios, and links can live here.</div>
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

