const express = require("express");

const groupController = require("../controllers/group.controller");
const taskController = require("../controllers/task.controller");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware);

router.get("/", groupController.listGroups);
router.post("/", groupController.createGroup);
router.get("/:groupId", groupController.getGroup);
router.patch("/:groupId", groupController.updateGroup);
router.delete("/:groupId", groupController.deleteGroup);
router.post("/:groupId/share", groupController.shareGroup);
router.post("/:groupId/tasks", taskController.createTask);

module.exports = router;
