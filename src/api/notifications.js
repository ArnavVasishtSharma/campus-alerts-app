import { Log } from '../utils/logger'

const BASE_URL = 'http://20.207.122.201/evaluation-service'
const BEARER_TOKEN = 'your-bearer-token-here' // Replace with actual token

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
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    })

    if (!response.ok) {
      const errText = await response.text()
      Log(stack, 'ERROR', 'api', `API responded with ${response.status}`, { status: response.status, body: errText })
      throw new Error(`HTTP ${response.status}: ${errText || response.statusText}`)
    }

    const data = await response.json()
    Log(stack, 'INFO', 'api', `Fetched ${data?.notifications?.length ?? 0} notifications successfully`, {
      total: data?.total,
      page: data?.page,
    })

    return data
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
    return data?.notifications ?? data?.data ?? []
  } catch (error) {
    Log(stack, 'ERROR', 'api', `Failed to fetch all notifications: ${error.message}`, error)
    throw error
  }
}