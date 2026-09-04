import dotenv from "dotenv";

dotenv.config();

const requiredEnvVariables = [
  "MONGO_URI",
  "JWT_SECRET",
];

for (const variable of requiredEnvVariables) {
  if (!process.env[variable]) {
    throw new Error(
      `Missing required environment variable: ${variable}`
    );
  }
}

// CLIENT_URL is required in production
if (
  process.env.NODE_ENV === "production" &&
  !process.env.CLIENT_URL
) {
  throw new Error(
    "CLIENT_URL is required in production."
  );
}

const env = {
  port: Number(process.env.PORT) || 5000,

  nodeEnv:
    process.env.NODE_ENV || "development",

  mongoUri:
    process.env.MONGO_URI,

  clientUrl:
    process.env.CLIENT_URL ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:5173"
      : ""),

  jwtSecret:
    process.env.JWT_SECRET,

  jwtExpiresIn:
    process.env.JWT_EXPIRES_IN || "1d",
};

export default env;