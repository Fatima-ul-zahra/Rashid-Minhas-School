import express from "express";

import {
  authStatus,
  setupAdmin,
  login,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", authStatus);

router.post("/setup-admin", setupAdmin);

router.post("/login", login);

router.get(
  "/me",
  protect,
  (req, res) => {
    res.status(200).json({
      success: true,
      data: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  }
);

router.get(
  "/admin-test",
  protect,
  authorize("admin"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Admin authorization successful.",
    });
  }
);

export default router;