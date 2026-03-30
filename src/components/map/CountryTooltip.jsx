import { useEffect, useState } from 'react'

export function CountryTooltip({ country, gamesCount }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!country) return
    setVisible(true)
    const t = window.setTimeout(() => setVisible(false), 2200)
    return () => window.clearTimeout(t)
  }, [country?.id])

  return (
    <div className={`country-tooltip ${visible ? 'visible' : ''}`} aria-hidden={!visible}>
      <span className="tooltip-flag">{country?.flag ?? '🌍'}</span>
      <span className="tooltip-name">{country?.name ?? '—'}</span>
      <span className="tooltip-count">{gamesCount} juegos</span>
    </div>
  )
}

