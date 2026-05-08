const crypto = require("crypto");
const bcrypt = require("bcryptjs");

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function comparePassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

function createToken() {
  return crypto.randomBytes(24).toString("hex");
}

module.exports = {
  comparePassword,
  createToken,
  hashPassword,
};
