import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../models/User.js";
import { signToken } from "../utils/tokens.js";
const reg = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8).max(128),
  }),
  login = z.object({ email: z.string().email(), password: z.string().min(1) });
export async function register(req, res) {
  const d = reg.parse(req.body),
    email = d.email.toLowerCase();
  if (await User.findOne({ email }))
    return res
      .status(409)
      .json({
        success: false,
        error: {
          code: "EMAIL_EXISTS",
          message: "An account with this email already exists.",
        },
      });
  const u = await User.create({
    name: d.name,
    email,
    passwordHash: await bcrypt.hash(d.password, 12),
  });
  res
    .status(201)
    .json({ success: true, data: { user: u.toPublic(), token: signToken(u) } });
}
export async function loginUser(req, res) {
  const d = login.parse(req.body),
    u = await User.findOne({ email: d.email.toLowerCase() });
  if (!u || !(await bcrypt.compare(d.password, u.passwordHash)))
    return res
      .status(401)
      .json({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Email or password is incorrect.",
        },
      });
  res.json({
    success: true,
    data: { user: u.toPublic(), token: signToken(u) },
  });
}
export async function me(req, res) {
  res.json({ success: true, data: { user: req.user.toPublic() } });
}
export async function logout(req, res) {
  res.json({ success: true, message: "Logged out successfully" });
}
