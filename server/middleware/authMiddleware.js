import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import env from "../config/env.js";

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Authorization header must contain a Bearer token
  if (
    !authHeader ||
    typeof authHeader !== "string" ||
    !authHeader.startsWith("Bearer ")
  ) {
    throw new ApiError(401, "Authentication required.");
  }

  const token = authHeader.slice(7).trim();

  // Reject missing or obviously malformed tokens
  if (!token || token.split(".").length !== 3) {
    throw new ApiError(
      401,
      "Invalid authentication token."
    );
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret, {
      algorithms: ["HS256"],
    });

    // Token must contain a valid user ID
    if (!decoded || !decoded.userId) {
      throw new ApiError(
        401,
        "Invalid authentication token."
      );
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new ApiError(
        401,
        "User account no longer exists."
      );
    }

    // Immediately block disabled accounts
    if (!user.isActive) {
      throw new ApiError(
        403,
        "User account is inactive."
      );
    }

    // Attach authenticated user to request
    req.user = user;

    next();
  } catch (error) {
    // Preserve our intentional API errors
    if (error instanceof ApiError) {
      throw error;
    }

    // Hide JWT implementation details from clients
    throw new ApiError(
      401,
      "Invalid or expired authentication token."
    );
  }
});

export default protect;