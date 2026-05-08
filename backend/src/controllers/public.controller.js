const Group = require("../models/Group");
const Task = require("../models/Task");
const { buildGroupPayload } = require("../services/group.service");

async function getPublicGroup(req, res, next) {
  try {
    const group = await Group.findOne({
      shareToken: req.params.shareToken,
      isPublic: true,
    }).lean();

    if (!group) {
      return res.status(404).json({ message: "Shared group not found." });
    }

    const tasks = await Task.find({ group: group._id }).sort({
      position: 1,
      createdAt: 1,
    });

    return res.json(buildGroupPayload(group, tasks));
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getPublicGroup,
};
