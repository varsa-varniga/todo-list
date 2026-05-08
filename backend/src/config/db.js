const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

async function connectDatabase() {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is missing in the backend .env file.");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(MONGO_URI);
  console.log("MongoDB connected");
}

module.exports = {
  connectDatabase,
};
