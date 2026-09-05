import mongoose from "mongoose";
const source = new mongoose.Schema(
  {
    title: String,
    url: String,
    domain: String,
    snippet: String,
    score: Number,
    publishedAt: String,
    sourceType: { type: String, default: "web" },
  },
  { _id: true },
);
const evidence = new mongoose.Schema(
  {
    claim: String,
    sourceId: mongoose.Schema.Types.ObjectId,
    confidence: Number,
    topic: String,
    excerpt: String,
  },
  { _id: true },
);
const claim = new mongoose.Schema(
  {
    text: String,
    confidence: Number,
    evidenceIds: [mongoose.Schema.Types.ObjectId],
    citations: [String],
  },
  { _id: true },
);
const gap = new mongoose.Schema(
  {
    description: String,
    importance: String,
    status: String,
    resolutionQuery: String,
  },
  { _id: true },
);
const conflict = new mongoose.Schema(
  {
    topic: String,
    claimA: String,
    claimB: String,
    resolution: String,
    confidence: Number,
  },
  { _id: true },
);
const event = new mongoose.Schema(
  {
    type: String,
    stage: String,
    progress: Number,
    message: String,
    metadata: mongoose.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
);
const evaluation = new mongoose.Schema(
  {
    coverage: Number,
    evidence: Number,
    citation: Number,
    sourceQuality: Number,
    consistency: Number,
    recommendations: [String],
  },
  { _id: false },
);
const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    researchQuestion: { type: String, required: true },
    objective: { type: String, required: true },
    depth: {
      type: String,
      enum: ["quick", "standard", "deep"],
      default: "standard",
    },
    maxSources: { type: Number, default: 20 },
    preferredDomains: { type: [String], default: [] },
    demoMode: { type: Boolean, default: true },
    status: {
      type: String,
      enum: [
        "draft",
        "planning",
        "researching",
        "completed",
        "stopped",
        "failed",
      ],
      default: "draft",
    },
    progress: { type: Number, default: 0 },
    currentStage: { type: String, default: "initialized" },
    confidenceScore: { type: Number, default: 0 },
    startedAt: Date,
    completedAt: Date,
    stoppedAt: Date,
    sources: { type: [source], default: [] },
    evidence: { type: [evidence], default: [] },
    claims: { type: [claim], default: [] },
    gaps: { type: [gap], default: [] },
    conflicts: { type: [conflict], default: [] },
    events: { type: [event], default: [] },
    report: { type: String, default: "" },
    evaluation: { type: evaluation, default: null },
    stopRequested: { type: Boolean, default: false },
  },
  { timestamps: true },
);
schema.index({ userId: 1, createdAt: -1 });
export const ResearchSession = mongoose.model("ResearchSession", schema);
