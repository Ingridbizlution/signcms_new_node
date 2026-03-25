import path from "node:path";
import dotenv from "dotenv";

const rootEnvPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: rootEnvPath });

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.BACKEND_PORT || 3001),
  JWT_SECRET: process.env.JWT_SECRET || "signcms-dev-secret-change-me",
  DATABASE_URL: process.env.DATABASE_URL || "file:./backend/dev.db",
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || "http://localhost:8080",
  UPLOAD_DIR: process.env.UPLOAD_DIR || "backend/uploads",
};
