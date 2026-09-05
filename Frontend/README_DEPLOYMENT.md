# ResearchPilot Frontend - Render API Connection

## 1. Local development
Create `.env` from `.env.example` and set:

`VITE_API_URL=http://localhost:5000`

Then run:

`npm install`
`npm run dev`

## 2. Vercel
Set the Vercel Root Directory to `client`.
Build command: `npm run build`
Output directory: `dist`
Environment variable:
`VITE_API_URL=https://YOUR-RENDER-SERVICE.onrender.com`

`vercel.json` is included for React Router SPA rewrites.

## 3. Render CORS
Set the backend environment variable:
`CLIENT_URL=https://YOUR-VERCEL-DOMAIN.vercel.app`

Redeploy the Render backend after changing it.

## 4. Important backend note
The frontend calls the API contract documented in `docs/api.md`:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- POST /api/auth/logout
- POST /api/research
- GET /api/research
- GET /api/research/:id
- DELETE /api/research/:id
- POST /api/research/:id/start
- POST /api/research/:id/stop
- POST /api/research/:id/refine
- GET /api/research/:id/events (SSE)

In the supplied backend source, only the health route is currently mounted. If these routes are not implemented on Render, login/research screens will correctly show API errors until the backend controllers/routes are added.
