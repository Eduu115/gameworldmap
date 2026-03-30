export const STATUSES = /** @type {const} */ (['completed', 'playing', 'abandoned', 'wishlist'])

export function statusLabel(status) {
  return (
    {
      completed: 'COMPLETED',
      playing: 'PLAYING',
      abandoned: 'DROPPED',
      wishlist: 'WISHLIST',
    }[status] ?? status
  )
}

