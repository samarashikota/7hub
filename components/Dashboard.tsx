"use client";

import { useCallback, useEffect, useState } from "react";
import SearchBox from "@/components/SearchBox";
import TicketCard, { SavedTitle } from "@/components/TicketCard";

export default function Dashboard() {
  const [titles, setTitles] = useState<SavedTitle[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/titles");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao carregar sua lista.");
        return;
      }
      setTitles(data.titles);
    } catch {
      setError("Erro de conexão ao carregar sua lista.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal-stub mb-2">
          Bilheteria
        </p>
        <h1 className="font-display text-4xl text-ink">Meus ingressos</h1>
      </div>

      <SearchBox onAdded={load} />

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {titles === null && !error && (
        <p className="text-ink-faint font-mono text-sm">Carregando seu arquivo...</p>
      )}

      {titles?.length === 0 && (
        <div className="border border-dashed border-reel-line rounded-lg p-10 text-center">
          <p className="font-display text-2xl text-ink-muted">Sessão vazia, por enquanto.</p>
          <p className="text-ink-faint text-sm mt-2">
            Busque um filme ou série acima para carimbar seu primeiro ingresso.
          </p>
        </div>
      )}

      <div className="space-y-5">
        {titles?.map((t) => (
          <TicketCard key={t.id} title={t} onChanged={load} />
        ))}
      </div>
    </div>
  );
}
