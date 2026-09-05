import React, { useState } from 'react';
import {
  User,
  Key,
  Sliders,
  Sparkles,
  Cloud,
  CheckCircle,
  Save,
  Shield,
  Upload
} from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const SettingsPage = () => {
  const [name, setName] = useState('Dr. Sarah Lin');
  const [email, setEmail] = useState('sarah.lin@research.org');
  const [aiProvider, setAiProvider] = useState('gemini');
  const [aiKey, setAiKey] = useState('••••••••••••••••••••••••••••••••');
  const [tavilyKey, setTavilyKey] = useState('••••••••••••••••••••••••••••••••');
  const [cloudinaryStatus, setCloudinaryStatus] = useState('Connected (Cloudinary Media Engine)');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">System & Account Settings</h1>
        <p className="text-xs text-text-muted mt-1">
          Configure API credentials, agent safety thresholds, and media storage integration.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <Card className="p-6 space-y-4">
          <CardHeader
            title="Researcher Identity"
            subtitle="Personal details attached to generated research reports"
          />
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-[#1E314B] border-2 border-[#2D8CFF] flex items-center justify-center text-xl font-bold text-white">
                SL
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 p-1 bg-[#2D8CFF] text-white rounded-full hover:bg-[#1E74DB] transition-colors"
                title="Upload Avatar"
              >
                <Upload className="w-3 h-3" />
              </button>
            </div>
            <div>
              <span className="text-sm font-semibold text-white">{name}</span>
              <p className="text-xs text-text-muted">{email}</p>
              <span className="text-[10px] text-[#43E6D5] font-mono mt-0.5 block">Cloudinary Media Storage Synced</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </Card>

        {/* API Credentials Card */}
        <Card className="p-6 space-y-4">
          <CardHeader
            title="AI & Retrieval Provider Credentials"
            subtitle="Backend proxies all calls securely; credentials are never exposed to browser context"
          />

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold tracking-wide text-text-muted uppercase mb-1.5">
                AI Service Provider
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'gemini', label: 'Google Gemini', desc: 'Gemini 2.5 Flash / Pro' },
                  { id: 'openai', label: 'OpenAI', desc: 'GPT-4o / Reasoning' },
                  { id: 'mock', label: 'Deterministic Mock', desc: 'Offline Demo Mode' },
                ].map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setAiProvider(p.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all text-xs ${
                      aiProvider === p.id
                        ? 'bg-[#2D8CFF]/15 border-[#2D8CFF] text-white'
                        : 'bg-[#071426] border-[#1E314B] text-text-muted hover:text-white'
                    }`}
                  >
                    <span className="font-semibold block">{p.label}</span>
                    <span className="text-[10px] opacity-70 block mt-0.5">{p.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="AI Provider API Key"
                type="password"
                icon={Key}
                value={aiKey}
                onChange={(e) => setAiKey(e.target.value)}
                helperText="Stored server-side via environment variables"
              />
              <Input
                label="Tavily Search API Key"
                type="password"
                icon={Key}
                value={tavilyKey}
                onChange={(e) => setTavilyKey(e.target.value)}
                helperText="Powers multi-angle web search queries"
              />
            </div>
          </div>
        </Card>

        {/* Cloudinary Integration Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2D8CFF]/15 border border-[#2D8CFF]/30 flex items-center justify-center text-[#2D8CFF]">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Cloudinary Asset Management</h4>
                <p className="text-xs text-text-muted">
                  Used for avatars, export diagrams, and optional uploaded source documents.
                </p>
              </div>
            </div>
            <Badge variant="success" size="sm" dot>
              Connected
            </Badge>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="text-xs text-[#43E6D5] flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Settings updated successfully
            </span>
          )}
          <Button type="submit" variant="accent" size="md" icon={Save}>
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};
