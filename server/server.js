import app from "./app.js";
import connectDB from "./config/db.js";
import env from "./config/env.js";
import "./utils/loadModels.js";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.port, () => {
      console.log(
        `School Management API running on http://localhost:${env.port}`
      );

      console.log(
        `Health check: http://localhost:${env.port}/api/health`
      );
    });
  } catch (error) {
    console.error("Server startup failed.");
    console.error(error.message);

    process.exit(1);
  }
};

startServer();