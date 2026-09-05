import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Search, RefreshCw, ExternalLink, AlertCircle } from "lucide-react";
import { Card, CardHeader } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { researchApi, getApiError } from "../services/api";
export const EvidenceExplorerPage = () => {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    researchApi
      .evidence(id)
      .then((r) => setItems(r?.data?.evidence || []))
      .catch((e) => setError(getApiError(e)))
      .finally(() => setLoading(false));
  }, [id]);
  const filtered = useMemo(
    () =>
      items.filter((x) =>
        `${x.claim} ${x.topic} ${x.excerpt}`
          .toLowerCase()
          .includes(q.toLowerCase()),
      ),
    [items, q],
  );
  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      <div>
        <Badge variant="primary" size="sm">
          Evidence Explorer
        </Badge>
        <h1 className="text-2xl font-bold text-white mt-2">
          Evidence Database
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Evidence extracted from the current Render-backed research session.
        </p>
      </div>
      <Card className="p-4">
        <Input
          icon={Search}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search evidence, topics, excerpts..."
        />
      </Card>
      {error && (
        <div className="p-3 border border-red-500/30 bg-red-500/10 rounded-lg text-xs text-red-200 flex gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
      {loading ? (
        <div className="text-center text-xs text-text-muted">
          <RefreshCw className="animate-spin inline mr-2 w-4 h-4" />
          Loading evidence...
        </div>
      ) : (
        filtered.map((e, i) => (
          <Card key={e._id || i} className="p-5">
            <div className="flex justify-between gap-4">
              <div>
                <Badge size="sm">{e.topic || "evidence"}</Badge>
                <h3 className="text-sm font-semibold text-white mt-2">
                  {e.claim}
                </h3>
                <p className="text-xs text-text-muted mt-2">{e.excerpt}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[11px] text-text-muted block">
                  Confidence
                </span>
                <span className="font-mono text-[#43E6D5]">
                  {e.confidence || 0}%
                </span>
              </div>
            </div>
          </Card>
        ))
      )}
      {!loading && !filtered.length && (
        <div className="text-center text-sm text-text-muted p-10">
          No evidence found.
        </div>
      )}
    </div>
  );
};
