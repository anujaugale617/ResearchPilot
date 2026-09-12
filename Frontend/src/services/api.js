import axios from "axios";
const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
export const api = axios.create({
  baseURL: API_BASE_URL ? `${API_BASE_URL}/api` : "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("researchpilot_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  (r) => r,
  (e) => {
    if (e.response?.status === 401) {
      localStorage.removeItem("researchpilot_token");
      localStorage.removeItem("researchpilot_user");
    }
    return Promise.reject(e);
  },
);
const unwrap = (r) => r.data;
export const authApi = {
  login: (p) => api.post("/auth/login", p).then(unwrap),
  register: (p) => api.post("/auth/register", p).then(unwrap),
  me: () => api.get("/auth/me").then(unwrap),
  logout: () => api.post("/auth/logout").then(unwrap),
};
export const researchApi = {
  list: (p) => api.get("/research", { params: p }).then(unwrap),
  get: (id) => api.get(`/research/${id}`).then(unwrap),
  create: (p) => api.post("/research", p).then(unwrap),
  start: (id, p = {}) => api.post(`/research/${id}/start`, p).then(unwrap),
  stop: (id) => api.post(`/research/${id}/stop`).then(unwrap),
  refine: (id, feedback) =>
    api.post(`/research/${id}/refine`, { feedback }).then(unwrap),
  remove: (id) => api.delete(`/research/${id}`).then(unwrap),
  sources: (id) => api.get(`/research/${id}/sources`).then(unwrap),
  evidence: (id) => api.get(`/research/${id}/evidence`).then(unwrap),
  claims: (id) => api.get(`/research/${id}/claims`).then(unwrap),
  gaps: (id) => api.get(`/research/${id}/gaps`).then(unwrap),
  conflicts: (id) => api.get(`/research/${id}/conflicts`).then(unwrap),
  report: (id) => api.get(`/research/${id}/report`).then(unwrap),
  exportPdf: (id) =>
    api.get(`/research/${id}/export-pdf`, {
      responseType: "blob",
    }),
  evaluation: (id) => api.get(`/research/${id}/evaluation`).then(unwrap),
};
export const healthApi = { check: () => api.get("/health").then(unwrap) };
export function getApiError(error) {
  return (
    error?.response?.data?.error?.message ||
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}
export function getEventsUrl(id) {
  const base = API_BASE_URL ? `${API_BASE_URL}/api` : "/api";
  const token = localStorage.getItem("researchpilot_token");
  return `${base}/research/${id}/events${token ? `?token=${encodeURIComponent(token)}` : ""}`;
}
