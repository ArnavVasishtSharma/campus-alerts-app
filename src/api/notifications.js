import { Log, setTokenGetter } from '../utils/logger'

const BASE_URL = '/api'
const ACCESS_CODE = 'QkbpxH'

let cachedToken = null

export async function register({ email, name, mobileNo, githubUsername, rollNo }) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, mobileNo, githubUsername, rollNo, accessCode: ACCESS_CODE }),
  })
  const data = await res.json()
  Log('register', 'INFO', 'api', 'Registration response', data)
  return data
}

async function getAccessToken() {
  if (cachedToken) return cachedToken

  const credentials = {
    email: 'as0156@srmist.edu.in',
    name: 'arnav vasisht sharma',
    rollNo: 'ra2311026011026',
    accessCode: ACCESS_CODE,
    clientID: 'c64fce44-d558-4e80-a6d1-96e76ede3d8f',
    clientSecret: 'SKKUYNuzuVzmSmEW',
  }

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

  // Share token with logger so it can authenticate log POSTs
  setTokenGetter(() => Promise.resolve(cachedToken))

  Log('getAccessToken', 'INFO', 'api', 'Token obtained successfully')
  return cachedToken
}

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

export async function fetchAllNotifications() {
  const stack = 'fetchAllNotifications'
  Log(stack, 'INFO', 'api', 'Fetching all for priority sort')
  const data = await fetchNotifications({ page: 1, limit: 100 })
  return data?.notifications ?? []
}