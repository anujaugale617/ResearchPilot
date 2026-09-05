import React from 'react';
import { Loader2, SearchX, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export const LoadingState = ({
  message = 'Analyzing intelligence...',
  subtext = 'Processing real-time autonomous research telemetry',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center ${className}`}>
      <div className="relative w-14 h-14 mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-[#1E314B]" />
        <div className="absolute inset-0 rounded-full border-2 border-t-[#35D9E8] border-r-[#2D8CFF] animate-spin" />
        <div className="absolute inset-2 rounded-full bg-[#0D1B2E] flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-[#35D9E8] animate-ping" />
        </div>
      </div>
      <h4 className="text-sm font-semibold text-white tracking-wide">{message}</h4>
      {subtext && <p className="text-xs text-text-muted mt-1 max-w-sm">{subtext}</p>}
    </div>
  );
};

export const EmptyState = ({
  title = 'No findings yet',
  description = 'Autonomous research tasks will populate data here as the agent explores sources.',
  icon: Icon = SearchX,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-[#1E314B] bg-[#071426]/50 ${className}`}>
      <div className="w-12 h-12 rounded-xl bg-[#0D1B2E] border border-[#1E314B] flex items-center justify-center text-text-muted mb-4 shadow-sm">
        <Icon className="w-6 h-6 text-[#35D9E8]" />
      </div>
      <h4 className="text-base font-semibold text-white">{title}</h4>
      <p className="text-xs text-text-muted mt-1.5 max-w-md">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction} className="mt-5">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export const ErrorState = ({
  title = 'Investigation Encountered An Issue',
  message = 'Search provider or extraction service temporarily unavailable.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`p-6 rounded-xl border border-red-500/30 bg-red-950/20 text-center flex flex-col items-center ${className}`}>
      <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 mb-3">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-semibold text-red-300">{title}</h4>
      <p className="text-xs text-text-muted mt-1 max-w-md">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          icon={RefreshCw}
          onClick={onRetry}
          className="mt-4 border-red-500/40 text-red-300 hover:border-red-400"
        >
          Retry
        </Button>
      )}
    </div>
  );
};
