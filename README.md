# Campus Notifications System

A clean, editorial-style React + Vite frontend for priority-sorted campus notifications.

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Set your Bearer token
# Open src/api/notifications.js and replace:
#   const BEARER_TOKEN = 'your-bearer-token-here'
# with your actual token.

# 3. Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Folder Structure

```
campus-notifications/
├── index.html
├── package.json
├── vite.config.js
├── logging_middleware/
│   └── index.js              ← Re-exports Log from src/utils/logger.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── api/
    │   └── notifications.js  ← API calls with Bearer token
    ├── components/
    │   ├── NotificationCard.jsx
    │   ├── NotificationCardSkeleton.jsx
    │   ├── FilterBar.jsx
    │   ├── PaginationBar.jsx
    │   └── ErrorBanner.jsx
    ├── pages/
    │   └── Home.jsx          ← Main page
    └── utils/
        ├── logger.js         ← Log(stack, level, package, message)
        └── priority.js       ← Priority sorting logic
```

---

## Priority Logic

```
Placement (rank 1) > Result (rank 2) > Event (rank 3)
Same type → latest timestamp first
Top N configurable via UI input (default: 10)
```

---

## Logging

```js
import { Log } from './utils/logger'
Log('Component.method', 'INFO', 'api', 'Fetched data', { count: 5 })
Log('Component.method', 'ERROR', 'api', 'Failed', error)
Log('FilterBar', 'INFO', 'filter', 'Filter changed to: placement')
Log('PaginationBar', 'INFO', 'ui', 'Navigate to page 2')
```

Levels: `DEBUG` | `INFO` | `WARN` | `ERROR`

---

## API

**Endpoint:** `GET http://20.207.122.201/evaluation-service/notifications`

**Params:** `?page=1&limit=10&type=placement`

**Auth:** `Authorization: Bearer <token>`

---

## Tech Stack

- React 18 + Vite 5
- Material UI v5
- Playfair Display + DM Sans (Google Fonts)
