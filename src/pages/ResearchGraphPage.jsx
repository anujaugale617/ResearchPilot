import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { RefreshCw, AlertCircle } from "lucide-react";
import { researchApi, getApiError } from "../services/api";
export const ResearchGraphPage = () => {
  const { id } = useParams();
  const [s, setS] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    researchApi
      .get(id)
      .then((r) => setS(r?.data?.session || null))
      .catch((e) => setError(getApiError(e)))
      .finally(() => setLoading(false));
  }, [id]);
  if (loading)
    return (
      <div className="text-xs text-text-muted">
        <RefreshCw className="animate-spin inline mr-2 w-4 h-4" />
        Loading research graph...
      </div>
    );
  return (
    <div className="space-y-5">
      <div>
        <Badge variant="primary" size="sm">
          Knowledge Graph
        </Badge>
        <h1 className="text-2xl font-bold text-white mt-2">
          Research Intelligence Graph
        </h1>
      </div>
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-200 flex gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
      <Card>
        <CardHeader title="Research Question" />
        <div className="p-5 text-sm text-white">{s?.researchQuestion}</div>
      </Card>
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-5">
          <span className="text-xs text-text-muted">Sources</span>
          <div className="text-2xl font-mono mt-2">{s?.sourcesCount || 0}</div>
        </Card>
        <Card className="p-5">
          <span className="text-xs text-text-muted">Evidence</span>
          <div className="text-2xl font-mono mt-2">{s?.evidenceCount || 0}</div>
        </Card>
        <Card className="p-5">
          <span className="text-xs text-text-muted">Claims</span>
          <div className="text-2xl font-mono mt-2">{s?.claimsCount || 0}</div>
        </Card>
      </div>
      <Card>
        <CardHeader title="Claims & Relationships" />
        <div className="p-5 space-y-3">
          {(s?.claims || []).map((c, i) => (
            <div
              key={c._id || i}
              className="p-4 rounded-lg bg-[#071426] border border-[#1E314B]"
            >
              <div className="flex justify-between gap-4">
                <p className="text-sm text-white">{c.text}</p>
                <span className="text-xs text-[#43E6D5] font-mono">
                  {c.confidence}%
                </span>
              </div>
              <div className="mt-2 text-[11px] text-text-dim">
                Evidence links: {c.evidenceIds?.length || 0}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
