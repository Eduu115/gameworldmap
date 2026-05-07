import { statusLabel } from '../../utils/status'

export function Sidebar({
  selectedCountry,
  activeTab,
  onChangeTab,
  activeFilters,
  onToggleFilter,
  games,
  allGames,
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
          className={`sidebar-tab ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => onChangeTab('list')}
        >
          LIST
        </button>
        <button
          type="button"
          className={`sidebar-tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => onChangeTab('stats')}
        >
          STATS
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

      {activeTab === 'games' && <GameList selectedCountry={selectedCountry} games={games} />}
      {activeTab === 'list' && <ListViewAll games={allGames} stats={stats} />}
      {activeTab === 'stats' && <StatsView stats={stats} />}

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

function ListViewAll({ games, stats }) {
  const countByStatus = (status) => games.filter(g => g.status === status).length
  const completed = countByStatus('completed')
  const playing = countByStatus('playing')
  const abandoned = countByStatus('abandoned')
  const wishlist = countByStatus('wishlist')

  return (
    <div className="game-list">
      <div style={{ padding: '12px 8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
          <div style={{ background: 'rgba(46, 204, 113, 0.12)', borderRadius: '6px', padding: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#2ecc71' }}>{completed}</div>
            <div style={{ fontSize: '10px', color: 'var(--gray-400)', textTransform: 'uppercase', marginTop: '4px' }}>Completed</div>
          </div>
          <div style={{ background: 'rgba(212, 160, 23, 0.12)', borderRadius: '6px', padding: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#d4a017' }}>{playing}</div>
            <div style={{ fontSize: '10px', color: 'var(--gray-400)', textTransform: 'uppercase', marginTop: '4px' }}>Playing</div>
          </div>
          <div style={{ background: 'rgba(192, 57, 43, 0.12)', borderRadius: '6px', padding: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#c0392b' }}>{abandoned}</div>
            <div style={{ fontSize: '10px', color: 'var(--gray-400)', textTransform: 'uppercase', marginTop: '4px' }}>Dropped</div>
          </div>
          <div style={{ background: 'var(--gray-700)', borderRadius: '6px', padding: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gray-300)' }}>{wishlist}</div>
            <div style={{ fontSize: '10px', color: 'var(--gray-400)', textTransform: 'uppercase', marginTop: '4px' }}>Wishlist</div>
          </div>
        </div>
      </div>
      {games.length === 0 ? (
        <div className="empty-state">
          <div className="empty-text">No games added yet.</div>
        </div>
      ) : (
        games.map((g, idx) => (
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
        ))
      )}
    </div>
  )
}

function StatsView({ stats }) {
  return (
    <div className="game-list">
      <div style={{ padding: '16px 8px' }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.5px' }}>
            Global Stats
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <StatBox label="Total Games" value={stats.completed + (stats.playing ?? 0)} />
            <StatBox label="Countries" value={stats.countries ?? 0} />
            <StatBox label="Completed" value={stats.completed ?? 0} color="#2ecc71" />
            <StatBox label="Playing" value={stats.playing ?? 0} color="#d4a017" />
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--gray-700)', paddingTop: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.5px' }}>
            Game Breakdown
          </div>
          <div style={{ fontSize: '12px', color: 'var(--gray-200)', lineHeight: '1.8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span>✓ Completed</span>
              <span style={{ color: '#2ecc71', fontWeight: 700 }}>{stats.completed ?? 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span>▶ Playing</span>
              <span style={{ color: '#d4a017', fontWeight: 700 }}>{stats.playing ?? 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>📍 Countries</span>
              <span style={{ color: '#b0b0c0', fontWeight: 700 }}>{stats.countries ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value, color = '#d4a017' }) {
  return (
    <div style={{ background: 'var(--gray-700)', borderRadius: '6px', padding: '10px', textAlign: 'center' }}>
      <div style={{ fontSize: '14px', fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: '9px', color: 'var(--gray-400)', textTransform: 'uppercase', marginTop: '4px', letterSpacing: '0.5px' }}>{label}</div>
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

