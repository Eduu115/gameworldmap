import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faBolt, faGamepad, faGlobe, faLocationDot } from '@fortawesome/free-solid-svg-icons'

export function LandingPage({ onGoToMap, totalGames, totalCountries }) {
  return (
    <div className="landing">
      <div className="landing-bg" aria-hidden="true" />

      <header className="landing-header">
        <div className="landing-brand">
          <span className="landing-dot" aria-hidden="true" />
          GAMEWORLD
        </div>
        <div className="landing-header-actions">
          <button type="button" className="landing-header-primary" onClick={onGoToMap}>
            Explore <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </header>

      <main className="landing-main">
        <div className="landing-copy">
          <div className="landing-kicker">
            <FontAwesomeIcon icon={faBolt} /> DISCOVER GAMES BY ORIGIN
          </div>
          <h1 className="landing-title">
            Every game,<br />on the map.
          </h1>
          <p className="landing-subtitle">
            Explore the world's video game catalog by country of origin.
            Browse {totalGames}+ games, discover studios, and track what you've played — all in one place.
          </p>

          <div className="landing-cta">
            <button type="button" className="landing-cta-primary" onClick={onGoToMap}>
              Open the map <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>

          <div className="landing-line" aria-hidden="true" />

          <div className="landing-metrics" aria-label="Snapshot">
            <div className="landing-metric">
              <div className="landing-metric-val">{totalGames}+</div>
              <div className="landing-metric-lbl">Games</div>
            </div>
            <div className="landing-metric">
              <div className="landing-metric-val">{totalCountries || '—'}</div>
              <div className="landing-metric-lbl">Countries</div>
            </div>
            <div className="landing-metric">
              <div className="landing-metric-val">Free</div>
              <div className="landing-metric-lbl">Always</div>
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
          <div className="landing-sigil-caption">BROWSE. DISCOVER. TRACK.</div>
        </div>
      </main>
    </div>
  )
}
