import { useEffect, useMemo, useState } from 'react'
import { COUNTRIES } from '../../data/countries'

export function AddGameModal({ open, onClose, onSave }) {
  const [title, setTitle] = useState('')
  const [countryId, setCountryId] = useState('')
  const [year, setYear] = useState('')
  const [studio, setStudio] = useState('')
  const [status, setStatus] = useState('completed')
  const [rating, setRating] = useState(0)

  useEffect(() => {
    if (!open) return
    setRating(0)
  }, [open])

  const countryOptions = useMemo(
    () =>
      [
        'japan',
        'usa',
        'germany',
        'france',
        'spain',
        'korea',
        'brazil',
        'uk',
        'canada',
        'australia',
      ].map((id) => COUNTRIES[id]).filter(Boolean),
    [],
  )

  const save = () => {
    const cleanTitle = title.trim()
    if (!cleanTitle || !countryId) {
      window.alert('Please provide at least a title and a country.')
      return
    }

    const y = Number.parseInt(year, 10) || new Date().getFullYear()
    onSave({
      title: cleanTitle,
      countryId,
      studio: studio.trim() || 'Desconocido',
      year: y,
      status,
      rating: rating || null,
    })

    setTitle('')
    setCountryId('')
    setYear('')
    setStudio('')
    setStatus('completed')
    setRating(0)
  }

  return (
    <div className={`add-form ${open ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Add game">
      <div className="form-card">
        <div className="form-title">+ ADD GAME</div>

        <div className="form-group">
          <label className="form-label" htmlFor="f-title">
            Game title
          </label>
          <input
            className="form-input"
            id="f-title"
            type="text"
            placeholder="e.g. Elden Ring"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="f-country">
              Country of origin
            </label>
            <select
              className="form-input"
              id="f-country"
              value={countryId}
              onChange={(e) => setCountryId(e.target.value)}
            >
              <option value="">Select...</option>
              {countryOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="f-year">
              Year
            </label>
            <input
              className="form-input"
              id="f-year"
              type="number"
              placeholder="2024"
              min="1970"
              max="2026"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="f-studio">
            Studio
          </label>
          <input
            className="form-input"
            id="f-studio"
            type="text"
            placeholder="e.g. FromSoftware"
            value={studio}
            onChange={(e) => setStudio(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="f-status">
              Status
            </label>
            <select className="form-select" id="f-status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="completed">✓ Completed</option>
              <option value="playing">▶ Playing</option>
              <option value="wishlist">◈ Wishlist</option>
              <option value="abandoned">✕ Dropped</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Your rating</label>
            <div className="rating-row">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`star-btn ${r <= rating ? 'lit' : ''}`}
                  onClick={() => setRating(r)}
                  aria-label={`Rating ${r}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            CANCEL
          </button>
          <button type="button" className="btn-save" onClick={save}>
            SAVE GAME
          </button>
        </div>
      </div>
    </div>
  )
}

