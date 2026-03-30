export function NavBar({ activeView, onChangeView, totalGames, totalCountries, onAddGame }) {
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
        <div className="stats-pill" aria-label="Estadísticas">
          <span>{totalGames}</span> juegos &nbsp;|&nbsp; <span>{totalCountries}</span> países
        </div>
        <button type="button" className="add-btn" onClick={onAddGame}>
          + AÑADIR
        </button>
      </div>
    </nav>
  )
}

