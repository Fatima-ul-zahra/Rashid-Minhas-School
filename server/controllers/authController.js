import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";

const authStatus = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authentication API is ready.",
  });
};

const setupAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(
      400,
      "Name, email and password are required."
    );
  }

  if (password.length < 8) {
    throw new ApiError(
      400,
      "Password must contain at least 8 characters."
    );
  }

  const existingAdmin = await User.findOne({
    role: "admin",
  });

  if (existingAdmin) {
    throw new ApiError(
      409,
      "An administrator has already been configured."
    );
  }

  const existingUser = await User.findOne({
    email: email.toLowerCase(),
  });

  if (existingUser) {
    throw new ApiError(
      409,
      "A user with this email already exists."
    );
  }

  const hashedPassword = await hashPassword(password);

  const admin = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: "admin",
    isActive: true,
  });

  res.status(201).json({
    success: true,
    message: "Administrator created successfully.",
    data: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(
      400,
      "Email and password are required."
    );
  }

  const user = await User.findOne({
    email: email.toLowerCase(),
  }).select("+password");

  if (!user) {
    throw new ApiError(
      401,
      "Invalid email or password."
    );
  }

  if (!user.isActive) {
    throw new ApiError(
      403,
      "This account has been deactivated."
    );
  }

  const passwordMatches = await comparePassword(
    password,
    user.password
  );

  if (!passwordMatches) {
    throw new ApiError(
      401,
      "Invalid email or password."
    );
  }

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user);

  res.status(200).json({
    success: true,
    message: "Login successful.",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    },
  });
});

export {
  authStatus,
  setupAdmin,
  login,
};