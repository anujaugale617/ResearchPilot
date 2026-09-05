import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi, getApiError } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('researchpilot_user') || 'null'); } catch { return null; }
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('researchpilot_token')));

  useEffect(() => {
    const token = localStorage.getItem('researchpilot_token');
    if (!token) { setLoading(false); return; }
    authApi.me()
      .then((res) => {
        const nextUser = res?.data?.user || res?.user || null;
        setUser(nextUser);
        if (nextUser) localStorage.setItem('researchpilot_user', JSON.stringify(nextUser));
      })
      .catch(() => {
        localStorage.removeItem('researchpilot_token');
        localStorage.removeItem('researchpilot_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const payload = res?.data || res;
    const nextUser = payload?.user;
    const token = payload?.token;
    if (!token) throw new Error('Login succeeded but the API did not return a token.');
    localStorage.setItem('researchpilot_token', token);
    if (nextUser) localStorage.setItem('researchpilot_user', JSON.stringify(nextUser));
    setUser(nextUser || null);
    return nextUser;
  };

  const register = async (name, email, password) => {
    const res = await authApi.register({ name, email, password });
    const payload = res?.data || res;
    const nextUser = payload?.user;
    const token = payload?.token;
    if (!token) throw new Error('Registration succeeded but the API did not return a token.');
    localStorage.setItem('researchpilot_token', token);
    if (nextUser) localStorage.setItem('researchpilot_user', JSON.stringify(nextUser));
    setUser(nextUser || null);
    return nextUser;
  };

  const logout = async () => {
    try { await authApi.logout(); } catch (_) {}
    localStorage.removeItem('researchpilot_token');
    localStorage.removeItem('researchpilot_user');
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, isAuthenticated: Boolean(user), login, register, logout, getApiError }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
