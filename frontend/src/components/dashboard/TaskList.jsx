export default function TaskList({
  tasks,
  onDeleteTask,
  onMoveTask,
  onToggleTask,
  onUpdateTask,
}) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={`${task.id}-${task.updatedAt}`} className="task-card">
          <div className="task-main">
            <input
              checked={task.completed}
              onChange={() => onToggleTask(task)}
              type="checkbox"
            />
            <div className="task-copy">
              <input
                className={task.completed ? "task-title done" : "task-title"}
                defaultValue={task.title}
                onBlur={(event) => {
                  if (event.target.value !== task.title) {
                    onUpdateTask(task.id, { title: event.target.value });
                  }
                }}
              />
              <input
                className="task-tags-input"
                defaultValue={task.tags.join(", ")}
                onBlur={(event) => onUpdateTask(task.id, { tags: event.target.value })}
                placeholder="Add tags"
              />
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
          </div>
          <div className="task-actions">
            <button className="ghost-button" onClick={() => onMoveTask(task, -1)} type="button">
              Up
            </button>
            <button className="ghost-button" onClick={() => onMoveTask(task, 1)} type="button">
              Down
            </button>
            <button className="ghost-button danger" onClick={() => onDeleteTask(task.id)} type="button">
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
