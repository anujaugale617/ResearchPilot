import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
      navigate(location.state?.from?.pathname || "/app/dashboard", {
        replace: true,
      });
    } catch (err) {
      setError(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Unable to sign in.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Access Cockpit
        </h2>
        <p className="text-xs text-text-muted mt-1">
          Sign in to manage your autonomous research sessions.
        </p>
      </div>
      {error && (
        <div className="flex gap-2 items-start p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-xs text-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
      <form onSubmit={submit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@organization.org"
          required
        />
        <Input
          label="Password"
          type="password"
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          icon={ArrowRight}
          className="w-full mt-2"
        >
          Sign In
        </Button>
      </form>
      <Button
        type="button"
        variant="secondary"
        size="md"
        icon={Sparkles}
        onClick={() => {
          setEmail("demo.scientist@researchpilot.ai");
          setPassword("DemoResearcher2026");
        }}
        className="w-full text-xs"
      >
        Fill Demo Credentials
      </Button>
      <div className="text-center text-xs text-text-muted">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-[#35D9E8] hover:underline font-medium"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
};
