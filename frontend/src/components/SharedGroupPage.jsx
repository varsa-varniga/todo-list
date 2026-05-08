export default function SharedGroupPage({ group, message }) {
  return (
    <main className="public-layout">
      <section className="public-card">
        <p className="eyebrow">Shared Todo List</p>
        <h1>{group?.name || "List not found"}</h1>
        {message ? <p className="feedback error">{message}</p> : null}
        {group ? (
          <>
            <div className="stats-grid">
              <article>
                <span>Total</span>
                <strong>{group.stats.total}</strong>
              </article>
              <article>
                <span>Pending</span>
                <strong>{group.stats.pending}</strong>
              </article>
              <article>
                <span>Completed</span>
                <strong>{group.stats.completed}</strong>
              </article>
            </div>
            <ul className="public-task-list">
              {group.tasks.map((task) => (
                <li key={task.id} className={task.completed ? "done" : ""}>
                  <div>
                    <h3>{task.title}</h3>
                    <div className="tag-row">
                      {task.tags.length ? (
                        task.tags.map((tag) => (
                          <span key={tag} className="tag">
                            #{tag}
                          </span>
                        ))
                      ) : (
                        <span className="tag muted">No Tag</span>
                      )}
                    </div>
                  </div>
                  <span className="task-state">{task.completed ? "Completed" : "Pending"}</span>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </section>
    </main>
  );
}
