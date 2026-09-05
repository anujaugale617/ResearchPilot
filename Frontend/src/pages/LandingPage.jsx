import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2,
  RefreshCw,
  GitFork,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Layers,
  FileCheck
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

export const LandingPage = () => {
  const workflowSteps = [
    { id: 1, title: 'Question', desc: 'Accepts deep, multifaceted inquiries', icon: Search, color: 'text-[#2D8CFF]' },
    { id: 2, title: 'Plan', desc: 'Formulates multi-angle investigation tasks', icon: Layers, color: 'text-[#35D9E8]' },
    { id: 3, title: 'Search', desc: 'Harvests & deduplicates authoritative web sources', icon: Cpu, color: 'text-[#2D8CFF]' },
    { id: 4, title: 'Verify', desc: 'Detects conflicts & cross-examines evidence', icon: ShieldCheck, color: 'text-[#43E6D5]' },
    { id: 5, title: 'Adapt', desc: 'Discovers knowledge gaps & autonomously re-queries', icon: RefreshCw, color: 'text-amber-400' },
    { id: 6, title: 'Report', desc: 'Synthesizes cited briefing & evaluates quality', icon: FileCheck, color: 'text-[#35D9E8]' },
  ];

  return (
    <div className="min-h-screen bg-[#071426] text-white selection:bg-brand-accent selection:text-background">
      {/* Hero Header */}
      <header className="border-b border-[#1E314B]/60 bg-[#071426]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2D8CFF] to-[#35D9E8] flex items-center justify-center text-[#071426] shadow-glow-accent">
              <Compass className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Research<span className="text-[#35D9E8]">Pilot</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/app/dashboard">
              <Button variant="primary" size="sm" icon={ArrowRight}>Launch Console</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
        <Badge variant="demo" size="lg" className="mb-6 animate-pulse-subtle">
          <Sparkles className="w-4 h-4 mr-1.5" />
          Autonomous Full-Stack AI Research Engine
        </Badge>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Research That Thinks <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#2D8CFF] via-[#35D9E8] to-[#43E6D5] bg-clip-text text-transparent">
            Beyond Search.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
          An autonomous AI research agent that plans, investigates, verifies, adapts, and produces comprehensive evidence-backed reports with zero hallucinated citations.
        </p>

        {/* CTA Group */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/app/research/new">
            <Button size="lg" variant="accent" icon={ArrowRight} className="font-semibold">
              Start Autonomous Research
            </Button>
          </Link>
          <Link to="/app/research/demo-session/workspace">
            <Button size="lg" variant="secondary" icon={Cpu}>
              Explore Live Demo Scenario
            </Button>
          </Link>
        </div>

        {/* Autonomous Loop Visualization */}
        <div className="mt-20 p-8 rounded-2xl bg-[#0D1B2E] border border-[#1E314B] shadow-card text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#2D8CFF]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#1E314B]">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#35D9E8]">State Machine Loop</span>
              <h2 className="text-xl font-bold text-white mt-0.5">The Autonomous Research Lifecycle</h2>
            </div>
            <Badge variant="researching" size="sm" dot>Dynamic LangGraph Orchestration</Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {workflowSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className="p-4 rounded-xl bg-[#071426] border border-[#1E314B] hover:border-[#2D8CFF]/50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-text-dim">0{step.id}</span>
                    <Icon className={`w-5 h-5 ${step.color} group-hover:scale-110 transition-transform`} />
                  </div>
                  <h3 className="text-sm font-semibold text-white">{step.title}</h3>
                  <p className="text-[11px] text-text-muted mt-1 leading-snug">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Core Capabilities Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <Card className="p-6">
            <div className="w-10 h-10 rounded-xl bg-[#2D8CFF]/15 border border-[#2D8CFF]/30 flex items-center justify-center text-[#2D8CFF] mb-4">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Autonomous Adaptation</h3>
            <p className="text-xs text-text-muted mt-2 leading-relaxed">
              When knowledge gaps or weak long-term empirical forecasts are diagnosed, the agent formulates targeted follow-up queries and investigates again without manual prompts.
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-10 h-10 rounded-xl bg-[#35D9E8]/15 border border-[#35D9E8]/30 flex items-center justify-center text-[#35D9E8] mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Conflict Reconciliation</h3>
            <p className="text-xs text-text-muted mt-2 leading-relaxed">
              Disparate empirical statistics between sources are cross-examined. Methodology divergences and sample differences are highlighted rather than smoothed over.
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-10 h-10 rounded-xl bg-[#43E6D5]/15 border border-[#43E6D5]/30 flex items-center justify-center text-[#43E6D5] mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Self-Evaluation Critique</h3>
            <p className="text-xs text-text-muted mt-2 leading-relaxed">
              An automated evaluation critique scores completeness, evidence density, citation coverage, and source authority. Low scores trigger an autonomous refinement cycle.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
};
