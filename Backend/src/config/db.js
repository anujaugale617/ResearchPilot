import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";
export async function connectDatabase() {
  if (!env.MONGODB_URI) throw new Error("MONGODB_URI is required");
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  logger.info("MongoDB connected");
}
export async function disconnectDatabase() {
  await mongoose.disconnect();
}
