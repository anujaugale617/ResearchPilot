import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  SERVER_URL: process.env.SERVER_URL || "http://localhost:5000",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  MONGODB_URI: process.env.MONGODB_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "change-me-in-production",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  AI_PROVIDER: process.env.AI_PROVIDER || "mock",
  AI_MODEL: process.env.AI_MODEL || "gemini-2.5-flash",
  AI_API_KEY: process.env.AI_API_KEY || "",
  TAVILY_API_KEY: process.env.TAVILY_API_KEY || "",
  DEMO_MODE:
    process.env.DEMO_MODE === undefined
      ? true
      : process.env.DEMO_MODE === "true",
};
