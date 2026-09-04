import mongoose from "mongoose";
import multer from "multer";
import ApiError from "../utils/ApiError.js";

const errorMiddleware = (error, req, res, next) => {
  console.error(error);

  let statusCode = error.statusCode || 500;
  let message =
    error.message || "An unexpected server error occurred.";
  let errors = error.errors || null;

  // Mongoose validation error
  if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Validation failed.";

    errors = Object.values(error.errors).map((item) => ({
      field: item.path,
      message: item.message,
    }));
  }

  // Invalid MongoDB ObjectId
  if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = "Invalid resource ID.";
    errors = null;
  }

  // MongoDB duplicate key error
  if (error.code === 11000) {
    statusCode = 409;

    const duplicateFields = Object.keys(error.keyPattern || {});

    if (duplicateFields.length > 0) {
      message = `A record with the same ${duplicateFields.join(
        ", "
      )} already exists.`;
    } else {
      message = "A record with the same value already exists.";
    }

    errors = null;
  }

  // Multer upload errors
  if (error instanceof multer.MulterError) {
    statusCode = 400;

    if (error.code === "LIMIT_FILE_SIZE") {
      message = "Uploaded file is too large.";
    } else if (error.code === "LIMIT_FILE_COUNT") {
      message = "Too many files uploaded.";
    } else if (error.code === "LIMIT_UNEXPECTED_FILE") {
      message = "Unexpected file uploaded.";
    } else {
      message = "File upload failed.";
    }

    errors = null;
  }

  // Unexpected errors must not expose internal details
  if (statusCode >= 500) {
    statusCode = 500;
    message = "An unexpected server error occurred.";
    errors = null;
  }

  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  // Stack traces only during development
  if (process.env.NODE_ENV === "development") {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};

export default errorMiddleware;