/**
 * Priority weight mapping for notification types.
 * Placement (highest) > Result > Event (lowest).
 *
 * Scalability Note:
 *   For very large datasets (100k+ notifications), consider replacing the
 *   sort-based approach with a max-heap / priority queue (e.g. a binary heap)
 *   to achieve O(n log k) instead of O(n log n) where k = number of top items.
 *   Libraries like 'heap-js' or a custom MinHeap of size k can be used.
 */
const priorityWeight = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

/**
 * Return the top N notifications sorted by priority weight (desc),
 * then by timestamp (latest first) as a tiebreaker.
 *
 * @param {Array} notifications - Array of notification objects with Type and Timestamp.
 * @param {number} n - Number of top notifications to return (default 10).
 * @returns {Array} Top N prioritised notifications.
 */
export const getTopNotifications = (notifications, n = 10) => {
  return notifications
    .map((item) => ({
      ...item,
      weight: priorityWeight[item.Type] || 0,
    }))
    .sort((a, b) => {
      // Primary sort: weight descending
      if (b.weight !== a.weight) {
        return b.weight - a.weight;
      }
      // Secondary sort: latest timestamp first
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    })
    .slice(0, n);
};
