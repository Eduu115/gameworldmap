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
      window.alert('Rellena al menos el título y el país.')
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
    <div className={`add-form ${open ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Añadir juego">
      <div className="form-card">
        <div className="form-title">+ AÑADIR JUEGO</div>

        <div className="form-group">
          <label className="form-label" htmlFor="f-title">
            Título del juego
          </label>
          <input
            className="form-input"
            id="f-title"
            type="text"
            placeholder="Ej: Elden Ring"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="f-country">
              País de origen
            </label>
            <select
              className="form-input"
              id="f-country"
              value={countryId}
              onChange={(e) => setCountryId(e.target.value)}
            >
              <option value="">Selecciona...</option>
              {countryOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="f-year">
              Año
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
            Estudio
          </label>
          <input
            className="form-input"
            id="f-studio"
            type="text"
            placeholder="Ej: FromSoftware"
            value={studio}
            onChange={(e) => setStudio(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="f-status">
              Estado
            </label>
            <select className="form-select" id="f-status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="completed">✓ Completado</option>
              <option value="playing">▶ Jugando</option>
              <option value="wishlist">◈ Wishlist</option>
              <option value="abandoned">✕ Abandonado</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Tu puntuación</label>
            <div className="rating-row">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`star-btn ${r <= rating ? 'lit' : ''}`}
                  onClick={() => setRating(r)}
                  aria-label={`Puntuación ${r}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            CANCELAR
          </button>
          <button type="button" className="btn-save" onClick={save}>
            GUARDAR JUEGO
          </button>
        </div>
      </div>
    </div>
  )
}

