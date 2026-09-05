import express from "express";
import { authRateLimiter } from "../middleware/rateLimiter.js";
import { requireAuth } from "../middleware/auth.js";
import {
  register,
  loginUser,
  me,
  logout,
} from "../controllers/authController.js";
const r = express.Router();
r.post("/register", authRateLimiter, register);
r.post("/login", authRateLimiter, loginUser);
r.get("/me", requireAuth, me);
r.post("/logout", requireAuth, logout);
export default r;
