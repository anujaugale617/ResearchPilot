import fs from "fs";
import path from "path";
import { marked } from "marked";
import puppeteer from "puppeteer";

// Configure marked for academic GitHub Flavored Markdown
marked.setOptions({
  gfm: true,
  breaks: true,
});

/**
 * Generate a sanitized, safe PDF filename according to research title.
 * Removes illegal filesystem characters and limits length.
 */
export function generatePdfFilename(title) {
  const rawTitle = title || "Research_Report";
  const clean = rawTitle
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 60);
  const safeTitle = clean || "Report";
  return `ResearchPilot_${safeTitle}_Report.pdf`;
}

/**
 * Locate a working browser executable if bundled Chrome is not found.
 */
function findSystemBrowser() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH && fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  const commonWindowsPaths = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  ];

  const commonLinuxPaths = [
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ];

  const candidates = process.platform === "win32" ? commonWindowsPaths : commonLinuxPaths;
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return p;
    } catch {
      // ignore
    }
  }
  return undefined;
}

let sharedBrowser = null;

/**
 * Obtain or launch a Puppeteer browser instance.
 */
async function getBrowserInstance() {
  if (sharedBrowser && sharedBrowser.connected) {
    return sharedBrowser;
  }

  const launchArgs = [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--font-render-hinting=medium",
    "--disable-extensions",
  ];

  try {
    sharedBrowser = await puppeteer.launch({
      headless: true,
      args: launchArgs,
    });
    return sharedBrowser;
  } catch (err) {
    // If bundled Chrome fails to launch, try system browser fallback
    const systemPath = findSystemBrowser();
    if (systemPath) {
      sharedBrowser = await puppeteer.launch({
        headless: true,
        executablePath: systemPath,
        args: launchArgs,
      });
      return sharedBrowser;
    }
    throw err;
  }
}

/**
 * Gracefully close any active shared browser instance.
 */
export async function closeBrowser() {
  if (sharedBrowser) {
    try {
      await sharedBrowser.close();
    } catch {
      // ignore
    }
    sharedBrowser = null;
  }
}

/**
 * Build professional academic HTML document wrapping the Markdown content.
 */
