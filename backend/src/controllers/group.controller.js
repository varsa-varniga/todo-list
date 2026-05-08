const crypto = require("crypto");

const Group = require("../models/Group");
const Task = require("../models/Task");
const { buildGroupPayload } = require("../services/group.service");

async function loadGroupWithTasks(groupId, userId) {
  const group = await Group.findOne({ _id: groupId, user: userId }).lean();

  if (!group) {
    return null;
  }

  const tasks = await Task.find({ group: groupId, user: userId }).sort({
    position: 1,
    createdAt: 1,
  });

  return buildGroupPayload(group, tasks);
}

async function listGroups(req, res, next) {
  try {
    const groups = await Group.find({ user: req.user._id }).sort({ createdAt: 1 }).lean();
    const tasks = await Task.find({ user: req.user._id }).sort({ position: 1, createdAt: 1 }).lean();

    const payload = groups.map((group) =>
      buildGroupPayload(
        group,
        tasks.filter((task) => String(task.group) === String(group._id)),
      ),
    );

    return res.json(payload);
  } catch (error) {
    return next(error);
  }
}

async function createGroup(req, res, next) {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Group name is required." });
    }

    const group = await Group.create({
      user: req.user._id,
      name,
    });

    req.user.groups.push(group._id);
    await req.user.save();

    const payload = await loadGroupWithTasks(group._id, req.user._id);
    return res.status(201).json(payload);
  } catch (error) {
    return next(error);
  }
}

async function getGroup(req, res, next) {
  try {
    const payload = await loadGroupWithTasks(req.params.groupId, req.user._id);

    if (!payload) {
      return res.status(404).json({ message: "Group not found." });
    }

    return res.json(payload);
  } catch (error) {
    return next(error);
  }
}

async function updateGroup(req, res, next) {
  try {
    const { name } = req.body;
    const group = await Group.findOne({ _id: req.params.groupId, user: req.user._id });

    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    if (name) {
      group.name = name;
    }

    await group.save();

    const payload = await loadGroupWithTasks(group._id, req.user._id);
    return res.json(payload);
  } catch (error) {
    return next(error);
  }
}

async function deleteGroup(req, res, next) {
  try {
    const group = await Group.findOneAndDelete({ _id: req.params.groupId, user: req.user._id });

    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    await Task.deleteMany({ group: group._id, user: req.user._id });
    req.user.groups = req.user.groups.filter((id) => String(id) !== String(group._id));
    await req.user.save();

    return res.json({ id: group._id, message: "Group deleted." });
  } catch (error) {
    return next(error);
  }
}

async function shareGroup(req, res, next) {
  try {
    const group = await Group.findOne({ _id: req.params.groupId, user: req.user._id });

    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    if (!group.shareToken) {
      group.shareToken = crypto.randomBytes(12).toString("hex");
    }

    group.isPublic = true;
    await group.save();

    const payload = await loadGroupWithTasks(group._id, req.user._id);
    return res.json(payload);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createGroup,
  deleteGroup,
  getGroup,
  listGroups,
  shareGroup,
  updateGroup,
};
