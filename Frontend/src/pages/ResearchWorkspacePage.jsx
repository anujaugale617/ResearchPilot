import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Activity, RefreshCw, Square, AlertCircle, Send } from "lucide-react";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { researchApi, getApiError, getEventsUrl } from "../services/api";

export const ResearchWorkspacePage = () => {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [sending, setSending] = useState(false);
  const load = async () => {
    try {
      const r = await researchApi.get(id);
      setSession(r?.data?.session || r?.session || r?.data || r);
    } catch (e) {
      setError(getApiError(e));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
    const es = new EventSource(getEventsUrl(id));
    const handler = (e) => {
      let data;
      try {
        data = JSON.parse(e.data);
      } catch {
        data = { message: e.data };
      }
      setEvents((v) => [...v, { type: e.type || "message", ...data }]);
      load();
    };
    es.onmessage = handler;
    es.onerror = () => {};
    return () => es.close();
  }, [id]);
  const stop = async () => {
    try {
      await researchApi.stop(id);
      await load();
    } catch (e) {
      setError(getApiError(e));
    }
  };
  const refine = async () => {
    if (!feedback.trim()) return;
    setSending(true);
    try {
      await researchApi.refine(id, feedback);
      setFeedback("");
      await load();
    } catch (e) {
      setError(getApiError(e));
    } finally {
      setSending(false);
    }
  };
  if (loading)
    return (
      <div className="text-sm text-text-muted">Loading research session…</div>
    );
  return (
    <div className="grid lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-5">
        <Card>
          <CardHeader
            title={
              session?.title || session?.researchQuestion || "Research Session"
            }
            subtitle={session?.objective || "Autonomous research session"}
          />
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant={session?.status || "default"}>
                {String(session?.status || "unknown").toUpperCase()}
              </Badge>
              <Badge variant="default">{session?.depth || "standard"}</Badge>
            </div>
            <ProgressBar value={session?.progress || 0} showLabel />
            <div className="mt-4 grid sm:grid-cols-3 gap-3">
              <div className="p-3 bg-[#071426] border border-[#1E314B] rounded-lg">
                <span className="text-[11px] text-text-muted">
                  Current Stage
                </span>
                <p className="text-sm font-semibold mt-1">
                  {session?.currentStage || "—"}
                </p>
              </div>
              <div className="p-3 bg-[#071426] border border-[#1E314B] rounded-lg">
                <span className="text-[11px] text-text-muted">Sources</span>
                <p className="text-sm font-mono font-semibold mt-1">
                  {session?.sourcesCount || session?.sourceCount || 0}
                </p>
              </div>
              <div className="p-3 bg-[#071426] border border-[#1E314B] rounded-lg">
                <span className="text-[11px] text-text-muted">Confidence</span>
                <p className="text-sm font-mono font-semibold mt-1">
                  {session?.confidenceScore || session?.confidence || 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader
            title="Live Agent Activity Stream"
            subtitle="Server-Sent Events from /events"
          />
          <div className="max-h-[520px] overflow-auto divide-y divide-[#1E314B]">
            {events.length === 0 ? (
              <div className="p-6 text-xs text-text-muted">
                Waiting for agent events…
              </div>
            ) : (
              events.map((e, i) => (
                <div key={i} className="p-4 text-xs">
                  <div className="flex gap-2 items-center text-[#35D9E8] font-mono">
                    <Activity className="w-3.5 h-3.5" />
                    {e.type}
                  </div>
                  <p className="mt-1 text-text-muted">
                    {e.message || e.text || JSON.stringify(e)}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
      <div className="space-y-5">
        <Card>
          <CardHeader title="Controls" />
          <CardContent className="space-y-3">
            <Button
              variant="secondary"
              className="w-full"
              icon={Square}
              onClick={stop}
            >
              Stop Research
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              icon={RefreshCw}
              onClick={load}
            >
              Refresh State
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader
            title="Refine Research"
            subtitle="Trigger another research cycle with targeted feedback."
          />
          <CardContent className="space-y-3">
            <Input
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="e.g. Investigate European labor statistics."
            />
            <Button
              variant="primary"
              className="w-full"
              icon={Send}
              isLoading={sending}
              onClick={refine}
            >
              Send Feedback
            </Button>
          </CardContent>
        </Card>
        {error && (
          <div className="flex gap-2 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-xs text-red-200">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
};
