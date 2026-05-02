const LOG_URL = "http://20.207.122.201/evaluation-service/logs";

/**
 * Send a structured log entry to the evaluation service.
 *
 * @param {string} source    - e.g. "frontend"
 * @param {string} level     - "info" | "error" | "warn" | "debug"
 * @param {string} context   - e.g. "api", "component", "filter"
 * @param {string} message   - Human-readable description
 * @param {string} token     - Bearer token
 */
export const Log = async (source, level, context, message, token) => {
  try {
    console.log(`[${level.toUpperCase()}] [${source}/${context}] ${message}`);

    await fetch(LOG_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        source,
        level,
        context,
        message,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (err) {
    console.error("Logging failed:", err.message);
  }
};
