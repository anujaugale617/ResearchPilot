import React from 'react';
import { NavLink, Outlet, useParams, Link } from 'react-router-dom';
import { Cpu, GitFork, Database, FileText, ArrowLeft, ExternalLink } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const WorkspaceLayout = () => {
  const { id } = useParams();
  const sessionId = id || 'demo-session';

  // Demo research query title for context
  const sessionTitle = "Impact of Generative AI on Software Engineering Productivity & Employment (2030)";

  const tabs = [
    { label: 'Agent Workspace', icon: Cpu, path: `/app/research/${sessionId}/workspace` },
    { label: 'Research Graph', icon: GitFork, path: `/app/research/${sessionId}/graph` },
    { label: 'Evidence Matrix', icon: Database, path: `/app/research/${sessionId}/evidence` },
    { label: 'Final Report', icon: FileText, path: `/app/research/${sessionId}/report` },
  ];

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Investigation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0D1B2E] border border-[#1E314B] shadow-card">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <Link
              to="/app/dashboard"
              className="text-text-muted hover:text-white flex items-center gap-1 text-xs transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <span className="text-text-dim">•</span>
            <Badge variant="researching" size="sm" dot>
              ACTIVE RESEARCH
            </Badge>
            <Badge variant="default" size="sm">
              Standard Depth
            </Badge>
          </div>
          <h1 className="text-lg md:text-xl font-bold text-white tracking-tight">
            {sessionTitle}
          </h1>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <Button variant="secondary" size="sm">
            Pause Agent
          </Button>
          <Button variant="primary" size="sm" icon={ExternalLink}>
            Share Briefing
          </Button>
        </div>
      </div>

      {/* Secondary Navigation Tabs */}
      <div className="flex border-b border-[#1E314B] gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 -mb-1 ${
                  isActive
                    ? 'border-[#35D9E8] text-[#35D9E8] bg-[#0D1B2E]/60'
                    : 'border-transparent text-text-muted hover:text-white hover:bg-[#0D1B2E]/30'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Outlet for Workspace Views */}
      <div>
        <Outlet />
      </div>
    </div>
  );
};
