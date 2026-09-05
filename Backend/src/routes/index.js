import express from "express";
import healthRoutes from "./healthRoutes.js";
import authRoutes from "./authRoutes.js";
import researchRoutes from "./researchRoutes.js";
const r = express.Router();
r.use("/", healthRoutes);
r.use("/auth", authRoutes);
r.use("/research", researchRoutes);
export default r;
