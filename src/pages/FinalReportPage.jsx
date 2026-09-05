import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { RefreshCw, Download, AlertCircle } from "lucide-react";
import { researchApi, getApiError } from "../services/api";
export const FinalReportPage = () => {
  const { id } = useParams();
  const [r, setR] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    researchApi
      .report(id)
      .then((x) => setR(x?.data || null))
      .catch((e) => setError(getApiError(e)))
      .finally(() => setLoading(false));
  }, [id]);
  const download = () => {
    const blob = new Blob([r?.report || ""], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "research-report.md";
    a.click();
    URL.revokeObjectURL(a.href);
  };
  if (loading)
    return (
      <div className="text-xs text-text-muted">
        <RefreshCw className="animate-spin inline mr-2 w-4 h-4" />
        Loading report...
      </div>
    );
  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex justify-between gap-4 items-start">
        <div>
          <Badge variant={r?.status || "default"} size="sm">
            {String(r?.status || "report").toUpperCase()}
          </Badge>
          <h1 className="text-2xl font-bold text-white mt-2">
            {r?.title || "Research Report"}
          </h1>
        </div>
        <button
          onClick={download}
          className="px-3 py-2 rounded-lg border border-[#1E314B] text-xs text-white flex gap-2"
        >
          <Download className="w-4 h-4" />
          Export Markdown
        </button>
      </div>
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-200 flex gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
      <Card>
        <CardHeader title="Final Research Report" />
        <div className="p-6">
          <pre className="whitespace-pre-wrap text-sm leading-7 text-text-muted font-sans">
            {r?.report ||
              "The report will appear here when research is completed."}
          </pre>
        </div>
      </Card>
    </div>
  );
};
