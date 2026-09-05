import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { WorkspaceLayout } from './layouts/WorkspaceLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ResearchSetupPage } from './pages/ResearchSetupPage';
import { ResearchWorkspacePage } from './pages/ResearchWorkspacePage';
import { ResearchGraphPage } from './pages/ResearchGraphPage';
import { EvidenceExplorerPage } from './pages/EvidenceExplorerPage';
import { FinalReportPage } from './pages/FinalReportPage';
import { ResearchHistoryPage } from './pages/ResearchHistoryPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<MainLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="research/new" element={<ResearchSetupPage />} />
          <Route path="research/:id" element={<WorkspaceLayout />}>
            <Route index element={<Navigate to="workspace" replace />} />
            <Route path="workspace" element={<ResearchWorkspacePage />} />
            <Route path="graph" element={<ResearchGraphPage />} />
            <Route path="evidence" element={<EvidenceExplorerPage />} />
            <Route path="report" element={<FinalReportPage />} />
          </Route>
          <Route path="history" element={<ResearchHistoryPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
export default App;
