export function Sidebar({ selectedCountry, games = [], totalGames = 0, totalCountries = 0 }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">Selected country</div>
        <div className="selected-country">
          <span className="flag">{selectedCountry?.flag ?? '🌍'}</span>
          <span>{selectedCountry?.name ?? 'Click a country'}</span>
        </div>
      </div>

      <GameList selectedCountry={selectedCountry} games={games} />

      <div className="sidebar-stats">
        <StatCell value={totalGames} label="Games" />
        <StatCell value={totalCountries} label="Countries" />
        <StatCell value={selectedCountry ? games.length : '—'} label="Here" />
      </div>
    </div>
  )
}

function GameList({ selectedCountry, games }) {
  if (!selectedCountry) {
    return (
      <div className="game-list">
        <div className="empty-state">
          <div className="empty-text">Click any country on the map to explore its games</div>
        </div>
      </div>
    )
  }
  if (!games.length) {
    return (
      <div className="game-list">
        <div className="empty-state">
          <div className="empty-text">No games mapped to this country yet.</div>
        </div>
      </div>
    )
  }
  return (
    <div className="game-list">
      {games.map((g) => (
        <GameCard key={g.id} game={g} />
      ))}
    </div>
  )
}

function GameCard({ game }) {
  return (
    <div className="game-card" style={{ cursor: 'default' }}>
      <div className="game-title">{game.title}</div>
      <div className="game-meta">
        <span className="game-studio">{game.studio}</span>
        {game.year && <span className="game-year">{game.year}</span>}
      </div>
      {game.rating ? (
        <div className="game-rating">
          {game.rating}<span className="star">★</span>
        </div>
      ) : null}
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
