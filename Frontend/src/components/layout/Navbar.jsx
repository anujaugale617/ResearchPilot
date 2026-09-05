import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Sparkles, Plus, User, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const Navbar = ({ isDemo = false, user = null, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1E314B] bg-[#071426]/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2D8CFF] to-[#35D9E8] flex items-center justify-center text-[#071426] shadow-glow-accent group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-[#071426] stroke-[2.5]" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                Research<span className="text-[#35D9E8]">Pilot</span>
              </span>
              <span className="text-[10px] block -mt-1 font-mono uppercase tracking-wider text-text-muted">
                Autonomous Agent
              </span>
            </div>
          </Link>

          {isDemo && (
            <Badge variant="demo" size="sm" className="ml-2 hidden sm:inline-flex">
              <Sparkles className="w-3 h-3 mr-1" />
              DEMO MODE
            </Badge>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            icon={Plus}
            onClick={() => navigate('/app/research/new')}
            className="hidden sm:inline-flex"
          >
            New Research
          </Button>

          {/* User Status / Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#1E314B]">
            <div className="w-8 h-8 rounded-full bg-[#1E314B] border border-[#2D8CFF]/40 flex items-center justify-center text-xs font-semibold text-white">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'RP'}
            </div>
            <span className="text-xs text-text-muted hidden md:inline-block font-medium">
              {user?.name || 'Researcher'}
            </span>
            <button
              onClick={onLogout || (() => navigate('/login'))}
              title="Logout"
              className="p-1.5 text-text-muted hover:text-white rounded-lg hover:bg-[#14243B] transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
