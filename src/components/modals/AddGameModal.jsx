import { useEffect, useState } from 'react'

export function AddGameModal({ open, onClose, onSave, games = [] }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [status, setStatus] = useState('completed')
  const [rating, setRating] = useState(0)

  useEffect(() => {
    if (!open) {
      setQuery('')
      setSelected(null)
      setStatus('completed')
      setRating(0)
    }
  }, [open])

  const results = query.trim().length < 2
    ? []
    : games
        .filter((g) => g.title.toLowerCase().includes(query.trim().toLowerCase()))
        .slice(0, 8)

  const save = () => {
    if (!selected) return
    onSave({ gameId: selected.id, status, rating: rating || null })
    onClose()
  }

  return (
    <div className={`add-form ${open ? 'open' : ''}`} role="dialog" aria-modal="true">
      <div className="form-card">
        <div className="form-title">+ TRACK A GAME</div>

        {!selected ? (
          <>
            <div className="form-group">
              <label className="form-label" htmlFor="f-search">Search game</label>
              <input
                className="form-input"
                id="f-search"
                type="text"
                placeholder="e.g. Elden Ring, GTA..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>

            {results.length > 0 && (
              <div style={{
                display: 'flex', flexDirection: 'column', gap: 4,
                maxHeight: 280, overflowY: 'auto', marginBottom: 12,
              }}>
                {results.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelected(g)}
                    style={{
                      background: 'var(--gray-700)',
                      border: '1px solid var(--gray-600)',
                      borderRadius: 6,
                      padding: '10px 12px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: 'var(--gray-100)',
                      transition: 'border-color 0.15s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--yellow)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--gray-600)'}
                  >
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{g.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 2 }}>
                      {g.studio} · {g.year ?? '—'}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {query.trim().length >= 2 && results.length === 0 && (
              <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 12 }}>
                No games found for "{query}"
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{
              background: 'var(--gray-700)',
              border: '1px solid var(--yellow-border)',
              borderRadius: 6,
              padding: '10px 12px',
              marginBottom: 16,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{selected.title}</div>
                <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 2 }}>
                  {selected.studio} · {selected.year ?? '—'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                style={{ background: 'none', border: 'none', color: 'var(--gray-400)', cursor: 'pointer', fontSize: 14 }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="f-status">Status</label>
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
          </>
        )}

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>CANCEL</button>
          <button type="button" className="btn-save" onClick={save} disabled={!selected}>
            SAVE
          </button>
        </div>
      </div>
    </div>
  )
}
