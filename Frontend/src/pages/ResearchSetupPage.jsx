import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input, Textarea } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { researchApi, getApiError } from "../services/api";

export const ResearchSetupPage = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [objective, setObjective] = useState("");
  const [depth, setDepth] = useState("standard");
  const [maxSources, setMaxSources] = useState(20);
  const [domains, setDomains] = useState("");
  const [demoMode, setDemoMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await researchApi.create({
        researchQuestion: question,
        objective,
        depth,
        maxSources: Number(maxSources),
        preferredDomains: domains
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
      });
      const s = res?.data?.session || res?.session;
      const id = s?.id || s?._id;
      if (!id)
        throw new Error(
          "Backend created the session but did not return its ID.",
        );
      await researchApi.start(id, { demoMode });
      navigate(`/app/research/${id}/workspace`);
    } catch (e) {
      setError(getApiError(e));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Badge variant="primary" size="sm">
          Autonomous Setup
        </Badge>
        <h1 className="text-2xl font-bold text-white mt-2">
          Initialize Research Inquiry
        </h1>
        <p className="text-xs text-text-muted mt-1">
          This form creates a real session through POST /api/research and starts
          it through POST /api/research/:id/start.
        </p>
      </div>
      {error && (
        <div className="flex gap-2 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-xs text-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
      <form onSubmit={submit}>
        <Card>
          <CardHeader
            title="Research Parameters"
            subtitle="Define the question, objective and source budget."
          />
          <CardContent className="space-y-5">
            <Textarea
              label="Research Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What do you want to investigate?"
              required
              rows={4}
            />
            <Textarea
              label="Objective"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="What should the final research establish?"
              required
              rows={3}
            />
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-text-muted">
                  Research Depth
                </label>
                <select
                  value={depth}
                  onChange={(e) => setDepth(e.target.value)}
                  className="mt-1 w-full rounded-lg bg-[#071426] border border-[#1E314B] p-2.5 text-sm text-white"
                >
                  <option value="quick">Quick</option>
                  <option value="standard">Standard</option>
                  <option value="deep">Deep</option>
                </select>
              </div>
              <Input
                label="Maximum Sources"
                type="number"
                min="1"
                max="100"
                value={maxSources}
                onChange={(e) => setMaxSources(e.target.value)}
              />
            </div>
            <Input
              label="Preferred Domains (comma separated)"
              value={domains}
              onChange={(e) => setDomains(e.target.value)}
              placeholder="arxiv.org, ieee.org, acm.org"
            />
            <div className="p-4 rounded-xl bg-[#071426] border border-[#1E314B] flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="w-4 h-4 text-[#35D9E8]" />
                  Demo Mode
                </div>
                <p className="text-xs text-text-muted mt-1">
                  Passes demoMode to the backend start endpoint.
                </p>
              </div>
              <input
                type="checkbox"
                checked={demoMode}
                onChange={(e) => setDemoMode(e.target.checked)}
                className="w-5 h-5"
              />
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end gap-3 mt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/app/dashboard")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="accent"
            isLoading={loading}
            icon={ArrowRight}
          >
            Create & Start Research
          </Button>
        </div>
      </form>
    </div>
  );
};
