import { useState, useEffect, useCallback } from "react";
import { fetchNotifications } from "../api/notifications";
import { getTopNotifications } from "../utils/priority";
import { Log } from "../utils/logger";
import NotificationCard from "../components/NotificationCard";
import "./Home.css";

// ── Replace with your actual auth token ──
const TOKEN = "YOUR_AUTH_TOKEN_HERE";

const TYPES = ["All", "Event", "Result", "Placement"];

export default function Home() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & pagination
  const [selectedType, setSelectedType] = useState("All");
  const [topN, setTopN] = useState(10);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // ── Fetch notifications ──
  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = { limit, page };
    if (selectedType !== "All") {
      params.notification_type = selectedType;
    }

    try {
      const data = await fetchNotifications(TOKEN, params);
      const items = data.notifications || data || [];
      setNotifications(items);
      Log("frontend", "info", "api", "Notifications loaded", TOKEN);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch notifications. Please try again.");
      Log("frontend", "error", "api", `Fetch failed: ${err.message}`, TOKEN);
    } finally {
      setLoading(false);
    }
  }, [selectedType, page, limit]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // ── Derived data ──
  const filteredNotifications =
    selectedType === "All"
      ? notifications
      : notifications.filter((n) => n.Type === selectedType);

  const topNotifications = getTopNotifications(notifications, topN);

  // ── Filter change handler ──
  const handleTypeChange = (type) => {
    setSelectedType(type);
    setPage(1);
    Log("frontend", "info", "filter", `Filter applied: ${type}`, TOKEN);
  };

  // ── Badge colour helper ──
  const typeBadgeClass = (type) => {
    switch (type) {
      case "Placement":
        return "badge badge-placement";
      case "Result":
        return "badge badge-result";
      case "Event":
        return "badge badge-event";
      default:
        return "badge";
    }
  };

  return (
    <div className="home">
      {/* ─── Header ─── */}
      <header className="home-header">
        <div className="header-content">
          <div className="header-icon">🔔</div>
          <div>
            <h1>Notification Center</h1>
            <p className="subtitle">
              Stay updated with placements, results &amp; events
            </p>
          </div>
        </div>
      </header>

      {/* ─── Controls ─── */}
      <section className="controls">
        <div className="control-group">
          <label htmlFor="type-filter">Filter by Type</label>
          <div className="pill-group" role="radiogroup" aria-label="Filter by type">
            {TYPES.map((t) => (
              <button
                key={t}
                className={`pill ${selectedType === t ? "pill-active" : ""}`}
                onClick={() => handleTypeChange(t)}
                aria-pressed={selectedType === t}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <label htmlFor="top-n-input">Top N Priority</label>
          <input
            id="top-n-input"
            type="number"
            min={1}
            max={100}
            value={topN}
            onChange={(e) => setTopN(Math.max(1, Number(e.target.value)))}
            className="top-n-input"
          />
        </div>
      </section>

      {/* ─── Error ─── */}
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={loadNotifications}>Retry</button>
        </div>
      )}

      {/* ─── Loading ─── */}
      {loading && (
        <div className="loader-wrap">
          <div className="loader" />
          <span>Fetching notifications…</span>
        </div>
      )}

      {/* ─── Main content ─── */}
      {!loading && !error && (
        <div className="content-grid">
          {/* Priority Notifications */}
          <section className="section priority-section">
            <h2>
              <span className="section-icon">⭐</span> Top {topN} Priority
              Notifications
            </h2>
            <p className="section-desc">
              Sorted by weight (Placement &gt; Result &gt; Event), then latest
              first.
            </p>
            {topNotifications.length === 0 ? (
              <p className="empty">No notifications yet.</p>
            ) : (
              <div className="card-list">
                {topNotifications.map((n, i) => (
                  <NotificationCard
                    key={n.ID || i}
                    notification={n}
                    rank={i + 1}
                    badgeClass={typeBadgeClass(n.Type)}
                    isPriority
                  />
                ))}
              </div>
            )}
          </section>

          {/* All / Filtered Notifications */}
          <section className="section all-section">
            <h2>
              <span className="section-icon">📋</span>{" "}
              {selectedType === "All"
                ? "All Notifications"
                : `${selectedType} Notifications`}
            </h2>
            <p className="section-desc">
              Page {page} · Showing up to {limit} per page
            </p>
            {filteredNotifications.length === 0 ? (
              <p className="empty">No notifications match the filter.</p>
            ) : (
              <div className="card-list">
                {filteredNotifications.map((n, i) => (
                  <NotificationCard
                    key={n.ID || i}
                    notification={n}
                    badgeClass={typeBadgeClass(n.Type)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="pagination">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ← Prev
              </button>
              <span className="page-indicator">Page {page}</span>
              <button onClick={() => setPage((p) => p + 1)}>Next →</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
