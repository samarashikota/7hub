"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type SearchResult = {
  tmdbId: number;
  mediaType: "movie" | "tv";
  name: string;
  year: string | null;
  posterUrl: string | null;
  overview: string;
};

export default function SearchBox({ onAdded }: { onAdded: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(res.ok ? data.results : []);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  async function addTitle(item: SearchResult) {
    setAddingId(item.tmdbId);
    setMessage(null);
    try {
      const res = await fetch("/api/titles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "Não foi possível adicionar.");
        return;
      }
      setMessage(`"${item.name}" carimbado como assistido.`);
      onAdded();
    } finally {
      setAddingId(null);
    }
  }

  return (
    <div className="border border-reel-line rounded-lg bg-reel-card p-4">
      <label className="block font-mono text-[11px] uppercase tracking-wider text-ink-muted mb-2">
        Buscar filme ou série
      </label>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ex: Cidade de Deus, Breaking Bad..."
        className="input"
      />

      {message && <p className="text-sm text-teal-stub mt-3">{message}</p>}
      {loading && <p className="text-sm text-ink-faint mt-3">Procurando na bilheteria...</p>}

      {results.length > 0 && (
        <ul className="mt-4 divide-y divide-reel-line">
          {results.map((item) => (
            <li key={`${item.mediaType}-${item.tmdbId}`} className="flex items-center gap-3 py-3">
              <div className="w-10 h-14 relative flex-shrink-0 rounded overflow-hidden bg-reel-card2">
                {item.posterUrl && (
                  <Image src={item.posterUrl} alt={item.name} fill sizes="40px" className="object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-ink text-sm font-medium truncate">{item.name}</p>
                <p className="text-ink-faint text-xs">
                  {item.year ?? "—"} · {item.mediaType === "movie" ? "Filme" : "Série"}
                </p>
              </div>
              <button
                onClick={() => addTitle(item)}
                disabled={addingId === item.tmdbId}
                className="font-mono text-xs uppercase tracking-wide rounded-full border border-marquee/70 text-marquee px-3 py-1.5 hover:bg-marquee hover:text-reel-bg transition disabled:opacity-50"
              >
                {addingId === item.tmdbId ? "..." : "Adicionar"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
