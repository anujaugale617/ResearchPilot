import { env } from "../config/env.js";
export async function searchWeb(query, maxSources = 10, preferredDomains = []) {
  if (!env.TAVILY_API_KEY)
    return mockSources(query, maxSources, preferredDomains);
  const r = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: env.TAVILY_API_KEY,
      query,
      max_results: maxSources,
      search_depth: "advanced",
      include_answer: false,
    }),
  });
  if (!r.ok) throw new Error(`Search provider failed with ${r.status}`);
  const d = await r.json();
  return (d.results || []).map((x) => ({
    title: x.title,
    url: x.url,
    domain: safeDomain(x.url),
    snippet: x.content || "",
    score: x.score || 0,
    publishedAt: x.published_date || "",
  }));
}
function safeDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
function mockSources(query, max, domains) {
  const pool = [
    ["NIST", "https://www.nist.gov/", "nist.gov"],
    ["arXiv", "https://arxiv.org/", "arxiv.org"],
    ["ACM", "https://www.acm.org/", "acm.org"],
    ["IEEE", "https://www.ieee.org/", "ieee.org"],
    ["Nature", "https://www.nature.com/", "nature.com"],
    ["OECD", "https://www.oecd.org/", "oecd.org"],
  ];
  const ordered = [
    ...domains.map((d) => ["Preferred source", `https://${d}`, d]),
    ...pool,
  ].filter((x, i, a) => a.findIndex((y) => y[2] === x[2]) === i);
  return ordered
    .slice(0, Math.max(1, Math.min(max, ordered.length)))
    .map((x, i) => ({
      title: `${x[0]} research relevant to: ${query}`,
      url: x[1],
      domain: x[2],
      snippet: `Demo evidence placeholder for the research question: ${query}. Add a Tavily API key for live web research.`,
      score: Number((0.95 - i * 0.03).toFixed(2)),
      publishedAt: "",
    }));
}
