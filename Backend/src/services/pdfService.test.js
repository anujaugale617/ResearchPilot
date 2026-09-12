import fs from "fs";
import path from "path";
import { generatePdf, generatePdfFilename, buildAcademicHtml, closeBrowser } from "./pdfService.js";

async function runTests() {
  console.log("==================================================");
  console.log("ResearchPilot - PDF Generation Comprehensive Tests");
  console.log("==================================================\n");

  const testOutputDir = path.resolve("test_output");
  if (!fs.existsSync(testOutputDir)) {
    fs.mkdirSync(testOutputDir, { recursive: true });
  }

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      process.stdout.write(`Testing: ${name}... `);
      await fn();
      console.log("PASSED");
      passed++;
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
      failed++;
    }
  }

  // TEST 1: Filename Sanitizer
  await test("Filename sanitization for various title inputs", async () => {
    const fn1 = generatePdfFilename("Impact of Generative AI on Software Engineering (2030)?");
    if (!fn1.startsWith("ResearchPilot_") || !fn1.endsWith(".pdf") || fn1.includes("?")) {
      throw new Error(`Unexpected filename: ${fn1}`);
    }

    const fn2 = generatePdfFilename("Heart Disease: XAI & Clinical Decisions / Multi-Modal *Analysis*");
    if (fn2.includes(":") || fn2.includes("/") || fn2.includes("*")) {
      throw new Error(`Invalid characters in filename: ${fn2}`);
    }

    const fnEmpty = generatePdfFilename("");
    if (fnEmpty !== "ResearchPilot_Report_Report.pdf" && fnEmpty !== "ResearchPilot_Research_Report_Report.pdf") {
      // should produce safe default
      if (!fnEmpty.endsWith(".pdf")) throw new Error(`Filename should end in .pdf: ${fnEmpty}`);
    }
  });

  // TEST 2: Short Markdown Report
  await test("Short Markdown report generation", async () => {
    const shortMd = `# Quick Overview: Quantum Computing
## Objective
Examine current superconducting qubit fidelity.

## Findings
- Coherence times have reached 100 microseconds on average.
- Error rates remain the primary hurdle to fault-tolerant scale.
`;
    const buffer = await generatePdf({
      title: "Quick Overview: Quantum Computing",
      markdown: shortMd,
      metadata: {
        author: "Dr. Demo Researcher",
        date: "2026-09-12",
        objective: "Examine superconducting qubit fidelity",
        depth: "quick",
        confidenceScore: 88,
      },
    });

    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
      throw new Error("Buffer is empty or not a buffer");
    }
    const magic = buffer.subarray(0, 5).toString("utf-8");
    if (!magic.startsWith("%PDF-")) {
      throw new Error(`Invalid PDF magic number: ${magic}`);
    }
    fs.writeFileSync(path.join(testOutputDir, "test_short.pdf"), buffer);
  });

  // TEST 3: Long Multi-Page Academic Research Report
  await test("Long multi-page academic research report with full sections", async () => {
    const longMd = `# Autonomous AI Agents in Clinical Diagnostics: Systematic Review and Algorithmic Audit

## Abstract
Artificial intelligence systems deployed in clinical medicine require rigorous verification, transparent evidence synthesis, and robust safeguards against hallucination. This investigation analyzes 48 peer-reviewed validation trials spanning 2022 to 2026.

## Introduction
The integration of multimodal foundation models into electronic health records (EHR) has demonstrated unprecedented diagnostic accuracy across radiologic imaging, genomic variant interpretation, and differential diagnostic reasoning. However, algorithmic drift and distribution shifts continue to challenge patient safety.

## Research Methodology
We utilized an autonomous agentic pipeline querying PubMed, arXiv, IEEE Xplore, and Nature Digital Medicine. Evidence items were extracted, cross-verified against control datasets, and scored using Bayesian confidence intervals.

## Literature Review & Related Work
Prior benchmarks established by Rajpurkar et al. (2023) highlighted significant variability in out-of-distribution generalization. Recent work by Chen & Thorne (2025) introduced multi-agent debate protocols to mitigate diagnostic bias.

## Key Findings
- **High Sensitivity**: Foundational diagnostic models achieve 94.2% diagnostic concordance on standard MIMIC-IV clinical vignettes.
- **Calibration Degradation**: Confidence scores degrade by up to 32% when presented with rare comorbid presentations.
- **Explainability Gap**: Heatmap-based saliency maps provide insufficient mechanistic justifications for critical interventions.

## Evidence Matrix
- **Clinical Concordance** — 14 randomized trials confirmed non-inferiority to board-certified fellows (confidence 91%).
- **Adverse Interaction Detection** — Automated pharmacovigilance agents identified 99.1% of high-risk contraindications (confidence 96%).
- **Longitudinal Calibration** — Continuous learning pipelines experienced 4.8% catastrophic forgetting across quarterly updates (confidence 84%).

## Discussion & Limitations
Observational retrospective datasets dominate the current body of literature. Prospective, double-blind clinical trials remain sparse in low-resource medical environments.

## Ethical & Societal Implications
Algorithmic fairness across underrepresented demographic cohorts must be mandated by regulatory frameworks including the FDA and EMA. Autonomous recommendation systems must function strictly in decision-support configurations with human oversight.

## Conclusion
Autonomous clinical evidence synthesis represents a transformative paradigm for translational medicine, provided that rigorous continuous auditing and uncertainty quantification protocols are actively maintained.

## References
1. [Rajpurkar et al. (2023) - AI Diagnostics Benchmark](https://nature.com/articles/s41746-023-0012)
2. [Chen & Thorne (2025) - Multi-Agent Verification in Medicine](https://arxiv.org/abs/2501.09912)
3. [NIST AI Risk Management Framework (AI RMF 1.0)](https://nist.gov/itl/ai-risk-management)
4. [MIMIC-IV Clinical Database](https://physionet.org/content/mimiciv/)
`;

    const buffer = await generatePdf({
      title: "Autonomous AI Agents in Clinical Diagnostics",
      markdown: longMd,
      metadata: {
        author: "ResearchPilot Clinical Synthesis Team",
        date: "2026-09-12",
        objective: "Systematic review and algorithmic audit of clinical AI diagnostic agents",
        depth: "deep",
        confidenceScore: 92,
        status: "completed",
      },
    });

    if (buffer.length < 5000) {
      throw new Error(`PDF buffer unexpectedly small for long report: ${buffer.length} bytes`);
    }
    fs.writeFileSync(path.join(testOutputDir, "test_long.pdf"), buffer);
  });

  // TEST 4: Report Containing Formatted Markdown Tables
  await test("Markdown table formatting, column alignment, and headers", async () => {
    const tableMd = `# Benchmark Comparison: Generative Code Agents

## Performance Comparison Matrix

| Model Architecture | Pass@1 (HumanEval) | MultiPL-E Concordance | Latency (p95) | Context Window | Memory Footprint |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **ResearchPilot Core v2** | **89.4%** | **84.2%** | **320 ms** | **128k tokens** | Optimized (14GB) |
| Baseline Transformer A | 78.1% | 71.5% | 850 ms | 32k tokens | Heavy (48GB) |
| Sparse MoE Variant B | 82.7% | 77.0% | 460 ms | 64k tokens | Balanced (24GB) |
| Compact Distilled Model | 71.3% | 66.8% | 180 ms | 16k tokens | Ultra-light (6GB) |
| Standard Academic Baseline | 64.5% | 58.2% | 1,100 ms | 8k tokens | Unoptimized (32GB) |

## Key Insights
The table illustrates strong comparative advantages in latency and memory footprint.
`;

    const buffer = await generatePdf({
      title: "Benchmark Comparison: Generative Code Agents",
      markdown: tableMd,
      metadata: {
        author: "Performance Lab",
        objective: "Comparative benchmarking of LLM code synthesis engines",
        depth: "standard",
        confidenceScore: 89,
      },
    });

    if (buffer.length < 3000) throw new Error("Table PDF buffer too small");
    fs.writeFileSync(path.join(testOutputDir, "test_table.pdf"), buffer);
  });

  // TEST 5: Citations, Links, Code Blocks, and Blockquotes
  await test("Citations, code blocks, blockquotes, and nested lists", async () => {
    const richMd = `# Advanced Agentic Architectures

> "Autonomous cognitive agents require persistent state reflection, structured verification, and dynamic tool orchestration."
> — *IEEE Transactions on Knowledge Engineering, 2026*

## Implementation Specification

Below is an exemplary Python verification harness:

\`\`\`python
import asyncio
from dataclasses import dataclass

@dataclass
class EvidenceItem:
    claim_id: str
    confidence_score: float
    verified: bool

async def verify_claim(evidence: EvidenceItem) -> bool:
    # Autonomous cross-source Bayesian validation
    await asyncio.sleep(0.05)
    return evidence.confidence_score >= 0.85
\`\`\`

## Hierarchy of Verification Tasks
1. Primary Source Discovery
   - Web crawl via domain whitelist
   - Semantic similarity filtering
     - Vector embedding generation
     - Cosine distance thresholding (< 0.25)
2. Claim Extraction
   - Named Entity Recognition (NER)
   - Stance classification (Support / Refute / Neutral)
3. Final Synthesis & Report Assembly
`;

    const buffer = await generatePdf({
      title: "Advanced Agentic Architectures",
      markdown: richMd,
      metadata: {
        author: "Software Architecture Review",
        depth: "standard",
        confidenceScore: 94,
      },
    });

    if (buffer.length < 3000) throw new Error("Rich formatting PDF buffer too small");
    fs.writeFileSync(path.join(testOutputDir, "test_rich.pdf"), buffer);
  });

  // TEST 6: Special Characters, Greek Math Symbols & Unicode
  await test("Special characters, Greek symbols (alpha, beta, theta, pi), and Unicode", async () => {
    const unicodeMd = `# Mathematical & Multi-lingual Synthesis: $\\alpha$, $\\beta$, $\\gamma$

## Formula & Statistical Notations
- Statistical significance threshold: $\\alpha = 0.05$, with observed $p < 0.001$.
- Prior distribution: $\\mathcal{N}(\\mu, \\sigma^2)$, posterior variance $\\Delta \\sigma \\le 0.02$.
- Greek parameters: $\\theta_{t+1} = \\theta_t - \\eta \\nabla L(\\theta_t) + \\lambda \\Omega$.
- Currency & Units: €1,200,000 / ¥85,000,000 / £450,000. Temperature: -12.5°C to 45.8°C.
- Unicode check: © 2026 ResearchPilot™, Registered ®, Em-dash — arrows → ← ↔ ⇒.
- Multilingual test: Français (é, à, ç), Deutsch (ä, ö, ü, ß), Español (ñ, ¿), 日本語 (AI研究).
`;

    const buffer = await generatePdf({
      title: "Mathematical & Multi-lingual Synthesis",
      markdown: unicodeMd,
      metadata: {
        author: "Quantitative Research Lab",
        depth: "deep",
        confidenceScore: 95,
      },
    });

    if (buffer.length < 2000) throw new Error("Unicode PDF buffer too small");
    fs.writeFileSync(path.join(testOutputDir, "test_unicode.pdf"), buffer);
  });

  // TEST 7: Missing Optional Metadata & Sections
  await test("Resilience with minimal metadata and missing optional fields", async () => {
    const minimalMd = `Just a plain paragraph without any standard markdown headings or sections. This ensures the PDF generator gracefully renders arbitrary user text without errors.`;

    const buffer = await generatePdf({
      title: "",
      markdown: minimalMd,
      metadata: {},
    });

    if (buffer.length < 1000) throw new Error("Minimal PDF buffer too small");
    fs.writeFileSync(path.join(testOutputDir, "test_minimal.pdf"), buffer);
  });

  // TEST 8: Error Handling on Invalid/Empty Input
  await test("Error handling when markdown content is empty or invalid", async () => {
    let threw = false;
    try {
      await generatePdf({ title: "Test", markdown: "" });
    } catch (e) {
      threw = true;
    }
    if (!threw) throw new Error("Did not throw on empty markdown");
  });

  // TEST 9: Sequential Multiple PDF Exports (Resource Leak Prevention)
  await test("Sequential multiple PDF exports without crashing or leaking browser", async () => {
    for (let i = 1; i <= 3; i++) {
      const b = await generatePdf({
        title: `Stress Test Iteration ${i}`,
        markdown: `## Iteration ${i}\nReport iteration payload content for stress testing.`,
        metadata: { confidenceScore: 80 + i },
      });
      if (!Buffer.isBuffer(b) || b.length < 1000) {
        throw new Error(`Failed on iteration ${i}`);
      }
    }
  });

  console.log("\n==================================================");
  console.log(`Results: ${passed} passed, ${failed} failed.`);
  console.log("Generated sample PDFs saved to Backend/test_output/");
  console.log("==================================================");

  await closeBrowser();

  if (failed > 0) {
    process.exit(1);
  }
  process.exit(0);
}

runTests().catch(async (err) => {
  console.error("Test runner crashed:", err);
  await closeBrowser();
  process.exit(1);
});



