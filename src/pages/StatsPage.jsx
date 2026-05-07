import { useMemo } from 'react'
import { countByStatus, progressPct as calculateProgress } from '../utils/gameStats'

export function StatsPage({ games, trackedGames = [] }) {
  const stats = useMemo(() => countByStatus(trackedGames), [trackedGames])
  const progress = useMemo(() => calculateProgress(trackedGames), [trackedGames])

  const gamesByCountry = useMemo(() => {
    const result = {}
    for (const game of games) {
      if (!result[game.countryId]) result[game.countryId] = 0
      result[game.countryId]++
    }
    return result
  }, [games])

  const gamesByStudio = useMemo(() => {
    const result = {}
    for (const game of games) {
      if (!result[game.studio]) result[game.studio] = 0
      result[game.studio]++
    }
    return Object.entries(result)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
  }, [games])

  const gamesByYear = useMemo(() => {
    const result = {}
    for (const game of games) {
      if (!result[game.year]) result[game.year] = 0
      result[game.year]++
    }
    return Object.entries(result)
      .sort(([a], [b]) => parseInt(b) - parseInt(a))
      .slice(0, 10)
  }, [games])

  const avgRating = useMemo(() => {
    const rated = games.filter(g => g.rating)
    if (rated.length === 0) return 0
    return (rated.reduce((sum, g) => sum + g.rating, 0) / rated.length).toFixed(1)
  }, [games])

  return (
    <div className="main">
      <div className="map-container">
        <div className="screen-label">STATISTICS</div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', overflow: 'auto', height: '100%' }}>
          {/* Main stats */}
          <div>
            <h2 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', color: 'var(--yellow)' }}>
              Global Overview
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <StatCard label="Total Games" value={games.length} color="#d4a017" />
              <StatCard label="Countries" value={Object.keys(gamesByCountry).length} color="#2ecc71" />
              <StatCard label="Studios" value={gamesByStudio.length} color="#5c5c6e" />
              <StatCard label="Avg Rating" value={avgRating} color="#e8b93a" />
            </div>
          </div>

          {/* Progress */}
          <div>
            <h2 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', color: 'var(--yellow)' }}>
              Completion Status
            </h2>
            <div style={{ background: 'var(--gray-700)', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                <span>Overall Progress</span>
                <span style={{ color: '#d4a017', fontWeight: 700 }}>{progress}%</span>
              </div>
              <div style={{ background: 'var(--gray-800)', borderRadius: '4px', height: '24px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #2ecc71 0%, #d4a017 50%, #c0392b 100%)',
                    width: `${progress}%`,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Status breakdown */}
          <div>
            <h2 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', color: 'var(--yellow)' }}>
              By Status
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <StatusBox
                label="Completed"
                value={stats.completed ?? 0}
                color="#2ecc71"
                bgColor="rgba(46, 204, 113, 0.12)"
              />
              <StatusBox
                label="Playing"
                value={stats.playing ?? 0}
                color="#d4a017"
                bgColor="rgba(212, 160, 23, 0.12)"
              />
              <StatusBox
                label="Dropped"
                value={stats.abandoned ?? 0}
                color="#c0392b"
                bgColor="rgba(192, 57, 43, 0.12)"
              />
              <StatusBox
                label="Wishlist"
                value={stats.wishlist ?? 0}
                color="var(--gray-300)"
                bgColor="var(--gray-700)"
              />
            </div>
          </div>

          {/* Top studios */}
          <div>
            <h2 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', color: 'var(--yellow)' }}>
              Top Studios
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {gamesByStudio.map(([studio, count]) => (
                <div
                  key={studio}
                  style={{
                    background: 'var(--gray-700)',
                    padding: '12px',
                    borderRadius: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '12px',
                  }}
                >
                  <span>{studio}</span>
                  <span style={{ color: '#d4a017', fontWeight: 700 }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* By year */}
          <div>
            <h2 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', color: 'var(--yellow)' }}>
              By Year
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
              {gamesByYear.map(([year, count]) => (
                <div
                  key={year}
                  style={{
                    background: 'var(--gray-700)',
                    padding: '12px',
                    borderRadius: '6px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#d4a017' }}>{count}</div>
                  <div style={{ fontSize: '10px', color: 'var(--gray-400)', marginTop: '4px' }}>{year}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">Quick Stats</div>
        </div>

        <div style={{ padding: '16px', flex: 1, overflow: 'auto' }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
              Collection
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: 'var(--gray-200)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Games</span>
                <span style={{ color: '#d4a017', fontWeight: 700 }}>{games.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Countries</span>
                <span style={{ color: '#2ecc71', fontWeight: 700 }}>{Object.keys(gamesByCountry).length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Studios</span>
                <span style={{ color: '#5c5c6e', fontWeight: 700 }}>{gamesByStudio.length}</span>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--gray-700)', paddingTop: '16px', marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
              Status
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--gray-200)' }}>✓ Completed</span>
                <span style={{ color: '#2ecc71', fontWeight: 700 }}>{stats.completed ?? 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--gray-200)' }}>▶ Playing</span>
                <span style={{ color: '#d4a017', fontWeight: 700 }}>{stats.playing ?? 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--gray-200)' }}>✕ Dropped</span>
                <span style={{ color: '#c0392b', fontWeight: 700 }}>{stats.abandoned ?? 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--gray-200)' }}>◈ Wishlist</span>
                <span style={{ color: 'var(--gray-300)', fontWeight: 700 }}>{stats.wishlist ?? 0}</span>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--gray-700)', paddingTop: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
              Average
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#e8b93a', marginBottom: '4px' }}>
              {avgRating}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Rating
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
            <div className="stat-val">{progress}%</div>
            <div className="stat-lbl">Progress</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: 'var(--gray-700)', borderRadius: '8px', padding: '16px', textAlign: 'center', border: '1px solid var(--gray-600)' }}>
      <div style={{ fontSize: '24px', fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: '10px', color: 'var(--gray-400)', textTransform: 'uppercase', marginTop: '8px', letterSpacing: '0.5px' }}>{label}</div>
    </div>
  )
}

function StatusBox({ label, value, color, bgColor }) {
  return (
    <div style={{ background: bgColor, borderRadius: '8px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ fontSize: '28px', fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: '11px', color: 'var(--gray-400)', textTransform: 'uppercase', marginTop: '8px', letterSpacing: '0.5px' }}>{label}</div>
    </div>
  )
}
