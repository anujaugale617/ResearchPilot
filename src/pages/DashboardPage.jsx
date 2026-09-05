import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Plus,
  Cpu,
  CheckCircle,
  Database,
  TrendingUp,
  ArrowRight,
  Clock,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Card, CardHeader } from "../components/ui/Card";
import { ProgressBar } from "../components/ui/ProgressBar";
import { researchApi, getApiError } from "../services/api";

const getSession = (item) => item?.session || item;
export const DashboardPage = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await researchApi.list({ limit: 20, page: 1 });
      setSessions(res?.data?.sessions || res?.sessions || []);
    } catch (e) {
      setError(getApiError(e));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const normalized = sessions.map(getSession);
  const completed = normalized.filter((s) => s.status === "completed").length;
  const active = normalized.filter(
    (s) => !["completed", "stopped", "failed"].includes(s.status),
  ).length;
  const sourceTotal = normalized.reduce(
    (n, s) => n + (s.sourcesCount || s.sourceCount || 0),
    0,
  );
  const avg = normalized.length
    ? Math.round(
        normalized.reduce(
          (n, s) => n + (s.confidenceScore || s.confidence || 0),
          0,
        ) / normalized.length,
      )
    : 0;
  const metrics = [
    ["Active Inquiries", active, Cpu],
    ["Completed Briefings", completed, CheckCircle],
    ["Avg Confidence", `${avg}%`, TrendingUp],
    ["Sources Analyzed", sourceTotal, Database],
  ];
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#0D1B2E] to-[#14243B] border border-[#1E314B] shadow-card">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#35D9E8]">
            Research Telemetry
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">
            Research Command Cockpit
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Live sessions and autonomous research status from your Render
            backend.
          </p>
        </div>
        <Button
          variant="accent"
          icon={Plus}
          onClick={() => navigate("/app/research/new")}
        >
          Start New Research
        </Button>
      </div>
      {error && (
        <div className="flex gap-2 items-center p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-xs text-red-200">
          <AlertCircle className="w-4 h-4" />
          {error}
          <button className="ml-auto underline" onClick={load}>
            Retry
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(([label, value, Icon]) => (
          <Card key={label} className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">{label}</span>
              <Icon className="w-4 h-4 text-[#35D9E8]" />
            </div>
            <div className="mt-3 text-2xl font-bold font-mono text-white">
              {value}
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader
          title="Active & Recent Investigations"
          subtitle="Loaded from GET /api/research"
          action={
            <Link to="/app/history" className="text-xs text-[#35D9E8]">
              View History →
            </Link>
          }
        />
        {loading ? (
          <div className="p-8 text-center text-xs text-text-muted">
            <RefreshCw className="w-4 h-4 animate-spin inline mr-2" />
            Loading sessions…
          </div>
        ) : normalized.length === 0 ? (
          <div className="p-10 text-center text-sm text-text-muted">
            No research sessions yet. Start your first inquiry.
          </div>
        ) : (
          <div className="divide-y divide-[#1E314B]">
            {normalized.slice(0, 8).map((s) => {
              const id = s.id || s._id;
              const done = s.status === "completed";
              return (
                <div
                  key={id}
                  onClick={() =>
                    navigate(
                      `/app/research/${id}/${done ? "report" : "workspace"}`,
                    )
                  }
                  className="p-5 hover:bg-[#14243B]/60 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={s.status || "default"} size="sm">
                        {String(s.status || "draft").toUpperCase()}
                      </Badge>
                      <Badge variant="default" size="sm">
                        {s.depth || "Standard"}
                      </Badge>
                      {s.updatedAt && (
                        <span className="text-xs text-text-dim flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(s.updatedAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-white">
                      {s.title || s.researchQuestion || "Untitled Research"}
                    </h3>
                    <p className="text-xs text-text-muted">
                      Stage:{" "}
                      <span className="text-white">
                        {s.currentStage || "initialized"}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="w-28 hidden sm:block">
                      <ProgressBar
                        value={s.progress || 0}
                        showLabel
                        size="sm"
                      />
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-text-muted block">
                        Sources
                      </span>
                      <span className="font-mono text-sm text-white">
                        {s.sourcesCount || s.sourceCount || 0}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
