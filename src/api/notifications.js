const BASE_URL = "http://20.207.122.201/evaluation-service";

/**
 * Fetch notifications from the evaluation service API.
 * @param {string} token - Bearer token for authorization.
 * @param {object} params - Query parameters (limit, page, notification_type, etc.).
 * @returns {Promise<object>} Parsed JSON response.
 */
export const fetchNotifications = async (token, params = {}) => {
  const query = new URLSearchParams(params).toString();

  const res = await fetch(`${BASE_URL}/notifications?${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
};
