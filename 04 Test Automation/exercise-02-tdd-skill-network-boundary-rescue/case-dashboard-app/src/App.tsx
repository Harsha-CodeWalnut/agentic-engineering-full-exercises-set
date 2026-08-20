import { useCallback, useEffect, useMemo, useState } from "react";
import "./styles.css";

export interface SupportCase {
  id: string;
  customer: string;
  owner: string;
  summary: string;
  status: "new" | "investigating" | "waiting";
}

export default function App() {
  const [cases, setCases] = useState<SupportCase[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const loadCases = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/cases");
      if (!response.ok) throw new Error(`Cases request failed with ${response.status}`);
      setCases((await response.json()) as SupportCase[]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load cases");
      setCases([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadCases(); }, [loadCases]);

  const filteredCases = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized || !cases) return cases ?? [];
    return cases.filter((item) => [item.id, item.customer, item.owner, item.summary].join(" ").toLowerCase().includes(normalized));
  }, [cases, query]);

  return (
    <main className="dashboard-shell">
      <header><p className="eyebrow">Support Operations</p><h1>Case dashboard</h1></header>
      <label className="search-label">Filter cases<input aria-label="Filter cases" value={query} onChange={(event) => setQuery(event.target.value)} /></label>

      {loading && <p>Loading cases...</p>}
      {error && <section role="alert"><p>We could not load cases. {error}</p><button onClick={() => void loadCases()}>Retry</button></section>}
      {!loading && !error && cases?.length === 0 && <p>No cases are assigned yet.</p>}
      {!loading && cases && cases.length > 0 && filteredCases.length === 0 && <p>No cases match "{query}".</p>}
      {!loading && filteredCases.length > 0 && (
        <ul className="case-list" aria-label="Cases">
          {filteredCases.map((item) => (
            <li key={item.id}>
              <div><strong>{item.customer}</strong><span>{item.id} · {item.owner}</span></div>
              <p>{item.summary}</p><span className="status">{item.status}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
