import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  Cpu,
  GitFork,
  Database,
  FileText,
  History,
  Settings,
  HelpCircle
} from 'lucide-react';

export const Sidebar = () => {
  const { id } = useParams();
  const activeSessionId = id || 'demo-session';

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/app/dashboard' },
    { label: 'New Inquiry', icon: PlusCircle, path: '/app/research/new' },
    { type: 'divider', label: 'Active Investigation' },
    { label: 'Agent Workspace', icon: Cpu, path: `/app/research/${activeSessionId}/workspace` },
    { label: 'Research Graph', icon: GitFork, path: `/app/research/${activeSessionId}/graph` },
    { label: 'Evidence Matrix', icon: Database, path: `/app/research/${activeSessionId}/evidence` },
    { label: 'Cited Report', icon: FileText, path: `/app/research/${activeSessionId}/report` },
    { type: 'divider', label: 'Management' },
    { label: 'History Archive', icon: History, path: '/app/history' },
    { label: 'Settings', icon: Settings, path: '/app/settings' },
  ];

  return (
    <aside className="w-64 border-r border-[#1E314B] bg-[#0A172A] flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 select-none">
      <div className="p-3 space-y-1 overflow-y-auto">
        {navItems.map((item, index) => {
          if (item.type === 'divider') {
            return (
              <div key={index} className="pt-4 pb-1 px-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-text-dim">
                  {item.label}
                </span>
              </div>
            );
          }

          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#2D8CFF]/15 text-[#35D9E8] border border-[#2D8CFF]/30 font-semibold shadow-sm'
                    : 'text-text-muted hover:text-white hover:bg-[#0D1B2E]'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="p-3 m-3 rounded-xl bg-[#0D1B2E] border border-[#1E314B]">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#43E6D5] animate-ping" />
          <span className="text-xs font-semibold text-white">Autonomous Loop</span>
        </div>
        <p className="text-[11px] text-text-muted">
          Self-evaluating state machine active with Tavily retrieval.
        </p>
      </div>
    </aside>
  );
};
