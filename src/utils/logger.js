/**
 * Logging Middleware
 * Log(stack, level, package, message)
 *
 * @param {string} stack   - Call stack or component/function context
 * @param {string} level   - 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'
 * @param {string} pkg     - Package/module name (e.g. 'api', 'filter', 'ui')
 * @param {string} message - Human-readable log message
 * @param {any}    [data]  - Optional extra data
 */

const LEVELS = {
  DEBUG: { priority: 0, color: '#888888', bg: '#f0f0f0' },
  INFO: { priority: 1, color: '#1a6b3c', bg: '#e8f5ee' },
  WARN: { priority: 2, color: '#8b6914', bg: '#fdf4dc' },
  ERROR: { priority: 3, color: '#c0392b', bg: '#fdecea' },
}

const logHistory = []

export function Log(stack, level, pkg, message, data = null) {
  const upperLevel = (level || 'INFO').toUpperCase()
  const meta = LEVELS[upperLevel] || LEVELS.INFO
  const timestamp = new Date().toISOString()

  const entry = {
    timestamp,
    stack,
    level: upperLevel,
    package: pkg,
    message,
    data,
  }

  logHistory.push(entry)

  // Pretty console output
  const prefix = `%c[${upperLevel}]%c [${pkg}] %c${message}`
  const styles = [
    `color: ${meta.color}; background: ${meta.bg}; font-weight: bold; padding: 1px 4px; border-radius: 3px;`,
    `color: #666; font-style: italic;`,
    `color: #111;`,
  ]

  if (upperLevel === 'ERROR') {
    console.error(prefix, ...styles, { stack, data, timestamp })
  } else if (upperLevel === 'WARN') {
    console.warn(prefix, ...styles, { stack, data, timestamp })
  } else if (upperLevel === 'DEBUG') {
    console.debug(prefix, ...styles, { stack, data, timestamp })
  } else {
    console.log(prefix, ...styles, { stack, data, timestamp })
  }

  return entry
}

export function getLogHistory() {
  return [...logHistory]
}

export function clearLogHistory() {
  logHistory.length = 0
}

export default Log