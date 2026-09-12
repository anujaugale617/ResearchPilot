import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { RefreshCw, Download, FileText, AlertCircle } from "lucide-react";
import { researchApi, getApiError } from "../services/api";

export const FinalReportPage = () => {
  const { id } = useParams();
  const [r, setR] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    researchApi
      .report(id)
      .then((x) => setR(x?.data || null))
      .catch((e) => setError(getApiError(e)))
      .finally(() => setLoading(false));
  }, [id]);

  const downloadMarkdown = () => {
    const blob = new Blob([r?.report || ""], { type: "text/markdown" });
    const a = document.createElement("a");
    const cleanTitle = (r?.title || "Report")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "_")
      .slice(0, 60);
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = `ResearchPilot_${cleanTitle}_Report.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPdf = async () => {
    if (!r?.report) return;
    setDownloadingPdf(true);
    setError("");
    try {
      const res = await researchApi.exportPdf(id);

      // Check if backend returned JSON error inside blob
      if (res.data?.type === "application/json") {
        const text = await res.data.text();
        const json = JSON.parse(text);
        throw new Error(json.error?.message || "Failed to download PDF.");
      }

      let filename = `ResearchPilot_${(r.title || "Report")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "_")
        .slice(0, 60)}_Report.pdf`;

      const disposition = res.headers?.["content-disposition"];
      if (disposition) {
        const match = disposition.match(/filename=["']?([^"';]+)["']?/i);
        if (match && match[1]) filename = match[1].trim();
      }

      const blob = new Blob([res.data], { type: "application/pdf" });
      const a = document.createElement("a");
      const url = URL.createObjectURL(blob);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(getApiError(e));
    } finally {
      setDownloadingPdf(false);
    }
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
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
        <div>
          <Badge variant={r?.status || "default"} size="sm">
            {String(r?.status || "report").toUpperCase()}
          </Badge>
          <h1 className="text-2xl font-bold text-white mt-2">
            {r?.title || "Research Report"}
          </h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            onClick={downloadMarkdown}
            icon={Download}
          >
            Export Markdown
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={downloadPdf}
            isLoading={downloadingPdf}
            icon={FileText}
            disabled={!r?.report}
          >
            Download PDF
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-200 flex gap-2 items-center">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Card>
        <CardHeader
          title="Final Research Report"
          subtitle="Generated report ready for academic export and submission"
        />
        <div className="p-6">
          <pre className="whitespace-pre-wrap text-sm leading-7 text-text-muted font-sans bg-[#071426]/50 p-4 rounded-xl border border-[#1E314B]/60">
            {r?.report ||
              "The report will appear here when research is completed."}
          </pre>
        </div>
      </Card>
    </div>
  );
};