export function buildAcademicHtml({ title, markdownContent, metadata = {} }) {
  const renderedContent = marked.parse(markdownContent || "");

  const authorName = metadata.author || "ResearchPilot Autonomous Research Agent";
  const formattedDate = metadata.date
    ? new Date(metadata.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
  const objective = metadata.objective || "";
  const depth = metadata.depth || "Standard";
  const confidence = metadata.confidenceScore ?? metadata.confidence ?? 85;
  const status = (metadata.status || "Completed").toUpperCase();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(title || "Research Report")}</title>
  <style>
    @page {
      size: A4;
      margin: 24mm 16mm 24mm 16mm;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 10pt;
      line-height: 1.65;
      color: #1e293b;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
    }

    /* Document Header Banner */
    .document-header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }

    .header-tagline {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8pt;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #0284c7;
      margin-bottom: 8px;
    }

    .report-title {
      font-size: 20pt;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.25;
      margin: 0 0 8px 0;
      letter-spacing: -0.02em;
    }

    .report-subtitle {
      font-size: 11pt;
      color: #475569;
      font-style: italic;
      margin: 0 0 16px 0;
      line-height: 1.4;
    }

    /* Metadata Badge Grid */
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10px 14px;
      margin-top: 12px;
    }

    .meta-item {
      display: flex;
      flex-direction: column;
    }

    .meta-label {
      font-size: 7.5pt;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      margin-bottom: 2px;
    }

    .meta-value {
      font-size: 9pt;
      font-weight: 600;
      color: #0f172a;
    }

    /* Typography & Hierarchy */
    h1, h2, h3, h4, h5, h6 {
      color: #0f172a;
      font-weight: 700;
      margin-top: 20px;
      margin-bottom: 8px;
      page-break-after: avoid;
      break-after: avoid;
    }

    h1 {
      font-size: 15pt;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 5px;
      margin-top: 24px;
      letter-spacing: -0.01em;
    }

    h2 {
      font-size: 12.5pt;
      color: #1e293b;
      margin-top: 18px;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 4px;
    }

    h3 {
      font-size: 11pt;
      color: #334155;
      margin-top: 14px;
    }

    h4 {
      font-size: 10pt;
      color: #475569;
    }

    p {
      margin-top: 0;
      margin-bottom: 10px;
      text-align: justify;
      hyphens: auto;
    }

    strong, b {
      font-weight: 700;
      color: #0f172a;
    }

    em, i {
      font-style: italic;
    }

    /* Lists */
    ul, ol {
      margin-top: 4px;
      margin-bottom: 12px;
      padding-left: 22px;
    }

    li {
      margin-bottom: 5px;
      line-height: 1.6;
    }

    li > ul, li > ol {
      margin-top: 4px;
      margin-bottom: 4px;
    }

    /* Academic Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 9pt;
      table-layout: auto;
      page-break-inside: auto;
    }

    thead {
      display: table-header-group; /* Repeats table header across pages in print */
    }

    tr {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    th {
      background-color: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
      text-align: left;
      padding: 8px 10px;
      border: 1px solid #cbd5e1;
      border-bottom: 2px solid #94a3b8;
      font-size: 8.5pt;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    td {
      padding: 7px 10px;
      border: 1px solid #e2e8f0;
      color: #334155;
      vertical-align: top;
      word-break: break-word;
      overflow-wrap: break-word;
    }

    tbody tr:nth-child(even) {
      background-color: #f8fafc;
    }

    /* Blockquotes & Callouts */
    blockquote {
      border-left: 3.5px solid #0284c7;
      background-color: #f0f9ff;
      color: #0369a1;
      margin: 14px 0;
      padding: 10px 16px;
      font-style: italic;
      border-radius: 0 6px 6px 0;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    blockquote p {
      margin: 0;
    }

    /* Code Blocks */
    pre {
      background-color: #0f172a;
      color: #f8fafc;
      padding: 12px 14px;
      border-radius: 6px;
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
      font-size: 8.5pt;
      line-height: 1.5;
      overflow-x: auto;
      margin: 14px 0;
      page-break-inside: avoid;
      break-inside: avoid;
      border: 1px solid #1e293b;
    }

    code {
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
      font-size: 8.5pt;
      background-color: #f1f5f9;
      color: #0f172a;
      padding: 2px 4px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    pre code {
      background-color: transparent;
      color: inherit;
      padding: 0;
      border: none;
    }

    /* Links & Citations */
    a {
      color: #0284c7;
      text-decoration: none;
      word-break: break-all;
    }

    a:hover {
      text-decoration: underline;
    }

    /* Horizontal Rules */
    hr {
      border: none;
      border-top: 1px solid #cbd5e1;
      margin: 20px 0;
    }

    /* Images */
    img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 14px auto;
      border-radius: 4px;
    }

    /* Academic Verification Badge */
    .verification-footer-note {
      margin-top: 30px;
      padding: 10px 14px;
      background: #f8fafc;
      border: 1px dashed #cbd5e1;
      border-radius: 6px;
      font-size: 8pt;
      color: #64748b;
      display: flex;
      justify-content: space-between;
      page-break-inside: avoid;
      break-inside: avoid;
    }
  </style>
</head>
<body>
  <header class="document-header">
    <div class="header-tagline">
      <span>ResearchPilot Academic Research Report</span>
      <span>Autonomous Evidence Synthesis</span>
    </div>
    <h1 class="report-title">${escapeHtml(title || "Autonomous Research Report")}</h1>
    ${objective ? `<div class="report-subtitle">Objective: ${escapeHtml(objective)}</div>` : ""}

    <div class="meta-grid">
      <div class="meta-item">
        <span class="meta-label">Author / System</span>
        <span class="meta-value">${escapeHtml(authorName)}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Generation Date</span>
        <span class="meta-value">${escapeHtml(formattedDate)}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Research Depth</span>
        <span class="meta-value">${escapeHtml(depth)} (${status})</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Confidence Score</span>
        <span class="meta-value">${confidence}%</span>
      </div>
    </div>
  </header>

  <main class="content-body">
    ${renderedContent}
  </main>

  <div class="verification-footer-note">
    <span>Generated by ResearchPilot AI Engine &bull; Academic Briefing</span>
    <span>Autonomous Literature &amp; Evidence Cross-Synthesis</span>
  </div>
</body>
</html>`;
}

/**
 * Generate a PDF Buffer from a Markdown research report.
 * Supports academic layout, headers, footers with page numbers, and custom options.
 *
 * @param {Object} options
 * @param {string} options.title - The research report title
 * @param {string} options.markdown - The raw Markdown report content
 * @param {Object} [options.metadata] - Optional session metadata (author, date, objective, depth, confidenceScore)
 * @returns {Promise<Buffer>} The generated PDF binary buffer
 */
export async function generatePdf({ title, markdown, metadata = {} }) {
  if (!markdown || typeof markdown !== "string") {
    throw new Error("Cannot generate PDF: markdown content is empty or invalid.");
  }

  const html = buildAcademicHtml({
    title,
    markdownContent: markdown,
    metadata,
  });

  const browser = await getBrowserInstance();
  const page = await browser.newPage();

  try {
    // Set content and wait until network is idle
    await page.setContent(html, {
      waitUntil: ["domcontentloaded", "networkidle0"],
    });

    const headerTemplate = `
      <div style="font-size: 8pt; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #94a3b8; width: 100%; display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding: 0 16mm 2.5mm 16mm; margin: 0; box-sizing: border-box;">
        <span style="font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">ResearchPilot &bull; Academic Report</span>
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 50%;">${escapeHtml(title || "Research Report")}</span>
      </div>
    `;

    const footerTemplate = `
      <div style="font-size: 8pt; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #94a3b8; width: 100%; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding: 2.5mm 16mm 0 16mm; margin: 0; box-sizing: border-box;">
        <span>Autonomous Research Synthesis &bull; ResearchPilot</span>
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>
    `;

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate,
      footerTemplate,
      margin: {
        top: "24mm",
        bottom: "24mm",
        left: "16mm",
        right: "16mm",
      },
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await page.close();
  }
}

/**
 * Utility to escape raw HTML text for safe insertion in template.
 */
function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
