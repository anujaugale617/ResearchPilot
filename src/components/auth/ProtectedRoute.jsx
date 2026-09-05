import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function ProtectedRoute() {
  const { loading, isAuthenticated } = useAuth();
  const location = useLocation();
  if (loading) return <div className="min-h-screen bg-[#071426] text-white grid place-items-center text-sm">Checking session…</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
