import express from "express";
import mongoose from "mongoose";
import { env } from "../config/env.js";
const r = express.Router();
r.get("/health", (req, res) =>
  res.json({
    success: true,
    message: "ResearchPilot API is running",
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    demoMode: env.DEMO_MODE,
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  }),
);
export default r;
