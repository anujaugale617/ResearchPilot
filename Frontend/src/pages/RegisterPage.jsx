import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/app/dashboard", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Unable to create account.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Create Workspace
        </h2>
        <p className="text-xs text-text-muted mt-1">
          Create an account for autonomous research.
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
          label="Full Name"
          type="text"
          icon={User}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Dr. Jordan Vance"
          required
        />
        <Input
          label="Institutional Email"
          type="email"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jordan.vance@lab.org"
          required
        />
        <Input
          label="Password"
          type="password"
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimum 8 characters"
          minLength={8}
          required
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={loading}
          icon={ArrowRight}
          className="w-full mt-2"
        >
          Create Researcher Account
        </Button>
      </form>
      <div className="text-center text-xs text-text-muted">
        Already registered?{" "}
        <Link
          to="/login"
          className="text-[#35D9E8] hover:underline font-medium"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};
