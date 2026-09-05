import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Trash2, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardHeader } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { researchApi, getApiError } from "../services/api";

export const ResearchHistoryPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = async () => {
    setLoading(true);
    try {
      const r = await researchApi.list({ limit: 100, page: 1 });
      setItems(r?.data?.sessions || r?.sessions || []);
    } catch (e) {
      setError(getApiError(e));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const filtered = items.filter((s) => {
    const text = `${s.title || ""} ${s.researchQuestion || ""}`.toLowerCase();
    return (
      text.includes(q.toLowerCase()) &&
      (status === "all" || s.status === status)
    );
  });
  const remove = async (id) => {
    if (!window.confirm("Delete this research session?")) return;
    try {
      await researchApi.remove(id);
      setItems((v) => v.filter((s) => (s.id || s._id) !== id));
    } catch (e) {
      setError(getApiError(e));
    }
  };
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Research History Archive</h1>
          <p className="text-xs text-text-muted mt-1">
            Real sessions returned by your Render API.
          </p>
        </div>
        <Button variant="accent" onClick={() => navigate("/app/research/new")}>
          + New Research
        </Button>
      </div>
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input
              icon={Search}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search investigations…"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              "all",
              "draft",
              "planning",
              "researching",
              "completed",
              "stopped",
              "failed",
            ].map((x) => (
              <button
                key={x}
                onClick={() => setStatus(x)}
                className={`px-3 py-1.5 rounded-lg text-xs uppercase border ${status === x ? "bg-[#2D8CFF] text-white border-[#2D8CFF]" : "bg-[#071426] text-text-muted border-[#1E314B]"}`}
              >
                {x}
              </button>
            ))}
          </div>
        </div>
      </Card>
      {error && (
        <div className="flex gap-2 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-xs text-red-200">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
      {loading ? (
        <div className="text-center text-xs text-text-muted">
          <RefreshCw className="w-4 h-4 animate-spin inline mr-2" />
          Loading…
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => {
            const id = s.id || s._id;
            const done = s.status === "completed";
            return (
              <Card key={id} className="p-5">
                <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                  <div className="flex-1">
                    <div className="flex gap-2 items-center flex-wrap">
                      <Badge variant={s.status || "default"} size="sm">
                        {String(s.status || "draft").toUpperCase()}
                      </Badge>
                      <Badge variant="default" size="sm">
                        {s.depth || "standard"}
                      </Badge>
                      {s.createdAt && (
                        <span className="text-xs text-text-dim flex gap-1 items-center">
                          <Clock className="w-3 h-3" />
                          {new Date(s.createdAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <h3
                      className="mt-2 text-sm font-semibold cursor-pointer hover:text-[#35D9E8]"
                      onClick={() =>
                        navigate(
                          `/app/research/${id}/${done ? "report" : "workspace"}`,
                        )
                      }
                    >
                      {s.title || s.researchQuestion || "Untitled Research"}
                    </h3>
                    <p className="text-xs text-text-muted mt-1 line-clamp-1">
                      {s.researchQuestion || ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        navigate(
                          `/app/research/${id}/${done ? "report" : "workspace"}`,
                        )
                      }
                    >
                      Open
                    </Button>
                    <button
                      onClick={() => remove(id)}
                      className="p-2 text-text-muted hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
          {filtered.length === 0 && (
            <div className="p-10 text-center text-sm text-text-muted">
              No matching sessions.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
