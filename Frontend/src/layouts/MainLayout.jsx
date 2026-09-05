import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { useAuth } from '../context/AuthContext';

export const MainLayout = () => {
  const { user, logout } = useAuth();
  return <div className="min-h-screen bg-[#071426] text-white flex flex-col">
    <Navbar user={user} onLogout={logout} />
    <div className="flex flex-1"><Sidebar /><main className="flex-1 overflow-x-hidden p-6 bg-grid-pattern min-h-[calc(100vh-4rem)]"><Outlet /></main></div>
  </div>;
};
