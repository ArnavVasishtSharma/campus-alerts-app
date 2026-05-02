import { Log } from '../utils/logger'

const BASE_URL = '/api'
const ACCESS_CODE = 'QkbpxH'

// ─── Token cache (in-memory) ───────────────────────────────────────────────
let cachedToken = null

/**
 * Step 1: Register to get clientID + clientSecret
 * Only needed once — save the result somewhere safe.
 * Call this manually from the browser console if needed:
 *   import { register } from './src/api/notifications.js'
 *   register({ email, name, mobileNo, githubUsername, rollNo })
 */
export async function register({ email, name, mobileNo, githubUsername, rollNo }) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, mobileNo, githubUsername, rollNo, accessCode: ACCESS_CODE }),
  })
  const data = await res.json()
  Log('register', 'INFO', 'api', 'Registration response', data)
  return data // { clientID, clientSecret, ... }
}

/**
 * Step 2: POST to /auth with your credentials to get access_token
 * Fill in YOUR details below after registering.
 */
async function getAccessToken() {
  if (cachedToken) return cachedToken

  // ── FILL THESE IN after you register ──────────────────────────────────
  const credentials = {
    email: 'YOUR_EMAIL',           // e.g. "you@college.edu"
    name: 'YOUR_NAME',
    rollNo: 'YOUR_ROLL_NO',
    accessCode: ACCESS_CODE,
    clientID: 'YOUR_CLIENT_ID',     // from /register response
    clientSecret: 'YOUR_CLIENT_SECRET', // from /register response
  }
  // ──────────────────────────────────────────────────────────────────────

  Log('getAccessToken', 'INFO', 'api', 'Fetching auth token...')

  const res = await fetch(`${BASE_URL}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })

  if (!res.ok) {
    const err = await res.text()
    Log('getAccessToken', 'ERROR', 'api', `Auth failed: ${res.status}`, err)
    throw new Error(`Auth failed (${res.status}): ${err}`)
  }

  const data = await res.json()
  cachedToken = data.access_token
  Log('getAccessToken', 'INFO', 'api', 'Token obtained successfully')
  return cachedToken
}

/**
 * Fetch notifications from the API
 * Response shape: { notifications: [{ ID, Type, Message, Timestamp }] }
 */
export async function fetchNotifications({ page = 1, limit = 10, type = '' } = {}) {
  const stack = 'fetchNotifications'

  const token = await getAccessToken()

  const queryParams = new URLSearchParams({ page, limit })
  if (type && type !== 'all') queryParams.append('type', type)

  const url = `${BASE_URL}/notifications?${queryParams.toString()}`

  Log(stack, 'INFO', 'api', `Fetching — page=${page}, limit=${limit}, type=${type || 'all'}`)

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const err = await res.text()
    Log(stack, 'ERROR', 'api', `API error ${res.status}`, err)
    throw new Error(`HTTP ${res.status}: ${err || res.statusText}`)
  }

  const data = await res.json()

  // API returns { notifications: [{ ID, Type, Message, Timestamp }] }
  // Normalise to camelCase for consistent use in UI
  const raw = data?.notifications ?? (Array.isArray(data) ? data : [])
  const notifications = raw.map((n) => ({
    id: n.ID ?? n.id,
    type: n.Type ?? n.type,
    title: n.Message ?? n.title ?? n.message,
    message: n.Message ?? n.message,
    timestamp: n.Timestamp ?? n.timestamp,
  }))

  const total = data?.total ?? data?.count ?? notifications.length

  Log(stack, 'INFO', 'api', `Fetched ${notifications.length} notifications`, { total })

  return { notifications, total, page, limit }
}

/**
 * Fetch all notifications for priority panel (large limit, no type filter)
 */
export async function fetchAllNotifications() {
  const stack = 'fetchAllNotifications'
  Log(stack, 'INFO', 'api', 'Fetching all for priority sort')
  const data = await fetchNotifications({ page: 1, limit: 100 })
  return data?.notifications ?? []
}