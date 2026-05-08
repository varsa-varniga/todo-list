import { useEffect, useMemo, useState } from "react";
import "./App.css";
import AuthPage from "./components/AuthPage";
import DashboardPage from "./components/DashboardPage";
import SharedGroupPage from "./components/SharedGroupPage";
import { apiFetch, tokenKey } from "./services/api";
import { emptyAuthForm } from "./utils/auth";

function App() {
  const shareToken = window.location.pathname.startsWith("/shared/")
    ? window.location.pathname.split("/shared/")[1]
    : null;

  const [token, setToken] = useState(() => localStorage.getItem(tokenKey) || "");
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState(emptyAuthForm());
  const [newGroupName, setNewGroupName] = useState("");
  const [newTask, setNewTask] = useState({ title: "", tags: "" });
  const [tagFilter, setTagFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [sharedGroup, setSharedGroup] = useState(null);

  useEffect(() => {
    if (shareToken) {
      setLoading(true);
      apiFetch(`/public/${shareToken}`)
        .then((data) => setSharedGroup(data))
        .catch((error) => setMessage(error.message))
        .finally(() => setLoading(false));
      return;
    }

    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    apiFetch("/auth/me", {}, token)
      .then((data) => {
        setUser(data.user);
        setGroups(data.groups);
        setSelectedGroupId((current) => current || data.groups[0]?.id || null);
      })
      .catch(() => {
        localStorage.removeItem(tokenKey);
        setToken("");
      })
      .finally(() => setLoading(false));
  }, [token, shareToken]);

  const selectedGroup = useMemo(
    () => groups.find((group) => group.id === selectedGroupId) || null,
    [groups, selectedGroupId],
  );

  const visibleTasks = useMemo(() => {
    if (!selectedGroup) {
      return [];
    }

    if (tagFilter === "all") {
      return selectedGroup.tasks;
    }

    if (tagFilter === "no tag") {
      return selectedGroup.tasks.filter((task) => task.tags.length === 0);
    }

    return selectedGroup.tasks.filter((task) => task.tags.includes(tagFilter));
  }, [selectedGroup, tagFilter]);

  function syncGroup(updatedGroup) {
    setGroups((current) => {
      const exists = current.some((group) => group.id === updatedGroup.id);
      return exists
        ? current.map((group) => (group.id === updatedGroup.id ? updatedGroup : group))
        : [...current, updatedGroup];
    });
    setSelectedGroupId(updatedGroup.id);
  }

  function removeGroup(groupId) {
    setGroups((current) => {
      const next = current.filter((group) => group.id !== groupId);
      if (selectedGroupId === groupId) {
        setSelectedGroupId(next[0]?.id || null);
      }
      return next;
    });
  }

  function updateAuthForm(field, value) {
    setAuthForm((current) => ({ ...current, [field]: value }));
  }

  function updateNewTask(field, value) {
    setNewTask((current) => ({ ...current, [field]: value }));
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const endpoint = authMode === "register" ? "/auth/register" : "/auth/login";
      const payload =
        authMode === "register"
          ? authForm
          : { email: authForm.email, password: authForm.password };

      const data = await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      localStorage.setItem(tokenKey, data.token);
      setToken(data.token);
      setUser(data.user);
      setGroups(data.groups || []);
      setSelectedGroupId(data.groups?.[0]?.id || null);
      setAuthForm(emptyAuthForm());
      setMessage(authMode === "register" ? "Account created." : "Welcome back.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    if (token) {
      try {
        await apiFetch("/auth/logout", { method: "POST" }, token);
      } catch {
        // Ignore logout errors and clear local session.
      }
    }

    localStorage.removeItem(tokenKey);
    setToken("");
    setUser(null);
    setGroups([]);
    setSelectedGroupId(null);
    setMessage("Logged out.");
  }

  async function handleCreateGroup(event) {
    event.preventDefault();
    if (!newGroupName.trim()) {
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const data = await apiFetch(
        "/groups",
        {
          method: "POST",
          body: JSON.stringify({ name: newGroupName }),
        },
        token,
      );

      syncGroup(data);
      setNewGroupName("");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRenameGroup() {
    if (!selectedGroup) {
      return;
    }

    const name = window.prompt("Rename list", selectedGroup.name);
    if (!name || name === selectedGroup.name) {
      return;
    }

    try {
      const data = await apiFetch(
        `/groups/${selectedGroup.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ name }),
        },
        token,
      );

      syncGroup(data);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleDeleteGroup() {
    if (!selectedGroup || !window.confirm(`Delete "${selectedGroup.name}"?`)) {
      return;
    }

    try {
      await apiFetch(`/groups/${selectedGroup.id}`, { method: "DELETE" }, token);
      removeGroup(selectedGroup.id);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleShareGroup() {
    if (!selectedGroup) {
      return;
    }

    try {
      const data = await apiFetch(`/groups/${selectedGroup.id}/share`, { method: "POST" }, token);
      syncGroup(data);
      const shareUrl = `${window.location.origin}/shared/${data.shareToken}`;
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setMessage("Public link copied to clipboard.");
      } else {
        setMessage(`Public link: ${shareUrl}`);
      }
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleCreateTask(event) {
    event.preventDefault();
    if (!selectedGroup || !newTask.title.trim()) {
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const data = await apiFetch(
        `/groups/${selectedGroup.id}/tasks`,
        {
          method: "POST",
          body: JSON.stringify(newTask),
        },
        token,
      );

      syncGroup(data);
      setNewTask({ title: "", tags: "" });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleTaskUpdate(taskId, updates) {
    try {
      const data = await apiFetch(
        `/tasks/${taskId}`,
        {
          method: "PATCH",
          body: JSON.stringify(updates),
        },
        token,
      );

      syncGroup(data);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleTaskDelete(taskId) {
    try {
      const data = await apiFetch(`/tasks/${taskId}`, { method: "DELETE" }, token);
      syncGroup(data);
    } catch (error) {
      setMessage(error.message);
    }
  }

  function handleMoveTask(task, direction) {
    if (!selectedGroup) {
      return;
    }

    const currentIndex = selectedGroup.tasks.findIndex((item) => item.id === task.id);
    const targetIndex = currentIndex + direction;

    if (targetIndex < 0 || targetIndex >= selectedGroup.tasks.length) {
      return;
    }

    const swapWith = selectedGroup.tasks[targetIndex];
    handleTaskUpdate(task.id, { position: swapWith.position });
    handleTaskUpdate(swapWith.id, { position: task.position });
  }

  if (loading) {
    return <div className="screen-message">Loading your todo workspace...</div>;
  }

  if (shareToken) {
    return <SharedGroupPage group={sharedGroup} message={message} />;
  }

  if (!token) {
    return (
      <AuthPage
        authForm={authForm}
        authMode={authMode}
        message={message}
        onFormChange={updateAuthForm}
        onModeChange={setAuthMode}
        onSubmit={handleAuthSubmit}
        submitting={submitting}
      />
    );
  }

  return (
    <DashboardPage
      groups={groups}
      message={message}
      newGroupName={newGroupName}
      newTask={newTask}
      onCreateGroup={handleCreateGroup}
      onCreateTask={handleCreateTask}
      onDeleteGroup={handleDeleteGroup}
      onGroupNameChange={setNewGroupName}
      onLogout={handleLogout}
      onMoveTask={handleMoveTask}
      onRenameGroup={handleRenameGroup}
      onSelectGroup={(groupId) => {
        setSelectedGroupId(groupId);
        setTagFilter("all");
      }}
      onShareGroup={handleShareGroup}
      onTagFilterChange={setTagFilter}
      onTaskChange={updateNewTask}
      onTaskDelete={handleTaskDelete}
      onTaskToggle={(task) => handleTaskUpdate(task.id, { completed: !task.completed })}
      onTaskUpdate={handleTaskUpdate}
      selectedGroup={selectedGroup}
      selectedGroupId={selectedGroupId}
      submitting={submitting}
      tagFilter={tagFilter}
      user={user}
      visibleTasks={visibleTasks}
    />
  );
}

export default App;
