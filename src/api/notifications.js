import { Log } from '../utils/logger'

// Use /api proxy in dev (Vite rewrites to http://20.207.122.201/evaluation-service)
const BASE_URL = '/api'
const ACCESS_CODE = 'QkbpxH'

/**
 * Fetch notifications from the API
 * @param {object} params - { page, limit, type }
 */
export async function fetchNotifications({ page = 1, limit = 10, type = '' } = {}) {
  const stack = 'fetchNotifications'

  const queryParams = new URLSearchParams({ page, limit })
  if (type && type !== 'all') queryParams.append('type', type)

  const url = `${BASE_URL}/notifications?${queryParams.toString()}`

  Log(stack, 'INFO', 'api', `Fetching notifications — page=${page}, limit=${limit}, type=${type || 'all'}`)

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_CODE}`,
        'access-code': ACCESS_CODE,
        'X-Access-Code': ACCESS_CODE,
      },
    })

    if (!response.ok) {
      const errText = await response.text()
      Log(stack, 'ERROR', 'api', `API responded with ${response.status}`, { status: response.status, body: errText })
      throw new Error(`HTTP ${response.status}: ${errText || response.statusText}`)
    }

    const data = await response.json()

    // Normalise different response shapes
    const items = data?.notifications ?? data?.data ?? (Array.isArray(data) ? data : [])
    const total = data?.total ?? data?.count ?? items.length

    Log(stack, 'INFO', 'api', `Fetched ${items.length} notifications successfully`, { total, page: data?.page })

    // Always return a consistent shape
    return { notifications: items, total, page: data?.page ?? page, limit: data?.limit ?? limit }
  } catch (error) {
    Log(stack, 'ERROR', 'api', `Failed to fetch notifications: ${error.message}`, error)
    throw error
  }
}

/**
 * Fetch all notifications (no pagination) for priority calculation
 */
export async function fetchAllNotifications() {
  const stack = 'fetchAllNotifications'
  Log(stack, 'INFO', 'api', 'Fetching all notifications for priority sorting')

  try {
    const data = await fetchNotifications({ page: 1, limit: 1000 })
    return data?.notifications ?? []
  } catch (error) {
    Log(stack, 'ERROR', 'api', `Failed to fetch all notifications: ${error.message}`, error)
    throw error
  }
}