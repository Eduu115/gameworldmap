export const STATUSES = /** @type {const} */ (['completed', 'playing', 'abandoned', 'wishlist'])

export function statusLabel(status) {
  return (
    {
      completed: 'COMPLET.',
      playing: 'JUGANDO',
      abandoned: 'ABANDON.',
      wishlist: 'WISHLIST',
    }[status] ?? status
  )
}

