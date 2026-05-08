export default function StatsPanel({ message, selectedGroup }) {
  return (
    <aside className="stats-panel">
      <p className="eyebrow">List Statistics</p>
      {selectedGroup ? (
        <>
          <div className="stats-grid single-column">
            <article>
              <span>Total Tasks</span>
              <strong>{selectedGroup.stats.total}</strong>
            </article>
            <article>
              <span>Pending</span>
              <strong>{selectedGroup.stats.pending}</strong>
            </article>
            <article>
              <span>Completed</span>
              <strong>{selectedGroup.stats.completed}</strong>
            </article>
          </div>

          <div className="tag-summary">
            {Object.entries(selectedGroup.stats.tags).map(([tag, count]) => (
              <div key={tag} className="tag-summary-row">
                <span>{tag === "no tag" ? "No Tag" : `#${tag}`}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="subtitle">Stats will appear once a list is selected.</p>
      )}
      {message ? <p className="feedback">{message}</p> : null}
    </aside>
  );
}
