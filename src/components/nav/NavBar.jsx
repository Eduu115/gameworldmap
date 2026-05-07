export function NavBar({ activeView, onChangeView, totalGames, totalCountries, user, onLogin }) {
  return (
    <nav>
      <div className="logo" aria-label="Gameworld">
        <div className="logo-dot" aria-hidden="true" />
        GAMEWORLD
      </div>

      <div className="nav-tabs" role="tablist" aria-label="Vistas">
        <button
          type="button"
          className={`nav-tab ${activeView === 'map' ? 'active' : ''}`}
          onClick={() => onChangeView('map')}
        >
          MAP
        </button>
        <button
          type="button"
          className={`nav-tab ${activeView === 'list' ? 'active' : ''}`}
          onClick={() => onChangeView('list')}
        >
          LIST
        </button>
        <button
          type="button"
          className={`nav-tab ${activeView === 'stats' ? 'active' : ''}`}
          onClick={() => onChangeView('stats')}
        >
          STATS
        </button>
      </div>

      <div className="nav-right">
        <div className="stats-pill" aria-label="Stats">
          <span>{totalGames}</span> games &nbsp;|&nbsp; <span>{totalCountries}</span> countries
        </div>
        {user ? (
          <div style={{ fontSize: 12, color: 'var(--yellow)', fontFamily: 'monospace' }}>
            {user.email.split('@')[0]}
          </div>
        ) : (
          <button type="button" className="add-btn" onClick={onLogin}>
            LOG IN
          </button>
        )}
      </div>
    </nav>
  )
}
