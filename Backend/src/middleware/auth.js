import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
export async function requireAuth(req, res, next) {
  try {
    const h = req.headers.authorization || "";
    const token = h.startsWith("Bearer ") ? h.slice(7) : null;
    if (!token)
      return res
        .status(401)
        .json({
          success: false,
          error: { code: "UNAUTHORIZED", message: "Authentication required." },
        });
    const p = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(p.sub);
    if (!user)
      return res
        .status(401)
        .json({
          success: false,
          error: { code: "UNAUTHORIZED", message: "User no longer exists." },
        });
    req.user = user;
    next();
  } catch {
    return res
      .status(401)
      .json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Invalid or expired token." },
      });
  }
}
