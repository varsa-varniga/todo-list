const express = require("express");

const publicController = require("../controllers/public.controller");

const router = express.Router();

router.get("/:shareToken", publicController.getPublicGroup);

module.exports = router;
