import mongoose from "mongoose";
import User from "./models/User.js";
import env from "./config/env.js";
import { hashPassword } from "./utils/password.js";

const newPassword = "8minschool.com";

try {
  await mongoose.connect(env.mongoUri);

  const hashedPassword = await hashPassword(newPassword);

  const admin = await User.findOneAndUpdate(
    { role: "admin" },
    { password: hashedPassword },
    { new: true }
  ).select("+password");

  if (!admin) {
    console.log("Admin user not found.");
  } else {
    console.log("Admin password reset successfully.");
    console.log("Email:", admin.email);
  }

  await mongoose.disconnect();
} catch (error) {
  console.error("Password reset failed:", error);
  process.exit(1);
}