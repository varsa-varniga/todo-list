function buildGroupStats(tasks) {
  const stats = {
    total: tasks.length,
    completed: 0,
    pending: 0,
    tags: {},
  };

  tasks.forEach((task) => {
    if (task.completed) {
      stats.completed += 1;
    } else {
      stats.pending += 1;
    }

    if (!task.tags.length) {
      stats.tags["no tag"] = (stats.tags["no tag"] || 0) + 1;
      return;
    }

    task.tags.forEach((tag) => {
      stats.tags[tag] = (stats.tags[tag] || 0) + 1;
    });
  });

  return stats;
}

function normalizeTask(task) {
  return {
    id: task._id,
    title: task.title,
    completed: task.completed,
    tags: task.tags,
    position: task.position,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

function buildGroupPayload(group, tasks) {
  const orderedTasks = [...tasks].sort((a, b) => a.position - b.position);

  return {
    id: group._id,
    name: group.name,
    isPublic: group.isPublic,
    shareToken: group.shareToken,
    shareUrl: group.shareToken
      ? `/shared/${group.shareToken}`
      : null,
    tasks: orderedTasks.map(normalizeTask),
    stats: buildGroupStats(orderedTasks),
    createdAt: group.createdAt,
    updatedAt: group.updatedAt,
  };
}

module.exports = {
  buildGroupPayload,
};
