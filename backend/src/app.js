const cors = require("cors");
const express = require("express");

const authRoutes = require("./routes/auth.routes");
const groupRoutes = require("./routes/group.routes");
const publicRoutes = require("./routes/public.routes");
const taskRoutes = require("./routes/task.routes");


const app = express();

app.use(
  cors({
    origin: true,
    credentials: false,
  }),
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/public", publicRoutes);

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  console.error(error);
  return res.status(error.statusCode || 500).json({
    message: error.message || "Something went wrong.",
  });
});

module.exports = app;
