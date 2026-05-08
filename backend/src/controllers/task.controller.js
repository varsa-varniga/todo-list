const Group = require("../models/Group");
const Task = require("../models/Task");
const { buildGroupPayload } = require("../services/group.service");

async function loadOwnedGroup(groupId, userId) {
  return Group.findOne({ _id: groupId, user: userId });
}

async function groupResponse(groupId, userId) {
  const group = await Group.findOne({ _id: groupId, user: userId }).lean();
  const tasks = await Task.find({ group: groupId, user: userId }).sort({
    position: 1,
    createdAt: 1,
  });

  return buildGroupPayload(group, tasks);
}

function parseTags(tags) {
  if (Array.isArray(tags)) {
    return tags
      .map((tag) => String(tag).trim().toLowerCase())
      .filter(Boolean);
  }

  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);
  }

  return [];
}

async function createTask(req, res, next) {
  try {
    const { title, tags } = req.body;
    const group = await loadOwnedGroup(req.params.groupId, req.user._id);

    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    if (!title) {
      return res.status(400).json({ message: "Task title is required." });
    }

    const lastTask = await Task.findOne({ group: group._id, user: req.user._id }).sort({
      position: -1,
    });

    const task = await Task.create({
      user: req.user._id,
      group: group._id,
      title,
      tags: parseTags(tags),
      position: lastTask ? lastTask.position + 1 : 0,
    });

    group.tasks.push(task._id);
    await group.save();

    return res.status(201).json(await groupResponse(group._id, req.user._id));
  } catch (error) {
    return next(error);
  }
}

async function updateTask(req, res, next) {
  try {
    const task = await Task.findOne({ _id: req.params.taskId, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    const { title, completed, tags, position } = req.body;

    if (title !== undefined) {
      task.title = title;
    }

    if (completed !== undefined) {
      task.completed = Boolean(completed);
    }

    if (tags !== undefined) {
      task.tags = parseTags(tags);
    }

    if (position !== undefined && Number.isFinite(Number(position))) {
      task.position = Number(position);
    }

    await task.save();

    return res.json(await groupResponse(task.group, req.user._id));
  } catch (error) {
    return next(error);
  }
}

async function deleteTask(req, res, next) {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.taskId, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    await Group.updateOne({ _id: task.group }, { $pull: { tasks: task._id } });
    return res.json(await groupResponse(task.group, req.user._id));
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createTask,
  deleteTask,
  updateTask,
};
