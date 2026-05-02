/**
 * logging_middleware/index.js
 *
 * Standalone logging middleware re-exported for convenience.
 * Import from here OR directly from src/utils/logger.js.
 *
 * Usage:
 *   import { Log } from '../logging_middleware'
 *   Log('MyComponent.doSomething', 'INFO', 'ui', 'User clicked button', { id: 42 })
 */

export { Log, getLogHistory, clearLogHistory } from '../src/utils/logger.js'
