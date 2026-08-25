import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import env from "./config/env.js";

import authRoutes from "./routes/authRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import schoolSettingsRoutes from "./routes/schoolSettingsRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import sectionRoutes from "./routes/sectionRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import admissionRoutes from "./routes/admissionRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

import notFoundMiddleware from "./middleware/notFoundMiddleware.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: "1mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

// Login rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many login attempts. Please try again later.",
  },
});

app.use("/api/auth/login", loginLimiter);

// API routes
app.use("/api/auth", authRoutes);

app.use("/api/health", healthRoutes);

app.use("/api/settings", schoolSettingsRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/students", studentRoutes);

app.use("/api/teachers", teacherRoutes);

app.use("/api/classes", classRoutes);

app.use("/api/sections", sectionRoutes);

app.use("/api/attendance", attendanceRoutes);

app.use("/api/admissions", admissionRoutes);

app.use("/api/announcements", announcementRoutes);

app.use("/api/gallery", galleryRoutes);

app.use("/api/reports", reportRoutes);

// API 404 handler
app.use(notFoundMiddleware);

// Central error handler
app.use(errorMiddleware);

export default app;