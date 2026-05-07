import { useMemo } from 'react'
import { statusLabel } from '../utils/status'

export function ListPage({ games, trackedGames = [], activeFilters, onToggleFilter }) {
  // Full catalog — search filter only, no status filter (status is user-specific)
  const filteredGames = games

  const statusCounts = useMemo(() => ({
    completed: trackedGames.filter(g => g.status === 'completed').length,
    playing: trackedGames.filter(g => g.status === 'playing').length,
    abandoned: trackedGames.filter(g => g.status === 'abandoned').length,
    wishlist: trackedGames.filter(g => g.status === 'wishlist').length,
  }), [trackedGames])

  return (
    <div className="main">
      <div className="map-container">
        <div className="screen-label">ALL GAMES</div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflow: 'auto' }}>
          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            <SummaryCard
              label="Completed"
              value={statusCounts.completed}
              color="#2ecc71"
              bgColor="rgba(46, 204, 113, 0.12)"
            />
            <SummaryCard
              label="Playing"
              value={statusCounts.playing}
              color="#d4a017"
              bgColor="rgba(212, 160, 23, 0.12)"
            />
            <SummaryCard
              label="Dropped"
              value={statusCounts.abandoned}
              color="#c0392b"
              bgColor="rgba(192, 57, 43, 0.12)"
            />
            <SummaryCard
              label="Wishlist"
              value={statusCounts.wishlist}
              color="var(--gray-300)"
              bgColor="var(--gray-700)"
            />
          </div>

          {/* Filter buttons */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <FilterBtn
              label="✓ Completed"
              active={activeFilters.includes('completed')}
              onClick={() => onToggleFilter('completed')}
              status="completed"
            />
            <FilterBtn
              label="▶ Playing"
              active={activeFilters.includes('playing')}
              onClick={() => onToggleFilter('playing')}
              status="playing"
            />
            <FilterBtn
              label="✕ Dropped"
              active={activeFilters.includes('abandoned')}
              onClick={() => onToggleFilter('abandoned')}
              status="abandoned"
            />
            <FilterBtn
              label="◈ Wishlist"
              active={activeFilters.includes('wishlist')}
              onClick={() => onToggleFilter('wishlist')}
              status="wishlist"
            />
          </div>

          {/* Games list */}
          {filteredGames.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="empty-state">
                <div className="empty-icon">🎮</div>
                <div className="empty-text">No games match the selected filters.</div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
              {filteredGames.map((g, idx) => (
                <div key={`${g.title}-${idx}`} className={`game-card ${g.status}`} style={{ height: 'fit-content' }}>
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
          )}
        </div>
      </div>

      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">Summary</div>
          <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '8px' }}>
            {filteredGames.length} Games
          </div>
        </div>

        <div style={{ padding: '16px', flex: 1, overflow: 'auto' }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.5px' }}>
              By Status
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--gray-200)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>✓ Completed</span>
                <span style={{ color: '#2ecc71', fontWeight: 700 }}>{statusCounts.completed}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>▶ Playing</span>
                <span style={{ color: '#d4a017', fontWeight: 700 }}>{statusCounts.playing}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>✕ Dropped</span>
                <span style={{ color: '#c0392b', fontWeight: 700 }}>{statusCounts.abandoned}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>◈ Wishlist</span>
                <span style={{ color: 'var(--gray-300)', fontWeight: 700 }}>{statusCounts.wishlist}</span>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--gray-700)', paddingTop: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.5px' }}>
              Total
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#d4a017' }}>
              {games.length}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--gray-400)', textTransform: 'uppercase', marginTop: '4px', letterSpacing: '0.5px' }}>
              Games Added
            </div>
          </div>
        </div>

        <div className="sidebar-stats">
          <div className="stat-cell">
            <div className="stat-val">{stats.completed ?? 0}</div>
            <div className="stat-lbl">Done</div>
          </div>
          <div className="stat-cell">
            <div className="stat-val">{stats.playing ?? 0}</div>
            <div className="stat-lbl">Playing</div>
          </div>
          <div className="stat-cell">
            <div className="stat-val">{stats.abandoned ?? 0}</div>
            <div className="stat-lbl">Dropped</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ label, value, color, bgColor }) {
  return (
    <div style={{ background: bgColor, borderRadius: '8px', padding: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ fontSize: '24px', fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: '10px', color: 'var(--gray-400)', textTransform: 'uppercase', marginTop: '6px', letterSpacing: '0.5px' }}>{label}</div>
    </div>
  )
}

function FilterBtn({ label, active, onClick, status }) {
  const colors = {
    completed: { text: '#2ecc71', border: 'rgba(46, 204, 113, 0.3)' },
    playing: { text: '#d4a017', border: 'rgba(212, 160, 23, 0.3)' },
    abandoned: { text: '#c0392b', border: 'rgba(192, 57, 43, 0.3)' },
    wishlist: { text: 'var(--gray-300)', border: 'var(--gray-600)' },
  }
  const color = colors[status]

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        fontSize: '11px',
        fontWeight: 700,
        padding: '6px 12px',
        borderRadius: '6px',
        border: `1px solid ${color.border}`,
        color: color.text,
        background: active ? `${color.border}30` : 'transparent',
        cursor: 'pointer',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  )
}
