import ContentArea from "./dashboard/ContentArea";
import Sidebar from "./dashboard/Sidebar";
import StatsPanel from "./dashboard/StatsPanel";

export default function DashboardPage(props) {
  return (
    <main className="app-shell">
      <Sidebar
        groups={props.groups}
        newGroupName={props.newGroupName}
        selectedGroupId={props.selectedGroupId}
        submitting={props.submitting}
        user={props.user}
        onCreateGroup={props.onCreateGroup}
        onGroupNameChange={props.onGroupNameChange}
        onLogout={props.onLogout}
        onSelectGroup={props.onSelectGroup}
      />

      <ContentArea
        message={props.message}
        newTask={props.newTask}
        selectedGroup={props.selectedGroup}
        submitting={props.submitting}
        tagFilter={props.tagFilter}
        visibleTasks={props.visibleTasks}
        onCreateTask={props.onCreateTask}
        onDeleteGroup={props.onDeleteGroup}
        onMoveTask={props.onMoveTask}
        onRenameGroup={props.onRenameGroup}
        onShareGroup={props.onShareGroup}
        onTagFilterChange={props.onTagFilterChange}
        onTaskChange={props.onTaskChange}
        onTaskDelete={props.onTaskDelete}
        onTaskToggle={props.onTaskToggle}
        onTaskUpdate={props.onTaskUpdate}
      />

      <StatsPanel message={props.message} selectedGroup={props.selectedGroup} />
    </main>
  );
}
