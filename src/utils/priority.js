/**
 * Priority Utility
 * Placement > Result > Event
 * Same type → latest timestamp first
 */

const PRIORITY_MAP = {
  placement: 1,
  result: 2,
  event: 3,
}

/**
 * Returns numeric priority for a notification type
 */
export function getTypePriority(type = '') {
  return PRIORITY_MAP[type.toLowerCase()] ?? 99
}

/**
 * Comparator for sorting notifications by priority rules:
 * 1. Lower priority number = higher rank
 * 2. Same type → sort by timestamp descending (latest first)
 */
export function priorityComparator(a, b) {
  const pa = getTypePriority(a.type)
  const pb = getTypePriority(b.type)

  if (pa !== pb) return pa - pb

  // Same type → latest timestamp first
  const ta = new Date(a.timestamp || a.created_at || 0).getTime()
  const tb = new Date(b.timestamp || b.created_at || 0).getTime()
  return tb - ta
}

/**
 * Returns top N notifications sorted by priority
 */
export function getTopPriorityNotifications(notifications = [], n = 10) {
  return [...notifications].sort(priorityComparator).slice(0, n)
}

/**
 * Returns label + color for a type
 */
export function getTypeStyle(type = '') {
  switch (type.toLowerCase()) {
    case 'placement':
      return { label: 'Placement', color: '#111111', textColor: '#f8f6f1' }
    case 'result':
      return { label: 'Result', color: '#444444', textColor: '#f8f6f1' }
    case 'event':
      return { label: 'Event', color: '#888888', textColor: '#f8f6f1' }
    default:
      return { label: type || 'Unknown', color: '#aaaaaa', textColor: '#111111' }
  }
}

/**
 * Format a timestamp to a readable string
 */
export function formatDate(ts) {
  if (!ts) return '—'
  const d = new Date(ts)
  if (isNaN(d)) return ts
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}