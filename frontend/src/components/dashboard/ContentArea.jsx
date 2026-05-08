import TaskList from "./TaskList";

export default function ContentArea({
  message,
  newTask,
  selectedGroup,
  submitting,
  tagFilter,
  visibleTasks,
  onCreateTask,
  onDeleteGroup,
  onMoveTask,
  onRenameGroup,
  onShareGroup,
  onTagFilterChange,
  onTaskChange,
  onTaskDelete,
  onTaskToggle,
  onTaskUpdate,
}) {
  return (
    <section className="content">
      {selectedGroup ? (
        <>
          <div className="content-header">
            <div>
              <div className="title-row">
                <h1>{selectedGroup.name}</h1>
                {selectedGroup.isPublic ? <span className="pill">Public</span> : null}
              </div>
              <p className="subtitle">Manage todos inside this group and share it when ready.</p>
            </div>
            <div className="header-actions">
              <button className="ghost-button" onClick={onRenameGroup} type="button">
                Rename
              </button>
              <button className="ghost-button danger" onClick={onDeleteGroup} type="button">
                Delete
              </button>
              <button className="primary-button" onClick={onShareGroup} type="button">
                Share
              </button>
            </div>
          </div>

          <form className="task-form" onSubmit={onCreateTask}>
            <input
              value={newTask.title}
              onChange={(event) => onTaskChange("title", event.target.value)}
              placeholder="Add a new task"
            />
            <input
              value={newTask.tags}
              onChange={(event) => onTaskChange("tags", event.target.value)}
              placeholder="Tags: urgent, work, follow-up"
            />
            <button className="primary-button" disabled={submitting} type="submit">
              New Task
            </button>
          </form>

          <div className="filter-row">
            <label>
              Filter by tag
              <select value={tagFilter} onChange={(event) => onTagFilterChange(event.target.value)}>
                <option value="all">All</option>
                <option value="no tag">No Tag</option>
                {Object.keys(selectedGroup.stats.tags)
                  .filter((tag) => tag !== "no tag")
                  .map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
              </select>
            </label>
            {selectedGroup.shareToken ? (
              <a
                className="share-link"
                href={`/shared/${selectedGroup.shareToken}`}
                rel="noreferrer"
                target="_blank"
              >
                Open shared view
              </a>
            ) : null}
          </div>

          <TaskList
            tasks={visibleTasks}
            onDeleteTask={onTaskDelete}
            onMoveTask={onMoveTask}
            onToggleTask={onTaskToggle}
            onUpdateTask={onTaskUpdate}
          />
        </>
      ) : (
        <div className="empty-state">
          <h1>Create your first list</h1>
          <p>Start by adding a group on the left, then create tasks inside it.</p>
        </div>
      )}

      {message && !selectedGroup ? <p className="feedback">{message}</p> : null}
    </section>
  );
}
