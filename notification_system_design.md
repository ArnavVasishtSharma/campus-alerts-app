# Notification System Design

## 1. Overview

This document describes the priority-based notification system architecture, sorting
strategy, and scalability considerations.

The system fetches notifications from a REST API and surfaces the most important ones
using a weighted priority model.

---

## 2. Priority Logic

Notifications are classified into three types with the following priority weights:

| Type        | Weight | Rationale                                   |
| ----------- | ------ | ------------------------------------------- |
| Placement   | 3      | Career-critical — requires immediate action |
| Result      | 2      | Academic outcome — time-sensitive            |
| Event       | 1      | General information — lower urgency          |

**Rule:** Higher weight = higher priority.

---

## 3. Sorting Strategy

Notifications are sorted using a **two-level comparator**:

1. **Primary key — Weight (descending):**
   All `Placement` notifications appear before `Result`, which appear before `Event`.

2. **Secondary key — Timestamp (latest first):**
   Within the same weight tier, newer notifications are shown first.

```javascript
// Comparator
(a, b) => {
  if (b.weight !== a.weight) return b.weight - a.weight;
  return new Date(b.Timestamp) - new Date(a.Timestamp);
};
```

After sorting, we slice the first **N** items to produce the "Top N" list.

**Time Complexity:** `O(n log n)` for the sort step.

---

## 4. Data Flow

```
API (paginated) ──► fetchNotifications(token, params)
                         │
                         ▼
                   notifications[]
                    ┌────┴────┐
                    │         │
              filter by     getTopNotifications(n)
              Type (UI)       │
                    │         ▼
                    ▼     Top N sorted by
              Filtered    weight + timestamp
              List
```

---

## 5. Filtering

The UI provides a **type filter** with four options:

- **All** — shows every notification
- **Event** / **Result** / **Placement** — filters by `Type` field

Filtering is applied both **client-side** (for the current page) and **server-side**
via the `notification_type` query parameter for paginated requests.

---

## 6. Pagination

Pagination is handled at the API level:

```
GET /notifications?limit=10&page=1&notification_type=Event
```

| Parameter           | Description                          |
| ------------------- | ------------------------------------ |
| `limit`             | Number of items per page             |
| `page`              | Current page number (1-indexed)      |
| `notification_type` | Optional filter (`Event`, `Result`, `Placement`) |

---

## 7. Logging

All significant actions are logged using a centralized `Log()` utility that sends
structured log entries to the evaluation service:

| Event                   | Level   | Context    |
| ----------------------- | ------- | ---------- |
| Notifications loaded    | `info`  | `api`      |
| Fetch failed            | `error` | `api`      |
| Filter applied          | `info`  | `filter`   |

Log format:
```
Log(source, level, context, message, token)
```

---

## 8. Scalability Considerations

### Current Approach
- `Array.sort()` with a comparator → **O(n log n)**
- Sufficient for datasets up to ~10,000 notifications

### At Scale (100k+ notifications)

For extracting the **Top K** from a large dataset, a **min-heap / priority queue**
is significantly more efficient:

| Approach       | Time Complexity | Space     |
| -------------- | --------------- | --------- |
| Full sort      | O(n log n)      | O(n)      |
| Min-heap (k)   | O(n log k)      | O(k)      |

**Heap-based approach:**

1. Maintain a **min-heap of size k**.
2. Iterate through all n notifications.
3. For each notification:
   - If heap size < k → push.
   - Else if current item > heap root → replace root and heapify-down.
4. At the end, the heap contains exactly the top k items.

```
Heap root = smallest of the top-k
Compare weight first, then timestamp
If new item > root → evict root, insert new item
```

This reduces the problem from O(n log n) to **O(n log k)** where k ≪ n.

### Additional Scalability Strategies

- **Server-side sorting & pagination** — push the sort to the database (`ORDER BY weight DESC, timestamp DESC LIMIT k`)
- **Caching** — cache the top-k list with a short TTL; invalidate on new notification
- **WebSocket push** — instead of polling, receive real-time notification events
- **Virtual scrolling** — for rendering large lists in the UI without DOM bloat

---

## 9. Technology Stack

| Layer     | Technology       |
| --------- | ---------------- |
| UI        | React 18 + Vite  |
| Styling   | Vanilla CSS      |
| API       | Fetch API        |
| Logging   | Custom Log()     |
| State     | React useState   |

---

## 10. File Structure

```
src/
├── api/
│   └── notifications.js       # API fetch layer
├── components/
│   ├── NotificationCard.jsx    # Card component
│   └── NotificationCard.css    # Card styles
├── pages/
│   ├── Home.jsx                # Main page
│   └── Home.css                # Page styles
├── utils/
│   ├── priority.js             # Priority sorting logic
│   └── logger.js               # Centralized logging
├── App.jsx                     # App entry
├── main.jsx                    # React root
└── index.css                   # Global styles
```
