export default function EmptyState({ title, text, action }) {
  return <div className="empty-state panel"><div className="empty-icon">✦</div><h3>{title}</h3><p className="muted">{text}</p>{action}</div>
}
