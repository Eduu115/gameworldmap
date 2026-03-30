import { useEffect } from 'react'

export function Toast({ open, message, onClose, timeoutMs = 3000 }) {
  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => onClose?.(), timeoutMs)
    return () => window.clearTimeout(t)
  }, [open, onClose, timeoutMs])

  if (!open) return null

  return (
    <div className="notif" role="status" aria-live="polite">
      <div className="notif-dot" aria-hidden="true" />
      {message}
    </div>
  )
}

