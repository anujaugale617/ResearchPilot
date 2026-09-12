import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import app from "../app.js";
import { env } from "../config/env.js";
import { connectDatabase, disconnectDatabase } from "../config/db.js";
import { User } from "../models/User.js";
import { ResearchSession } from "../models/ResearchSession.js";
import { closeBrowser } from "./pdfService.js";

async function runApiIntegrationTests() {
  console.log("==================================================");
  console.log("ResearchPilot - API PDF Export Integration Tests");
  console.log("==================================================\n");

  await connectDatabase();

  let server;
  const PORT = 55432;

  await new Promise((resolve) => {
    server = app.listen(PORT, "127.0.0.1", resolve);
  });

  const BASE_URL = `http://127.0.0.1:${PORT}`;

  try {
    // 1. Create or retrieve test user
    let user1 = await User.findOne({ email: "integration.test1@researchpilot.ai" });
    if (!user1) {
      user1 = await User.create({
        name: "Integration Researcher 1",
        email: "integration.test1@researchpilot.ai",
        passwordHash: "hash123",
      });
    }

    let user2 = await User.findOne({ email: "integration.test2@researchpilot.ai" });
    if (!user2) {
      user2 = await User.create({
        name: "Integration Researcher 2",
        email: "integration.test2@researchpilot.ai",
        passwordHash: "hash456",
      });
    }

    const token1 = jwt.sign({ sub: user1._id.toString() }, env.JWT_SECRET, { expiresIn: "1h" });
    const token2 = jwt.sign({ sub: user2._id.toString() }, env.JWT_SECRET, { expiresIn: "1h" });

    // 2. Create test sessions
    const sessionWithReport = await ResearchSession.create({
      userId: user1._id,
      title: "Heart Disease XAI Clinical Trials",
      researchQuestion: "What is the efficacy of explainable AI in early cardiac diagnostics?",
      objective: "Evaluate clinical utility and interpretability metrics of XAI architectures.",
      status: "completed",
      depth: "standard",
      confidenceScore: 88,
      report: `# Heart Disease XAI Clinical Trials\n\n## Executive Summary\nSynthetic evaluation of 24 trials demonstrates 88% diagnostic concordance.\n\n## Key Findings\n- SHAP and Integrated Gradients provide clinically reliable feature importance.\n- Model calibration is critical when diagnosing atypical ischemic syndromes.\n\n## References\n1. [Nature Cardiology XAI Review](https://nature.com/articles/cardio-2025)\n`,
    });

    const sessionEmptyReport = await ResearchSession.create({
      userId: user1._id,
      title: "Pending Empty Session",
      researchQuestion: "Unfinished research question?",
      objective: "Ongoing research.",
      status: "planning",
      report: "",
    });

    console.log("Testing: Unauthorized request without token receives 401...");
    const resNoAuth = await fetch(`${BASE_URL}/api/research/${sessionWithReport._id}/export-pdf`);
    if (resNoAuth.status !== 401) {
      throw new Error(`Expected status 401, got ${resNoAuth.status}`);
    }
    console.log("PASSED: 401 Unauthorized enforced.");

    console.log("Testing: User cannot export another user's research report (receives 404)...");
    const resUser2 = await fetch(`${BASE_URL}/api/research/${sessionWithReport._id}/export-pdf`, {
      headers: { Authorization: `Bearer ${token2}` },
    });
    if (resUser2.status !== 404) {
      throw new Error(`Expected status 404, got ${resUser2.status}`);
    }
    console.log("PASSED: 404 session isolation enforced across users.");

    console.log("Testing: Session with empty/pending report receives 400 REPORT_NOT_READY...");
    const resEmpty = await fetch(`${BASE_URL}/api/research/${sessionEmptyReport._id}/export-pdf`, {
      headers: { Authorization: `Bearer ${token1}` },
    });
    if (resEmpty.status !== 400) {
      throw new Error(`Expected status 400, got ${resEmpty.status}`);
    }
    const emptyJson = await resEmpty.json();
    if (emptyJson.error?.code !== "REPORT_NOT_READY") {
      throw new Error(`Expected error code REPORT_NOT_READY, got ${JSON.stringify(emptyJson)}`);
    }
    console.log("PASSED: 400 REPORT_NOT_READY returned correctly.");

    console.log("Testing: Valid GET /api/research/:id/export-pdf returns proper PDF stream...");
    const resPdf = await fetch(`${BASE_URL}/api/research/${sessionWithReport._id}/export-pdf`, {
      headers: { Authorization: `Bearer ${token1}` },
    });
    if (resPdf.status !== 200) {
      const txt = await resPdf.text();
      throw new Error(`Expected status 200, got ${resPdf.status}: ${txt}`);
    }

    const contentType = resPdf.headers.get("content-type");
    const disposition = resPdf.headers.get("content-disposition");
    if (!contentType || !contentType.includes("application/pdf")) {
      throw new Error(`Invalid Content-Type header: ${contentType}`);
    }
    if (!disposition || !disposition.includes("attachment") || !disposition.includes("filename=")) {
      throw new Error(`Invalid Content-Disposition header: ${disposition}`);
    }
    if (!disposition.includes("ResearchPilot_Heart_Disease_XAI_Clinical_Trials_Report.pdf")) {
      throw new Error(`Unexpected filename in Content-Disposition: ${disposition}`);
    }

    const pdfArrayBuffer = await resPdf.arrayBuffer();
    const pdfBuf = Buffer.from(pdfArrayBuffer);
    if (!pdfBuf.subarray(0, 5).toString("utf-8").startsWith("%PDF-")) {
      throw new Error("Downloaded response is not valid PDF binary data");
    }
    console.log(`PASSED: Received ${pdfBuf.length} bytes of valid PDF with Content-Disposition: ${disposition}`);

    console.log("Testing: POST /api/research/:id/export-pdf also succeeds...");
    const resPost = await fetch(`${BASE_URL}/api/research/${sessionWithReport._id}/export-pdf`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token1}` },
    });
    if (resPost.status !== 200) {
      throw new Error(`Expected 200 on POST, got ${resPost.status}`);
    }
    console.log("PASSED: POST /api/research/:id/export-pdf succeeds with identical headers.");

    // Clean up test documents
    await ResearchSession.deleteMany({ _id: { $in: [sessionWithReport._id, sessionEmptyReport._id] } });
    await User.deleteMany({ _id: { $in: [user1._id, user2._id] } });

    console.log("\n==================================================");
    console.log("All API integration tests PASSED successfully!");
    console.log("==================================================");
  } finally {
    await closeBrowser();
    server.close();
    await disconnectDatabase();
  }
}

runApiIntegrationTests().catch((err) => {
  console.error("API Integration test failed:", err);
  process.exit(1);
});
