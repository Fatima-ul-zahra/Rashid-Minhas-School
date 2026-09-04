import mongoose from "mongoose";
import env from "./env.js";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 2,
    });

    console.log(
      `MongoDB connected: ${connection.connection.host}`
    );

    console.log(
      `Database: ${connection.connection.name}`
    );

    mongoose.connection.on("error", (error) => {
      console.error(
        "MongoDB runtime error:",
        error.message
      );
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected.");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected.");
    });
  } catch (error) {
    console.error("MongoDB connection failed.");
    console.error(error.message);

    process.exit(1);
  }
};

export default connectDB;