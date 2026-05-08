const express = require("express"); // Changed to require
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUsers,
} = require("../controllers/user.controller");

// Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getUsers);

module.exports = router;
