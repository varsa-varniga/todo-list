const Group = require("../models/Group");
const Task = require("../models/Task");
const User = require("../models/User");
const { buildGroupPayload } = require("../services/group.service");
const { comparePassword, createToken, hashPassword } = require("../utils/auth");

async function getGroupCollection(userId) {
  const groups = await Group.find({ user: userId }).sort({ createdAt: 1 }).lean();
  const tasks = await Task.find({ user: userId }).sort({ position: 1, createdAt: 1 }).lean();

  return groups.map((group) =>
    buildGroupPayload(
      group,
      tasks.filter((task) => String(task.group) === String(group._id)),
    ),
  );
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const token = createToken();
    const user = await User.create({
      name,
      email,
      passwordHash: await hashPassword(password),
      authTokens: [token],
    });

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      groups: [],
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: String(email || "").toLowerCase() });

    const passwordMatches = user
      ? await comparePassword(password || "", user.passwordHash)
      : false;

    if (!user || !passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = createToken();
    user.authTokens.push(token);
    await user.save();

    const groups = await getGroupCollection(user._id);

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      groups,
    });
  } catch (error) {
    return next(error);
  }
}

async function me(req, res, next) {
  try {
    const groups = await getGroupCollection(req.user._id);

    return res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
      groups,
    });
  } catch (error) {
    return next(error);
  }
}

async function logout(req, res, next) {
  try {
    req.user.authTokens = req.user.authTokens.filter((token) => token !== req.token);
    await req.user.save();
    return res.json({ message: "Logged out." });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
  logout,
  me,
  register,
};
