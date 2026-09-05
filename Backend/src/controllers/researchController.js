import { z } from "zod";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ResearchSession } from "../models/ResearchSession.js";
import { runResearch, titleFromQuestion } from "../services/researchService.js";
import { subscribe } from "../services/eventBus.js";
const createSchema = z.object({
  researchQuestion: z.string().min(10).max(2000),
  objective: z.string().min(5).max(2000),
  depth: z.enum(["quick", "standard", "deep"]).default("standard"),
  maxSources: z.number().int().min(1).max(100).default(20),
  preferredDomains: z.array(z.string()).default([]),
});
const view = (s) => ({
  ...s.toObject(),
  id: s._id.toString(),
  userId: s.userId.toString(),
  sourcesCount: s.sources.length,
  evidenceCount: s.evidence.length,
  claimsCount: s.claims.length,
});
const owned = async (req, id) => {
  const s = await ResearchSession.findOne({ _id: id, userId: req.user._id });
  if (!s) {
    const e = new Error("Research session not found.");
    e.statusCode = 404;
    e.code = "RESEARCH_NOT_FOUND";
    throw e;
  }
  return s;
};
export async function createResearch(req, res) {
  const d = createSchema.parse({
    ...req.body,
    maxSources: Number(req.body.maxSources || 20),
  });
  const s = await ResearchSession.create({
    ...d,
    userId: req.user._id,
    title: titleFromQuestion(d.researchQuestion),
    demoMode: true,
  });
  res.status(201).json({ success: true, data: { session: view(s) } });
}
export async function listResearch(req, res) {
  const page = Math.max(1, Number(req.query.page) || 1),
    limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20)),
    filter = { userId: req.user._id };
  if (req.query.status) filter.status = req.query.status;
  const [ss, total] = await Promise.all([
    ResearchSession.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    ResearchSession.countDocuments(filter),
  ]);
  res.json({
    success: true,
    data: {
      sessions: ss.map(view),
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  });
}
export async function getResearch(req, res) {
  res.json({
    success: true,
    data: { session: view(await owned(req, req.params.id)) },
  });
}
export async function deleteResearch(req, res) {
  await owned(req, req.params.id);
  await ResearchSession.deleteOne({ _id: req.params.id, userId: req.user._id });
  res.json({ success: true, message: "Research session deleted." });
}
export async function startResearch(req, res) {
  const s = await owned(req, req.params.id);
  if (["researching", "planning"].includes(s.status))
    return res
      .status(409)
      .json({
        success: false,
        error: {
          code: "ALREADY_RUNNING",
          message: "Research is already running.",
        },
      });
  s.demoMode = req.body?.demoMode ?? s.demoMode;
  s.stopRequested = false;
  s.status = "planning";
  s.startedAt = new Date();
  await s.save();
  setImmediate(() => runResearch(s._id.toString()));
  res
    .status(202)
    .json({
      success: true,
      message: "Autonomous research initiated",
      sessionId: s._id.toString(),
      status: "planning",
    });
}
export async function stopResearch(req, res) {
  const s = await owned(req, req.params.id);
  if (!["planning", "researching"].includes(s.status))
    return res.json({
      success: true,
      message: "Research is not currently running.",
      data: { session: view(s) },
    });
  s.stopRequested = true;
  await s.save();
  res.json({
    success: true,
    message: "Stop requested.",
    data: { session: view(s) },
  });
}
export async function refineResearch(req, res) {
  const { feedback } = z
    .object({ feedback: z.string().min(3).max(2000) })
    .parse(req.body);
  const s = await owned(req, req.params.id);
  s.objective = `${s.objective}\nRefinement: ${feedback}`;
  s.status = "planning";
  s.stopRequested = false;
  await s.save();
  setImmediate(() => runResearch(s._id.toString()));
  res
    .status(202)
    .json({
      success: true,
      message: "Refinement cycle initiated.",
      sessionId: s._id.toString(),
      status: "planning",
    });
}
export async function events(req, res) {
  const token = req.query.token;
  if (token) {
    try {
      const p = jwt.verify(token, env.JWT_SECRET);
      req.user = { _id: p.sub };
    } catch {
      return res.status(401).end();
    }
  }
  if (!req.user) return res.status(401).end();
  const s = await owned(req, req.params.id);
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();
  for (const e of s.events.slice(-30)) {
    res.write(`event: ${e.type}\n`);
    res.write(
      `data: ${JSON.stringify({ ...e.toObject(), sessionId: s._id.toString(), timestamp: e.createdAt.toISOString() })}\n\n`,
    );
  }
  const off = subscribe(s._id.toString(), res);
  const hb = setInterval(() => res.write(": heartbeat\n\n"), 15000);
  req.on("close", () => {
    clearInterval(hb);
    off();
  });
}
const sub = (field) => (req, res) =>
  owned(req, req.params.id).then((s) =>
    res.json({ success: true, data: { [field]: s[field] } }),
  );
export const getSources = sub("sources");
export const getEvidence = sub("evidence");
export const getClaims = sub("claims");
export const getGaps = sub("gaps");
export const getConflicts = sub("conflicts");
export async function getReport(req, res) {
  const s = await owned(req, req.params.id);
  res.json({
    success: true,
    data: { report: s.report, status: s.status, title: s.title },
  });
}
export async function getEvaluation(req, res) {
  const s = await owned(req, req.params.id);
  res.json({ success: true, data: { evaluation: s.evaluation } });
}
