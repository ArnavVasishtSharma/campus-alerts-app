/**
 * Logging Middleware
 * Log(stack, level, package, message)
 *
 * Makes an API call to the test server on every log event.
 * Also pretty-prints to the browser console.
 */

const BASE_URL = '/api'
const ACCESS_CODE = 'QkbpxH'

const LEVELS = {
  DEBUG: { color: '#888888', bg: '#f0f0f0' },
  INFO: { color: '#1a6b3c', bg: '#e8f5ee' },
  WARN: { color: '#8b6914', bg: '#fdf4dc' },
  ERROR: { color: '#c0392b', bg: '#fdecea' },
}

const logHistory = []

// Token reference — shared with notifications.js via module-level singleton
let _tokenGetter = null
export function setTokenGetter(fn) { _tokenGetter = fn }

async function postLogToServer(entry) {
  try {
    let token = null
    if (_tokenGetter) token = await _tokenGetter()

    await fetch(`${BASE_URL}/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        stack: entry.stack,
        level: entry.level,
        package: entry.package,
        message: entry.message,
        timestamp: entry.timestamp,
      }),
    })
  } catch (_) {
    // silently ignore — don't let logging crash the app
  }
}

export function Log(stack, level, pkg, message, data = null) {
  const upperLevel = (level || 'INFO').toUpperCase()
  const meta = LEVELS[upperLevel] || LEVELS.INFO
  const timestamp = new Date().toISOString()

  const entry = { timestamp, stack, level: upperLevel, package: pkg, message, data }
  logHistory.push(entry)

  // Pretty console output
  const prefix = `%c[${upperLevel}]%c [${pkg}] %c${message}`
  const styles = [
    `color:${meta.color};background:${meta.bg};font-weight:bold;padding:1px 4px;border-radius:3px;`,
    `color:#666;font-style:italic;`,
    `color:#111;`,
  ]

  if (upperLevel === 'ERROR') console.error(prefix, ...styles, { stack, data, timestamp })
  else if (upperLevel === 'WARN') console.warn(prefix, ...styles, { stack, data, timestamp })
  else if (upperLevel === 'DEBUG') console.debug(prefix, ...styles, { stack, data, timestamp })
  else console.log(prefix, ...styles, { stack, data, timestamp })

  // Fire-and-forget API call to test server
  postLogToServer(entry)

  return entry
}

export function getLogHistory() { return [...logHistory] }
export function clearLogHistory() { logHistory.length = 0 }

export default Log