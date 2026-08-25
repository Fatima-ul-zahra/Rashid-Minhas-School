import mongoose from "mongoose";

const getHealth = (req, res) => {
  const databaseState = mongoose.connection.readyState;

  const databaseStatus =
    databaseState === 1 ? "connected" : "disconnected";

  res.status(200).json({
    success: true,
    message: "School Management API is healthy.",
    data: {
      environment: process.env.NODE_ENV || "development",
      database: databaseStatus,
      timestamp: new Date().toISOString(),
    },
  });
};

export { getHealth };