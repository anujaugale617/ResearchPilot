import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#071426] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-grid-pattern relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2D8CFF] to-[#35D9E8] flex items-center justify-center text-[#071426] shadow-glow-accent group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 text-[#071426] stroke-[2.5]" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            Research<span className="text-[#35D9E8]">Pilot</span>
          </span>
        </Link>
        <p className="text-xs uppercase font-mono tracking-widest text-text-dim">
          Autonomous Research Agent Cockpit
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#0D1B2E] py-8 px-6 sm:px-8 border border-[#1E314B] rounded-2xl shadow-card">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
