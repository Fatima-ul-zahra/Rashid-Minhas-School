import express from "express";
import path from "path";
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
import studentActivityRoutes from "./routes/studentActivityRoutes.js";
import studentDailyActivityRoutes from "./routes/studentDailyActivityRoutes.js";
import feeRoutes from "./routes/feeRoutes.js";
import feeStructureRoutes from "./routes/feeStructureRoutes.js";

import notFoundMiddleware from "./middleware/notFoundMiddleware.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();

if (env.nodeEnv === "production") {
  app.set("trust proxy", 1);
}


// ==========================================
// Static uploads
// ==========================================

app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), "uploads"),
    {
      index: false,
      dotfiles: "deny",
      maxAge:
        env.nodeEnv === "production"
          ? "7d"
          : 0,
    }
  )
);


// ==========================================
// Security headers
// ==========================================

app.use(helmet());


// ==========================================
// CORS
// ==========================================

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // such as server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      if (origin === env.clientUrl) {
        return callback(null, true);
      }

      return callback(
        new Error("CORS origin not allowed."),
        false
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    optionsSuccessStatus: 204,
  })
);


// ==========================================
// Body parsing
// ==========================================

app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);


// ==========================================
// Rate limiting
// ==========================================

// Strict protection for login attempts
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

// General API protection
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many requests. Please try again later.",
  },

  skip: (req) => {
    // Login has its own stricter rate limiter
    if (req.path === "/auth/login") {
      return true;
    }

    // Health checks should remain unrestricted
    if (req.path === "/health") {
      return true;
    }

    return false;
  },
});

// Apply strict login limiter
app.use(
  "/api/auth/login",
  loginLimiter
);

// Apply general API limiter
app.use(
  "/api",
  apiLimiter
);

// ==========================================
// API Routes
// ==========================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/health",
  healthRoutes
);

app.use(
  "/api/settings",
  schoolSettingsRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/students",
  studentRoutes
);

app.use(
  "/api/student-activities",
  studentActivityRoutes
);

app.use(
  "/api/student-daily-activities",
  studentDailyActivityRoutes
);

app.use(
  "/api/teachers",
  teacherRoutes
);

app.use(
  "/api/classes",
  classRoutes
);

app.use(
  "/api/sections",
  sectionRoutes
);

app.use(
  "/api/attendance",
  attendanceRoutes
);

app.use(
  "/api/admissions",
  admissionRoutes
);

app.use(
  "/api/announcements",
  announcementRoutes
);

app.use(
  "/api/gallery",
  galleryRoutes
);

app.use(
  "/api/reports",
  reportRoutes
);

app.use(
  "/api/fees",
  feeRoutes
);

app.use(
  "/api/fee-structures",
  feeStructureRoutes
);

// ==========================================
// API 404 Handler
// ==========================================

app.use(notFoundMiddleware);


// ==========================================
// Central Error Handler
// ==========================================

app.use(errorMiddleware);


export default app;