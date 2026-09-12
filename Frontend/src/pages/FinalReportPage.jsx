import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { marked } from "marked";
import { Card, CardHeader } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { RefreshCw, Download, FileText, AlertCircle, Eye, Code } from "lucide-react";
import { researchApi, getApiError } from "../services/api";

marked.setOptions({
  gfm: true,
  breaks: true,
});

export const FinalReportPage = () => {
  const { id } = useParams();
  const [r, setR] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("formatted"); // 'formatted' | 'raw'

  useEffect(() => {
    researchApi
      .report(id)
      .then((x) => setR(x?.data || null))
      .catch((e) => setError(getApiError(e)))
      .finally(() => setLoading(false));
  }, [id]);

  const htmlContent = useMemo(() => {
    if (!r?.report) return "";
    return marked.parse(r.report);
  }, [r?.report]);

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
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const downloadPdf = async () => {
    if (!r?.report) return;
    setDownloadingPdf(true);
    setError("");
    try {
      const res = await researchApi.exportPdf(id);

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

      const blob =
        res.data instanceof Blob
          ? res.data
          : new Blob([res.data], { type: "application/pdf" });

      if (blob.type === "application/json") {
        const text = await blob.text();
        const json = JSON.parse(text);
        throw new Error(json.error?.message || "Failed to generate PDF.");
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (e) {
      console.error("PDF export error:", e);
      let errMsg = "PDF export failed.";
      if (e?.response?.data instanceof Blob) {
        try {
          const text = await e.response.data.text();
          const json = JSON.parse(text);
          errMsg = json?.error?.message || text;
        } catch {
          errMsg = e.message || errMsg;
        }
      } else {
        errMsg = getApiError(e);
      }
      setError(errMsg);

      // Fallback: Direct download via browser navigation if token exists
      const token = localStorage.getItem("researchpilot_token");
      if (token) {
        const fallbackUrl = `/api/research/${id}/export-pdf?token=${encodeURIComponent(token)}`;
        window.open(fallbackUrl, "_blank");
      }
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (loading)
    return (
      <div className="text-xs text-text-muted flex items-center gap-2 p-8">
        <RefreshCw className="animate-spin w-4 h-4 text-[#35D9E8]" />
        Loading academic research report...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Report Actions Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant={r?.status || "default"} size="sm">
              {String(r?.status || "report").toUpperCase()}
            </Badge>
            <span className="text-xs text-text-muted">Autonomous Synthesis</span>
          </div>
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
            variant="accent"
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

      {/* Main Report Card with View Switcher */}
      <Card className="overflow-hidden border border-[#1E314B]">
        <CardHeader
          title="Final Research Report"
          subtitle="Publication-grade formatted research synthesis"
          action={
            <div className="flex items-center gap-1 bg-[#071426] p-1 rounded-lg border border-[#1E314B]">
              <button
                onClick={() => setViewMode("formatted")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  viewMode === "formatted"
                    ? "bg-[#2D8CFF] text-white"
                    : "text-text-muted hover:text-white"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Formatted Report
              </button>
              <button
                onClick={() => setViewMode("raw")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  viewMode === "raw"
                    ? "bg-[#2D8CFF] text-white"
                    : "text-text-muted hover:text-white"
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                Raw Source
              </button>
            </div>
          }
        />

        <div className="p-6 md:p-8 bg-[#0D1B2E]/60">
          {viewMode === "formatted" ? (
            <div
              className="report-content"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          ) : (
            <pre className="whitespace-pre-wrap text-xs leading-6 text-slate-300 font-mono bg-[#071426] p-5 rounded-xl border border-[#1E314B] overflow-x-auto">
              {r?.report || "The report will appear here when research is completed."}
            </pre>
          )}
        </div>
      </Card>
    </div>
  );
};

