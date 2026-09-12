# ResearchPilot Backend

## Render environment variables
Set `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `NODE_ENV=production`, `DEMO_MODE=true`. Optional: `TAVILY_API_KEY` for live web search.

### PDF Export & Puppeteer on Render / Linux
ResearchPilot includes a resilient **Dual-Engine PDF Architecture**:
1. **Primary Engine (Puppeteer)**: Generates high-fidelity HTML-to-PDF reports with running headers and dynamic page numbers.
   - Configured via `.puppeteerrc.cjs` to use local cache `./.cache/puppeteer`.
   - On Render, set Build Command to: `npm run build` (which downloads Chrome into cache) or standard `npm install`.
   - Optionally set `PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer`.
2. **Automatic Pure JavaScript Fallback (PDFKit)**: If Chrome is not installed or cannot run in the environment (e.g. Render free tier without system libraries), the backend automatically catches the error and generates a clean, professional academic PDF using pure JavaScript with zero native dependencies!
   - Result: PDF download **never fails** with "Could not find Chrome", even on minimal Linux containers.

Build command: `npm run build`
Start command: `npm start`

Health: `/api/health`
PDF Export Endpoint: `GET /api/research/:id/export-pdf`

