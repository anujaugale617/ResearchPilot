# ResearchPilot — Autonomous Research Agent

> **Production-Style Full-Stack AI Research Platform**  
> Built for deep autonomous investigation, multi-source evidence extraction, conflict reconciliation, and rigorous self-evaluation.

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![Frontend](https://img.shields.io/badge/Frontend-React_18_%7C_Vite_%7C_TailwindCSS_%7C_React_Flow-2D8CFF.svg)]()
[![Backend](https://img.shields.io/badge/Backend-Node.js_%7C_Express_%7C_LangGraph.js-35D9E8.svg)]()
[![Database](https://img.shields.io/badge/Database-MongoDB_Atlas_%7C_Mongoose-43E6D5.svg)]()

---

## 🎯 Executive Overview

**ResearchPilot** is an autonomous AI research system that transcends basic chatbot wrappers. Given an open-ended, complex research question, ResearchPilot:
1. Formulates a multi-stage investigation plan.
2. Generates multifaceted web search queries across distinct angles.
3. Gathers, deduplicates, and objectively rates source authority, relevance, and bias.
4. Extracts discrete evidence units and links them to verifiable claims.
5. **Autonomously discovers knowledge gaps and adapts its search strategy** without user intervention.
6. Detects factual conflicts and executes targeted verification rounds.
7. Synthesizes a structured academic report with verifiable citation indexing.
8. **Critiques its own output with automated self-evaluation**, triggering additional research cycles if confidence or depth falls below quality thresholds.

---

## 🔄 The Autonomous Research Loop

```
                     ┌───────────────────────────┐
                     │   User Research Question  │
                     └─────────────┬─────────────┘
                                   │
                                   ▼
                       ┌───────────────────────┐
                       │  Query Understanding  │
                       └───────────┬───────────┘
                                   │
                                   ▼
                       ┌───────────────────────┐
                       │   Research Planner    │
                       └───────────┬───────────┘
                                   │
                                   ▼
                       ┌───────────────────────┐
                       │ Multi-Query Generator │
                       └───────────┬───────────┘
                                   │
                                   ▼
                       ┌───────────────────────┐
                       │ Tavily Web Retrieval  │
                       └───────────┬───────────┘
                                   │
                                   ▼
                       ┌───────────────────────┐
                       │   Source Evaluation   │
                       │ (Relevance, Bias, Auth)
                       └───────────┬───────────┘
                                   │
                                   ▼
                       ┌───────────────────────┐
                       │  Evidence Extraction  │
                       └───────────┬───────────┘
                                   │
                                   ▼
                       ┌───────────────────────┐
                       │ Gap & Conflict Check  │
                       └─────┬───────────┬─────┘
                             │           │
           [Knowledge Gap Detected]   [Conflict Found]
                             │           │
                             ▼           ▼
                   ┌───────────────┐ ┌───────────────┐
                   │ Adapt Queries │ │ Verify Claims │
                   └───────┬───────┘ └───────┬───────┘
                           │                 │
                           └────────┬────────┘
                                    │ (Evidence Sufficient)
                                    ▼
                       ┌───────────────────────┐
                       │ Multi-Source Synthesis│
                       └───────────┬───────────┘
                                   │
                                   ▼
                       ┌───────────────────────┐
                       │   Report Generation   │
                       └───────────┬───────────┘
                                   │
                                   ▼
                       ┌───────────────────────┐
                       │    Self-Evaluation    │
                       └───────────┬───────────┘
                                   │
               ┌───────────────────┴───────────────────┐
               │                                       │
      [Score < Threshold & Budget]            [Score >= Threshold]
               │                                       │
               ▼                                       ▼
     [Re-Search / Refine]                     [Final Cited Report]
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend UI** | React 18, Vite, React Router 6, Tailwind CSS, Lucide React, Recharts (Analytics), React Flow (Knowledge Graph) |
| **Backend API** | Node.js, Express.js, Server-Sent Events (SSE), Helmet, CORS, Express Rate Limit, Zod |
| **Database** | MongoDB Atlas / Mongoose (11 domain collections) |
| **Orchestration** | LangGraph.js (StateGraph, conditional edges, cycle loops) |
| **AI Layer** | Abstracted AI Service (Gemini / OpenAI / Mock) with strict Zod structured outputs |
| **Web Research** | Tavily Search API, Content Extraction Service (Tavily / Firecrawl fallback) |
| **Asset Storage**| Cloudinary (Avatars, report diagrams, user documents) |

---

## 📁 Repository Structure

```
d:/ResearchPilot/
├── Frontend/                     # Vite + React Frontend
│   ├── public/                 # Static assets
│   └── src/
│       ├── assets/             # Brand logos, icons
│       ├── components/         # Reusable atomic UI (Navbar, Card, Modal, etc.)
│       ├── context/            # AuthContext, ResearchContext, SSEContext
│       ├── hooks/              # Custom hooks (useSSE, useResearch, useAuth)
│       ├── layouts/            # MainLayout, AuthLayout, WorkspaceLayout
│       ├── pages/              # 11 Dedicated views (Landing, Setup, Workspace, Report, etc.)
│       ├── services/           # Axios API clients
│       ├── utils/              # Formatting, graph transforms, metric helpers
│       ├── App.jsx             # Route definitions
│       └── main.jsx            # Entrypoint
│
├── Backend/                      # Express.js REST & SSE Backend
│   └── src/
│       ├── agents/             # LangGraph.js Research Orchestrator & graph nodes
│       ├── config/             # DB connection, Cloudinary, environment loader
│       ├── controllers/        # AuthController, ResearchController, EventController
│       ├── middleware/         # Auth, rateLimiter, errorHandler, validator
│       ├── models/             # 11 Mongoose schemas (Session, Source, Evidence, etc.)
│       ├── routes/             # Express route modules
│       ├── services/           # aiService, searchService, extractionService, reportService
│       ├── tools/              # Tavily search wrappers, text chunkers, deduplicators
│       ├── utils/              # Logger, metrics, response helpers
│       ├── validators/         # Zod schemas for requests & LLM outputs
│       ├── app.js              # Express app initialization
│       └── server.js           # Server listen & lifecycle hooks
│
├── docs/                       # Architecture & Technical Specifications
│   ├── architecture.md         # System design, security, and component interaction
│   ├── agent-workflow.md       # LangGraph state machine & adaptive loop specifications
│   ├── api.md                  # REST endpoints & SSE streaming protocols
│   ├── database.md             # Mongoose schemas, relationships & indexing
│   └── frontend-map.md         # Page layouts, state flows, and component specs
│
├── .env.example                # Canonical environment variable template
├── .gitignore                  # Git exclusions
└── README.md                   # Project overview & operational documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.x or higher (v24.x LTS recommended)
- **npm**: v9.x or higher
- **MongoDB**: Active MongoDB Atlas URI or local instance (`mongodb://localhost:27017/researchpilot`)

### 1. Clone & Environment Setup
```bash
# Clone the repository
git clone <repo-url>
cd ResearchPilot

# Create backend environment file
copy .env.example Backend/.env
```

Edit `Backend/.env` with your API keys:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Random 32+ character string
- `AI_API_KEY`: Gemini or OpenAI API key
- `TAVILY_API_KEY`: Tavily API key
- `CLOUDINARY_CLOUD_NAME`: Cloudinary account details

> **Note on Demo Mode**:  
> If `DEMO_MODE=true` is set in `.env`, the entire autonomous loop runs with simulated high-fidelity search queries, source extractions, conflict resolutions, and evaluations without spending live API credits.

### 2. Install Dependencies
```bash
# Install Backend Dependencies
cd Backend
npm install

# Install Frontend Dependencies
cd ../Frontend
npm install
```

### 3. Run the Application
In development, run both the backend server and frontend client concurrently:

```bash
# Terminal 1: Start Express Backend (Port 5000)
cd Backend
npm run dev

# Terminal 2: Start Vite React Frontend (Port 5173)
cd client
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🧪 Phased Roadmap & Status

- [x] **Phase 1: Project Planning & Architecture** (Docs, schemas, contracts, root scaffolding)
- [ ] **Phase 2: Frontend Foundation** (Vite, React 18, Tailwind, layout & UI kit)
- [ ] **Phase 3: Backend Foundation** (Express, security middleware, health checks)
- [ ] **Phase 4: Database & Authentication** (MongoDB Atlas, JWT, bcrypt, user sessions)
- [ ] **Phase 5: Research Session System** (Session model, state machine, CRUD routes)
- [ ] **Phase 6: AI Service Abstraction** (Provider-agnostic interface with Zod schemas)
- [ ] **Phase 7: Research Tools & Web Search** (Tavily integration, source evaluation, deduplication)
- [ ] **Phase 8: Research Orchestrator** (LangGraph.js state machine & execution nodes)
- [ ] **Phase 9: Evidence, Claims & Verification** (Fact extraction, citation mapping)
- [ ] **Phase 10: Autonomous Adaptation** (Knowledge gap detection, automatic re-querying)
- [ ] **Phase 11: Live Agent Monitoring** (Real-time SSE event pipeline)
- [ ] **Phase 12: Research Workspace UI** (3-pane cockpit, live stream, intelligence tabs)
- [ ] **Phase 13: Research Graph & Analytics** (React Flow visual node graph, Recharts)
- [ ] **Phase 14: Report Generation & Self-Evaluation** (Cited Markdown reports, quality gate)
- [ ] **Phase 15: Production Polish & Demo Mode** (Reliability, budget caps, end-to-end verification)

---

## 🛡️ Agent Safety & Ethical Principles
- **No Hallucinated Citations**: Every claim generated in the final report must trace to an extracted evidence unit and evaluated source.
- **Budget Enforced**: Hard caps (`MAX_RESEARCH_ITERATIONS`, `MAX_SOURCES_PER_SESSION`, `MAX_TOKENS_PER_SESSION`) prevent infinite recursion.
- **Safe Output Only**: Private chain-of-thought is never exposed via SSE or APIs; only action-oriented progress events are streamed.
- **Transparent Simulation**: In Demo Mode, all data is explicitly badged as `DEMO MODE — SIMULATED RESEARCH`.
