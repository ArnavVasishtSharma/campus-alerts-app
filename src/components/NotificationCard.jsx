import "./NotificationCard.css";

export default function NotificationCard({
  notification,
  rank,
  badgeClass,
  isPriority,
}) {
  const { Type, Title, Message, Timestamp, weight } = notification;
  const date = Timestamp ? new Date(Timestamp).toLocaleString() : "—";

  return (
    <div className={`notif-card ${isPriority ? "notif-card--priority" : ""}`}>
      {rank && <span className="rank-badge">#{rank}</span>}

      <div className="notif-card__header">
        <span className={badgeClass}>{Type}</span>
        <span className="notif-card__time">{date}</span>
      </div>

      <h3 className="notif-card__title">{Title || "Notification"}</h3>
      <p className="notif-card__message">{Message || "No details available."}</p>

      {isPriority && weight !== undefined && (
        <div className="notif-card__weight">
          Priority weight: <strong>{weight}</strong>
        </div>
      )}
    </div>
  );
}
