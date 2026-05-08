require("dotenv").config();

const app = require("./src/app");
const { connectDatabase } = require("./src/config/db");

const PORT = process.env.PORT || 8080;

async function startServer() {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

startServer();
