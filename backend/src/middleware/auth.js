const User = require("../models/User");

async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const user = await User.findOne({ authTokens: token });

    if (!user) {
      return res.status(401).json({ message: "Invalid session." });
    }

    req.user = user;
    req.token = token;
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = authMiddleware;
