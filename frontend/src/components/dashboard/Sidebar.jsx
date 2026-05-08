export default function Sidebar({
  groups,
  newGroupName,
  selectedGroupId,
  submitting,
  user,
  onCreateGroup,
  onGroupNameChange,
  onLogout,
  onSelectGroup,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div>
          <p className="eyebrow">Welcome</p>
          <h2>{user?.name}</h2>
        </div>
        <button className="ghost-button" onClick={onLogout} type="button">
          Logout
        </button>
      </div>

      <div className="sidebar-section">
        <div className="section-heading">
          <span>My Lists</span>
        </div>
        <ul className="group-list">
          {groups.map((group) => (
            <li key={group.id}>
              <button
                className={selectedGroupId === group.id ? "group-button active" : "group-button"}
                onClick={() => onSelectGroup(group.id)}
                type="button"
              >
                <span>{group.name}</span>
                <span>{group.stats.total}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <form className="inline-form" onSubmit={onCreateGroup}>
        <input
          value={newGroupName}
          onChange={(event) => onGroupNameChange(event.target.value)}
          placeholder="New list name"
        />
        <button className="primary-button" disabled={submitting} type="submit">
          Add List
        </button>
      </form>
    </aside>
  );
}
