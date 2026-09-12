import fs from "fs";
import path from "path";
import { marked } from "marked";
import puppeteer from "puppeteer";
import PDFDocument from "pdfkit";

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

    ul, ol {
      margin-top: 4px;
      margin-bottom: 12px;
      padding-left: 22px;
    }

    li {
      margin-bottom: 5px;
      line-height: 1.6;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 9pt;
      table-layout: auto;
      page-break-inside: auto;
    }

    thead {
      display: table-header-group;
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

    a {
      color: #0284c7;
      text-decoration: none;
      word-break: break-all;
    }

    hr {
      border: none;
      border-top: 1px solid #cbd5e1;
      margin: 20px 0;
    }

    img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 14px auto;
      border-radius: 4px;
    }

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
 * Generate a PDF Buffer using Puppeteer.
 */
export async function generatePdfWithPuppeteer({ title, markdown, metadata = {} }) {
  const html = buildAcademicHtml({
    title,
    markdownContent: markdown,
    metadata,
  });

  const browser = await getBrowserInstance();
  const page = await browser.newPage();

  try {
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
 * 100% Pure JavaScript PDF generation using PDFKit.
 * Guaranteed to work anywhere without requiring Chromium or system dependencies.
 */
export function generatePdfWithPdfKit({ title, markdown, metadata = {} }) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 55, bottom: 55, left: 50, right: 50 },
        bufferPages: true,
        info: {
          Title: title || "Research Report",
          Author: metadata.author || "ResearchPilot",
          Subject: metadata.objective || "Academic Research Synthesis",
        },
      });

      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const contentWidth = 495.28;
      const authorName = metadata.author || "ResearchPilot Autonomous Research Agent";
      const formattedDate = metadata.date
        ? new Date(metadata.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
        : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      const depth = metadata.depth || "Standard";
      const confidence = metadata.confidenceScore ?? metadata.confidence ?? 85;
      const status = (metadata.status || "Completed").toUpperCase();

      // Top Tagline
      doc.fontSize(8).font("Helvetica-Bold").fillColor("#0284C7")
        .text("RESEARCHPILOT ACADEMIC RESEARCH REPORT", 50, 50, { continued: true })
        .text("AUTONOMOUS EVIDENCE SYNTHESIS", { align: "right" });

      doc.moveDown(0.6);

      // Main Report Title
      doc.fontSize(18).font("Helvetica-Bold").fillColor("#0F172A")
        .text(title || "Autonomous Research Report", { lineGap: 3 });

      // Subtitle / Objective if present
      if (metadata.objective) {
        doc.fontSize(10).font("Helvetica-Oblique").fillColor("#475569")
          .text(`Objective: ${metadata.objective}`, { lineGap: 2 });
      }

      doc.moveDown(0.6);

      // Metadata card grid
      const metaY = doc.y;
      doc.rect(50, metaY, contentWidth, 38).fillAndStroke("#F8FAFC", "#CBD5E1");
      const colWidth = contentWidth / 4;

      const metaFields = [
        ["AUTHOR / SYSTEM", authorName.slice(0, 22)],
        ["GENERATION DATE", formattedDate],
        ["RESEARCH DEPTH", `${depth} (${status})`],
        ["CONFIDENCE SCORE", `${confidence}%`],
      ];

      metaFields.forEach(([lbl, val], idx) => {
        const xPos = 50 + idx * colWidth + 8;
        doc.fontSize(7).font("Helvetica-Bold").fillColor("#64748B")
          .text(lbl, xPos, metaY + 6, { width: colWidth - 10, lineBreak: false });
        doc.fontSize(8.5).font("Helvetica-Bold").fillColor("#0F172A")
          .text(val, xPos, metaY + 19, { width: colWidth - 10, lineBreak: false });
      });

      doc.y = metaY + 48;
      doc.moveTo(50, doc.y).lineTo(50 + contentWidth, doc.y).lineWidth(1.5).strokeColor("#0F172A").stroke();
      doc.moveDown(0.8);

      // Parse Markdown content line by line
      const lines = (markdown || "").split(/\r?\n/);
      let inCodeBlock = false;
      let inTable = false;
      let tableRows = [];

      function flushTable() {
        if (tableRows.length === 0) return;
        const validRows = tableRows.filter((r) => !/^\s*\|?\s*[-:]+[-| :]*\|?\s*$/.test(r));
        if (validRows.length === 0) {
          tableRows = [];
          return;
        }

        const parsedRows = validRows.map((r) =>
          r.split("|").map((c) => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - (r.endsWith("|") ? 1 : 0))
        ).filter((r) => r.length > 0);

        if (parsedRows.length === 0) {
          tableRows = [];
          return;
        }

        if (doc.y > 700) doc.addPage();
        const numCols = Math.max(...parsedRows.map((r) => r.length));
        const cellWidth = contentWidth / numCols;
        const startX = 50;

        parsedRows.forEach((row, rowIndex) => {
          const isHeader = rowIndex === 0;
          const rowHeight = 22;
          if (doc.y + rowHeight > 760) doc.addPage();
          const curY = doc.y;

          doc.rect(startX, curY, contentWidth, rowHeight)
            .fillAndStroke(isHeader ? "#F1F5F9" : rowIndex % 2 === 1 ? "#FFFFFF" : "#F8FAFC", "#CBD5E1");

          row.forEach((cell, cIdx) => {
            const cleanCell = cell.replace(/\*\*/g, "");
            doc.fontSize(isHeader ? 8 : 7.5)
              .font(isHeader ? "Helvetica-Bold" : "Helvetica")
              .fillColor(isHeader ? "#0F172A" : "#334155")
              .text(cleanCell, startX + cIdx * cellWidth + 5, curY + 6, {
                width: cellWidth - 10,
                lineBreak: false,
                ellipsis: true,
              });
          });
          doc.y = curY + rowHeight;
        });

        doc.moveDown(0.6);
        tableRows = [];
      }

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.trim().startsWith("```")) {
          if (inCodeBlock) {
            inCodeBlock = false;
            doc.moveDown(0.5);
          } else {
            if (inTable) { flushTable(); inTable = false; }
            inCodeBlock = true;
            if (doc.y > 720) doc.addPage();
          }
          continue;
        }

        if (inCodeBlock) {
          if (doc.y > 750) doc.addPage();
          const codeY = doc.y;
          doc.rect(50, codeY, contentWidth, 16).fill("#0F172A");
          doc.fontSize(8).font("Courier").fillColor("#35D9E8").text(line || " ", 56, codeY + 3, { width: contentWidth - 12 });
          continue;
        }

        if (line.trim().startsWith("|") || (line.includes("|") && line.trim().endsWith("|"))) {
          inTable = true;
          tableRows.push(line);
          continue;
        } else if (inTable) {
          flushTable();
          inTable = false;
        }

        if (!line.trim()) {
          doc.moveDown(0.4);
          continue;
        }

        if (line.startsWith("# ")) {
          if (line.slice(2).trim().toLowerCase() === (title || "").toLowerCase()) continue;
          if (doc.y > 690) doc.addPage();
          doc.moveDown(0.6);
          doc.fontSize(14).font("Helvetica-Bold").fillColor("#0F172A").text(line.slice(2).trim());
          doc.moveDown(0.3);
        } else if (line.startsWith("## ")) {
          if (doc.y > 700) doc.addPage();
          doc.moveDown(0.6);
          const headingText = line.slice(3).trim();
          doc.fontSize(11.5).font("Helvetica-Bold").fillColor("#0284C7").text(headingText);
          doc.moveTo(50, doc.y + 2).lineTo(50 + contentWidth, doc.y + 2).lineWidth(0.5).strokeColor("#E2E8F0").stroke();
          doc.y += 4;
        } else if (line.startsWith("### ")) {
          if (doc.y > 720) doc.addPage();
          doc.moveDown(0.4);
          doc.fontSize(10).font("Helvetica-Bold").fillColor("#1E293B").text(line.slice(4).trim());
          doc.moveDown(0.2);
        } else if (line.trim().startsWith("> ")) {
          if (doc.y > 720) doc.addPage();
          const quoteY = doc.y;
          const quoteText = line.slice(2).replace(/\*/g, "").trim();
          doc.fontSize(9).font("Helvetica-Oblique").fillColor("#0369A1");
          const textHeight = doc.heightOfString(quoteText, { width: contentWidth - 24 });
          doc.rect(50, quoteY, contentWidth, textHeight + 10).fill("#F0F9FF");
          doc.rect(50, quoteY, 3.5, textHeight + 10).fill("#0284C7");
          doc.text(quoteText, 62, quoteY + 5, { width: contentWidth - 24 });
          doc.y = quoteY + textHeight + 14;
        } else if (/^\s*[-*]\s+/.test(line)) {
          if (doc.y > 750) doc.addPage();
          const cleanLine = line.replace(/^\s*[-*]\s+/, "");
          const isBold = cleanLine.startsWith("**");
          let bulletText = cleanLine.replace(/\*\*/g, "");
          doc.fontSize(9).font("Helvetica").fillColor("#1E293B");
          doc.text("• ", 58, doc.y, { continued: true });
          if (isBold) doc.font("Helvetica-Bold");
          doc.text(bulletText, { width: contentWidth - 20, lineGap: 2 });
          doc.moveDown(0.2);
        } else if (/^\s*\d+\.\s+/.test(line)) {
          if (doc.y > 750) doc.addPage();
          const match = line.match(/^\s*(\d+\.)\s+(.*)/);
          const num = match ? match[1] : "1.";
          const itemText = (match ? match[2] : line).replace(/\[(.*?)\]\((.*?)\)/g, "$1 ($2)");
          doc.fontSize(9).font("Helvetica-Bold").fillColor("#0284C7").text(`${num} `, 58, doc.y, { continued: true });
          doc.font("Helvetica").fillColor("#1E293B").text(itemText, { width: contentWidth - 24, lineGap: 2 });
          doc.moveDown(0.2);
        } else {
          if (doc.y > 750) doc.addPage();
          const cleanPara = line.replace(/\*\*/g, "");
          doc.fontSize(9.5).font("Helvetica").fillColor("#1E293B").text(cleanPara, 50, doc.y, {
            width: contentWidth,
            lineGap: 3,
            align: "justify",
          });
          doc.moveDown(0.4);
        }
      }

      if (inTable) flushTable();

      // Number all pages at the end
      const range = doc.bufferedPageRange();
      for (let i = 0; i < range.count; i++) {
        doc.switchToPage(i);

        // Header
        doc.fontSize(7.5).font("Helvetica-Bold").fillColor("#94A3B8")
          .text("RESEARCHPILOT • ACADEMIC REPORT", 50, 30, { lineBreak: false });
        doc.fontSize(7.5).font("Helvetica").fillColor("#94A3B8")
          .text((title || "Research Report").slice(0, 45), 250, 30, { width: 295, align: "right", lineBreak: false });
        doc.moveTo(50, 42).lineTo(50 + contentWidth, 42).lineWidth(0.5).strokeColor("#E2E8F0").stroke();

        // Footer (within margin to prevent extra page creation)
        doc.moveTo(50, 765).lineTo(50 + contentWidth, 765).lineWidth(0.5).strokeColor("#E2E8F0").stroke();
        doc.fontSize(7.5).font("Helvetica").fillColor("#94A3B8")
          .text("Autonomous Research Synthesis • ResearchPilot", 50, 770, { lineBreak: false });
        doc.fontSize(7.5).font("Helvetica-Bold").fillColor("#94A3B8")
          .text(`Page ${i + 1} of ${range.count}`, 250, 770, { width: 295, align: "right", lineBreak: false });
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Generate a PDF Buffer from a Markdown research report.
 * Tries Puppeteer first; seamlessly falls back to pure JavaScript PDFKit engine
 * if Chromium is not installed (e.g. on Render Linux free tier).
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

  // 1. Try Puppeteer HTML-to-PDF rendering first
  try {
    return await generatePdfWithPuppeteer({ title, markdown, metadata });
  } catch (err) {
    console.warn(
      `[pdfService] Puppeteer render encountered: "${err.message}". Seamlessly switching to pure JavaScript PDF engine...`
    );
    // 2. 100% reliable fallback with zero Chromium dependency (works on Render/Linux without Chrome)
    return await generatePdfWithPdfKit({ title, markdown, metadata });
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
