import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faBolt, faGamepad, faGlobe, faLocationDot } from '@fortawesome/free-solid-svg-icons'

export function LandingPage({ onGoToMap, onAddGame, totalGames, totalCountries }) {
  return (
    <div className="landing">
      <div className="landing-bg" aria-hidden="true" />

      <header className="landing-header">
        <div className="landing-brand">
          <span className="landing-dot" aria-hidden="true" />
          GAMEWORLD
        </div>
        <div className="landing-header-actions">
          <button type="button" className="landing-header-link" onClick={onAddGame}>
            Add game
          </button>
          <button type="button" className="landing-header-primary" onClick={onGoToMap}>
            Enter <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </header>

      <main className="landing-main">
        <div className="landing-copy">
          <div className="landing-kicker">
            <FontAwesomeIcon icon={faBolt} /> PERSONAL ATLAS FOR YOUR BACKLOG
          </div>
          <h1 className="landing-title">
            Track games by origin.
            <br />
            Make your map feel alive.
          </h1>
          <p className="landing-subtitle">
            A clean, sharp, no-nonsense map UI — built for people who actually finish things (and for the rest of us,
            too).
          </p>

          <div className="landing-cta">
            <button type="button" className="landing-cta-primary" onClick={onGoToMap}>
              Open the map <FontAwesomeIcon icon={faArrowRight} />
            </button>
            <button type="button" className="landing-cta-ghost" onClick={onAddGame}>
              Add a game
            </button>
          </div>

          <div className="landing-line" aria-hidden="true" />

          <div className="landing-metrics" aria-label="Snapshot">
            <div className="landing-metric">
              <div className="landing-metric-val">{totalGames}</div>
              <div className="landing-metric-lbl">Games</div>
            </div>
            <div className="landing-metric">
              <div className="landing-metric-val">{totalCountries}</div>
              <div className="landing-metric-lbl">Countries</div>
            </div>
            <div className="landing-metric">
              <div className="landing-metric-val">0</div>
              <div className="landing-metric-lbl">Excuses</div>
            </div>
          </div>
        </div>

        <div className="landing-sigil" aria-hidden="true">
          <div className="landing-sigil-ring">
            <div className="landing-sigil-icon">
              <FontAwesomeIcon icon={faGlobe} />
            </div>
            <div className="landing-sigil-icon">
              <FontAwesomeIcon icon={faLocationDot} />
            </div>
            <div className="landing-sigil-icon">
              <FontAwesomeIcon icon={faGamepad} />
            </div>
          </div>
          <div className="landing-sigil-caption">CLICK. FILTER. ADD. REPEAT.</div>
        </div>
      </main>
    </div>
  )
}

